package org.seed.modules.word.controller;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.seed.common.api.vo.Result;
import org.seed.common.system.query.QueryGenerator;
import org.seed.common.util.oConvertUtils;
import org.seed.modules.word.entity.IcibaSentence;
import org.seed.modules.word.service.IIcibaSentenceService;

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
 * @Description: iciba_sentence
 * @author： jeecg-boot
 * @date：   2019-08-22
 * @version： V1.0
 */
@RestController
@RequestMapping("/word/icibaSentence")
@Slf4j
public class IcibaSentenceController {
	@Autowired
	private IIcibaSentenceService icibaSentenceService;
	
	/**
	  * 分页列表查询
	 * @param icibaSentence
	 * @param pageNo
	 * @param pageSize
	 * @param req
	 * @return
	 */
	@GetMapping(value = "/list")
	public Result<IPage<IcibaSentence>> queryPageList(IcibaSentence icibaSentence,
									  @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
									  @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
									  HttpServletRequest req) {
		Result<IPage<IcibaSentence>> result = new Result<IPage<IcibaSentence>>();
		QueryWrapper<IcibaSentence> queryWrapper = QueryGenerator.initQueryWrapper(icibaSentence, req.getParameterMap());
		Page<IcibaSentence> page = new Page<IcibaSentence>(pageNo, pageSize);
		IPage<IcibaSentence> pageList = icibaSentenceService.page(page, queryWrapper);
		result.setSuccess(true);
		result.setResult(pageList);
		return result;
	}
	
	/**
	  *   添加
	 * @param icibaSentence
	 * @return
	 */
	@PostMapping(value = "/add")
	public Result<IcibaSentence> add(@RequestBody IcibaSentence icibaSentence) {
		Result<IcibaSentence> result = new Result<IcibaSentence>();
		try {
			icibaSentenceService.save(icibaSentence);
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
	 * @param icibaSentence
	 * @return
	 */
	@PutMapping(value = "/edit")
	public Result<IcibaSentence> edit(@RequestBody IcibaSentence icibaSentence) {
		Result<IcibaSentence> result = new Result<IcibaSentence>();
		IcibaSentence icibaSentenceEntity = icibaSentenceService.getById(icibaSentence.getId());
		if(icibaSentenceEntity==null) {
			result.error500("未找到对应实体");
		}else {
			boolean ok = icibaSentenceService.updateById(icibaSentence);
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
	public Result<IcibaSentence> delete(@RequestParam(name="id",required=true) String id) {
		Result<IcibaSentence> result = new Result<IcibaSentence>();
		IcibaSentence icibaSentence = icibaSentenceService.getById(id);
		if(icibaSentence==null) {
			result.error500("未找到对应实体");
		}else {
			boolean ok = icibaSentenceService.removeById(id);
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
	public Result<IcibaSentence> deleteBatch(@RequestParam(name="ids",required=true) String ids) {
		Result<IcibaSentence> result = new Result<IcibaSentence>();
		if(ids==null || "".equals(ids.trim())) {
			result.error500("参数不识别！");
		}else {
			this.icibaSentenceService.removeByIds(Arrays.asList(ids.split(",")));
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
	public Result<IcibaSentence> queryById(@RequestParam(name="id",required=true) String id) {
		Result<IcibaSentence> result = new Result<IcibaSentence>();
		IcibaSentence icibaSentence = icibaSentenceService.getById(id);
		if(icibaSentence==null) {
			result.error500("未找到对应实体");
		}else {
			result.setResult(icibaSentence);
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
      QueryWrapper<IcibaSentence> queryWrapper = null;
      try {
          String paramsStr = request.getParameter("paramsStr");
          if (oConvertUtils.isNotEmpty(paramsStr)) {
              String deString = URLDecoder.decode(paramsStr, "UTF-8");
              IcibaSentence icibaSentence = JSON.parseObject(deString, IcibaSentence.class);
              queryWrapper = QueryGenerator.initQueryWrapper(icibaSentence, request.getParameterMap());
          }
      } catch (UnsupportedEncodingException e) {
          e.printStackTrace();
      }

      //Step.2 AutoPoi 导出Excel
      ModelAndView mv = new ModelAndView(new JeecgEntityExcelView());
      List<IcibaSentence> pageList = icibaSentenceService.list(queryWrapper);
      //导出文件名称
      mv.addObject(NormalExcelConstants.FILE_NAME, "iciba_sentence列表");
      mv.addObject(NormalExcelConstants.CLASS, IcibaSentence.class);
      mv.addObject(NormalExcelConstants.PARAMS, new ExportParams("iciba_sentence列表数据", "导出人:Jeecg", "导出信息"));
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
              List<IcibaSentence> listIcibaSentences = ExcelImportUtil.importExcel(file.getInputStream(), IcibaSentence.class, params);
              for (IcibaSentence icibaSentenceExcel : listIcibaSentences) {
                  icibaSentenceService.save(icibaSentenceExcel);
              }
              return Result.ok("文件导入成功！数据行数：" + listIcibaSentences.size());
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
