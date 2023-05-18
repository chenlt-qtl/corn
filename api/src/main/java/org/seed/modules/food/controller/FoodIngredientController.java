package org.seed.modules.food.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;
import org.seed.common.api.vo.Result;
import org.seed.common.exception.CornException;
import org.seed.common.system.query.QueryGenerator;
import org.seed.common.util.ResultUtils;
import org.seed.modules.food.entity.FoodIngredient;
import org.seed.modules.food.service.IFoodIngredientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

/**
 * @Title: Controller
 * @Description: 食材
 * @author： jeecg-boot
 * @date： 2023-01-30
 * @version： V1.0
 */
@RestController
@RequestMapping("/food/ingredient")
@Slf4j
public class FoodIngredientController {
    @Autowired
    private IFoodIngredientService foodIngredientService;

    /**
     * 分页列表查询
     *
     * @param foodIngredient
     * @param pageNo
     * @param pageSize
     * @param req
     * @return
     */
    @GetMapping
    public Result queryPageList(FoodIngredient foodIngredient,
                                @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
                                HttpServletRequest req) {
        QueryWrapper<FoodIngredient> queryWrapper = QueryGenerator.initQueryWrapper(foodIngredient, req.getParameterMap());
        Page<FoodIngredient> page = new Page<FoodIngredient>(pageNo, pageSize);
        IPage<FoodIngredient> pageList = foodIngredientService.page(page, queryWrapper);

        return ResultUtils.okData(pageList);

    }

    /**
     * 添加
     *
     * @param foodIngredient
     * @return
     */
    @PostMapping
    public Result add(@RequestBody FoodIngredient foodIngredient) {
        try {
            foodIngredientService.save(foodIngredient);
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
     * @param foodIngredient
     * @return
     */
    @PutMapping
    public Result edit(@RequestBody FoodIngredient foodIngredient) {
        FoodIngredient foodIngredientEntity = foodIngredientService.getById(foodIngredient.getId());
        if (foodIngredientEntity == null) {
            throw new CornException("未找到对应实体");
        } else {
            boolean ok = foodIngredientService.updateById(foodIngredient);

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
        FoodIngredient foodIngredient = foodIngredientService.getById(id);
        if (foodIngredient == null) {
            throw new CornException("未找到对应实体");
        } else {
            boolean ok = foodIngredientService.removeById(id);
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
        FoodIngredient foodIngredient = foodIngredientService.getById(id);
        if (foodIngredient == null) {
            throw new CornException("未找到对应实体");
        } else {
            return ResultUtils.okData(foodIngredient);

        }

    }

}
