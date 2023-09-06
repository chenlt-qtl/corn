package org.seed.modules.word.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;
import org.seed.common.api.vo.Result;
import org.seed.common.exception.CornException;
import org.seed.common.system.query.QueryGenerator;
import org.seed.common.util.ResultUtils;
import org.seed.modules.word.entity.ArticleFolder;
import org.seed.modules.word.service.IArticleFolderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

/**
 * @Title: Controller
 * @Description: 文件夹
 * @author： jeecg-boot
 * @date： 2023-09-01
 * @version： V1.0
 */
@RestController
@RequestMapping("/folder")
@Slf4j
public class ArticleFolderController {
    @Autowired
    private IArticleFolderService articleFolderService;

    /**
     * 分页列表查询
     *
     * @param articleFolder
     * @param pageNo
     * @param pageSize
     * @param req
     * @return
     */
    @GetMapping
    public Result queryPageList(ArticleFolder articleFolder,
                                @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
                                HttpServletRequest req) {
        QueryWrapper<ArticleFolder> queryWrapper = QueryGenerator.initQueryWrapper(articleFolder, req.getParameterMap());
        Page<ArticleFolder> page = new Page<ArticleFolder>(pageNo, pageSize);
        IPage<ArticleFolder> pageList = articleFolderService.page(page, queryWrapper);

        return ResultUtils.okData(pageList);

    }

    /**
     * 添加
     *
     * @param articleFolder
     * @return
     */
    @PostMapping
    public Result add(@RequestBody ArticleFolder articleFolder) {
        try {
            articleFolderService.save(articleFolder);
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
     * @param articleFolder
     * @return
     */
    @PutMapping
    public Result edit(@RequestBody ArticleFolder articleFolder) {
        ArticleFolder articleFolderEntity = articleFolderService.getById(articleFolder.getId());
        if (articleFolderEntity == null) {
            throw new CornException("未找到对应实体");
        } else {
            boolean ok = articleFolderService.updateById(articleFolder);
            return ResultUtils.ok("修改成功!");

        }


    }

    /**
     * 通过id删除
     *
     * @param id
     * @return
     */
    @DeleteMapping(value = "/{id}")
    public Result delete(@PathVariable(name = "id") Long id) {
        ArticleFolder articleFolder = articleFolderService.getById(id);
        if (articleFolder == null) {
            throw new CornException("未找到对应实体");
        } else {
            boolean ok = articleFolderService.removeById(id);
            return ResultUtils.ok("删除成功!");
        }

    }


    /**
     * 通过id查询
     *
     * @param id
     * @return
     */
    @GetMapping(value = "/{id}")
    public Result queryById(@PathVariable(name = "id") Long id) {
        ArticleFolder articleFolder = articleFolderService.getById(id);
        if (articleFolder == null) {
            throw new CornException("未找到对应实体");
        } else {
            return ResultUtils.okData(articleFolder);

        }

    }


}
