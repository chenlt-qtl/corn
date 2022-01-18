package org.jeecg.modules.game.controller;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.util.oConvertUtils;
import org.jeecg.modules.game.entity.Game;
import org.jeecg.modules.game.entity.GameWordRel;
import org.jeecg.modules.game.service.IGameService;
import org.jeecg.modules.game.service.IGameWordRelService;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;

import org.jeecg.modules.word.entity.Word;
import org.jeecg.modules.word.entity.WordChinese;
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
 * @Description: 关联
 * @author： jeecg-boot
 * @date： 2021-12-15
 * @version： V1.0
 */
@RestController
@RequestMapping("/game/gameWordRel")
@Slf4j
public class GameWordRelController {
    @Autowired
    private IGameWordRelService gameWordRelService;

    @Autowired
    private IGameService gameService;

    /**
     * 分页列表查询
     *
     * @param gameWordRel
     * @param pageNo
     * @param pageSize
     * @param req
     * @return
     */
    @GetMapping(value = "/list")
    public Result<IPage<GameWordRel>> queryPageList(GameWordRel gameWordRel,
                                                    @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                                    @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
                                                    HttpServletRequest req) {
        Result<IPage<GameWordRel>> result = new Result<IPage<GameWordRel>>();
        if (StringUtils.isBlank(gameWordRel.getGameId())) {
            result.error500("Game id 是必填项！");
        }

        QueryWrapper<GameWordRel> queryWrapper = QueryGenerator.initQueryWrapper(gameWordRel, req.getParameterMap());
        queryWrapper.eq("game_id", gameWordRel.getGameId());
        Page<GameWordRel> page = new Page<GameWordRel>(pageNo, pageSize);
        IPage<GameWordRel> pageList = gameWordRelService.page(page, queryWrapper);
        result.setSuccess(true);
        result.setResult(pageList);
        return result;
    }



    /**
     * 添加
     *
     * @return
     */
    @PostMapping(value = "/add/{gameId}")
    public Result<String> add(@PathVariable(name = "gameId", required = true) String gameId, @RequestParam("articleIds") String articleIds) throws Exception {
        Result<String> result = new Result<String>();
        String msg = gameWordRelService.addRelByArticle(gameId, articleIds.split(","));
        result.setResult(msg);
        return result;
    }


}
