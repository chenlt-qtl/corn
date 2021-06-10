package org.jeecg.modules.word.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import lombok.extern.slf4j.Slf4j;
import org.jeecg.common.api.vo.Result;
import org.jeecg.modules.word.entity.Word;
import org.jeecg.modules.word.model.WordVo;
import org.jeecg.modules.word.service.IIcibaSentenceService;
import org.jeecg.modules.word.service.ISentenceService;
import org.jeecg.modules.word.service.IWordService;
import org.jeecg.modules.word.service.IWordUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
    public Result<WordVo> queryByWordName(@RequestParam(name = "wordName", required = true) String wordName) {
        Result<WordVo> result = new Result<WordVo>();
        try {

            WordVo wordVo = new WordVo(wordService.getWord(wordName));
            String wordId = wordVo.getId();

            wordVo.setIcibaSentences(icibaSentenceService.getByWordId(wordId));
            wordVo.setSentences(sentenceService.getSentencesByWord(wordId));
            wordVo.setWordUserRel(wordUserService.getRel(wordId));

            result.setResult(wordVo);
            result.setSuccess(true);
        } catch (Exception e) {
            result.error500("未查到单词");
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

    @GetMapping(value = "/queryBySentence")
    public Result<Map> queryBySentence(@RequestParam(name = "id", required = true) String id) {
        Result<Map> result = new Result<Map>();
        //获取word
        List<Map> words = wordService.searchWordBySentence(id);
        result.setResult(new HashMap() {{
            put("records", words);
        }});
        result.setSuccess(true);
        return result;
    }


}
