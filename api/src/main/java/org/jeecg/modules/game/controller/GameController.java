package org.jeecg.modules.game.controller;

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
import org.jeecg.modules.game.entity.Game;
import org.jeecg.modules.game.service.IGameService;

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
 * @Description: 闯关游戏
 * @author： jeecg-boot
 * @date：   2021-12-15
 * @version： V1.0
 */
@RestController
@RequestMapping("/game/game")
@Slf4j
public class GameController {
	@Autowired
	private IGameService gameService;
	
	/**
	  * 分页列表查询
	 * @param game
	 * @param pageNo
	 * @param pageSize
	 * @param req
	 * @return
	 */
	@GetMapping(value = "/list")
	public Result<IPage<Game>> queryPageList(Game game,
									  @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
									  @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
									  HttpServletRequest req) {
		Result<IPage<Game>> result = new Result<IPage<Game>>();
		QueryWrapper<Game> queryWrapper = QueryGenerator.initQueryWrapper(game, req.getParameterMap());
		Page<Game> page = new Page<Game>(pageNo, pageSize);
		IPage<Game> pageList = gameService.page(page, queryWrapper);
		result.setSuccess(true);
		result.setResult(pageList);
		return result;
	}
	
	/**
	  *   添加
	 * @param game
	 * @return
	 */
	@PostMapping(value = "/add")
	public Result<Game> add(@RequestBody Game game) {
		Result<Game> result = new Result<Game>();
		try {
			gameService.save(game);
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
	 * @param game
	 * @return
	 */
	@PutMapping(value = "/edit")
	public Result<Game> edit(@RequestBody Game game) {
		Result<Game> result = new Result<Game>();
		Game gameEntity = gameService.getById(game.getId());
		if(gameEntity==null) {
			result.error500("未找到对应实体");
		}else {
			boolean ok = gameService.updateById(game);
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
	public Result<Game> delete(@RequestParam(name="id",required=true) String id) {
		Result<Game> result = new Result<Game>();
		Game game = gameService.getById(id);
		if(game==null) {
			result.error500("未找到对应实体");
		}else {
			boolean ok = gameService.removeById(id);
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
	public Result<Game> deleteBatch(@RequestParam(name="ids",required=true) String ids) {
		Result<Game> result = new Result<Game>();
		if(ids==null || "".equals(ids.trim())) {
			result.error500("参数不识别！");
		}else {
			this.gameService.removeByIds(Arrays.asList(ids.split(",")));
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
	public Result<Game> queryById(@RequestParam(name="id",required=true) String id) {
		Result<Game> result = new Result<Game>();
		Game game = gameService.getById(id);
		if(game==null) {
			result.error500("未找到对应实体");
		}else {
			result.setResult(game);
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
      QueryWrapper<Game> queryWrapper = null;
      try {
          String paramsStr = request.getParameter("paramsStr");
          if (oConvertUtils.isNotEmpty(paramsStr)) {
              String deString = URLDecoder.decode(paramsStr, "UTF-8");
              Game game = JSON.parseObject(deString, Game.class);
              queryWrapper = QueryGenerator.initQueryWrapper(game, request.getParameterMap());
          }
      } catch (UnsupportedEncodingException e) {
          e.printStackTrace();
      }

      //Step.2 AutoPoi 导出Excel
      ModelAndView mv = new ModelAndView(new JeecgEntityExcelView());
      List<Game> pageList = gameService.list(queryWrapper);
      //导出文件名称
      mv.addObject(NormalExcelConstants.FILE_NAME, "闯关游戏列表");
      mv.addObject(NormalExcelConstants.CLASS, Game.class);
      mv.addObject(NormalExcelConstants.PARAMS, new ExportParams("闯关游戏列表数据", "导出人:Jeecg", "导出信息"));
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
              List<Game> listGames = ExcelImportUtil.importExcel(file.getInputStream(), Game.class, params);
              for (Game gameExcel : listGames) {
                  gameService.save(gameExcel);
              }
              return Result.ok("文件导入成功！数据行数：" + listGames.size());
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
