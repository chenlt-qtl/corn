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
import org.seed.modules.word.entity.Word;
import org.seed.modules.word.model.WordVo;
import org.seed.modules.word.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @Title: Controller
 * @Description: word
 * @author： jeecg-boot
 * @date： 2019-08-22
 * @version： V1.0
 */
@RestController
@RequestMapping("/word/word")
@Slf4j
public class WordController {
    @Autowired
    private IWordService wordService;

    @Autowired
    private IIcibaSentenceService icibaSentenceService;

    @Autowired
    private ISentenceService sentenceService;

    @Autowired
    private IWordUserService wordUserService;

    @Autowired
    private IArticleWordRelService articleWordRelService;


    /**
     * 分页列表查询
     *
     * @param pageNo
     * @param pageSize
     * @return
     */
    @GetMapping(value = "/list")
    public Result queryPageList(String wordName,
                                @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize) {


        IPage<Map> rows = wordService.pageSearchWord(wordName, pageNo, pageSize);

        return ResultUtils.okData(rows);

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
    @GetMapping(value = "/listByGame")
    public Result listByGame(@PathVariable String gameId,
                             @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                             @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
                             HttpServletRequest req) {
        if (StringUtils.isBlank(gameId)) {
            throw new CornException("Game id 是必填项！");
        }

        Word word = new Word();
        QueryWrapper<Word> queryWrapper = QueryGenerator.initQueryWrapper(word, req.getParameterMap());
        queryWrapper.inSql("id", " select word_id from game_word_rel where game_id = '" + gameId);
        Page<Word> page = new Page<Word>(pageNo, pageSize);
        IPage<Word> pageList = wordService.page(page, queryWrapper);

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

        Word word = new Word();
        QueryWrapper<Word> queryWrapper = QueryGenerator.initQueryWrapper(word, req.getParameterMap());
        queryWrapper.inSql("id", " select word_id from game_word_rel where game_id = '" + gameId + "' and level = 0");
        queryWrapper.orderByAsc("rand()");
        Page<Word> page = new Page<Word>(pageNo, pageSize);
        IPage<Word> pageList = wordService.page(page, queryWrapper);

        return ResultUtils.okData(pageList);

    }

    /**
     * 添加
     *
     * @param word
     * @return
     */
    @PostMapping(value = "/add")
    public Result add(@RequestBody Word word) {
        try {
            wordService.save(word);
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
     * @param word
     * @return
     */
    @PutMapping(value = "/edit")
    public Result edit(@RequestBody Word word) {
        Word wordEntity = wordService.getById(word.getId());
        if (wordEntity == null) {
            throw new CornException("未找到对应实体");
        } else {
            boolean ok = wordService.updateById(word);
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
        Word word = wordService.getById(id);
        if (word == null) {
            throw new CornException("未找到对应实体");
        } else {
            boolean ok = wordService.removeById(id);

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
            this.wordService.removeByIds(Arrays.asList(ids.split(",")));
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
        Word word = wordService.getById(id);
        if (word == null) {
            throw new CornException("未找到对应实体");
        } else {
            return ResultUtils.okData(word);

        }

    }

    /**
     * 通过wordName查询
     *
     * @param wordName
     * @return
     */
    @GetMapping(value = "/queryByWordName")
    public Result queryByWordName(@RequestParam(name = "wordName", required = true) String wordName, @RequestParam(name = "articleId", required = false) Long articleId) {

        WordVo wordVo = new WordVo(wordService.getWord(wordName));
        String wordId = wordVo.getId();

        wordVo.setIcibaSentences(icibaSentenceService.getByWordId(wordId));
        wordVo.setSentences(sentenceService.getSentencesByWord(wordName));
        wordVo.setRelWithUser(wordUserService.getRel(wordId) != null);
        if (articleId != null) {
            wordVo.setRelWithArticle(articleWordRelService.getRel(articleId, wordId) != null);
        }
        return ResultUtils.okData(wordVo);

    }

    @GetMapping(value = "/queryByArticle")
    public Result queryByArticle(@RequestParam(name = "id", required = true) String id) {
        //获取word
        List<Map> words = wordService.searchWordByArticle(id);
        return ResultUtils.okData(new HashMap() {{
            put("records", words);
        }});


    }


}
