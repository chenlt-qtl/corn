package org.jeecg.modules.note.controller;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.SecurityUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.util.UpLoadUtil;
import org.jeecg.common.util.oConvertUtils;
import org.jeecg.modules.note.entity.Note;
import org.jeecg.modules.note.model.NoteModel;
import org.jeecg.modules.note.model.NoteTreeModel;
import org.jeecg.modules.note.service.INoteService;
import org.jeecg.modules.system.entity.SysUser;
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
 * @Description: 笔记管理
 * @author： jeecg-boot
 * @date：   2019-04-23
 * @version： V1.0
 */
@RestController
@RequestMapping("/note")
@Slf4j
public class NoteController {
	@Autowired
	private INoteService noteService;
	
	/**
	  * 分页列表查询
	 * @param note
	 * @param pageNo
	 * @param pageSize
	 * @param req
	 * @return
	 */
	@GetMapping(value = "/list")
	public Result<IPage<Note>> queryPageList(Note note,
									  @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
									  @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
									  HttpServletRequest req) {
		Result<IPage<Note>> result = new Result<IPage<Note>>();
		QueryWrapper<Note> queryWrapper = QueryGenerator.initQueryWrapper(note, req.getParameterMap());
		Page<Note> page = new Page<Note>(pageNo, pageSize);
		IPage<Note> pageList = noteService.page(page, queryWrapper);
		result.setSuccess(true);
		result.setResult(pageList);
		return result;
	}

	 /**
	  * 查询笔记本(不分页)
	  * @param req
	  * @return
	  */
	 @GetMapping(value = "/listNote")
	 public Result<List<Note>> queryNote(String parentId,HttpServletRequest req) {
		 Result<List<Note>> result = new Result<>();
		 SysUser sysUser = (SysUser) SecurityUtils.getSubject().getPrincipal();
		 try {
			 List<Note> list = noteService.listNote(sysUser.getUsername(),parentId);
			 result.setResult(list);
			 result.setSuccess(true);
		 } catch (Exception e) {
			 e.printStackTrace();
		 }
		 return result;
	 }

	 @RequestMapping(value = "/queryTreeList", method = RequestMethod.GET)
	 public Result<List<NoteTreeModel>> queryTreeList(String parentId) {
		 Result<List<NoteTreeModel>> result = new Result<>();
		 SysUser sysUser = (SysUser) SecurityUtils.getSubject().getPrincipal();
		 try {
			 List<NoteTreeModel> list = noteService.queryTreeList(sysUser.getUsername(),parentId);
			 result.setResult(list);
			 result.setSuccess(true);
		 } catch (Exception e) {
			 e.printStackTrace();
		 }
		 return result;
	 }

	/**
	  *   添加
	 * @param note
	 * @return
	 */
	@PostMapping(value = "/add")
	public Result<Note> add(@RequestBody Note note) {
		Result<Note> result = new Result<Note>();
		try {
			noteService.setParentIds(note);
			noteService.saveNote(note);
			result.setResult(note);
			result.success("添加成功！");
		} catch (Exception e) {
			e.printStackTrace();
			log.info(e.getMessage());
			result.error500("操作失败");
		}
		return result;
	}

	 /**
	  *   复制
	  * @return
	  */
	 @PostMapping(value = "/copy")
	 public Result<Note> copy(@RequestBody Note note) {
		 Result<Note> result = new Result<Note>();
		 try {
			 Note parent = noteService.getById(note.getParentId());
			 Note oldNote = noteService.getById(note.getId());
			 Note newNote = new Note();
			 newNote.setName(oldNote.getName()+"(1)");
			 newNote.setText(oldNote.getText());
			 newNote.setParentId(note.getParentId());
			 newNote.setParentIds(parent.getParentIds()+"/"+note.getParentId());
			 noteService.saveNote(newNote);
			 result.setResult(newNote);
			 result.success("复制成功！");
		 } catch (Exception e) {
			 e.printStackTrace();
			 log.info(e.getMessage());
			 result.error500("操作失败");
		 }
		 return result;
	 }
	
