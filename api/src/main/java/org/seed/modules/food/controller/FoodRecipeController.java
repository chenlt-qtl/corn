package org.seed.modules.food.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;
import org.seed.common.api.vo.Result;
import org.seed.common.exception.CornException;
import org.seed.common.system.query.QueryGenerator;
import org.seed.common.util.ResultUtils;
import org.seed.modules.food.entity.FoodRecipe;
import org.seed.modules.food.service.IFoodRecipeIngredientService;
import org.seed.modules.food.service.IFoodRecipeService;
import org.seed.modules.food.vo.FoodRecipeVo;
import org.seed.modules.food.vo.RecipeRelVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * @Title: Controller
 * @Description: 食谱
 * @author： jeecg-boot
 * @date： 2023-01-30
 * @version： V1.0
 */
@RestController
@RequestMapping("/food/recipe")
@Slf4j
public class FoodRecipeController {
    @Autowired
    private IFoodRecipeService foodRecipeService;

    @Autowired
    private IFoodRecipeIngredientService foodRecipeIngredientService;

    /**
     * 分页列表查询
     *
     * @param foodRecipe
     * @param pageNo
     * @param pageSize
     * @param req
     * @return
     */
    @GetMapping
    public Result queryPageList(FoodRecipe foodRecipe,
                                @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
                                HttpServletRequest req) {
        QueryWrapper<FoodRecipe> queryWrapper = QueryGenerator.initQueryWrapper(foodRecipe, req.getParameterMap());
        Page<FoodRecipe> page = new Page<FoodRecipe>(pageNo, pageSize);
        IPage<FoodRecipe> pageList = foodRecipeService.page(page, queryWrapper);

        return ResultUtils.okData(pageList);

    }

    /**
     * 添加
     *
     * @param foodRecipe
     * @return
     */
    @PostMapping
    public Result add(@RequestBody FoodRecipeVo foodRecipe) {
        try {
            foodRecipeService.save(foodRecipe.toFoodRecipe());

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
     * @param foodRecipe
     * @return
     */
    @PutMapping
    public Result edit(@RequestBody FoodRecipe foodRecipe) {
        FoodRecipe foodRecipeEntity = foodRecipeService.getById(foodRecipe.getId());
        if (foodRecipeEntity == null) {
            throw new CornException("未找到对应实体");
        } else {
            boolean ok = foodRecipeService.updateById(foodRecipe);
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
    public Result delete(@PathVariable String id) {
        FoodRecipe foodRecipe = foodRecipeService.getById(id);
        if (foodRecipe == null) {
            throw new CornException("未找到对应实体");
        } else {
            boolean ok = foodRecipeService.removeById(id);

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
    public Result queryById(@PathVariable Integer id) {
        FoodRecipe foodRecipe = foodRecipeService.getById(id);
        if (foodRecipe == null) {
            throw new CornException("未找到对应实体");
        } else {
            FoodRecipeVo foodRecipeVo = new FoodRecipeVo(foodRecipe);
            List<RecipeRelVo> ingredients = foodRecipeIngredientService.getByRecipe(id);
            foodRecipeVo.setRecipeRelVoList(ingredients);
            return ResultUtils.okData(foodRecipeVo);

        }

    }

}
