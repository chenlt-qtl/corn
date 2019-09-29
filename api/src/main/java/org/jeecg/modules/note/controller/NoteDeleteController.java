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
import org.jeecg.modules.note.entity.NoteDelete;
import org.jeecg.modules.note.service.INoteDeleteService;

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
 * @Description: delete
 * @author： jeecg-boot
 * @date：   2019-07-09
 * @version： V1.0
 */
@RestController
@RequestMapping("/org.jeecg.modules.note/noteDelete")
@Slf4j
public class NoteDeleteController {
	@Autowired
	private INoteDeleteService noteDeleteService;
	
	/**
	  * 分页列表查询
	 * @param noteDelete
	 * @param pageNo
	 * @param pageSize
	 * @param req
	 * @return
	 */
	@GetMapping(value = "/list")
	public Result<IPage<NoteDelete>> queryPageList(NoteDelete noteDelete,
									  @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
									  @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
									  HttpServletRequest req) {
		Result<IPage<NoteDelete>> result = new Result<IPage<NoteDelete>>();
		QueryWrapper<NoteDelete> queryWrapper = QueryGenerator.initQueryWrapper(noteDelete, req.getParameterMap());
		Page<NoteDelete> page = new Page<NoteDelete>(pageNo, pageSize);
		IPage<NoteDelete> pageList = noteDeleteService.page(page, queryWrapper);
		result.setSuccess(true);
		result.setResult(pageList);
		return result;
	}
	
	/**
	  *   添加
	 * @param noteDelete
	 * @return
	 */
	@PostMapping(value = "/add")
	public Result<NoteDelete> add(@RequestBody NoteDelete noteDelete) {
		Result<NoteDelete> result = new Result<NoteDelete>();
		try {
			noteDeleteService.save(noteDelete);
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
	 * @param noteDelete
	 * @return
	 */
	@PutMapping(value = "/edit")
	public Result<NoteDelete> edit(@RequestBody NoteDelete noteDelete) {
		Result<NoteDelete> result = new Result<NoteDelete>();
		NoteDelete noteDeleteEntity = noteDeleteService.getById(noteDelete.getId());
		if(noteDeleteEntity==null) {
			result.error500("未找到对应实体");
		}else {
			boolean ok = noteDeleteService.updateById(noteDelete);
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
	public Result<NoteDelete> delete(@RequestParam(name="id",required=true) String id) {
		Result<NoteDelete> result = new Result<NoteDelete>();
		NoteDelete noteDelete = noteDeleteService.getById(id);
		if(noteDelete==null) {
			result.error500("未找到对应实体");
		}else {
			boolean ok = noteDeleteService.removeById(id);
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
	public Result<NoteDelete> deleteBatch(@RequestParam(name="ids",required=true) String ids) {
		Result<NoteDelete> result = new Result<NoteDelete>();
		if(ids==null || "".equals(ids.trim())) {
			result.error500("参数不识别！");
		}else {
			this.noteDeleteService.removeByIds(Arrays.asList(ids.split(",")));
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
	public Result<NoteDelete> queryById(@RequestParam(name="id",required=true) String id) {
		Result<NoteDelete> result = new Result<NoteDelete>();
		NoteDelete noteDelete = noteDeleteService.getById(id);
		if(noteDelete==null) {
			result.error500("未找到对应实体");
		}else {
			result.setResult(noteDelete);
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
      QueryWrapper<NoteDelete> queryWrapper = null;
      try {
          String paramsStr = request.getParameter("paramsStr");
          if (oConvertUtils.isNotEmpty(paramsStr)) {
              String deString = URLDecoder.decode(paramsStr, "UTF-8");
              NoteDelete noteDelete = JSON.parseObject(deString, NoteDelete.class);
              queryWrapper = QueryGenerator.initQueryWrapper(noteDelete, request.getParameterMap());
          }
      } catch (UnsupportedEncodingException e) {
          e.printStackTrace();
      }

      //Step.2 AutoPoi 导出Excel
      ModelAndView mv = new ModelAndView(new JeecgEntityExcelView());
      List<NoteDelete> pageList = noteDeleteService.list(queryWrapper);
      //导出文件名称
      mv.addObject(NormalExcelConstants.FILE_NAME, "delete列表");
      mv.addObject(NormalExcelConstants.CLASS, NoteDelete.class);
      mv.addObject(NormalExcelConstants.PARAMS, new ExportParams("delete列表数据", "导出人:Jeecg", "导出信息"));
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
              List<NoteDelete> listNoteDeletes = ExcelImportUtil.importExcel(file.getInputStream(), NoteDelete.class, params);
              for (NoteDelete noteDeleteExcel : listNoteDeletes) {
                  noteDeleteService.save(noteDeleteExcel);
              }
              return Result.ok("文件导入成功！数据行数：" + listNoteDeletes.size());
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
