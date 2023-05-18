package org.seed.modules.game.controller;

import javax.servlet.http.HttpServletRequest;

import org.seed.common.api.vo.Result;
import org.seed.common.exception.CornException;
import org.seed.common.system.query.QueryGenerator;
import org.seed.common.util.ResultUtils;
import org.seed.modules.game.entity.GameScore;
import org.seed.modules.game.service.IGameScoreService;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * @Title: Controller
 * @Description: 分数
 * @author： jeecg-boot
 * @date： 2021-12-15
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
     *
     * @param gameScore
     * @param pageNo
     * @param pageSize
     * @param req
     * @return
     */
    @GetMapping(value = "/list")
    public Result queryPageList(GameScore gameScore,
                                @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
                                HttpServletRequest req) {
        QueryWrapper<GameScore> queryWrapper = QueryGenerator.initQueryWrapper(gameScore, req.getParameterMap());
        Page<GameScore> page = new Page<GameScore>(pageNo, pageSize);
        IPage<GameScore> pageList = gameScoreService.page(page, queryWrapper);

        return ResultUtils.okData(pageList);

    }

    /**
     * 添加
     *
     * @param gameScore
     * @return
     */
    @PostMapping(value = "/add")
    public Result add(@RequestBody GameScore gameScore) {
        try {
            gameScoreService.save(gameScore);
            return ResultUtils.ok("添加成功！");
        } catch (Exception e) {
            e.printStackTrace();
            log.info(e.getMessage());
            throw new CornException("操作失败");
        }

    }

    /**
     * 编辑
     *
     * @param gameScore
     * @return
     */
    @PutMapping(value = "/edit")
    public Result edit(@RequestBody GameScore gameScore) {
        GameScore gameScoreEntity = gameScoreService.getById(gameScore.getId());
        if (gameScoreEntity == null) {
            throw new CornException("未找到对应实体");
        } else {
            boolean ok = gameScoreService.updateById(gameScore);
            return ResultUtils.ok("修改成功!");

        }


    }


    /**
     * 通过id查询
     *
     * @param id
     * @return
     */
    @GetMapping(value = "/queryById")
    public Result queryById(@RequestParam(name = "id", required = true) String id) {
        GameScore gameScore = gameScoreService.getById(id);
        if (gameScore == null) {
            throw new CornException("未找到对应实体");
        } else {
            return ResultUtils.okData(gameScore);

        }

    }
}
