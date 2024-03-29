package org.seed.modules.word.controller;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;
import org.seed.common.api.vo.Result;
import org.seed.common.exception.CornException;
import org.seed.common.system.query.QueryGenerator;
import org.seed.common.util.ResultUtils;
import org.seed.common.util.oConvertUtils;
import org.seed.modules.word.entity.WordUser;
import org.seed.modules.word.service.IWordUserService;
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
 * @Description: test
 * @author： jeecg-boot
 * @date：   2019-11-05
 * @version： V1.0
 */
@RestController
@RequestMapping("/word/wordUser")
@Slf4j
public class WordUserController {
	@Autowired
	private IWordUserService wordUserService;
	
	/**
	  * 分页列表查询
	 * @param wordUser
	 * @param pageNo
	 * @param pageSize
	 * @param req
	 * @return
	 */
	@GetMapping(value = "/list")
	public Result queryPageList(WordUser wordUser,
									  @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
									  @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
									  HttpServletRequest req) {
		QueryWrapper<WordUser> queryWrapper = QueryGenerator.initQueryWrapper(wordUser, req.getParameterMap());
		Page<WordUser> page = new Page<WordUser>(pageNo, pageSize);
		IPage<WordUser> pageList = wordUserService.page(page, queryWrapper);

		return ResultUtils.okData(pageList);

	}
	
	/**
	  *   添加
	 * @param wordId
	 * @return
	 */
	@PostMapping(value = "/add")
	public Result add(@RequestParam(name="wordId",required=true) String wordId) {
		try {
			wordUserService.saveRel(wordId);
			return ResultUtils.ok("添加成功！");
		} catch (Exception e) {
			e.printStackTrace();
			log.info(e.getMessage());
			throw new CornException("操作失败");
		}

	}
	
	/**
	  *  编辑
	 * @param wordUser
	 * @return
	 */
	@PutMapping(value = "/edit")
	public Result edit(@RequestBody WordUser wordUser) {
		WordUser wordUserEntity = wordUserService.getById(wordUser.getId());
		if(wordUserEntity==null) {
			throw new CornException("未找到对应实体");
		}else {
			boolean ok = wordUserService.updateById(wordUser);
			return ResultUtils.ok("修改成功!");

		}
		

	}
	
	/**
	  *   通过id删除
	 * @param wordId
	 * @return
	 */
	@DeleteMapping(value = "/delete")
	public Result delete(@RequestParam(name="wordId",required=true) String wordId) {
		WordUser wordUser = wordUserService.getRel(wordId);
		if(wordUser==null) {
			throw new CornException("未找到对应实体");
		}else {
			boolean ok = wordUserService.removeById(wordUser.getId());
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
			this.wordUserService.removeByIds(Arrays.asList(ids.split(",")));
			return ResultUtils.ok("删除成功!");
		}

	}
	
	/**
	  * 通过id查询
	 * @param id
	 * @return
	 */
	@GetMapping(value = "/queryById")
	public Result queryById(@RequestParam(name="id",required=true) String id) {
		WordUser wordUser = wordUserService.getById(id);
		if(wordUser==null) {
			throw new CornException("未找到对应实体");
		}else {
			return ResultUtils.okData(wordUser);

		}

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
      QueryWrapper<WordUser> queryWrapper = null;
      try {
          String paramsStr = request.getParameter("paramsStr");
          if (oConvertUtils.isNotEmpty(paramsStr)) {
              String deString = URLDecoder.decode(paramsStr, "UTF-8");
              WordUser wordUser = JSON.parseObject(deString, WordUser.class);
              queryWrapper = QueryGenerator.initQueryWrapper(wordUser, request.getParameterMap());
          }
      } catch (UnsupportedEncodingException e) {
          e.printStackTrace();
      }

      //Step.2 AutoPoi 导出Excel
      ModelAndView mv = new ModelAndView(new JeecgEntityExcelView());
      List<WordUser> pageList = wordUserService.list(queryWrapper);
      //导出文件名称
      mv.addObject(NormalExcelConstants.FILE_NAME, "test列表");
      mv.addObject(NormalExcelConstants.CLASS, WordUser.class);
      mv.addObject(NormalExcelConstants.PARAMS, new ExportParams("test列表数据", "导出人:Jeecg", "导出信息"));
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
  public Result importExcel(HttpServletRequest request, HttpServletResponse response) {
      MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
      Map<String, MultipartFile> fileMap = multipartRequest.getFileMap();
      for (Map.Entry<String, MultipartFile> entity : fileMap.entrySet()) {
          MultipartFile file = entity.getValue();// 获取上传文件对象
          ImportParams params = new ImportParams();
          params.setTitleRows(2);
          params.setHeadRows(1);
          params.setNeedSave(true);
          try {
              List<WordUser> listWordUsers = ExcelImportUtil.importExcel(file.getInputStream(), WordUser.class, params);
              for (WordUser wordUserExcel : listWordUsers) {
                  wordUserService.save(wordUserExcel);
              }
              return ResultUtils.ok("文件导入成功！数据行数：" + listWordUsers.size());
          } catch (Exception e) {
              log.error(e.getMessage());
              return ResultUtils.error("文件导入失败！");
          } finally {
              try {
                  file.getInputStream().close();
              } catch (IOException e) {
                  e.printStackTrace();
              }
          }
      }
      return ResultUtils.ok("文件导入失败！");
  }

}
