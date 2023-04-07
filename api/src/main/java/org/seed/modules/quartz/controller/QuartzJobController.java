package org.seed.modules.quartz.controller;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSON;
import org.seed.common.api.vo.Result;
import org.seed.common.constant.CommonConstant;
import org.seed.common.exception.CornException;
import org.seed.common.system.query.QueryGenerator;
import org.seed.common.util.ResultUtils;
import org.seed.common.util.oConvertUtils;
import org.seed.modules.quartz.entity.QuartzJob;
import org.seed.modules.quartz.service.IQuartzJobService;
import org.jeecgframework.poi.excel.ExcelImportUtil;
import org.jeecgframework.poi.excel.def.NormalExcelConstants;
import org.jeecgframework.poi.excel.entity.ExportParams;
import org.jeecgframework.poi.excel.entity.ImportParams;
import org.jeecgframework.poi.excel.view.JeecgEntityExcelView;
import org.quartz.CronScheduleBuilder;
import org.quartz.CronTrigger;
import org.quartz.Job;
import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.JobKey;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.TriggerBuilder;
import org.quartz.TriggerKey;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

/**
 * @Title: Controller
 * @Description: 定时任务在线管理
 * @author： jeecg-boot
 * @date： 2019-01-02
 * @version：V1.0
 */
@RestController
@RequestMapping("/sys/quartzJob")
@Slf4j
public class QuartzJobController {
    @Autowired
    private IQuartzJobService quartzJobService;
    @Autowired
    private Scheduler scheduler;

    /**
     * 分页列表查询
     *
     * @param quartzJob
     * @param pageNo
     * @param pageSize
     * @param req
     * @return
     */
    @RequestMapping(value = "/list", method = RequestMethod.GET)
    public Result queryPageList(QuartzJob quartzJob, @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize, HttpServletRequest req) {
        QueryWrapper<QuartzJob> queryWrapper = QueryGenerator.initQueryWrapper(quartzJob, req.getParameterMap());
        Page<QuartzJob> page = new Page<QuartzJob>(pageNo, pageSize);
        IPage<QuartzJob> pageList = quartzJobService.page(page, queryWrapper);
        return ResultUtils.okData(pageList);
    }

    /**
     * 添加定时任务
     *
     * @param quartzJob
     * @return
     */
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public Result add(@RequestBody QuartzJob quartzJob) {

        List<QuartzJob> list = quartzJobService.findByJobClassName(quartzJob.getJobClassName());
        if (list != null && list.size() > 0) {
            throw new CornException("该定时任务类名已存在");
        }
        try {
            schedulerAdd(quartzJob.getJobClassName().trim(), quartzJob.getCronExpression().trim(), quartzJob.getParameter());
            //
            quartzJob.setDelFlag(CommonConstant.DEL_FLAG_0);
            quartzJob.setStatus(CommonConstant.STATUS_NORMAL);
            quartzJobService.save(quartzJob);
            return ResultUtils.ok();
        } catch (Exception e) {
            e.printStackTrace();
            log.info(e.getMessage());
            throw new CornException(e.getMessage());
        }
    }

    /**
     * 更新定时任务
     *
     * @param quartzJob
     * @return
     */
    @RequestMapping(value = "/edit", method = RequestMethod.PUT)
    public Result eidt(@RequestBody QuartzJob quartzJob) {
        QuartzJob quartzJobEntity = quartzJobService.getById(quartzJob.getId());
        if (quartzJobEntity == null) {
            return ResultUtils.error("未找到对应实体");
        } else {
            schedulerDelete(quartzJob.getJobClassName().trim());
            if (CommonConstant.STATUS_NORMAL == quartzJob.getStatus()) {
                schedulerAdd(quartzJob.getJobClassName().trim(), quartzJob.getCronExpression().trim(), quartzJob.getParameter());
            }
            quartzJobService.updateById(quartzJob);
            return ResultUtils.ok();
        }
    }

    /**
     * 通过id删除
     *
     * @param id
     * @return
     */
    @RequestMapping(value = "/delete", method = RequestMethod.DELETE)
    public Result delete(@RequestParam(name = "id", required = true) String id) {
        QuartzJob quartzJob = quartzJobService.getById(id);
        if (quartzJob == null) {
            return ResultUtils.error("未找到对应实体");
        } else {
            QuartzJob job = quartzJobService.getById(id);
            schedulerDelete(job.getJobClassName().trim());
            quartzJobService.removeById(id);
            return ResultUtils.ok();
        }
    }

    /**
     * 批量删除
     *
     * @param ids
     * @return
     */
    @RequestMapping(value = "/deleteBatch", method = RequestMethod.DELETE)
    public Result deleteBatch(@RequestParam(name = "ids", required = true) String ids) {
        if (ids == null || "".equals(ids.trim())) {
            return ResultUtils.error("参数不识别！");
        } else {
            for (String id : Arrays.asList(ids.split(","))) {
                QuartzJob job = quartzJobService.getById(id);
                schedulerDelete(job.getJobClassName().trim());
                quartzJobService.removeById(id);
            }
            return ResultUtils.ok();
        }
    }

    /**
     * 暂停定时任务
     *
     * @param job
     * @return
     */
    @RequestMapping(value = "/pause", method = RequestMethod.POST)
    @ApiOperation(value = "暂停定时任务")
    public Result pauseJob(@RequestBody QuartzJob job) {

        try {
            scheduler.pauseJob(JobKey.jobKey(job.getJobClassName().trim()));
        } catch (SchedulerException e) {
            throw new CornException("暂停定时任务失败");
        }
        job.setStatus(CommonConstant.STATUS_DISABLE);
        quartzJobService.updateById(job);
        return ResultUtils.ok();
    }

