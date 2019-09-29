package org.jeecg.modules.word.controller;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.shiro.SecurityUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.util.oConvertUtils;
import org.jeecg.modules.system.entity.SysUser;
import org.jeecg.modules.word.entity.Article;
import org.jeecg.modules.word.service.IArticleService;

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
 * @Description: article
 * @author： jeecg-boot
 * @date：   2019-08-22
 * @version： V1.0
 */
@RestController
@RequestMapping("/word/article")
@Slf4j
public class ArticleController {
	@Autowired
	private IArticleService articleService;
	
	/**
	  * 分页列表查询
	 * @param article
	 * @param pageNo
	 * @param pageSize
	 * @param req
	 * @return
	 */
	@GetMapping(value = "/list")
	public Result<IPage<Article>> queryPageList(Article article,
									  @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
									  @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
									  HttpServletRequest req) {
		SysUser sysUser = (SysUser) SecurityUtils.getSubject().getPrincipal();
		Result<IPage<Article>> result = new Result<IPage<Article>>();
		QueryWrapper<Article> queryWrapper = new QueryWrapper<>();
		queryWrapper.eq("create_by",sysUser.getUsername()).
				like("title",article.getTitle()).
				orderByDesc("create_time");
		Page<Article> page = new Page<Article>(pageNo, pageSize);
		IPage<Article> pageList = articleService.page(page, queryWrapper);
		result.setSuccess(true);
		result.setResult(pageList);
		return result;
	}
	
	/**
	  *   添加
	 * @param article
	 * @return
	 */
	@PostMapping(value = "/add")
	public Result<Article> add(@RequestBody Article article) {
		Result<Article> result = new Result<Article>();
		try {
			articleService.save(article);
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
	 * @param article
	 * @return
	 */
	@PutMapping(value = "/edit")
	public Result<Article> edit(@RequestBody Article article) {
		Result<Article> result = new Result<Article>();
		Article articleEntity = articleService.getById(article.getId());
		if(articleEntity==null) {
			result.error500("未找到对应实体");
		}else {
			boolean ok = articleService.updateById(article);
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
	public Result<Article> delete(@RequestParam(name="id",required=true) String id) {
		Result<Article> result = new Result<Article>();
		Article article = articleService.getById(id);
		if(article==null) {
			result.error500("未找到对应实体");
		}else {
			boolean ok = articleService.removeById(id);
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
	public Result<Article> deleteBatch(@RequestParam(name="ids",required=true) String ids) {
		Result<Article> result = new Result<Article>();
		if(ids==null || "".equals(ids.trim())) {
			result.error500("参数不识别！");
		}else {
			this.articleService.removeByIds(Arrays.asList(ids.split(",")));
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
	public Result<Article> queryById(@RequestParam(name="id",required=true) String id) {
		Result<Article> result = new Result<Article>();
		Article article = articleService.getById(id);
		if(article==null) {
			result.error500("未找到对应实体");
		}else {
			result.setResult(article);
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
      QueryWrapper<Article> queryWrapper = null;
      try {
          String paramsStr = request.getParameter("paramsStr");
          if (oConvertUtils.isNotEmpty(paramsStr)) {
              String deString = URLDecoder.decode(paramsStr, "UTF-8");
              Article article = JSON.parseObject(deString, Article.class);
              queryWrapper = QueryGenerator.initQueryWrapper(article, request.getParameterMap());
          }
      } catch (UnsupportedEncodingException e) {
          e.printStackTrace();
      }

      //Step.2 AutoPoi 导出Excel
      ModelAndView mv = new ModelAndView(new JeecgEntityExcelView());
      List<Article> pageList = articleService.list(queryWrapper);
      //导出文件名称
      mv.addObject(NormalExcelConstants.FILE_NAME, "article列表");
      mv.addObject(NormalExcelConstants.CLASS, Article.class);
      mv.addObject(NormalExcelConstants.PARAMS, new ExportParams("article列表数据", "导出人:Jeecg", "导出信息"));
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
              List<Article> listArticles = ExcelImportUtil.importExcel(file.getInputStream(), Article.class, params);
              for (Article articleExcel : listArticles) {
                  articleService.save(articleExcel);
              }
              return Result.ok("文件导入成功！数据行数：" + listArticles.size());
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
