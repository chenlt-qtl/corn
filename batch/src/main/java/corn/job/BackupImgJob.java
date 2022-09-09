package corn.job;


import corn.listener.JobListener;
import corn.modal.Student;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.batch.item.database.JpaPagingItemReader;
import org.springframework.batch.item.database.orm.JpaNativeQueryProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManagerFactory;

@Slf4j
@Component
public class BackupImgJob {
    @Autowired
    private JobBuilderFactory jobBuilderFactory;

    @Autowired
    private StepBuilderFactory stepBuilderFactory;

    @Autowired
    private EntityManagerFactory emf;

    @Autowired
    private JobListener jobListener;


    public Job dataHandleJob() {
        return jobBuilderFactory.get("dataHandleJob")
                .incrementer(new RunIdIncrementer())
                .start(handleDataStep())
                .listener(jobListener)
                .build();
    }

    /**
     * 一个简单基础的Step主要分为三个部分
     * ItemReader : 用于读取数据
     * ItemProcessor : 用于处理数据
     * ItemWriter : 用于写数据
     */
    public Step handleDataStep() {
        return stepBuilderFactory.get("getData")
                .<Student, Student>chunk(2)
                .faultTolerant().retryLimit(3).retry(Exception.class).skipLimit(100).skip(Exception.class)
                .reader(getDataReader())
                .processor(getDataProcessor())
                .writer(getDataWriter())
                .build();

    }

    private ItemWriter<Student> getDataWriter() {
        return list -> {
            for (Student student:list){
                log.info("write data: {}",student);
            }
        };
    }

    private ItemProcessor<Student, Student> getDataProcessor() {
        return student -> {
            log.info("processer data: {}",student.toString());
            return student;
        };
    }

    private ItemReader<Student> getDataReader() {
        JpaPagingItemReader<Student> reader = new JpaPagingItemReader<>();
        try {
            JpaNativeQueryProvider<Student> queryProvider = new JpaNativeQueryProvider<>();
            queryProvider.setSqlQuery("select * from student");
            //设置实体类
            queryProvider.setEntityClass(Student.class);
            queryProvider.afterPropertiesSet();

            reader.setEntityManagerFactory(emf);
            //设置每页读取的记录数
            reader.setPageSize(3);
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