	/**
	  *  编辑
	 * @param note
	 * @return
	 */
	@PutMapping(value = "/edit")
	public Result<NoteModel> edit(@RequestBody Note note) {
		Result<NoteModel> result = new Result<NoteModel>();
		Note noteEntity = noteService.getById(note.getId());
		if(noteEntity==null) {
			result.error500("未找到对应笔记");
		}else {
			noteService.setParentIds(note);
			note.setUpdateBy(null);
			note.setUpdateTime(null);
			boolean ok = noteService.updateNote(note,noteEntity.getText());
			note.setText(UpLoadUtil.dbToReal(note.getText(),"html"));
			if(ok) {
				NoteModel model = new NoteModel(note);
				noteService.setParentNames(model);
				result.setResult(model);
				result.success("修改成功!");
			}
		}
		
		return result;
	}

	 /**
	  *  编辑
	  * @param note
	  * @return
	  */
	 @PutMapping(value = "/updateParent")
	 public Result<Note> updateParent(@RequestBody Note note) {
		 Result<Note> result = new Result<Note>();
		 Note noteEntity = noteService.getById(note.getId());
		 if(noteEntity==null) {
			 result.error500("未找到对应实体");
		 }else {
			 noteEntity.setParentId(note.getParentId());
			 noteService.updateParent(noteEntity,noteEntity.getParentIds());
			 result.setResult(note);
			 result.success("修改成功!");
		 }

		 return result;
	 }
	
	/**
	  *   通过id删除
	 * @param id
	 * @return
	 */
	@DeleteMapping(value = "/delete")
	public Result<Note> delete(@RequestParam(name="id",required=true) String id) {
		Result<Note> result = new Result<Note>();
		SysUser sysUser = (SysUser) SecurityUtils.getSubject().getPrincipal();

		noteService.delete(sysUser.getUsername(),id);
		result.success("删除成功!");
		return result;
	}
	
	/**
	  *  批量删除
	 * @param ids
	 * @return
	 */
	@DeleteMapping(value = "/deleteBatch")
	public Result<Note> deleteBatch(@RequestParam(name="ids",required=true) String ids) {
		Result<Note> result = new Result<Note>();
		if(ids==null || "".equals(ids.trim())) {
			result.error500("参数不识别！");
		}else {
			this.noteService.removeByIds(Arrays.asList(ids.split(",")));
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
	public Result<NoteModel> queryById(@RequestParam(name="id",required=true) String id) {
		Result<NoteModel> result = new Result<NoteModel>();
		Note note = noteService.getById(id);
		if(note==null) {
			result.error500("未找到对应实体");
		}else {
			NoteModel noteModel = new NoteModel(note);
			noteService.setParentNames(noteModel);//设置父节点名称
			noteModel.setText(UpLoadUtil.dbToReal(note.getText(),"html"));
			result.setResult(noteModel);
			result.setSuccess(true);
		}
		return result;
	}

	 /**
	  * 通过text查询
	  * @param text
	  * @param parentId
	  * @return
	  */
	 @GetMapping(value = "/queryByText")
	 public Result<List> queryByText(String text,String parentId) {
		 Result<List> result = new Result<List>();
		 SysUser sysUser = (SysUser) SecurityUtils.getSubject().getPrincipal();
		 List<Note> noteList = noteService.searchNote(sysUser.getUsername(),parentId,text);
		 result.setResult(noteList);
		 result.setSuccess(true);
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
      QueryWrapper<Note> queryWrapper = null;
      try {
          String paramsStr = request.getParameter("paramsStr");
          if (oConvertUtils.isNotEmpty(paramsStr)) {
              String deString = URLDecoder.decode(paramsStr, "UTF-8");
              Note note = JSON.parseObject(deString, Note.class);
              queryWrapper = QueryGenerator.initQueryWrapper(note, request.getParameterMap());
          }
      } catch (UnsupportedEncodingException e) {
          e.printStackTrace();
      }

      //Step.2 AutoPoi 导出Excel
      ModelAndView mv = new ModelAndView(new JeecgEntityExcelView());
      List<Note> pageList = noteService.list(queryWrapper);
      //导出文件名称
      mv.addObject(NormalExcelConstants.FILE_NAME, "笔记管理列表");
      mv.addObject(NormalExcelConstants.CLASS, Note.class);
      mv.addObject(NormalExcelConstants.PARAMS, new ExportParams("笔记管理列表数据", "导出人:Jeecg", "导出信息"));
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
              List<Note> listNotes = ExcelImportUtil.importExcel(file.getInputStream(), Note.class, params);
              for (Note noteExcel : listNotes) {
                  noteService.saveNote(noteExcel);
              }
              return Result.ok("文件导入成功！数据行数：" + listNotes.size());
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
