package org.seed.modules.read.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;
import org.seed.common.api.vo.Result;
import org.seed.common.exception.CornException;
import org.seed.common.system.query.QueryGenerator;
import org.seed.common.util.ResultUtils;
import org.seed.common.util.UpLoadUtil;
import org.seed.modules.read.entity.Read;
import org.seed.modules.read.service.IReadService;
import org.seed.modules.system.entity.SysData;
import org.seed.modules.system.service.ISysDataService;
import org.seed.modules.word.entity.Article;
import org.seed.modules.word.entity.Sentence;
import org.seed.modules.word.service.IArticleService;
import org.seed.modules.word.service.ISentenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

/**
 * @Title: Controller
 * @Description: 点读
 * @author： jeecg-boot
 * @date：   2023-07-30
 * @version： V1.0
 */
@RestController
@RequestMapping("/read")
@Slf4j
public class ReadController {
	@Autowired
	private IReadService readService;

	@Autowired
	private IArticleService articleService;

	@Autowired
	private ISentenceService sentenceService;

	@Autowired
	private ISysDataService sysDataService;
	/**
	  * 分页列表查询
	 * @param read
	 * @param current
	 * @param size
	 * @param req
	 * @return
	 */
	@GetMapping
	public Result queryPageList(Read read,
									  @RequestParam(name="current", defaultValue="1") Integer current,
									  @RequestParam(name="size", defaultValue="10") Integer size,
									  HttpServletRequest req) {
		QueryWrapper<Read> queryWrapper = QueryGenerator.initQueryWrapper(read, req.getParameterMap());
		Page<Read> page = new Page<Read>(current, size);
		IPage<Read> pageList = readService.page(page, queryWrapper);

		return ResultUtils.okData(pageList);

	}
	
	/**
	  *   添加
	 * @param read
	 * @return
	 */
	@PostMapping
	public Result add(@RequestBody Read read) {
		try {
			readService.add(read);
			return ResultUtils.ok("添加成功！");
		} catch (Exception e) {
			e.printStackTrace();
			log.info(e.getMessage());
			throw new CornException(e.getMessage());
		}

	}
	
	/**
	  *  编辑
	 * @param read
	 * @return
	 */
	@PutMapping
	public Result edit(@RequestBody Read read) {
		Read readEntity = readService.getById(read.getId());
		if(readEntity==null) {
			throw new CornException("未找到对应实体");
		}else {
			boolean ok = readService.update(read);
			return ResultUtils.ok("修改成功!");

		}
		

	}

	/**
	 *  编辑
	 * @param read
	 * @return
	 */
	@PutMapping("/article")
	public Result editByArticle(@RequestBody Read read) {

		if(read.getArticleId()==null){
			throw new CornException("请输入articelId");
		}
		QueryWrapper<Read> queryWrapper = new QueryWrapper<Read>();
		queryWrapper.eq("article_id",read.getArticleId());
		Read readEntity = readService.getOne(queryWrapper);

		if(readEntity==null) {
			throw new CornException("未找到对应实体");
		}else {
			read.setId(readEntity.getId());
			boolean ok = readService.update(read);
			return ResultUtils.ok("修改成功!");
		}


	}
	
	/**
	  *   通过id删除
	 * @param id
	 * @return
	 */
	@DeleteMapping(value = "/{id}")
	public Result delete(@PathVariable(name="id") String id) {
		Read read = readService.getById(id);
		if(read==null) {
			throw new CornException("未找到对应实体");
		}else {
			boolean ok = readService.removeById(id);
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
			this.readService.removeByIds(Arrays.asList(ids.split(",")));
			return ResultUtils.ok("删除成功!");
		}

	}
	
	/**
	  * 通过id查询
	 * @param id
	 * @return
	 */
	@GetMapping(value = "/{id}")
	public Result queryById(@PathVariable(name="id") String id) {
		Read read = readService.getById(id);
		if(read==null) {
			throw new CornException("未找到对应实体");
		}else {
			return ResultUtils.okData(read);

		}

	}

	/**
	 * 通过id查询文章
	 *
	 */
	@GetMapping(value = "/article/{id}")
	public Result queryById(@PathVariable Long id) {
		Map map = new HashMap();
		Article article = articleService.getById(id);

		if (article == null) {
			throw new CornException("未找到对应实体");
		} else {
			article.setPicture(UpLoadUtil.dbToReal(article.getPicture()));
			article.setMp3(UpLoadUtil.dbToReal(article.getMp3()));

			//查询对应句子
			QueryWrapper<Sentence> queryWrapper = new QueryWrapper<Sentence>();
			queryWrapper.eq("article_id", id);
			queryWrapper.orderByAsc("idx");
			Page<Sentence> page = new Page<Sentence>(1, 100);
			IPage<Sentence> pageList = sentenceService.page(page, queryWrapper);

			//查询相对应的read数据
			QueryWrapper<Read> queryWrapper1 = new QueryWrapper<Read>();
			queryWrapper1.eq("article_id", id);
			Page<Read> readPage = new Page<Read>(1, 1);
			IPage<Read> readList = readService.page(readPage, queryWrapper1);

			if(readList.getRecords().size()>0){
				map.put("read", readList.getRecords().get(0));
			}

			map.put("article", article);
			map.put("sentences", pageList);
			return ResultUtils.okData(map);
		}

	}

	/**
	 * 查询菜单数据
	 * @return
	 */
	@GetMapping(value = "/menu")
	public Result getMenuData() {
		QueryWrapper<SysData> queryWrapper = new QueryWrapper();
		queryWrapper.eq("code", "read-master");
		SysData sysData = sysDataService.getOne(queryWrapper);
		if(sysData==null) {
			throw new CornException("未找到对应实体");
		}else {
			return ResultUtils.okData(sysData);

		}

	}

}
