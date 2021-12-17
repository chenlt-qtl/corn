package org.jeecg.modules.word.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.util.UpLoadUtil;
import org.jeecg.modules.word.entity.Article;
import org.jeecg.modules.word.entity.Sentence;
import org.jeecg.modules.word.model.ArticalVo;
import org.jeecg.modules.word.service.IArticleWordRelService;
import org.jeecg.modules.word.service.ISentenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;

/**
 * @Title: Controller
 * @Description: word_sentence
 * @author： jeecg-boot
 * @date： 2019-08-22
 * @version： V1.0
 */
@RestController
@RequestMapping("/word/sentence")
@Slf4j
public class SentenceController {
    @Autowired
    private ISentenceService sentenceService;

    @Autowired
    private IArticleWordRelService articleWordRelService;


    /**
     * 根据文章查询句子 分页
     */
    @GetMapping(value = "/listByArticle")
    public Result<IPage<Sentence>> queryByArticle(String articleId, @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                                  @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize) {
        Result<IPage<Sentence>> result = new Result<IPage<Sentence>>();
        QueryWrapper<Sentence> queryWrapper = new QueryWrapper<Sentence>();
        queryWrapper.eq("article_id", articleId);
        queryWrapper.orderByAsc("idx");
        Page<Sentence> page = new Page<Sentence>(pageNo, pageSize);
        IPage<Sentence> pageList = sentenceService.page(page, queryWrapper);
        for (Sentence a : pageList.getRecords()) {
            a.setPicture(UpLoadUtil.dbToReal(a.getPicture()));
            a.setMp3(UpLoadUtil.dbToReal(a.getMp3()));
        }
        result.setSuccess(true);
        result.setResult(pageList);
        return result;
    }

    /**
     * 编辑
     *
     * @param sentence
     * @return
     */
    @PutMapping(value = "/edit")
    public Result<Sentence> edit(@RequestBody Sentence sentence) {
        Result<Sentence> result = new Result<Sentence>();
        Sentence sentenceEntity = sentenceService.getById(sentence.getId());
        if (sentenceEntity == null) {
            result.error500("未找到对应实体");
        } else {
            boolean ok = sentenceService.updateById(sentence);
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
    public Result<Sentence> delete(@RequestParam(name = "id", required = true) String id) {
        Result<Sentence> result = new Result<Sentence>();
        Sentence sentence = sentenceService.getById(id);
        if (sentence == null) {
            result.error500("未找到对应实体");
        } else {
            boolean ok = sentenceService.removeById(id);
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
    public Result<Sentence> deleteBatch(@RequestParam(name = "ids", required = true) String ids) {
        Result<Sentence> result = new Result<Sentence>();
        if (ids == null || "".equals(ids.trim())) {
            result.error500("参数不识别！");
        } else {
            this.sentenceService.removeByIds(Arrays.asList(ids.split(",")));
            result.success("删除成功!");
        }
        return result;
    }


    @PostMapping("/save")
    public Result saveSentence(@RequestBody ArticalVo articleVo) {
        sentenceService.saveSentences(articleVo.getId(), articleVo.getType(), articleVo.getSentences());
        articleWordRelService.saveRels(articleVo.getId(),articleVo.getType(), articleVo.getAddWordNames(), articleVo.getRemoveWordNames());//保存文章与单词的关联
        Result<Article> result = new Result();
        result.setSuccess(true);
        return result;
    }

}
