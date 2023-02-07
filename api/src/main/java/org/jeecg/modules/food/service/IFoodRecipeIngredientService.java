package org.jeecg.modules.food.service;

import com.baomidou.mybatisplus.extension.service.IService;
import org.jeecg.modules.food.entity.FoodRecipeIngredient;
import org.jeecg.modules.food.vo.RecipeRelVo;

import java.util.List;

/**
 * @Description: 关联
 * @author： jeecg-boot
 * @date：   2023-01-30
 * @version： V1.0
 */
public interface IFoodRecipeIngredientService extends IService<FoodRecipeIngredient> {

    public List<RecipeRelVo> getByRecipe(Integer id);
}
