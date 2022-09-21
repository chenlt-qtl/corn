package corn.task;

import corn.service.NoteContentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.JobParametersInvalidException;
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
    NoteContentService noteContentService;

    @Scheduled(cron = "0 0 0 * * ? ")
    public void runBatch() throws JobParametersInvalidException, JobExecutionAlreadyRunningException, JobRestartException, JobInstanceAlreadyCompleteException {
       log.info("备份开始。。。");
       //清理多余的content
       noteContentService.removeUselessContent();
       //备份图片
       noteContentService.runBackupImgJob();


       log.info("备份结束");
    }
}
