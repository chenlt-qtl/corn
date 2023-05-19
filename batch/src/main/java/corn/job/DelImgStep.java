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
import org.springframework.batch.item.file.FlatFileItemReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.persistence.EntityManagerFactory;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Configuration
public class DelImgStep {

    @Autowired
    private StepBuilderFactory stepBuilderFactory;

    @Autowired
    private EntityManagerFactory emf;

    @Autowired
    private ImgUtil imgUtil;

    Pattern imgPattern = Pattern.compile("(.png|.jpg|.jpeg)$", Pattern.CASE_INSENSITIVE);


    /**
     * 原始图片存放位置，删除多余的图片
     */
    @Value(value = "${corn.path.origin-img}")
    private String originImgPath;

    /**
     * 一个简单基础的Step主要分为三个部分
     * ItemReader : 用于读取数据
     * ItemProcessor : 用于处理数据
     * ItemWriter : 用于写数据
     */
    @Bean("delImg")
    public Step getDelImgStep() {
        return stepBuilderFactory.get("delImgStep")
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

    private ItemReader<String> getDataReader() {
        FlatFileItemReader<String> reader = new FlatFileItemReader<>();
        List result = new ArrayList();
        getDirs(originImgPath, result);
        reader.setr
        return reader;
    }


    private void getDirs(String path, List<String> pathList) {
        File file = new File(path);
        String[] list = file.list();
        if (list != null) {
            for (String name : list) {
                if (imgPattern.matcher(name).find()) {
                    pathList.add(path + File.separator + name);
                } else {
                    getDirs(path + File.separator + name, pathList);
                }
            }
        }
    }

    public static void main(String[] args) {
        DelImgStep delImgStep = new DelImgStep();
        List result = new ArrayList();
        delImgStep.getDirs("E:\\corn\\backup\\originImg\\note\\damu", result);
        result.forEach(i -> System.out.println(i));

    }
}
