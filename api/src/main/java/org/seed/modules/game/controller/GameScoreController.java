package org.seed.modules.game.controller;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.seed.common.api.vo.Result;
import org.seed.common.system.query.QueryGenerator;
import org.seed.common.util.oConvertUtils;
import org.seed.modules.game.entity.Game;
import org.seed.modules.game.entity.GameScore;
import org.seed.modules.game.service.IGameScoreService;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;

import org.seed.modules.game.service.IGameService;
import org.seed.modules.word.entity.Word;
import org.seed.modules.word.entity.WordChinese;
import org.seed.modules.word.service.IWordChineseService;
import org.seed.modules.word.service.IWordService;
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
 * @Description: 分数
 * @author： jeecg-boot
 * @date：   2021-12-15
 * @version： V1.0
 */
@RestController
@RequestMapping("/game/gameScore")
@Slf4j
public class GameScoreController {
	@Autowired
	private IGameScoreService gameScoreService;
	
	/**
	  * 分页列表查询
	 * @param gameScore
	 * @param pageNo
	 * @param pageSize
	 * @param req
	 * @return
	 */
	@GetMapping(value = "/list")
	public Result<IPage<GameScore>> queryPageList(GameScore gameScore,
									  @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
									  @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
									  HttpServletRequest req) {
		Result<IPage<GameScore>> result = new Result<IPage<GameScore>>();
		QueryWrapper<GameScore> queryWrapper = QueryGenerator.initQueryWrapper(gameScore, req.getParameterMap());
		Page<GameScore> page = new Page<GameScore>(pageNo, pageSize);
		IPage<GameScore> pageList = gameScoreService.page(page, queryWrapper);
		result.setSuccess(true);
		result.setResult(pageList);
		return result;
	}
	
	/**
	  *   添加
	 * @param gameScore
	 * @return
	 */
	@PostMapping(value = "/add")
	public Result<GameScore> add(@RequestBody GameScore gameScore) {
		Result<GameScore> result = new Result<GameScore>();
		try {
			gameScoreService.save(gameScore);
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
	 * @param gameScore
	 * @return
	 */
	@PutMapping(value = "/edit")
	public Result<GameScore> edit(@RequestBody GameScore gameScore) {
		Result<GameScore> result = new Result<GameScore>();
		GameScore gameScoreEntity = gameScoreService.getById(gameScore.getId());
		if(gameScoreEntity==null) {
			result.error500("未找到对应实体");
		}else {
			boolean ok = gameScoreService.updateById(gameScore);
			//TODO 返回false说明什么？
			if(ok) {
				result.success("修改成功!");
			}
		}
		
		return result;
	}
	

	
	/**
	  * 通过id查询
	 * @param id
	 * @return
	 */
	@GetMapping(value = "/queryById")
	public Result<GameScore> queryById(@RequestParam(name="id",required=true) String id) {
		Result<GameScore> result = new Result<GameScore>();
		GameScore gameScore = gameScoreService.getById(id);
		if(gameScore==null) {
			result.error500("未找到对应实体");
		}else {
			result.setResult(gameScore);
			result.setSuccess(true);
		}
		return result;
	}
}
