package org.jeecg.modules.note.controller;

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
import org.jeecg.modules.note.entity.NoteContent;
import org.jeecg.modules.note.service.INoteContentService;

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
 * @Description: 内容
 * @author： jeecg-boot
 * @date：   2021-05-19
 * @version： V1.0
 */
@RestController
@RequestMapping("/note/noteContent")
@Slf4j
public class NoteContentController {
	@Autowired
	private INoteContentService noteContentService;
	
	/**
	  * 分页列表查询
	 * @param noteContent
	 * @param pageNo
	 * @param pageSize
	 * @param req
	 * @return
	 */
	@GetMapping(value = "/list")
	public Result<IPage<NoteContent>> queryPageList(NoteContent noteContent,
									  @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
									  @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
									  HttpServletRequest req) {
		Result<IPage<NoteContent>> result = new Result<IPage<NoteContent>>();
		QueryWrapper<NoteContent> queryWrapper = QueryGenerator.initQueryWrapper(noteContent, req.getParameterMap());
		Page<NoteContent> page = new Page<NoteContent>(pageNo, pageSize);
		IPage<NoteContent> pageList = noteContentService.page(page, queryWrapper);
		result.setSuccess(true);
		result.setResult(pageList);
		return result;
	}
	
	/**
	  *   添加
	 * @param noteContent
	 * @return
	 */
	@PostMapping(value = "/add")
	public Result<NoteContent> add(@RequestBody NoteContent noteContent) {
		Result<NoteContent> result = new Result<NoteContent>();
		try {
			noteContentService.save(noteContent);
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
	 * @param noteContent
	 * @return
	 */
	@PutMapping(value = "/edit")
	public Result<NoteContent> edit(@RequestBody NoteContent noteContent) {
		Result<NoteContent> result = new Result<NoteContent>();
		NoteContent noteContentEntity = noteContentService.getById(noteContent.getId());
		if(noteContentEntity==null) {
			result.error500("未找到对应实体");
		}else {
			boolean ok = noteContentService.updateById(noteContent);
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
	public Result<NoteContent> delete(@RequestParam(name="id",required=true) String id) {
		Result<NoteContent> result = new Result<NoteContent>();
		NoteContent noteContent = noteContentService.getById(id);
		if(noteContent==null) {
			result.error500("未找到对应实体");
		}else {
			boolean ok = noteContentService.removeById(id);
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
	public Result<NoteContent> deleteBatch(@RequestParam(name="ids",required=true) String ids) {
		Result<NoteContent> result = new Result<NoteContent>();
		if(ids==null || "".equals(ids.trim())) {
			result.error500("参数不识别！");
		}else {
			this.noteContentService.removeByIds(Arrays.asList(ids.split(",")));
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
	public Result<NoteContent> queryById(@RequestParam(name="id",required=true) String id) {
		Result<NoteContent> result = new Result<NoteContent>();
		NoteContent noteContent = noteContentService.getById(id);
		if(noteContent==null) {
			result.error500("未找到对应实体");
		}else {
			result.setResult(noteContent);
			result.setSuccess(true);
		}
		return result;
	}


}
