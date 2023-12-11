package corn.job;

import corn.modal.NoteContent;
import corn.utils.ImgUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.batch.item.database.JpaPagingItemReader;
import org.springframework.batch.item.database.orm.JpaNativeQueryProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManagerFactory;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Component
public class BackupImgStep {

    @Autowired
    private StepBuilderFactory stepBuilderFactory;

    @Autowired
    private EntityManagerFactory emf;

    @Autowired
    private ImgUtil imgUtil;

    /**
     * 一个简单基础的Step主要分为三个部分
     * ItemReader : 用于读取数据
     * ItemProcessor : 用于处理数据
     * ItemWriter : 用于写数据
     */
    @Bean
    public Step getBackupImgStep() {
        return stepBuilderFactory.get("backupImgStep")
                .<NoteContent, List<String>>chunk(100)
                .faultTolerant().retryLimit(3).retry(Exception.class).skipLimit(100).skip(Exception.class)
                .reader(getDataReader())
                .processor(getDataProcessor())
                .writer(getDataWriter())
                .build();

    }


    private ItemWriter<List<String>> getDataWriter() {
        return list -> {
            for (List<String> urls : list) {
                urls.forEach(url -> {
                    //写到对应目录中
                    log.info("write data: {}", url);
                    try {
                        imgUtil.saveFile(url);
                        log.info("{} 保存成功", url);
                    } catch (IOException e) {
                        log.info("保存失败: {}", e.getMessage());
                    }
                });

            }
        };
    }

    private ItemProcessor<NoteContent, List<String>> getDataProcessor() {
        return content -> {
            //1.提取图片URL
            String[] imgUrls = ImgUtil.getImgUrls(content.getText());

            //2.把URL放到List中返回
            return Arrays.asList(imgUrls);
        };
    }

    private ItemReader<NoteContent> getDataReader() {
        JpaPagingItemReader<NoteContent> reader = new JpaPagingItemReader<>();
        try {
            JpaNativeQueryProvider<NoteContent> queryProvider = new JpaNativeQueryProvider<>();
            queryProvider.setSqlQuery("select * from note_content");
            queryProvider.setEntityClass(NoteContent.class);
            queryProvider.afterPropertiesSet();

            reader.setEntityManagerFactory(emf);
            //设置每页读取的记录数
            reader.setPageSize(100);
            //设置数据提供者
            reader.setQueryProvider(queryProvider);
            reader.afterPropertiesSet();
            // 所有ItemReader和ItemWriter实现都会在ExecutionContext提交之前将其当前状态存储在其中,
            // 如果不希望这样做,可以设置setSaveState(false)
            reader.setSaveState(true);

        } catch (Exception e) {
            e.printStackTrace();
        }
        return reader;
    }
}
