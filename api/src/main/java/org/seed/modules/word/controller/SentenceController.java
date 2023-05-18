package org.seed.modules.word.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;
import org.seed.common.api.vo.Result;
import org.seed.common.exception.CornException;
import org.seed.common.util.ResultUtils;
import org.seed.common.util.UpLoadUtil;
import org.seed.modules.word.entity.Article;
import org.seed.modules.word.entity.Sentence;
import org.seed.modules.word.model.ArticalVo;
import org.seed.modules.word.service.IArticleWordRelService;
import org.seed.modules.word.service.ISentenceService;
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
    public Result queryByArticle(String articleId, @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                 @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize) {
        QueryWrapper<Sentence> queryWrapper = new QueryWrapper<Sentence>();
        queryWrapper.eq("article_id", articleId);
        queryWrapper.orderByAsc("idx");
        Page<Sentence> page = new Page<Sentence>(pageNo, pageSize);
        IPage<Sentence> pageList = sentenceService.page(page, queryWrapper);
        for (Sentence a : pageList.getRecords()) {
            a.setPicture(UpLoadUtil.dbToReal(a.getPicture()));
            a.setMp3(UpLoadUtil.dbToReal(a.getMp3()));
        }

        return ResultUtils.okData(pageList);

    }

    /**
     * 编辑
     *
     * @param sentence
     * @return
     */
    @PutMapping(value = "/edit")
    public Result edit(@RequestBody Sentence sentence) {
        Sentence sentenceEntity = sentenceService.getById(sentence.getId());
        if (sentenceEntity == null) {
            throw new CornException("未找到对应实体");
        } else {
            boolean ok = sentenceService.updateById(sentence);

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
        Sentence sentence = sentenceService.getById(id);
        if (sentence == null) {
            throw new CornException("未找到对应实体");
        } else {
            boolean ok = sentenceService.removeById(id);

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
            this.sentenceService.removeByIds(Arrays.asList(ids.split(",")));
            return ResultUtils.ok("删除成功!");
        }

    }


    @PostMapping("/save")
    public Result saveSentence(@RequestBody ArticalVo articleVo) {
        sentenceService.saveSentences(articleVo.getId(), articleVo.getType(), articleVo.getSentences());
        articleWordRelService.saveRels(articleVo.getId(), articleVo.getType(), articleVo.getAddWordNames(), articleVo.getRemoveWordNames());//保存文章与单词的关联
        return ResultUtils.ok();
    }

}
