package corn.task;

import corn.job.BackupImgJob;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.*;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.repository.JobExecutionAlreadyRunningException;
import org.springframework.batch.core.repository.JobInstanceAlreadyCompleteException;
import org.springframework.batch.core.repository.JobRestartException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class TimeTask {

    @Autowired
    private JobLauncher jobLauncher;

    @Autowired
    private BackupImgJob backupImgJob;

    //10秒执行一次
    @Scheduled(cron = "0/10 * * * * ?")
    public void runBatch() throws JobParametersInvalidException, JobExecutionAlreadyRunningException, JobRestartException, JobInstanceAlreadyCompleteException {
       log.info("执行定时任务。。。");
        // 在运行一个job的时候需要添加至少一个参数，这个参数最后会被写到batch_job_execution_params表中，
        // 不添加这个参数的话，job不会运行，并且这个参数在表中中不能重复，若设置的参数已存在表中，则会抛出异常，
        // 所以这里才使用时间戳作为参数
        JobParameters jobParameters = new JobParametersBuilder().addLong("timestamp", System.currentTimeMillis()).toJobParameters();

        //获取JOB并运行
        Job job = backupImgJob.dataHandleJob();
        JobExecution execution = jobLauncher.run(job,jobParameters);
        log.info("定时任务结束，状态:{}",execution.getStatus());
    }
}
