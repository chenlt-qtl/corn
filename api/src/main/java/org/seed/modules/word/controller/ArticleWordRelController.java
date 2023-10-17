package org.seed.modules.word.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;
import org.seed.common.api.vo.Result;
import org.seed.common.exception.CornException;
import org.seed.common.system.query.QueryGenerator;
import org.seed.common.util.ResultUtils;
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
     * @param articleWordRel
     * @param pageNo
     * @param pageSize
     * @param req
     * @return
     */
    @GetMapping(value = "/list")
    public Result queryPageList(ArticleWordRel articleWordRel,
                                @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
                                HttpServletRequest req) {
        QueryWrapper<ArticleWordRel> queryWrapper = QueryGenerator.initQueryWrapper(articleWordRel, req.getParameterMap());
        Page<ArticleWordRel> page = new Page<ArticleWordRel>(pageNo, pageSize);
        IPage<ArticleWordRel> pageList = ArticleWordRelService.page(page, queryWrapper);

        return ResultUtils.okData(pageList);

    }

    /**
     * 添加
     *
     * @param articleWordRel
     * @return
     */
    @PostMapping(value = "/add")
    public Result add(@RequestBody ArticleWordRel articleWordRel) {
        try {
            ArticleWordRelService.saveRels(articleWordRel.getArticleId(), articleWordRel.getWordId());
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
     * @param ArticleWordRel
     * @return
     */
    @PutMapping(value = "/edit")
    public Result edit(@RequestBody ArticleWordRel ArticleWordRel) {
        ArticleWordRel ArticleWordRelEntity = ArticleWordRelService.getById(ArticleWordRel.getId());
        if (ArticleWordRelEntity == null) {
            throw new CornException("未找到对应实体");
        } else {
            boolean ok = ArticleWordRelService.updateById(ArticleWordRel);
            return ResultUtils.ok("修改成功!");
        }

    }

    /**
     * 通过id删除
     *
     * @return
     */
    @DeleteMapping(value = "/delete")
    public Result delete(@RequestParam(name = "wordId", required = true) Long wordId, @RequestParam(name = "articleId", required = true) Long articleId) {
        ArticleWordRel articleWordRel = ArticleWordRelService.getRel(articleId, wordId);
        if (articleWordRel == null) {
            throw new CornException("未找到对应实体");
        } else {
            ArticleWordRelService.removeAricleRel(articleWordRel);
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
//            this.ArticleWordRelService.removeByIds(Arrays.asList(ids.split(",")));
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
        ArticleWordRel ArticleWordRel = ArticleWordRelService.getById(id);
        if (ArticleWordRel == null) {
            throw new CornException("未找到对应实体");
        } else {
            return ResultUtils.okData(ArticleWordRel);

        }

    }

}
