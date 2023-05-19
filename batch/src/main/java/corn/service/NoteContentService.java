package corn.service;

import corn.job.BackupImgJob;
import corn.mapper.NoteContentMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.*;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.repository.JobExecutionAlreadyRunningException;
import org.springframework.batch.core.repository.JobInstanceAlreadyCompleteException;
import org.springframework.batch.core.repository.JobRestartException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.text.SimpleDateFormat;
import java.util.Date;

@Service
@Slf4j
public class NoteContentService {

    @Autowired
    private JobLauncher jobLauncher;

    @Autowired
    private BackupImgJob backupImgJob;

    @Resource
    private NoteContentMapper noteContentMapper;

    public void backupImg() throws JobParametersInvalidException, JobExecutionAlreadyRunningException, JobRestartException, JobInstanceAlreadyCompleteException {
        //备份数据
        runBackupImgJob();

    }

    public void runBackupImgJob() throws JobParametersInvalidException, JobExecutionAlreadyRunningException, JobRestartException, JobInstanceAlreadyCompleteException {
        log.info("执行备份任务。。。");
        // 在运行一个job的时候需要添加至少一个参数，这个参数最后会被写到batch_job_execution_params表中，
        // 不添加这个参数的话，job不会运行，并且这个参数在表中中不能重复，若设置的参数已存在表中，则会抛出异常，
        // 所以这里才使用时间戳作为参数
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss ");

        JobParameters jobParameters = new JobParametersBuilder().addDate("date",new Date()).toJobParameters();

        //获取JOB并运行
        Job job = backupImgJob.dataHandleJob();
        JobExecution execution = jobLauncher.run(job,jobParameters);
        log.info("备份任务结束，状态:{}",execution.getStatus());
    }

    public void removeUselessContent(){
        log.info("删除无用的content");
        noteContentMapper.deleteUseless();
    }

    public void runCreateIndex() throws JobParametersInvalidException, JobExecutionAlreadyRunningException, JobRestartException, JobInstanceAlreadyCompleteException {
        log.info("执行备份任务。。。");
        // 在运行一个job的时候需要添加至少一个参数，这个参数最后会被写到batch_job_execution_params表中，
        // 不添加这个参数的话，job不会运行，并且这个参数在表中中不能重复，若设置的参数已存在表中，则会抛出异常，
        // 所以这里才使用时间戳作为参数
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss ");

        JobParameters jobParameters = new JobParametersBuilder().addString("date", sdf.format(new Date())).toJobParameters();
        //获取JOB并运行
        Job job = backupImgJob.dataHandleJob();
        JobExecution execution = jobLauncher.run(job,jobParameters);
        log.info("备份任务结束，状态:{}",execution.getStatus());
    }
}
