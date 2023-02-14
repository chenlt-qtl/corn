package org.seed.modules.food.vo;

import lombok.Data;
import org.seed.modules.food.entity.FoodRecipe;
import org.springframework.beans.BeanUtils;

import java.util.List;

@Data
public class FoodRecipeVo {

    private Integer id;
    private String name;
    private String img;
    private String type;
    private Object content;
    private Integer status;
    private List<RecipeRelVo> recipeRelVoList;

    public FoodRecipe toFoodRecipe(){
        FoodRecipe foodRecipe = new FoodRecipe();
        BeanUtils.copyProperties(this,foodRecipe);
        return foodRecipe;
    }

    public FoodRecipeVo(FoodRecipe foodRecipe){
        BeanUtils.copyProperties(foodRecipe,this);
    }
}
