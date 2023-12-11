package corn.service;

import corn.mapper.NoteContentMapper;
import corn.modal.NoteContent;
import corn.modal.Result;
import corn.utils.BtoaEncode;
import corn.utils.ImgUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.batch.core.*;
import org.springframework.batch.core.repository.JobExecutionAlreadyRunningException;
import org.springframework.batch.core.repository.JobInstanceAlreadyCompleteException;
import org.springframework.batch.core.repository.JobRestartException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;

import javax.annotation.Resource;
import java.io.*;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class NoteContentService {

    @Autowired
    RestService restService;

    @Resource
    private NoteContentMapper noteContentMapper;

    @Value("${corn.path.backup}")
    String backupPath;

    @Value("${corn.resourceUrl}")
    String resourceUrl;

    public void backupImg() {
        //1. 从API读取数据
        int pageNo = 1;
        int pageSize = 20;
        int total = pageSize + 1;
        Map<String, Object> param = new HashMap();
        param.put("pageSize", pageSize);
        param.put("searchStr", "![图片");

        for (; total > (pageNo - 1) * pageSize; pageNo++) {
            param.put("pageNo", pageNo);
            Result result = restService.get("/noteContent", param);
            Map page = (Map) result.getResult();
            List<Map> records = (List<Map>) page.get("records");
            total = (int) page.get("total");
            //2. 提取出图片
            for (Map noteContent : records) {
                log.info("处理笔记：{}", noteContent.get("id"));
                String text = BtoaEncode.decrypt((String) noteContent.get("text"));
                String[] imgUrls = ImgUtil.getImgUrls(text);


                //3. 保存到本地
                for (String urlStr : imgUrls) {
                    if (StringUtils.isNotBlank(urlStr)) {
                        String oldUrl = resourceUrl + urlStr;
                        String newUrl = backupPath + File.separator + urlStr;
                        OutputStream out = null;
                        try {
                            //如果文件夹不存在要创建
                            File newFolder = new File(newUrl.substring(0, newUrl.lastIndexOf("/")));
                            if (!newFolder.exists()) {
                                newFolder.mkdirs();
                            }else{
                                //如果文件已存在则跳过
                                File newFile = new File(newUrl);
                                if(newFile.exists()){
                                    continue;
                                }
                            }

                            out = new FileOutputStream(newUrl);
                            URL url = new URL(oldUrl);
                            URLConnection connection = url.openConnection();
                            connection.setConnectTimeout(5000); // 设置连接超时时间
                            FileCopyUtils.copy(connection.getInputStream(), out);
                            log.info("保存成功：{}", newUrl);
                        } catch (IOException e) {
                            if (out != null) {
                                try {
                                    out.close();
                                } catch (IOException ex) {
                                    ex.printStackTrace();
                                }
                            }

                        } finally {
                        }
                    }

                }
            }
        }
        log.info("total : {}", total);

    }

    /**
     * 通过API查出数据，再根据URL去获取数据保存到本地
     *
     * @throws JobParametersInvalidException
     * @throws JobExecutionAlreadyRunningException
     * @throws JobRestartException
     * @throws JobInstanceAlreadyCompleteException
     */
//    public void runBackupImgJob() throws JobParametersInvalidException, JobExecutionAlreadyRunningException, JobRestartException, JobInstanceAlreadyCompleteException {
//        log.info("执行备份任务。。。");
//        // 在运行一个job的时候需要添加至少一个参数，这个参数最后会被写到batch_job_execution_params表中，
//        // 不添加这个参数的话，job不会运行，并且这个参数在表中中不能重复，若设置的参数已存在表中，则会抛出异常，
//        // 所以这里才使用时间戳作为参数
//
//        JobParameters jobParameters = new JobParametersBuilder().addDate("date",new Date()).toJobParameters();
//
//        //获取JOB并运行
//        Job job = backupImgJob.dataHandleJob();
//        JobExecution execution = jobLauncher.run(job,jobParameters);
//        log.info("备份任务结束，状态:{}",execution.getStatus());
//    }
    public void removeUselessContent() {
        log.info("删除无用的content");
        noteContentMapper.deleteUseless();
    }

}
