package org.seed.modules.word.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.seed.common.api.vo.Result;
import org.seed.common.system.query.QueryGenerator;
import org.seed.modules.word.entity.Word;
import org.seed.modules.word.model.WordVo;
import org.seed.modules.word.service.*;
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
    public Result<IPage<Map>> queryPageList(String wordName,
                                            @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                            @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize) {


        Result<IPage<Map>> result = new Result<IPage<Map>>();
        IPage<Map> rows = wordService.pageSearchWord(wordName, pageNo, pageSize);
        result.setSuccess(true);
        result.setResult(rows);
        return result;
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
    public Result<IPage<Word>> listByGame(@PathVariable String gameId,
                                                  @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                                  @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
                                                  HttpServletRequest req) {
        Result<IPage<Word>> result = new Result<IPage<Word>>();
        if (StringUtils.isBlank(gameId)) {
            result.error500("Game id 是必填项！");
        }

        Word word = new Word();
        QueryWrapper<Word> queryWrapper = QueryGenerator.initQueryWrapper(word, req.getParameterMap());
        queryWrapper.inSql("id", " select word_id from game_word_rel where game_id = '" + gameId);
        Page<Word> page = new Page<Word>(pageNo, pageSize);
        IPage<Word> pageList = wordService.page(page, queryWrapper);
        result.setSuccess(true);
        result.setResult(pageList);
        return result;
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
    public Result<IPage<Word>> listByGameLevel(@PathVariable String gameId,
                                          @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                          @RequestParam(name = "pageSize", defaultValue = "5") Integer pageSize,
                                          HttpServletRequest req) {
        Result<IPage<Word>> result = new Result<IPage<Word>>();
        if (StringUtils.isBlank(gameId)) {
            result.error500("Game id 是必填项！");
        }

        Word word = new Word();
        QueryWrapper<Word> queryWrapper = QueryGenerator.initQueryWrapper(word, req.getParameterMap());
        queryWrapper.inSql("id", " select word_id from game_word_rel where game_id = '" + gameId+"' and level = 0");
        queryWrapper.orderByAsc("rand()");
        Page<Word> page = new Page<Word>(pageNo, pageSize);
        IPage<Word> pageList = wordService.page(page, queryWrapper);
        result.setSuccess(true);
        result.setResult(pageList);
        return result;
    }
    /**
     * 添加
     *
     * @param word
     * @return
     */
    @PostMapping(value = "/add")
    public Result<Word> add(@RequestBody Word word) {
        Result<Word> result = new Result<Word>();
        try {
            wordService.save(word);
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
     * @param word
     * @return
     */
    @PutMapping(value = "/edit")
    public Result<Word> edit(@RequestBody Word word) {
        Result<Word> result = new Result<Word>();
        Word wordEntity = wordService.getById(word.getId());
        if (wordEntity == null) {
            result.error500("未找到对应实体");
        } else {
            boolean ok = wordService.updateById(word);
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
    public Result<Word> delete(@RequestParam(name = "id", required = true) String id) {
        Result<Word> result = new Result<Word>();
        Word word = wordService.getById(id);
        if (word == null) {
            result.error500("未找到对应实体");
        } else {
            boolean ok = wordService.removeById(id);
            if (ok) {
                result.success("删除成功!");
            }
        }

        return result;
    }

    /**
     * 批量删除
     *
     * @param ids
     * @return
     */
    @DeleteMapping(value = "/deleteBatch")
    public Result<Word> deleteBatch(@RequestParam(name = "ids", required = true) String ids) {
        Result<Word> result = new Result<Word>();
        if (ids == null || "".equals(ids.trim())) {
            result.error500("参数不识别！");
        } else {
            this.wordService.removeByIds(Arrays.asList(ids.split(",")));
            result.success("删除成功!");
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
    public Result<Word> queryById(@RequestParam(name = "id", required = true) String id) {
        Result<Word> result = new Result<Word>();
        Word word = wordService.getById(id);
        if (word == null) {
            result.error500("未找到对应实体");
        } else {
            result.setResult(word);
            result.setSuccess(true);
        }
        return result;
    }

    /**
     * 通过wordName查询
     *
     * @param wordName
     * @return
     */
    @GetMapping(value = "/queryByWordName")
    public Result<WordVo> queryByWordName(@RequestParam(name = "wordName", required = true) String wordName, @RequestParam(name = "articleId", required = false) String articleId) {
        Result<WordVo> result = new Result<WordVo>();
        try {
            WordVo wordVo = new WordVo(wordService.getWord(wordName));
            String wordId = wordVo.getId();

            wordVo.setIcibaSentences(icibaSentenceService.getByWordId(wordId));
            wordVo.setSentences(sentenceService.getSentencesByWord(wordName));
            wordVo.setRelWithUser(wordUserService.getRel(wordId) != null);
            if (StringUtils.isNotBlank(articleId)) {
                wordVo.setRelWithArticle(articleWordRelService.getRel(articleId, wordId) != null);
            }

            result.setResult(wordVo);
            result.setSuccess(true);
        } catch (Exception e) {
            e.printStackTrace();
            result.setSuccess(true);
            result.setMessage("未查到单词");
        }

        return result;
    }

    @GetMapping(value = "/queryByArticle")
    public Result<Map> queryByArticle(@RequestParam(name = "id", required = true) String id) {
        Result<Map> result = new Result<Map>();
        //获取word
        List<Map> words = wordService.searchWordByArticle(id);
        result.setResult(new HashMap() {{
            put("records", words);
        }});
        result.setSuccess(true);
        return result;
    }


}
