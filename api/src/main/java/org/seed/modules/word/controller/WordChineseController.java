package org.seed.modules.word.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.seed.common.api.vo.Result;
import org.seed.common.system.query.QueryGenerator;
import org.seed.modules.word.entity.WordChinese;
import org.seed.modules.word.model.WordChineseVo;
import org.seed.modules.word.service.IArticleWordRelService;
import org.seed.modules.word.service.IWordChineseService;
import org.seed.modules.word.service.IWordUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @Title: Controller
 * @Description: 汉字
 * @author： jeecg-boot
 * @date： 2021-11-30
 * @version： V1.0
 */
@RestController
@RequestMapping("/wordChinese")
@Slf4j
public class WordChineseController {
    @Autowired
    private IWordChineseService wordChineseService;

    @Autowired
    private IWordUserService wordUserService;

    @Autowired
    private IArticleWordRelService articleWordRelService;

    /**
     * 分页列表查询
     *
     * @param wordChinese
     * @param pageNo
     * @param pageSize
     * @param req
     * @return
     */
    @GetMapping(value = "/list")
    public Result<IPage<WordChinese>> queryPageList(WordChinese wordChinese,
                                                    @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                                    @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
                                                    HttpServletRequest req) {
        Result<IPage<WordChinese>> result = new Result<IPage<WordChinese>>();
        QueryWrapper<WordChinese> queryWrapper = QueryGenerator.initQueryWrapper(wordChinese, req.getParameterMap());
        Page<WordChinese> page = new Page<WordChinese>(pageNo, pageSize);
        IPage<WordChinese> pageList = wordChineseService.page(page, queryWrapper);
        result.setSuccess(true);
        result.setResult(pageList);
        return result;
    }

    /**
     * 分页列表查询
     *
     * @param gameId
     * @param pageNo
     * @param pageSize
     * @param req
     * @return
     */
    @GetMapping(value = "/listByGame")
    public Result<IPage<WordChinese>> listByGame(String gameId,
                                                    @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                                    @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
                                                    HttpServletRequest req) {
		Result<IPage<WordChinese>> result = new Result();
		if (StringUtils.isBlank(gameId)) {
			result.error500("Game id 是必填项！");
		}

    	WordChinese wordChinese = new WordChinese();
        QueryWrapper<WordChinese> queryWrapper = QueryGenerator.initQueryWrapper(wordChinese, req.getParameterMap());
        queryWrapper.inSql("id", " select word_id from game_word_rel where game_id = '" + gameId+"'");
        Page<WordChinese> page = new Page(pageNo, pageSize);
        IPage<WordChinese> pageList = wordChineseService.page(page, queryWrapper);

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
    public Result<IPage<WordChinese>> listByGameLevel(@PathVariable String gameId,
                                          @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                          @RequestParam(name = "pageSize", defaultValue = "5") Integer pageSize,
                                          HttpServletRequest req) {
        Result<IPage<WordChinese>> result = new Result();
        if (StringUtils.isBlank(gameId)) {
            result.error500("Game id 是必填项！");
        }

        QueryWrapper<WordChinese> queryWrapper = QueryGenerator.initQueryWrapper(new WordChinese(), req.getParameterMap());
        queryWrapper.inSql("id", " select word_id from game_word_rel where game_id = '" + gameId+"' and level = 0");
        queryWrapper.orderByAsc("rand()");
        Page<WordChinese> page = new Page(pageNo, pageSize);
        IPage<WordChinese> pageList = wordChineseService.page(page, queryWrapper);
        result.setSuccess(true);
        result.setResult(pageList);
        return result;
    }

    /**
     * 获取随机数量的字
     * @param size
     * @param req
     * @return
     */
    @GetMapping(value = "/listRand")
    public Result<List<WordChinese>> getRandWord(@RequestParam(name = "size", defaultValue = "5") Integer size,
                                                      HttpServletRequest req) {
        Result<List<WordChinese>> result = new Result();


        QueryWrapper<WordChinese> queryWrapper = QueryGenerator.initQueryWrapper(new WordChinese(), req.getParameterMap());
        queryWrapper.orderByAsc("rand()");
        Page<WordChinese> page = new Page(0, size);
        IPage<WordChinese> pageList = wordChineseService.page(page, queryWrapper);
        result.setSuccess(true);
        result.setResult(pageList.getRecords());
        return result;
    }

    /**
     * 添加
     *
     * @param wordChinese
     * @return
     */
    @PostMapping(value = "/add")
    public Result<WordChinese> add(@RequestBody WordChinese wordChinese) {
        Result<WordChinese> result = new Result<WordChinese>();
        try {
            wordChineseService.save(wordChinese);
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
     * @param wordChinese
     * @return
     */
    @PutMapping(value = "/edit")
    public Result<WordChinese> edit(@RequestBody WordChinese wordChinese) {
        Result<WordChinese> result = new Result<WordChinese>();
        WordChinese wordChineseEntity = wordChineseService.getById(wordChinese.getId());
        if (wordChineseEntity == null) {
            result.error500("未找到对应实体");
        } else {
            boolean ok = wordChineseService.updateById(wordChinese);
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
    public Result<WordChinese> delete(@RequestParam(name = "id", required = true) String id) {
        Result<WordChinese> result = new Result<WordChinese>();
        WordChinese wordChinese = wordChineseService.getById(id);
        if (wordChinese == null) {
            result.error500("未找到对应实体");
        } else {
            boolean ok = wordChineseService.removeById(id);
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
    public Result<WordChinese> deleteBatch(@RequestParam(name = "ids", required = true) String ids) {
        Result<WordChinese> result = new Result<WordChinese>();
        if (ids == null || "".equals(ids.trim())) {
            result.error500("参数不识别！");
        } else {
            this.wordChineseService.removeByIds(Arrays.asList(ids.split(",")));
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
    public Result<WordChinese> queryById(@RequestParam(name = "id", required = true) String id) {
        Result<WordChinese> result = new Result<WordChinese>();
        WordChinese wordChinese = wordChineseService.getById(id);
        if (wordChinese == null) {
            result.error500("未找到对应实体");
        } else {
            result.setResult(wordChinese);
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
    public Result<WordChineseVo> queryByWordName(@RequestParam(name = "wordName", required = true) String wordName, @RequestParam(name = "articleId", required = false) String articleId) {
        Result<WordChineseVo> result = new Result<WordChineseVo>();
        try {
            WordChineseVo wordChineseVo = new WordChineseVo(wordChineseService.getWord(wordName));
            String wordId = wordChineseVo.getId();

            wordChineseVo.setRelWithUser(wordUserService.getRel(wordId) != null);
            if (StringUtils.isNotBlank(articleId)) {
                wordChineseVo.setRelWithArticle(articleWordRelService.getRel(articleId, wordId) != null);
            }

            result.setResult(wordChineseVo);
            result.setSuccess(true);
        } catch (Exception e) {
            e.printStackTrace();
            result.setSuccess(true);
            result.setMessage("未查到结果");
        }

        return result;
    }


    @GetMapping(value = "/queryByArticle")
    public Result<Map> queryByArticle(@RequestParam(name = "id", required = true) String id) {
        Result<Map> result = new Result<Map>();
        //获取word
        List<Map> words = wordChineseService.searchWordByArticle(id);
        result.setResult(new HashMap() {{
            put("records", words);
        }});
        result.setSuccess(true);
        return result;
    }
}
