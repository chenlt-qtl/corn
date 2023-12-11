package corn.job;


import corn.listener.JobListener;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class BackupImgJob {
    @Autowired
    private JobBuilderFactory jobBuilderFactory;

    @Autowired
    private JobListener jobListener;

    @Autowired
    private BackupImgStep backupImgStep;

    public Job dataHandleJob() {
        return jobBuilderFactory.get("backupImgJob")
                .incrementer(new RunIdIncrementer())
                .start(backupImgStep.getBackupImgStep())
                .listener(jobListener)
                .build();
    }
}
