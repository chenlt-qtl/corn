package org.jeecg.modules.food.mapper;

import java.util.List;

import org.jeecg.modules.food.entity.FoodRecipeIngredient;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.jeecg.modules.food.vo.RecipeRelVo;

/**
 * @Description: 关联
 * @author： jeecg-boot
 * @date：   2023-01-30
 * @version： V1.0
 */
public interface FoodRecipeIngredientMapper extends BaseMapper<FoodRecipeIngredient> {
    List<RecipeRelVo> getByRecipe(Integer id);
}
