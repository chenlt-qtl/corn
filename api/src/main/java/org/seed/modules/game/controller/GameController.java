package org.seed.modules.game.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.seed.common.api.vo.Result;
import org.seed.common.exception.CornException;
import org.seed.common.system.query.QueryGenerator;
import org.seed.common.util.ResultUtils;
import org.seed.modules.game.entity.Game;
import org.seed.modules.game.service.IGameService;
import org.seed.modules.word.entity.WordChinese;
import org.seed.modules.word.entity.WordEnglist;
import org.seed.modules.word.service.IWordChineseService;
import org.seed.modules.word.service.IWordEnglistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

/**
 * @Title: Controller
 * @Description: 闯关游戏
 * @author： jeecg-boot
 * @date： 2021-12-15
 * @version： V1.0
 */
@RestController
@RequestMapping("/game/game")
@Slf4j
public class GameController {
    @Autowired
    private IGameService gameService;

    @Autowired
    private IWordChineseService wordChineseService;

    @Autowired
    private IWordEnglistService wordEnglishService;

    /**
     * 分页列表查询
     *
     * @param game
     * @param pageNo
     * @param pageSize
     * @param req
     * @return
     */
    @GetMapping(value = "/list")
    public Result queryPageList(Game game,
                                @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
                                HttpServletRequest req) {
        QueryWrapper<Game> queryWrapper = QueryGenerator.initQueryWrapper(game, req.getParameterMap());
        Page<Game> page = new Page<Game>(pageNo, pageSize);
        IPage<Game> pageList = gameService.page(page, queryWrapper);

        return ResultUtils.okData(pageList);

    }

    /**
     * 添加
     *
     * @param game
     * @return
     */
    @PostMapping(value = "/add")
    public Result add(@RequestBody Game game) {
        try {
            gameService.save(game);
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
     * @param game
     * @return
     */
    @PutMapping(value = "/edit")
    public Result edit(@RequestBody Game game) {
        Game gameEntity = gameService.getById(game.getId());
        if (gameEntity == null) {
            throw new CornException("未找到对应实体");
        } else {
            boolean ok = gameService.updateById(game);

            return ResultUtils.ok("修改成功!");

        }


    }

    /**
     * 通过id删除
     *
     * @param id
     * @return
     */
    @DeleteMapping(value = "/delete")
    public Result delete(@RequestParam(name = "id", required = true) String id) {
        Game game = gameService.getById(id);
        if (game == null) {
            throw new CornException("未找到对应实体");
        } else {
            boolean ok = gameService.removeById(id);

            return ResultUtils.ok("删除成功!");

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
        Game game = gameService.getById(id);
        if (game == null) {
            throw new CornException("未找到对应实体");
        } else {
            return ResultUtils.okData(game);

        }

    }

    /**
     * 根据游戏查询level信息
     *
     * @param gameId
     * @param req
     * @return
     */
    @GetMapping(value = "/level")
    public Result getGameLevelInfo(String gameId, HttpServletRequest req) {
        Map data = new HashMap();
        if (StringUtils.isBlank(gameId)) {
            throw new CornException("Game id 是必填项！");
        }
        Game game = gameService.getById(gameId);
        if (game == null) {
            throw new CornException("未找到对应实体");
        } else {
            int count = 0;
            if (game.getType().intValue() == 0) {//英文
                QueryWrapper<WordEnglist> queryWrapper = QueryGenerator.initQueryWrapper(new WordEnglist(), req.getParameterMap());
                queryWrapper.inSql("id", " select word_id from game_word_rel where game_id = '" + gameId + "'");
                count = wordEnglishService.count(queryWrapper);
            } else {
                QueryWrapper<WordChinese> queryWrapper = QueryGenerator.initQueryWrapper(new WordChinese(), req.getParameterMap());
                queryWrapper.inSql("id", " select word_id from game_word_rel where game_id = '" + gameId + "'");
                count = wordChineseService.count(queryWrapper);
            }
            data.put("wordCount", count);
            data.put("type", game.getType());
        }
        return ResultUtils.okData(data);


    }

}
