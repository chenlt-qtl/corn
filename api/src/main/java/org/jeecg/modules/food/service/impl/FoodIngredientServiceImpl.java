package org.jeecg.modules.food.service.impl;

import org.jeecg.modules.food.entity.FoodIngredient;
import org.jeecg.modules.food.mapper.FoodIngredientMapper;
import org.jeecg.modules.food.service.IFoodIngredientService;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

/**
 * @Description: 食材
 * @author： jeecg-boot
 * @date：   2023-01-30
 * @version： V1.0
 */
@Service
public class FoodIngredientServiceImpl extends ServiceImpl<FoodIngredientMapper, FoodIngredient> implements IFoodIngredientService {

}
