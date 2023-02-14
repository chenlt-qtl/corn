package org.seed.modules.food.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.seed.modules.food.entity.FoodRecipeIngredient;
import org.seed.modules.food.mapper.FoodRecipeIngredientMapper;
import org.seed.modules.food.service.IFoodRecipeIngredientService;
import org.seed.modules.food.vo.RecipeRelVo;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

/**
 * @Description: 关联
 * @author： jeecg-boot
 * @date：   2023-01-30
 * @version： V1.0
 */
@Service
public class FoodRecipeIngredientServiceImpl extends ServiceImpl<FoodRecipeIngredientMapper, FoodRecipeIngredient> implements IFoodRecipeIngredientService {

    @Resource
    private FoodRecipeIngredientMapper foodRecipeIngredientMapper;

    @Override
    public List<RecipeRelVo> getByRecipe(Integer id) {
        return foodRecipeIngredientMapper.getByRecipe(id);
    }
}
