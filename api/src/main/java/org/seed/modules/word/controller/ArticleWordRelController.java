package org.seed.modules.word.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;
import org.seed.common.api.vo.Result;
import org.seed.common.system.query.QueryGenerator;
import org.seed.modules.word.entity.ArticleWordRel;
import org.seed.modules.word.service.IArticleWordRelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

/**
 * @Title: Controller
 * @Description: word_article_word_rel
 * @author： jeecg-boot
 * @date： 2019-08-22
 * @version： V1.0
 */
@RestController
@RequestMapping("/word/articleWordRel")
@Slf4j
public class ArticleWordRelController {
    @Autowired
    private IArticleWordRelService ArticleWordRelService;

    /**
     * 分页列表查询
     *
     * @param ArticleWordRel
     * @param pageNo
     * @param pageSize
     * @param req
     * @return
     */
    @GetMapping(value = "/list")
    public Result<IPage<ArticleWordRel>> queryPageList(ArticleWordRel ArticleWordRel,
                                                       @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                                       @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
                                                       HttpServletRequest req) {
        Result<IPage<ArticleWordRel>> result = new Result<IPage<ArticleWordRel>>();
        QueryWrapper<ArticleWordRel> queryWrapper = QueryGenerator.initQueryWrapper(ArticleWordRel, req.getParameterMap());
        Page<ArticleWordRel> page = new Page<ArticleWordRel>(pageNo, pageSize);
        IPage<ArticleWordRel> pageList = ArticleWordRelService.page(page, queryWrapper);
        result.setSuccess(true);
        result.setResult(pageList);
        return result;
    }

    /**
     * 添加
     *
     * @param articleWordRel
     * @return
     */
    @PostMapping(value = "/add")
    public Result<ArticleWordRel> add(@RequestBody ArticleWordRel articleWordRel) {
        Result<ArticleWordRel> result = new Result<ArticleWordRel>();
        try {
            ArticleWordRelService.saveRels(articleWordRel.getArticleId(), articleWordRel.getWordId());
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
     * @param ArticleWordRel
     * @return
     */
    @PutMapping(value = "/edit")
    public Result<ArticleWordRel> edit(@RequestBody ArticleWordRel ArticleWordRel) {
        Result<ArticleWordRel> result = new Result<ArticleWordRel>();
        ArticleWordRel ArticleWordRelEntity = ArticleWordRelService.getById(ArticleWordRel.getId());
        if (ArticleWordRelEntity == null) {
            result.error500("未找到对应实体");
        } else {
            boolean ok = ArticleWordRelService.updateById(ArticleWordRel);
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
     * @return
     */
    @DeleteMapping(value = "/delete")
    public Result<ArticleWordRel> delete(@RequestParam(name = "wordId", required = true) String wordId, @RequestParam(name = "articleId", required = true) String articleId) {
        Result<ArticleWordRel> result = new Result<ArticleWordRel>();
        ArticleWordRel articleWordRel = ArticleWordRelService.getRel(articleId, wordId);
        if (articleWordRel == null) {
            result.error500("未找到对应实体");
        } else {
            ArticleWordRelService.removeAricleRel(articleWordRel);
            result.success("删除成功!");
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
    public Result<ArticleWordRel> deleteBatch(@RequestParam(name = "ids", required = true) String ids) {
        Result<ArticleWordRel> result = new Result<ArticleWordRel>();
        if (ids == null || "".equals(ids.trim())) {
            result.error500("参数不识别！");
        } else {
//            this.ArticleWordRelService.removeByIds(Arrays.asList(ids.split(",")));
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
    public Result<ArticleWordRel> queryById(@RequestParam(name = "id", required = true) String id) {
        Result<ArticleWordRel> result = new Result<ArticleWordRel>();
        ArticleWordRel ArticleWordRel = ArticleWordRelService.getById(id);
        if (ArticleWordRel == null) {
            result.error500("未找到对应实体");
        } else {
            result.setResult(ArticleWordRel);
            result.setSuccess(true);
        }
        return result;
    }

}
