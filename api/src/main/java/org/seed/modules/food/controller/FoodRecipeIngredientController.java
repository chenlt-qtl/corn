package org.seed.modules.food.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;
import org.seed.common.api.vo.Result;
import org.seed.common.exception.CornException;
import org.seed.common.system.query.QueryGenerator;
import org.seed.common.util.ResultUtils;
import org.seed.modules.food.entity.FoodRecipeIngredient;
import org.seed.modules.food.service.IFoodRecipeIngredientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

/**
 * @Title: Controller
 * @Description: 关联
 * @author： jeecg-boot
 * @date： 2023-01-30
 * @version： V1.0
 */
@RestController
@RequestMapping("/food/recipeRel")
@Slf4j
public class FoodRecipeIngredientController {
    @Autowired
    private IFoodRecipeIngredientService foodRecipeIngredientService;

    /**
     * 分页列表查询
     *
     * @param foodRecipeIngredient
     * @param pageNo
     * @param pageSize
     * @param req
     * @return
     */
    @GetMapping
    public Result queryPageList(FoodRecipeIngredient foodRecipeIngredient,
                                @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
                                HttpServletRequest req) {
        QueryWrapper<FoodRecipeIngredient> queryWrapper = QueryGenerator.initQueryWrapper(foodRecipeIngredient, req.getParameterMap());
        Page<FoodRecipeIngredient> page = new Page<FoodRecipeIngredient>(pageNo, pageSize);
        IPage<FoodRecipeIngredient> pageList = foodRecipeIngredientService.page(page, queryWrapper);

        return ResultUtils.okData(pageList);

    }

    /**
     * 添加
     *
     * @param foodRecipeIngredient
     * @return
     */
    @PostMapping
    public Result add(@RequestBody FoodRecipeIngredient foodRecipeIngredient) {
        try {
            foodRecipeIngredientService.save(foodRecipeIngredient);
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
     * @param foodRecipeIngredient
     * @return
     */
    @PutMapping
    public Result edit(@RequestBody FoodRecipeIngredient foodRecipeIngredient) {
        FoodRecipeIngredient foodRecipeIngredientEntity = foodRecipeIngredientService.getById(foodRecipeIngredient.getId());
        if (foodRecipeIngredientEntity == null) {
            throw new CornException("未找到对应实体");
        } else {
            boolean ok = foodRecipeIngredientService.updateById(foodRecipeIngredient);
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
        FoodRecipeIngredient foodRecipeIngredient = foodRecipeIngredientService.getById(id);
        if (foodRecipeIngredient == null) {
            throw new CornException("未找到对应实体");
        } else {
            boolean ok = foodRecipeIngredientService.removeById(id);
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
    public Result queryById(@PathVariable String id) {
        FoodRecipeIngredient foodRecipeIngredient = foodRecipeIngredientService.getById(id);
        if (foodRecipeIngredient == null) {
            throw new CornException("未找到对应实体");
        } else {
            return ResultUtils.okData(foodRecipeIngredient);

        }

    }

}
