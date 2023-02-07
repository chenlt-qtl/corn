package org.jeecg.modules.food.vo;

import lombok.Data;

import java.io.Serializable;

/**
 * @Description: 关联
 * @author： jeecg-boot
 * @date：   2023-01-30
 * @version： V1.0
 */
@Data
public class RecipeRelVo implements Serializable {
    private static final long serialVersionUID = 1L;


	private Integer id;

	private Integer recipeId;

	private Integer ingredientId;

	private String amount;

	private String ingredientName;
}
