package org.jeecg.modules.game.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.modules.game.entity.Game;
import org.jeecg.modules.game.service.IGameService;
import org.jeecg.modules.word.entity.Word;
import org.jeecg.modules.word.entity.WordChinese;
import org.jeecg.modules.word.service.IWordChineseService;
import org.jeecg.modules.word.service.IWordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
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
    private IWordService wordService;

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
    public Result<IPage<Game>> queryPageList(Game game,
                                             @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                             @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
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
     * 添加
     *
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
     * 编辑
     *
     * @param game
     * @return
     */
    @PutMapping(value = "/edit")
    public Result<Game> edit(@RequestBody Game game) {
        Result<Game> result = new Result<Game>();
        Game gameEntity = gameService.getById(game.getId());
        if (gameEntity == null) {
            result.error500("未找到对应实体");
        } else {
            boolean ok = gameService.updateById(game);
            //TODO 返回false说明什么？
            if (ok) {
                result.success("修改成功!");
            }
        }

        return result;
    }

    /**
     * 通过id删除
     *
     * @param id
     * @return
     */
    @DeleteMapping(value = "/delete")
    public Result<Game> delete(@RequestParam(name = "id", required = true) String id) {
        Result<Game> result = new Result<Game>();
        Game game = gameService.getById(id);
        if (game == null) {
            result.error500("未找到对应实体");
        } else {
            boolean ok = gameService.removeById(id);
            if (ok) {
                result.success("删除成功!");
            }
        }

        return result;
    }

    /**
     * 通过id查询
     *
     * @param id
     * @return
     */
    @GetMapping(value = "/queryById")
    public Result<Game> queryById(@RequestParam(name = "id", required = true) String id) {
        Result<Game> result = new Result<Game>();
        Game game = gameService.getById(id);
        if (game == null) {
            result.error500("未找到对应实体");
        } else {
            result.setResult(game);
            result.setSuccess(true);
        }
        return result;
    }

    /**
     * 根据游戏查询level信息
     *
     * @param gameId
     * @param req
     * @return
     */
    @GetMapping(value = "/level")
    public Result<Map> getGameLevelInfo(String gameId, HttpServletRequest req) {
        Result<Map> result = new Result();
        Map data = new HashMap();
        if (StringUtils.isBlank(gameId)) {
            result.error500("Game id 是必填项！");
        }
        Game game = gameService.getById(gameId);
        if (game == null) {
            result.error500("未找到对应实体");
        } else {
            int count = 0;
            if (game.getType().intValue() == 0) {//英文
                QueryWrapper<Word> queryWrapper = QueryGenerator.initQueryWrapper(new Word(), req.getParameterMap());
                queryWrapper.inSql("id", " select word_id from game_word_rel where game_id = '" + gameId + "'");
                count = wordService.count(queryWrapper);
            } else {
                QueryWrapper<WordChinese> queryWrapper = QueryGenerator.initQueryWrapper(new WordChinese(), req.getParameterMap());
                queryWrapper.inSql("id", " select word_id from game_word_rel where game_id = '" + gameId + "'");
                count = wordChineseService.count(queryWrapper);
            }
            data.put("wordCount",count);
            data.put("type",game.getType());
        }
        result.setResult(data);
        result.setSuccess(true);
        return result;

    }

}
