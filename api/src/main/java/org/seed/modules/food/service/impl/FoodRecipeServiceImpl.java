package org.seed.modules.food.service.impl;

import org.seed.modules.food.entity.FoodRecipe;
import org.seed.modules.food.mapper.FoodRecipeMapper;
import org.seed.modules.food.service.IFoodRecipeService;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

/**
 * @Description: 食谱
 * @author： jeecg-boot
 * @date：   2023-01-30
 * @version： V1.0
 */
@Service
public class FoodRecipeServiceImpl extends ServiceImpl<FoodRecipeMapper, FoodRecipe> implements IFoodRecipeService {

}
