package org.seed.modules.game.controller;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.seed.common.api.vo.Result;
import org.seed.common.exception.CornException;
import org.seed.common.system.query.QueryGenerator;
import org.seed.common.util.ResultUtils;
import org.seed.modules.game.entity.GameWordRel;
import org.seed.modules.game.service.IGameService;
import org.seed.modules.game.service.IGameWordRelService;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
    public Result queryPageList(GameWordRel gameWordRel,
                                                    @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                                    @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
                                                    HttpServletRequest req) {
        if (StringUtils.isBlank(gameWordRel.getGameId())) {
            throw new CornException("Game id 是必填项！");
        }

        QueryWrapper<GameWordRel> queryWrapper = QueryGenerator.initQueryWrapper(gameWordRel, req.getParameterMap());
        queryWrapper.eq("game_id", gameWordRel.getGameId());
        Page<GameWordRel> page = new Page<GameWordRel>(pageNo, pageSize);
        IPage<GameWordRel> pageList = gameWordRelService.page(page, queryWrapper);

        return ResultUtils.okData(pageList);

    }



    /**
     * 添加
     *
     * @return
     */
    @PostMapping(value = "/add/{gameId}")
    public Result add(@PathVariable(name = "gameId", required = true) String gameId, @RequestParam("articleIds") String articleIds) throws Exception {
        String msg = gameWordRelService.addRelByArticle(gameId, articleIds.split(","));
        return ResultUtils.okData(msg);

    }


}
