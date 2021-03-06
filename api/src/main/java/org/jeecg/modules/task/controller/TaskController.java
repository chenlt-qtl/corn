package org.jeecg.modules.task.controller;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.util.UpLoadUtil;
import org.jeecg.common.util.oConvertUtils;
import org.jeecg.modules.task.entity.Task;
import org.jeecg.modules.task.service.ITaskService;
import org.jeecg.modules.task.vo.TaskVo;
import org.jeecgframework.poi.excel.ExcelImportUtil;
import org.jeecgframework.poi.excel.def.NormalExcelConstants;
import org.jeecgframework.poi.excel.entity.ExportParams;
import org.jeecgframework.poi.excel.entity.ImportParams;
import org.jeecgframework.poi.excel.view.JeecgEntityExcelView;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.*;

/**
 * @Title: Controller
 * @Description: 任务
 * @author： jeecg-boot
 * @date：   2019-12-10
 * @version： V1.0
 */
@RestController
@RequestMapping("/task")
@Slf4j
public class TaskController {
	@Autowired
	private ITaskService taskService;
	
	/**
	  * 分页列表查询
	 * @param task
	 * @param pageNo
	 * @param pageSize
	 * @param req
	 * @return
	 */
	@GetMapping(value = "/list")
	public Result<IPage<TaskVo>> queryPageList(Task task,
											   @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
											   @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
											   @RequestParam(name="timeRange",required = false) String timeRange,
											   @RequestParam(name="statusArr",required = false) Integer[] statusArr,
											   @RequestParam(name="searchKey",required = false) String searchKey,
											   HttpServletRequest req) {
		Result<IPage<TaskVo>> result = new Result<IPage<TaskVo>>();
		QueryWrapper<Task> queryWrapper = QueryGenerator.initQueryWrapper(task, req.getParameterMap());
		queryWrapper.eq("p_id","0");

		if(statusArr != null && statusArr.length>0){
			queryWrapper.in("status", statusArr);
		}

		if(StringUtils.isNotBlank(searchKey)){
			queryWrapper.like("title",searchKey);
		}

		if(StringUtils.isNotBlank(timeRange)){
			if("nodate".equals(timeRange)){
				queryWrapper.isNull("plan_start_date");
			}else {
				Calendar calendar = Calendar.getInstance();
				calendar.setTimeInMillis((calendar.getTimeInMillis() / (1000 * 60 * 60 * 24)) * 1000 * 60 * 60 * 24 - (1000 * 60 * 60 * 8));
				if ("week".equals(timeRange)) {
					calendar.add(Calendar.DATE, -calendar.get(Calendar.DAY_OF_WEEK) + 2);
				}
				queryWrapper.ge("plan_start_date", calendar.getTime());
			}
		}
		queryWrapper.orderByDesc("update_time");

		Page<Task> page = new Page<Task>(pageNo, pageSize);
		IPage<TaskVo> pageList = taskService.pageWithChild(page, queryWrapper);
		result.setSuccess(true);
		result.setResult(pageList);
		return result;
	}
	
	/**
	  *   添加
	 * @param task
	 * @return
	 */
	@PostMapping(value = "/add")
	public Result<Task> add(@RequestBody Task task) {
		Result<Task> result = new Result<Task>();
		try {
			taskService.saveTask(task);
			result.success("添加成功！");
		} catch (Exception e) {
			e.printStackTrace();
			log.info(e.getMessage());
			result.error500("操作失败");
		}
		return result;
	}
	
	/**
	  *  编辑
	 * @param task
	 * @return
	 */
	@PutMapping(value = "/edit")
	public Result<Task> edit(@RequestBody Task task) {
		Result<Task> result = new Result<Task>();
		Task taskEntity = taskService.getById(task.getId());
		if(taskEntity==null) {
			result.error500("未找到对应实体");
		}else {
			boolean ok = taskService.updateTask(task,taskEntity);
			//TODO 返回false说明什么？
			if(ok) {
				result.success("修改成功!");
				result.setResult(task);
			}
		}
		
		return result;
	}
	
	/**
	  *   通过id删除
	 * @param id
	 * @return
	 */
	@DeleteMapping(value = "/delete")
	public Result<Task> delete(@RequestParam(name="id",required=true) String id) {
		Result<Task> result = new Result<Task>();
		Task task = taskService.getById(id);
		if(task==null) {
			result.error500("未找到对应实体");
		}else {
			taskService.delTask(task);
			result.success("删除成功!");
		}
		
		return result;
	}
	
	/**
	  *  批量删除
	 * @param ids
	 * @return
	 */
	@DeleteMapping(value = "/deleteBatch")
	public Result<Task> deleteBatch(@RequestParam(name="ids",required=true) String ids) {
		Result<Task> result = new Result<Task>();
		if(ids==null || "".equals(ids.trim())) {
			result.error500("参数不识别！");
		}else {
			//this.taskService.removeByIds(Arrays.asList(ids.split(",")));
			result.success("删除成功!");
		}
		return result;
	}
	
	/**
	  * 通过id查询
	 * @param id
	 * @return
	 */
	@GetMapping(value = "/queryById")
	public Result<Task> queryById(@RequestParam(name="id",required=true) String id) {
		Result<Task> result = new Result<Task>();
		Task task = taskService.getById(id);
		if(task==null) {
			result.error500("未找到对应实体");
		}else {
			task.setComment(UpLoadUtil.dbToReal(task.getComment(),"html"));
			result.setResult(task);
			result.setSuccess(true);
		}
		return result;
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
      QueryWrapper<Task> queryWrapper = null;
      try {
          String paramsStr = request.getParameter("paramsStr");
          if (oConvertUtils.isNotEmpty(paramsStr)) {
              String deString = URLDecoder.decode(paramsStr, "UTF-8");
              Task task = JSON.parseObject(deString, Task.class);
              queryWrapper = QueryGenerator.initQueryWrapper(task, request.getParameterMap());
          }
      } catch (UnsupportedEncodingException e) {
          e.printStackTrace();
      }

      //Step.2 AutoPoi 导出Excel
      ModelAndView mv = new ModelAndView(new JeecgEntityExcelView());
      List<Task> pageList = taskService.list(queryWrapper);
      //导出文件名称
      mv.addObject(NormalExcelConstants.FILE_NAME, "任务列表");
      mv.addObject(NormalExcelConstants.CLASS, Task.class);
      mv.addObject(NormalExcelConstants.PARAMS, new ExportParams("任务列表数据", "导出人:Jeecg", "导出信息"));
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
  public Result<?> importExcel(HttpServletRequest request, HttpServletResponse response) {
      MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
      Map<String, MultipartFile> fileMap = multipartRequest.getFileMap();
      for (Map.Entry<String, MultipartFile> entity : fileMap.entrySet()) {
          MultipartFile file = entity.getValue();// 获取上传文件对象
          ImportParams params = new ImportParams();
          params.setTitleRows(2);
          params.setHeadRows(1);
          params.setNeedSave(true);
          try {
              List<Task> listTasks = ExcelImportUtil.importExcel(file.getInputStream(), Task.class, params);
              for (Task taskExcel : listTasks) {
                  taskService.save(taskExcel);
              }
              return Result.ok("文件导入成功！数据行数：" + listTasks.size());
          } catch (Exception e) {
              log.error(e.getMessage());
              return Result.error("文件导入失败！");
          } finally {
              try {
                  file.getInputStream().close();
              } catch (IOException e) {
                  e.printStackTrace();
              }
          }
      }
      return Result.ok("文件导入失败！");
  }

}
