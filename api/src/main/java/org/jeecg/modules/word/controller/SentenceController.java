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
        for(Sentence a:list){
            a.setPicture(UpLoadUtil.parseBaseToUrl(a.getPicture(),""));
            a.setMp3(UpLoadUtil.parseBaseToUrl(a.getMp3(),""));
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
     * 导出excel
     *
     * @param request
     * @param response
     */
    @RequestMapping(value = "/exportXls")
    public ModelAndView exportXls(HttpServletRequest request, HttpServletResponse response) {
        // Step.1 组装查询条件
        QueryWrapper<Sentence> queryWrapper = null;
        try {
            String paramsStr = request.getParameter("paramsStr");
            if (oConvertUtils.isNotEmpty(paramsStr)) {
                String deString = URLDecoder.decode(paramsStr, "UTF-8");
                Sentence sentence = JSON.parseObject(deString, Sentence.class);
                queryWrapper = QueryGenerator.initQueryWrapper(sentence, request.getParameterMap());
            }
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }

        //Step.2 AutoPoi 导出Excel
        ModelAndView mv = new ModelAndView(new JeecgEntityExcelView());
        List<Sentence> pageList = sentenceService.list(queryWrapper);
        //导出文件名称
        mv.addObject(NormalExcelConstants.FILE_NAME, "word_sentence列表");
        mv.addObject(NormalExcelConstants.CLASS, Sentence.class);
        mv.addObject(NormalExcelConstants.PARAMS, new ExportParams("word_sentence列表数据", "导出人:Jeecg", "导出信息"));
        mv.addObject(NormalExcelConstants.DATA_LIST, pageList);
        return mv;
    }

    /**
     * 通过excel导入数据
     *
     * @param request
     * @param response
     * @return
     */
    @RequestMapping(value = "/importExcel", method = RequestMethod.POST)
    public Result<?> importExcel(HttpServletRequest request, HttpServletResponse response) {
        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
        Map<String, MultipartFile> fileMap = multipartRequest.getFileMap();
        for (Map.Entry<String, MultipartFile> entity : fileMap.entrySet()) {
            MultipartFile file = entity.getValue();// 获取上传文件对象
            ImportParams params = new ImportParams();
            params.setTitleRows(2);
            params.setHeadRows(1);
            params.setNeedSave(true);
            try {
                List<Sentence> listSentences = ExcelImportUtil.importExcel(file.getInputStream(), Sentence.class, params);
                for (Sentence sentenceExcel : listSentences) {
                    sentenceService.save(sentenceExcel);
                }
                return Result.ok("文件导入成功！数据行数：" + listSentences.size());
            } catch (Exception e) {
                log.error(e.getMessage());
                return Result.error("文件导入失败！");
            } finally {
                try {
                    file.getInputStream().close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return Result.ok("文件导入失败！");
    }


    @PostMapping("/save")
    public Result saveSentence(@RequestBody ArticalVo articleVo) {
        sentenceService.saveSentences(articleVo.getId(), articleVo.getSentences());
        Result<Article> result = new Result<Article>();
        result.setSuccess(true);
        return result;
    }

}
