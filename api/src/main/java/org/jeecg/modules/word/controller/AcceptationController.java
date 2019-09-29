package org.jeecg.modules.word.controller;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.util.oConvertUtils;
import org.jeecg.modules.word.entity.Acceptation;
import org.jeecg.modules.word.service.IAcceptationService;

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
 * @Description: acceptation
 * @author： jeecg-boot
 * @date：   2019-08-22
 * @version： V1.0
 */
@RestController
@RequestMapping("/word/acceptation")
@Slf4j
public class AcceptationController {
	@Autowired
	private IAcceptationService acceptationService;
	
	/**
	  * 分页列表查询
	 * @param acceptation
	 * @param pageNo
	 * @param pageSize
	 * @param req
	 * @return
	 */
	@GetMapping(value = "/list")
	public Result<IPage<Acceptation>> queryPageList(Acceptation acceptation,
									  @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
									  @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
									  HttpServletRequest req) {
		Result<IPage<Acceptation>> result = new Result<IPage<Acceptation>>();
		QueryWrapper<Acceptation> queryWrapper = QueryGenerator.initQueryWrapper(acceptation, req.getParameterMap());
		Page<Acceptation> page = new Page<Acceptation>(pageNo, pageSize);
		IPage<Acceptation> pageList = acceptationService.page(page, queryWrapper);
		result.setSuccess(true);
		result.setResult(pageList);
		return result;
	}
	
	/**
	  *   添加
	 * @param acceptation
	 * @return
	 */
	@PostMapping(value = "/add")
	public Result<Acceptation> add(@RequestBody Acceptation acceptation) {
		Result<Acceptation> result = new Result<Acceptation>();
		try {
			acceptationService.save(acceptation);
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
	 * @param acceptation
	 * @return
	 */
	@PutMapping(value = "/edit")
	public Result<Acceptation> edit(@RequestBody Acceptation acceptation) {
		Result<Acceptation> result = new Result<Acceptation>();
		Acceptation acceptationEntity = acceptationService.getById(acceptation.getId());
		if(acceptationEntity==null) {
			result.error500("未找到对应实体");
		}else {
			boolean ok = acceptationService.updateById(acceptation);
			//TODO 返回false说明什么？
			if(ok) {
				result.success("修改成功!");
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
	public Result<Acceptation> delete(@RequestParam(name="id",required=true) String id) {
		Result<Acceptation> result = new Result<Acceptation>();
		Acceptation acceptation = acceptationService.getById(id);
		if(acceptation==null) {
			result.error500("未找到对应实体");
		}else {
			boolean ok = acceptationService.removeById(id);
			if(ok) {
				result.success("删除成功!");
			}
		}
		
		return result;
	}
	
	/**
	  *  批量删除
	 * @param ids
	 * @return
	 */
	@DeleteMapping(value = "/deleteBatch")
	public Result<Acceptation> deleteBatch(@RequestParam(name="ids",required=true) String ids) {
		Result<Acceptation> result = new Result<Acceptation>();
		if(ids==null || "".equals(ids.trim())) {
			result.error500("参数不识别！");
		}else {
			this.acceptationService.removeByIds(Arrays.asList(ids.split(",")));
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
	public Result<Acceptation> queryById(@RequestParam(name="id",required=true) String id) {
		Result<Acceptation> result = new Result<Acceptation>();
		Acceptation acceptation = acceptationService.getById(id);
		if(acceptation==null) {
			result.error500("未找到对应实体");
		}else {
			result.setResult(acceptation);
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
      QueryWrapper<Acceptation> queryWrapper = null;
      try {
          String paramsStr = request.getParameter("paramsStr");
          if (oConvertUtils.isNotEmpty(paramsStr)) {
              String deString = URLDecoder.decode(paramsStr, "UTF-8");
              Acceptation acceptation = JSON.parseObject(deString, Acceptation.class);
              queryWrapper = QueryGenerator.initQueryWrapper(acceptation, request.getParameterMap());
          }
      } catch (UnsupportedEncodingException e) {
          e.printStackTrace();
      }

      //Step.2 AutoPoi 导出Excel
      ModelAndView mv = new ModelAndView(new JeecgEntityExcelView());
      List<Acceptation> pageList = acceptationService.list(queryWrapper);
      //导出文件名称
      mv.addObject(NormalExcelConstants.FILE_NAME, "acceptation列表");
      mv.addObject(NormalExcelConstants.CLASS, Acceptation.class);
      mv.addObject(NormalExcelConstants.PARAMS, new ExportParams("acceptation列表数据", "导出人:Jeecg", "导出信息"));
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
              List<Acceptation> listAcceptations = ExcelImportUtil.importExcel(file.getInputStream(), Acceptation.class, params);
              for (Acceptation acceptationExcel : listAcceptations) {
                  acceptationService.save(acceptationExcel);
              }
              return Result.ok("文件导入成功！数据行数：" + listAcceptations.size());
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
