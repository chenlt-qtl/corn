package org.seed.modules.food.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;
import org.seed.common.api.vo.Result;
import org.seed.common.system.query.QueryGenerator;
import org.seed.modules.food.entity.FoodRecipe;
import org.seed.modules.food.service.IFoodRecipeIngredientService;
import org.seed.modules.food.service.IFoodRecipeService;
import org.seed.modules.food.vo.FoodRecipeVo;
import org.seed.modules.food.vo.RecipeRelVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * @Title: Controller
 * @Description: 食谱
 * @author： jeecg-boot
 * @date：   2023-01-30
 * @version： V1.0
 */
@RestController
@RequestMapping("/food/recipe")
@Slf4j
public class FoodRecipeController {
	@Autowired
	private IFoodRecipeService foodRecipeService;

	 @Autowired
	 private IFoodRecipeIngredientService foodRecipeIngredientService;
	
	/**
	  * 分页列表查询
	 * @param foodRecipe
	 * @param pageNo
	 * @param pageSize
	 * @param req
	 * @return
	 */
	@GetMapping
	public Result<IPage<FoodRecipe>> queryPageList(FoodRecipe foodRecipe,
									  @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
									  @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
									  HttpServletRequest req) {
		Result<IPage<FoodRecipe>> result = new Result<IPage<FoodRecipe>>();
		QueryWrapper<FoodRecipe> queryWrapper = QueryGenerator.initQueryWrapper(foodRecipe, req.getParameterMap());
		Page<FoodRecipe> page = new Page<FoodRecipe>(pageNo, pageSize);
		IPage<FoodRecipe> pageList = foodRecipeService.page(page, queryWrapper);
		result.setSuccess(true);
		result.setResult(pageList);
		return result;
	}
	
	/**
	  *   添加
	 * @param foodRecipe
	 * @return
	 */
	@PostMapping
	public Result<FoodRecipe> add(@RequestBody FoodRecipeVo foodRecipe) {
		Result<FoodRecipe> result = new Result<FoodRecipe>();
		try {
			foodRecipeService.save(foodRecipe.toFoodRecipe());

			result.success("添加成功！");
		} catch (Exception e) {
			e.printStackTrace();
			log.info(e.getMessage());
			result.error500("操作失败");
		}
		return result;
	}
	
	/**
	  *  编辑
	 * @param foodRecipe
	 * @return
	 */
	@PutMapping
	public Result<FoodRecipe> edit(@RequestBody FoodRecipe foodRecipe) {
		Result<FoodRecipe> result = new Result<FoodRecipe>();
		FoodRecipe foodRecipeEntity = foodRecipeService.getById(foodRecipe.getId());
		if(foodRecipeEntity==null) {
			result.error500("未找到对应实体");
		}else {
			boolean ok = foodRecipeService.updateById(foodRecipe);
			//TODO 返回false说明什么？
			if(ok) {
				result.success("修改成功!");
			}
		}
		
		return result;
	}
	
	/**
	  *   通过id删除
	 * @param id
	 * @return
	 */
	@DeleteMapping(value = "/{id}")
	public Result<FoodRecipe> delete(@PathVariable String id) {
		Result<FoodRecipe> result = new Result<FoodRecipe>();
		FoodRecipe foodRecipe = foodRecipeService.getById(id);
		if(foodRecipe==null) {
			result.error500("未找到对应实体");
		}else {
			boolean ok = foodRecipeService.removeById(id);
			if(ok) {
				result.success("删除成功!");
			}
		}
		
		return result;
	}
	

	
	/**
	  * 通过id查询
	 * @param id
	 * @return
	 */
	@GetMapping(value = "/{id}")
	public Result<FoodRecipeVo> queryById(@PathVariable Integer id) {
		Result<FoodRecipeVo> result = new Result<>();
		FoodRecipe foodRecipe = foodRecipeService.getById(id);
		if(foodRecipe==null) {
			result.error500("未找到对应实体");
		}else {
			FoodRecipeVo foodRecipeVo = new FoodRecipeVo(foodRecipe);
			List<RecipeRelVo> ingredients = foodRecipeIngredientService.getByRecipe(id);
			foodRecipeVo.setRecipeRelVoList(ingredients);
			result.setResult(foodRecipeVo);
			result.setSuccess(true);
		}
		return result;
	}

}
