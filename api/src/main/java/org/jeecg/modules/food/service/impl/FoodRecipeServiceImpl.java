package org.jeecg.modules.food.service.impl;

import org.jeecg.modules.food.entity.FoodRecipe;
import org.jeecg.modules.food.mapper.FoodRecipeMapper;
import org.jeecg.modules.food.service.IFoodRecipeService;
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
