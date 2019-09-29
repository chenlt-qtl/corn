package org.jeecg.modules.note.controller;

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
import org.jeecg.common.util.oConvertUtils;
import org.jeecg.modules.note.entity.Note;
import org.jeecg.modules.note.entity.NoteOpenKeys;
import org.jeecg.modules.note.model.NoteOpenKeyModel;
import org.jeecg.modules.note.service.INoteOpenKeysService;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;

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
import com.alibaba.fastjson.JSON;

 /**
 * @Title: Controller
 * @Description: 打开记录
 * @author： jeecg-boot
 * @date：   2019-07-10
 * @version： V1.0
 */
@RestController
@RequestMapping("/note/noteOpenKeys")
@Slf4j
public class NoteOpenKeysController {
	@Autowired
	private INoteOpenKeysService noteOpenKeysService;

	 @Autowired
	 private INoteService noteService;
	
	/**
	  * 分页列表查询
	 * @param noteOpenKeys
	 * @param pageNo
	 * @param pageSize
	 * @param req
	 * @return
	 */
	@GetMapping(value = "/list")
	public Result<IPage<NoteOpenKeys>> queryPageList(NoteOpenKeys noteOpenKeys,
									  @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
									  @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
									  HttpServletRequest req) {
		Result<IPage<NoteOpenKeys>> result = new Result<IPage<NoteOpenKeys>>();
		QueryWrapper<NoteOpenKeys> queryWrapper = QueryGenerator.initQueryWrapper(noteOpenKeys, req.getParameterMap());
		Page<NoteOpenKeys> page = new Page<NoteOpenKeys>(pageNo, pageSize);
		IPage<NoteOpenKeys> pageList = noteOpenKeysService.page(page, queryWrapper);
		result.setSuccess(true);
		result.setResult(pageList);
		return result;
	}
	
	/**
	  *   添加
	 * @param noteOpenKeys
	 * @return
	 */
	@PostMapping(value = "/add")
	public Result<NoteOpenKeys> add(@RequestBody NoteOpenKeys noteOpenKeys) {
		Result<NoteOpenKeys> result = new Result<NoteOpenKeys>();
		try {
			noteOpenKeysService.save(noteOpenKeys);
			result.success("添加成功！");
		} catch (Exception e) {
			e.printStackTrace();
			log.info(e.getMessage());
			result.error500("操作失败");
		}
		return result;
	}

	 /**
	  *   保存
	  * @param noteOpenKeys
	  * @return
	  */
	 @PostMapping(value = "/save")
	 public Result<NoteOpenKeys> save(@RequestBody NoteOpenKeys noteOpenKeys) {
		 Result<NoteOpenKeys> result = new Result<NoteOpenKeys>();
		 SysUser sysUser = (SysUser) SecurityUtils.getSubject().getPrincipal();
		 NoteOpenKeys obj = noteOpenKeysService.getByTopKey(noteOpenKeys.getTopKey(),sysUser.getUsername());
		 if(obj != null){
			 noteOpenKeysService.removeById(obj.getId());
		 }
		 noteOpenKeysService.save(noteOpenKeys);
		 result.success("保存成功！");
		 return result;
	 }
	

	/**
	  *   通过id删除
	 * @param id
	 * @return
	 */
	@DeleteMapping(value = "/delete")
	public Result<NoteOpenKeys> delete(@RequestParam(name="id",required=true) String id) {
		Result<NoteOpenKeys> result = new Result<NoteOpenKeys>();
		NoteOpenKeys noteOpenKeys = noteOpenKeysService.getById(id);
		if(noteOpenKeys==null) {
			result.error500("未找到对应实体");
		}else {
			boolean ok = noteOpenKeysService.removeById(id);
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
	public Result<NoteOpenKeys> deleteBatch(@RequestParam(name="ids",required=true) String ids) {
		Result<NoteOpenKeys> result = new Result<NoteOpenKeys>();
		if(ids==null || "".equals(ids.trim())) {
			result.error500("参数不识别！");
		}else {
			this.noteOpenKeysService.removeByIds(Arrays.asList(ids.split(",")));
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
	public Result<NoteOpenKeys> queryById(@RequestParam(name="id",required=true) String id) {
		Result<NoteOpenKeys> result = new Result<NoteOpenKeys>();
		NoteOpenKeys noteOpenKeys = noteOpenKeysService.getById(id);
		if(noteOpenKeys==null) {
			result.error500("未找到对应实体");
		}else {
			result.setResult(noteOpenKeys);
			result.setSuccess(true);
		}
		return result;
	}

	 /**
	  * 通过id查询
	  * @param topId
	  * @return
	  */
	 @GetMapping(value = "/queryByTopId")
	 public Result<NoteOpenKeyModel> queryByTopId(@RequestParam(name="topId",required=true) String topId) {
		 Result<NoteOpenKeyModel> result = new Result<NoteOpenKeyModel>();
		 SysUser sysUser = (SysUser) SecurityUtils.getSubject().getPrincipal();
		 NoteOpenKeyModel model = noteOpenKeysService.getOpenNote(topId,sysUser.getUsername());
		 result.setResult(model);
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
      QueryWrapper<NoteOpenKeys> queryWrapper = null;
      try {
          String paramsStr = request.getParameter("paramsStr");
          if (oConvertUtils.isNotEmpty(paramsStr)) {
              String deString = URLDecoder.decode(paramsStr, "UTF-8");
              NoteOpenKeys noteOpenKeys = JSON.parseObject(deString, NoteOpenKeys.class);
              queryWrapper = QueryGenerator.initQueryWrapper(noteOpenKeys, request.getParameterMap());
          }
      } catch (UnsupportedEncodingException e) {
          e.printStackTrace();
      }

      //Step.2 AutoPoi 导出Excel
      ModelAndView mv = new ModelAndView(new JeecgEntityExcelView());
      List<NoteOpenKeys> pageList = noteOpenKeysService.list(queryWrapper);
      //导出文件名称
      mv.addObject(NormalExcelConstants.FILE_NAME, "打开记录列表");
      mv.addObject(NormalExcelConstants.CLASS, NoteOpenKeys.class);
      mv.addObject(NormalExcelConstants.PARAMS, new ExportParams("打开记录列表数据", "导出人:Jeecg", "导出信息"));
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
              List<NoteOpenKeys> listNoteOpenKeyss = ExcelImportUtil.importExcel(file.getInputStream(), NoteOpenKeys.class, params);
              for (NoteOpenKeys noteOpenKeysExcel : listNoteOpenKeyss) {
                  noteOpenKeysService.save(noteOpenKeysExcel);
              }
              return Result.ok("文件导入成功！数据行数：" + listNoteOpenKeyss.size());
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