    /**
     * 启动定时任务
     *
     * @param job
     * @return
     */
    @RequestMapping(value = "/resume", method = RequestMethod.POST)
    @ApiOperation(value = "恢复定时任务")
    public Result resumeJob(@RequestBody QuartzJob job) {

        try {
            scheduler.resumeJob(JobKey.jobKey(job.getJobClassName().trim()));
        } catch (SchedulerException e) {
            throw new CornException("恢复定时任务失败");
        }
        job.setStatus(CommonConstant.STATUS_NORMAL);
        quartzJobService.updateById(job);
        return ResultUtils.ok();
    }

    /**
     * 通过id查询
     *
     * @param id
     * @return
     */
    @RequestMapping(value = "/queryById", method = RequestMethod.GET)
    public Result queryById(@RequestParam(name = "id", required = true) String id) {
        QuartzJob quartzJob = quartzJobService.getById(id);
        if (quartzJob == null) {
            return ResultUtils.error("未找到对应实体");
        } else {
            return ResultUtils.okData(quartzJob);
        }
    }

    /**
     * 添加定时任务
     *
     * @param jobClassName
     * @param cronExpression
     * @param parameter
     */
    private void schedulerAdd(String jobClassName, String cronExpression, String parameter) {

        try {
            // 启动调度器
            scheduler.start();

            // 构建job信息
            JobDetail jobDetail = JobBuilder.newJob(getClass(jobClassName).getClass()).withIdentity(jobClassName).usingJobData("parameter", parameter).build();

            // 表达式调度构建器(即任务执行的时间)
            CronScheduleBuilder scheduleBuilder = CronScheduleBuilder.cronSchedule(cronExpression);

            // 按新的cronExpression表达式构建一个新的trigger
            CronTrigger trigger = TriggerBuilder.newTrigger().withIdentity(jobClassName).withSchedule(scheduleBuilder).build();

            scheduler.scheduleJob(jobDetail, trigger);
        } catch (SchedulerException e) {
            log.error(e.toString());
            throw new CornException("创建定时任务失败");
        } catch (Exception e) {
            throw new CornException("后台找不到该类名任务");
        }
    }

    /**
     * 删除定时任务
     *
     * @param jobClassName
     */
    private void schedulerDelete(String jobClassName) {

        try {
            scheduler.pauseTrigger(TriggerKey.triggerKey(jobClassName));
            scheduler.unscheduleJob(TriggerKey.triggerKey(jobClassName));
            scheduler.deleteJob(JobKey.jobKey(jobClassName));
        } catch (Exception e) {
            throw new CornException("删除定时任务失败");
        }
    }

    private static Job getClass(String classname) throws Exception {
        Class<?> class1 = Class.forName(classname);
        return (Job) class1.newInstance();
    }

    /**
     * 导出excel
     *
     * @param request
     * @param response
     */
    @RequestMapping(value = "/exportXls")
    public ModelAndView exportXls(HttpServletRequest request, HttpServletResponse response) {
        // Step.1 组装查询条件
        QueryWrapper<QuartzJob> queryWrapper = null;
        try {
            String paramsStr = request.getParameter("paramsStr");
            if (oConvertUtils.isNotEmpty(paramsStr)) {
                String deString = URLDecoder.decode(paramsStr, "UTF-8");
                QuartzJob quartzJob = JSON.parseObject(deString, QuartzJob.class);
                queryWrapper = QueryGenerator.initQueryWrapper(quartzJob, request.getParameterMap());
            }
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }

        //Step.2 AutoPoi 导出Excel
        ModelAndView mv = new ModelAndView(new JeecgEntityExcelView());
        List<QuartzJob> pageList = quartzJobService.list(queryWrapper);
        //导出文件名称
        mv.addObject(NormalExcelConstants.FILE_NAME, "定时任务列表");
        mv.addObject(NormalExcelConstants.CLASS, QuartzJob.class);
        mv.addObject(NormalExcelConstants.PARAMS, new ExportParams("定时任务列表数据", "导出人:Jeecg", "导出信息"));
        mv.addObject(NormalExcelConstants.DATA_LIST, pageList);
        return mv;
    }

    /**
     * 通过excel导入数据
     *
     * @param request
     * @param response
     * @return
     */
    @RequestMapping(value = "/importExcel", method = RequestMethod.POST)
    public Result importExcel(HttpServletRequest request, HttpServletResponse response) {
        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
        Map<String, MultipartFile> fileMap = multipartRequest.getFileMap();
        for (Map.Entry<String, MultipartFile> entity : fileMap.entrySet()) {
            MultipartFile file = entity.getValue();// 获取上传文件对象
            ImportParams params = new ImportParams();
            params.setTitleRows(2);
            params.setHeadRows(1);
            params.setNeedSave(true);
            try {
                List<QuartzJob> listQuartzJobs = ExcelImportUtil.importExcel(file.getInputStream(), QuartzJob.class, params);
                for (QuartzJob quartzJobExcel : listQuartzJobs) {
                    quartzJobService.save(quartzJobExcel);
                }
                return ResultUtils.ok("文件导入成功！数据行数：" + listQuartzJobs.size());
            } catch (Exception e) {
                log.error(e.getMessage());
                return ResultUtils.error("文件导入失败！");
            } finally {
                try {
                    file.getInputStream().close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return ResultUtils.ok("文件导入失败！");
    }
}
