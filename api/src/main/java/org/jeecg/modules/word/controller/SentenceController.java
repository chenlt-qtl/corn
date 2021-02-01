package org.jeecg.modules.word.controller;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.util.UpLoadUtil;
import org.jeecg.common.util.oConvertUtils;
import org.jeecg.modules.word.entity.Article;
import org.jeecg.modules.word.entity.Sentence;
import org.jeecg.modules.word.model.ArticalVo;
import org.jeecg.modules.word.service.IArticleService;
import org.jeecg.modules.word.service.ISentenceService;
import org.jeecgframework.poi.excel.ExcelImportUtil;
import org.jeecgframework.poi.excel.def.NormalExcelConstants;
import org.jeecgframework.poi.excel.entity.ExportParams;
import org.jeecgframework.poi.excel.entity.ImportParams;
import org.jeecgframework.poi.excel.view.JeecgEntityExcelView;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

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
    private IArticleService articleService;

    /**
     * 分页列表查询
     *
     * @param sentence
     * @param pageNo
     * @param pageSize
     * @param req
     * @return
     */
    @GetMapping(value = "/list")
    public Result<IPage<Sentence>> queryPageList(Sentence sentence,
                                                 @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                                 @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
                                                 HttpServletRequest req) {
        Result<IPage<Sentence>> result = new Result<IPage<Sentence>>();
        QueryWrapper<Sentence> queryWrapper = QueryGenerator.initQueryWrapper(sentence, req.getParameterMap());
        Page<Sentence> page = new Page<Sentence>(pageNo, pageSize);
        IPage<Sentence> pageList = sentenceService.page(page, queryWrapper);
        result.setSuccess(true);
        result.setResult(pageList);
        return result;
    }

    /**
     * 根据文章查询句子
     */
    @GetMapping(value = "/listByArticle")
    public Result<List<Sentence>> queryByArticle(String articleId) {
        Result<List<Sentence>> result = new Result<List<Sentence>>();
        QueryWrapper<Sentence> queryWrapper = new QueryWrapper<Sentence>();
        queryWrapper.eq("article_id", articleId);
        queryWrapper.orderByAsc("idx");
        List<Sentence> list = sentenceService.list(queryWrapper);
        for (Sentence a : list) {
            a.setPicture(UpLoadUtil.dbToReal(a.getPicture()));
            a.setMp3(UpLoadUtil.dbToReal(a.getMp3()));
        }
        result.setSuccess(true);
        result.setResult(list);
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

    /**
     * 通过id查询
     *
     * @param id
     * @return
     */
    @GetMapping(value = "/queryById")
    public Result<Sentence> queryById(@RequestParam(name = "id", required = true) String id) {
        Result<Sentence> result = new Result<Sentence>();
        Sentence sentence = sentenceService.getById(id);
        if (sentence == null) {
            result.error500("未找到对应实体");
        } else {
            result.setResult(sentence);
            result.setSuccess(true);
        }
        return result;
    }


    /**
     * 通过id查询
     *
     * @param wordName
     * @return
     */
    @GetMapping(value = "/queryByWordName")
    public Result<List<Sentence>> queryByWordName(@RequestParam(name = "wordName", required = true) String wordName) {
        Result<List<Sentence>> result = new Result();
        QueryWrapper<Sentence> queryWrapper = new QueryWrapper<Sentence>();
        queryWrapper.like("content", " " + wordName + " ");
        List<Sentence> sentences = sentenceService.list(queryWrapper);
        result.setResult(sentences);
        result.setSuccess(true);
        return result;
    }


    @PostMapping("/save")
    public Result saveSentence(@RequestBody ArticalVo articleVo) {
        sentenceService.saveSentences(articleVo.getId(), articleVo.getSentences());
        Result<Article> result = new Result<Article>();
        result.setSuccess(true);
        return result;
    }

}
