package org.seed.modules.message.controller;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.seed.common.api.vo.Result;
import org.seed.common.exception.CornException;
import org.seed.common.system.query.QueryGenerator;
import org.seed.common.util.ResultUtils;
import org.seed.common.util.oConvertUtils;
import org.seed.modules.message.entity.SysMessage;
import org.seed.modules.message.service.ISysMessageService;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;

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
import com.alibaba.fastjson.JSON;

 /**
 * @Title: Controller
 * @Description: 消息
 * @author： jeecg-boot
 * @date：   2019-04-09
 * @version： V1.0
 */
@RestController
@RequestMapping("/message/sysMessage")
@Slf4j
public class SysMessageController {
	@Autowired
	private ISysMessageService sysMessageService;
	
	/**
	  * 分页列表查询
	 * @param sysMessage
	 * @param pageNo
	 * @param pageSize
	 * @param req
	 * @return
	 */
	@GetMapping(value = "/list")
	public Result queryPageList(SysMessage sysMessage,
												   @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
												   @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
												   HttpServletRequest req) {
		QueryWrapper<SysMessage> queryWrapper = QueryGenerator.initQueryWrapper(sysMessage, req.getParameterMap());
		Page<SysMessage> page = new Page<SysMessage>(pageNo, pageSize);
		IPage<SysMessage> pageList = sysMessageService.page(page, queryWrapper);

		return ResultUtils.okData(pageList);

	}
	
	/**
	  *   添加
	 * @param sysMessage
	 * @return
	 */
	@PostMapping(value = "/add")
	public Result add(@RequestBody SysMessage sysMessage) {
		try {
			sysMessageService.save(sysMessage);
			return ResultUtils.ok("添加成功！");
		} catch (Exception e) {
			e.printStackTrace();
			log.info(e.getMessage());
			throw new CornException("操作失败");
		}

	}
	
	/**
	  *  编辑
	 * @param sysMessage
	 * @return
	 */
	@PutMapping(value = "/edit")
	public Result edit(@RequestBody SysMessage sysMessage) {
		SysMessage sysMessageEntity = sysMessageService.getById(sysMessage.getId());
		if(sysMessageEntity==null) {
			throw new CornException("未找到对应实体");
		}else {
			boolean ok = sysMessageService.updateById(sysMessage);
			return ResultUtils.ok("修改成功!");

		}
		

	}
	
	/**
	  *   通过id删除
	 * @param id
	 * @return
	 */
	@DeleteMapping(value = "/delete")
	public Result delete(@RequestParam(name="id",required=true) String id) {
		SysMessage sysMessage = sysMessageService.getById(id);
		if(sysMessage==null) {
			throw new CornException("未找到对应实体");
		}else {
			boolean ok = sysMessageService.removeById(id);
			return ResultUtils.ok("删除成功!");
		}
	}
	
	/**
	  *  批量删除
	 * @param ids
	 * @return
	 */
	@DeleteMapping(value = "/deleteBatch")
	public Result deleteBatch(@RequestParam(name="ids",required=true) String ids) {
		if(ids==null || "".equals(ids.trim())) {
			throw new CornException("参数不识别！");
		}else {
			this.sysMessageService.removeByIds(Arrays.asList(ids.split(",")));
			return ResultUtils.ok("删除成功!");
		}

	}
	
	/**
	  * 通过id查询
	 * @param id
	 * @return
	 */
	@GetMapping(value = "/queryById")
	public Result queryById(@RequestParam(name="id",required=true) String id) {
		SysMessage sysMessage = sysMessageService.getById(id);
		if(sysMessage==null) {
			throw new CornException("未找到对应实体");
		}else {
			return ResultUtils.okData(sysMessage);

		}

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
      QueryWrapper<SysMessage> queryWrapper = null;
      try {
          String paramsStr = request.getParameter("paramsStr");
          if (oConvertUtils.isNotEmpty(paramsStr)) {
              String deString = URLDecoder.decode(paramsStr, "UTF-8");
              SysMessage sysMessage = JSON.parseObject(deString, SysMessage.class);
              queryWrapper = QueryGenerator.initQueryWrapper(sysMessage, request.getParameterMap());
          }
      } catch (UnsupportedEncodingException e) {
          e.printStackTrace();
      }

      //Step.2 AutoPoi 导出Excel
      ModelAndView mv = new ModelAndView(new JeecgEntityExcelView());
      List<SysMessage> pageList = sysMessageService.list(queryWrapper);
      //导出文件名称
      mv.addObject(NormalExcelConstants.FILE_NAME, "消息列表");
      mv.addObject(NormalExcelConstants.CLASS, SysMessage.class);
      mv.addObject(NormalExcelConstants.PARAMS, new ExportParams("消息列表数据", "导出人:Jeecg", "导出信息"));
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
              List<SysMessage> listSysMessages = ExcelImportUtil.importExcel(file.getInputStream(), SysMessage.class, params);
              for (SysMessage sysMessageExcel : listSysMessages) {
                  sysMessageService.save(sysMessageExcel);
              }
              return ResultUtils.ok("文件导入成功！数据行数：" + listSysMessages.size());
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
