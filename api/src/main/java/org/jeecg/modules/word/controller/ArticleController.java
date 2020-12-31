package org.jeecg.modules.word.controller;

import java.util.Arrays;
import java.util.HashMap;
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
import org.jeecg.common.util.UpLoadUtil;
import org.jeecg.common.util.oConvertUtils;
import org.jeecg.modules.system.entity.SysUser;
import org.jeecg.modules.word.entity.Article;
import org.jeecg.modules.word.entity.Sentence;
import org.jeecg.modules.word.service.IArticleService;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;

import org.jeecg.modules.word.service.ISentenceService;
import org.jeecg.modules.word.service.IWordService;
import org.jeecgframework.poi.excel.ExcelImportUtil;
import org.jeecgframework.poi.excel.def.NormalExcelConstants;
import org.jeecgframework.poi.excel.entity.ExportParams;
import org.jeecgframework.poi.excel.entity.ImportParams;
import org.jeecgframework.poi.excel.view.JeecgEntityExcelView;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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

	 @Autowired
	 private ISentenceService sentenceService;

	 @Autowired
	 private IWordService wordService;

	 @Value(value = "${jeecg.path.upload}")
	 private String uploadpath;

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
				orderByDesc("create_time");

		if(article.getTitle() != null) {
			queryWrapper.like("title",article.getTitle());
		}
		Page<Article> page = new Page<Article>(pageNo, pageSize);
		IPage<Article> pageList = articleService.page(page, queryWrapper);
		for(Article a:pageList.getRecords()){
			a.setPicture(UpLoadUtil.parseBaseToUrl(a.getPicture(),""));
			a.setMp3(UpLoadUtil.parseBaseToUrl(a.getMp3(),""));
		}
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
			article.setPicture(UpLoadUtil.parseUrlToBase(article.getPicture(),""));
			article.setMp3(UpLoadUtil.parseUrlToBase(article.getMp3(),""));
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
			//删除图片mp3
			UpLoadUtil.delImg(uploadpath,article.getMp3());
			UpLoadUtil.delImg(uploadpath,article.getPicture());

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
	  * 通过id查询文章
	 * @param id
	 * @return
	 */
	@GetMapping(value = "/queryById")
	public Result<Map> queryById(@RequestParam(name="id",required=true) String id) {
		Result<Map> result = new Result<Map>();
		Map map = new HashMap();
		Article article = articleService.getById(id);

//		//获取句子
//		QueryWrapper<Sentence> queryWrapper = new QueryWrapper<>();
//		queryWrapper.eq("article_id",id);
//		queryWrapper.orderByAsc("idx");
//		List<Sentence> sentencesList = sentenceService.list(queryWrapper);
//		map.put("sentences",sentencesList);

		if(article==null) {
			result.error500("未找到对应实体");
		}else {
			article.setPicture(UpLoadUtil.parseBaseToUrl(article.getPicture(),""));
			article.setMp3(UpLoadUtil.parseBaseToUrl(article.getMp3(),""));
			map.put("article",article);
			result.setResult(map);
			result.setSuccess(true);
		}
		return result;
	}

}
