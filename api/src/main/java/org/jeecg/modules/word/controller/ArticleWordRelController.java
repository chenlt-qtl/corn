package org.jeecg.modules.word.controller;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.util.oConvertUtils;
import org.jeecg.modules.word.entity.ArticleWordRel;
import org.jeecg.modules.word.service.IArticleWordRelService;
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
import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * @Title: Controller
 * @Description: word_article_word_rel
 * @author： jeecg-boot
 * @date：   2019-08-22
 * @version： V1.0
 */
@RestController
@RequestMapping("/word/articleWordRel")
@Slf4j
public class ArticleWordRelController {
	@Autowired
	private IArticleWordRelService ArticleWordRelService;
	
	/**
	  * 分页列表查询
	 * @param ArticleWordRel
	 * @param pageNo
	 * @param pageSize
	 * @param req
	 * @return
	 */
	@GetMapping(value = "/list")
	public Result<IPage<ArticleWordRel>> queryPageList(ArticleWordRel ArticleWordRel,
													   @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
													   @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
													   HttpServletRequest req) {
		Result<IPage<ArticleWordRel>> result = new Result<IPage<ArticleWordRel>>();
		QueryWrapper<ArticleWordRel> queryWrapper = QueryGenerator.initQueryWrapper(ArticleWordRel, req.getParameterMap());
		Page<ArticleWordRel> page = new Page<ArticleWordRel>(pageNo, pageSize);
		IPage<ArticleWordRel> pageList = ArticleWordRelService.page(page, queryWrapper);
		result.setSuccess(true);
		result.setResult(pageList);
		return result;
	}
	
	/**
	  *   添加
	 * @param ArticleWordRel
	 * @return
	 */
	@PostMapping(value = "/add")
	public Result<ArticleWordRel> add(@RequestBody ArticleWordRel ArticleWordRel) {
		Result<ArticleWordRel> result = new Result<ArticleWordRel>();
		try {
			ArticleWordRelService.save(ArticleWordRel);
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
	 * @param ArticleWordRel
	 * @return
	 */
	@PutMapping(value = "/edit")
	public Result<ArticleWordRel> edit(@RequestBody ArticleWordRel ArticleWordRel) {
		Result<ArticleWordRel> result = new Result<ArticleWordRel>();
		ArticleWordRel ArticleWordRelEntity = ArticleWordRelService.getById(ArticleWordRel.getId());
		if(ArticleWordRelEntity==null) {
			result.error500("未找到对应实体");
		}else {
			boolean ok = ArticleWordRelService.updateById(ArticleWordRel);
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
	public Result<ArticleWordRel> delete(@RequestParam(name="wordId",required=true) String wordId,@RequestParam(name="articleId",required=true) String articleId) {
		Result<ArticleWordRel> result = new Result<ArticleWordRel>();
		ArticleWordRel articleWordRel = ArticleWordRelService.getRel(articleId,wordId);
		if(articleWordRel==null) {
			result.error500("未找到对应实体");
		}else {
			boolean ok = ArticleWordRelService.removeById(articleWordRel.getId());
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
	public Result<ArticleWordRel> deleteBatch(@RequestParam(name="ids",required=true) String ids) {
		Result<ArticleWordRel> result = new Result<ArticleWordRel>();
		if(ids==null || "".equals(ids.trim())) {
			result.error500("参数不识别！");
		}else {
			this.ArticleWordRelService.removeByIds(Arrays.asList(ids.split(",")));
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
	public Result<ArticleWordRel> queryById(@RequestParam(name="id",required=true) String id) {
		Result<ArticleWordRel> result = new Result<ArticleWordRel>();
		ArticleWordRel ArticleWordRel = ArticleWordRelService.getById(id);
		if(ArticleWordRel==null) {
			result.error500("未找到对应实体");
		}else {
			result.setResult(ArticleWordRel);
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
      QueryWrapper<ArticleWordRel> queryWrapper = null;
      try {
          String paramsStr = request.getParameter("paramsStr");
          if (oConvertUtils.isNotEmpty(paramsStr)) {
              String deString = URLDecoder.decode(paramsStr, "UTF-8");
              ArticleWordRel ArticleWordRel = JSON.parseObject(deString, ArticleWordRel.class);
              queryWrapper = QueryGenerator.initQueryWrapper(ArticleWordRel, request.getParameterMap());
          }
      } catch (UnsupportedEncodingException e) {
          e.printStackTrace();
      }

      //Step.2 AutoPoi 导出Excel
      ModelAndView mv = new ModelAndView(new JeecgEntityExcelView());
      List<ArticleWordRel> pageList = ArticleWordRelService.list(queryWrapper);
      //导出文件名称
      mv.addObject(NormalExcelConstants.FILE_NAME, "word_sentence_word_rel列表");
      mv.addObject(NormalExcelConstants.CLASS, ArticleWordRel.class);
      mv.addObject(NormalExcelConstants.PARAMS, new ExportParams("word_sentence_word_rel列表数据", "导出人:Jeecg", "导出信息"));
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
              List<ArticleWordRel> listArticleWordRels = ExcelImportUtil.importExcel(file.getInputStream(), ArticleWordRel.class, params);
              for (ArticleWordRel ArticleWordRelExcel : listArticleWordRels) {
                  ArticleWordRelService.save(ArticleWordRelExcel);
              }
              return Result.ok("文件导入成功！数据行数：" + listArticleWordRels.size());
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
