package org.seed.modules.word.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.seed.common.api.vo.Result;
import org.seed.common.exception.CornException;
import org.seed.common.system.query.QueryGenerator;
import org.seed.common.util.ResultUtils;
import org.seed.modules.word.entity.WordChinese;
import org.seed.modules.word.model.WordChineseVo;
import org.seed.modules.word.service.IArticleWordRelService;
import org.seed.modules.word.service.IWordChineseService;
import org.seed.modules.word.service.IWordUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @Title: Controller
 * @Description: 汉字
 * @author： jeecg-boot
 * @date： 2021-11-30
 * @version： V1.0
 */
@RestController
@RequestMapping("/wordChinese")
@Slf4j
public class WordChineseController {
    @Autowired
    private IWordChineseService wordChineseService;

    @Autowired
    private IWordUserService wordUserService;

    @Autowired
    private IArticleWordRelService articleWordRelService;

    /**
     * 分页列表查询
     *
     * @param wordChinese
     * @param pageNo
     * @param pageSize
     * @param req
     * @return
     */
    @GetMapping(value = "/list")
    public Result queryPageList(WordChinese wordChinese,
                                @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
                                HttpServletRequest req) {
        QueryWrapper<WordChinese> queryWrapper = QueryGenerator.initQueryWrapper(wordChinese, req.getParameterMap());
        Page<WordChinese> page = new Page<WordChinese>(pageNo, pageSize);
        IPage<WordChinese> pageList = wordChineseService.page(page, queryWrapper);

        return ResultUtils.okData(pageList);

    }

    /**
     * 分页列表查询
     *
     * @param gameId
     * @param pageNo
     * @param pageSize
     * @param req
     * @return
     */
    @GetMapping(value = "/listByGame")
    public Result listByGame(String gameId,
                             @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                             @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
                             HttpServletRequest req) {
        if (StringUtils.isBlank(gameId)) {
            throw new CornException("Game id 是必填项！");
        }

        WordChinese wordChinese = new WordChinese();
        QueryWrapper<WordChinese> queryWrapper = QueryGenerator.initQueryWrapper(wordChinese, req.getParameterMap());
        queryWrapper.inSql("id", " select word_id from game_word_rel where game_id = '" + gameId + "'");
        Page<WordChinese> page = new Page(pageNo, pageSize);
        IPage<WordChinese> pageList = wordChineseService.page(page, queryWrapper);


        return ResultUtils.okData(pageList);


    }

    /**
     * 根据game分页列表查询
     *
     * @param gameId
     * @param pageNo
     * @param pageSize
     * @param req
     * @return
     */
    @GetMapping(value = "/listByGameLevel/{gameId}")
    public Result listByGameLevel(@PathVariable String gameId,
                                  @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                  @RequestParam(name = "pageSize", defaultValue = "5") Integer pageSize,
                                  HttpServletRequest req) {
        if (StringUtils.isBlank(gameId)) {
            throw new CornException("Game id 是必填项！");
        }

        QueryWrapper<WordChinese> queryWrapper = QueryGenerator.initQueryWrapper(new WordChinese(), req.getParameterMap());
        queryWrapper.inSql("id", " select word_id from game_word_rel where game_id = '" + gameId + "' and level = 0");
        queryWrapper.orderByAsc("rand()");
        Page<WordChinese> page = new Page(pageNo, pageSize);
        IPage<WordChinese> pageList = wordChineseService.page(page, queryWrapper);

        return ResultUtils.okData(pageList);

    }

    /**
     * 获取随机数量的字
     *
     * @param size
     * @param req
     * @return
     */
    @GetMapping(value = "/listRand")
    public Result getRandWord(@RequestParam(name = "size", defaultValue = "5") Integer size,
                              HttpServletRequest req) {


        QueryWrapper<WordChinese> queryWrapper = QueryGenerator.initQueryWrapper(new WordChinese(), req.getParameterMap());
        queryWrapper.orderByAsc("rand()");
        Page<WordChinese> page = new Page(0, size);
        IPage<WordChinese> pageList = wordChineseService.page(page, queryWrapper);

        return ResultUtils.okData(pageList.getRecords());

    }

    /**
     * 添加
     *
     * @param wordChinese
     * @return
     */
    @PostMapping(value = "/add")
    public Result add(@RequestBody WordChinese wordChinese) {
        try {
            wordChineseService.save(wordChinese);
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
     * @param wordChinese
     * @return
     */
    @PutMapping(value = "/edit")
    public Result edit(@RequestBody WordChinese wordChinese) {
        WordChinese wordChineseEntity = wordChineseService.getById(wordChinese.getId());
        if (wordChineseEntity == null) {
            throw new CornException("未找到对应实体");
        } else {
            boolean ok = wordChineseService.updateById(wordChinese);
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
        WordChinese wordChinese = wordChineseService.getById(id);
        if (wordChinese == null) {
            throw new CornException("未找到对应实体");
        } else {
            boolean ok = wordChineseService.removeById(id);
            return ResultUtils.ok("删除成功!");
        }
    }

    /**
     * 批量删除
     *
     * @param ids
     * @return
     */
    @DeleteMapping(value = "/deleteBatch")
    public Result deleteBatch(@RequestParam(name = "ids", required = true) String ids) {
        if (ids == null || "".equals(ids.trim())) {
            throw new CornException("参数不识别！");
        } else {
            this.wordChineseService.removeByIds(Arrays.asList(ids.split(",")));
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
        WordChinese wordChinese = wordChineseService.getById(id);
        if (wordChinese == null) {
            throw new CornException("未找到对应实体");
        } else {
            return ResultUtils.okData(wordChinese);

        }

    }

    /**
     * 通过wordName查询
     *
     * @param wordName
     * @return
     */
    @GetMapping(value = "/queryByWordName")
    public Result queryByWordName(@RequestParam(name = "wordName", required = true) String wordName, @RequestParam(name = "articleId", required = false) String articleId) throws Exception {

        WordChineseVo wordChineseVo = new WordChineseVo(wordChineseService.getWord(wordName));
        String wordId = wordChineseVo.getId();

        wordChineseVo.setRelWithUser(wordUserService.getRel(wordId) != null);
        if (StringUtils.isNotBlank(articleId)) {
            wordChineseVo.setRelWithArticle(articleWordRelService.getRel(articleId, wordId) != null);
        }

        return ResultUtils.okData(wordChineseVo);
    }


    @GetMapping(value = "/queryByArticle")
    public Result queryByArticle(@RequestParam(name = "id", required = true) String id) {
        //获取word
        List<Map> words = wordChineseService.searchWordByArticle(id);
        return ResultUtils.okData(new HashMap() {{
            put("records", words);
        }});


    }
}
