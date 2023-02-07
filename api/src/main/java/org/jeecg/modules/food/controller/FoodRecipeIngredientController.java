package org.jeecg.modules.food.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.modules.food.entity.FoodRecipeIngredient;
import org.jeecg.modules.food.service.IFoodRecipeIngredientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

 /**
 * @Title: Controller
 * @Description: 关联
 * @author： jeecg-boot
 * @date：   2023-01-30
 * @version： V1.0
 */
@RestController
@RequestMapping("/food/recipeRel")
@Slf4j
public class FoodRecipeIngredientController {
	@Autowired
	private IFoodRecipeIngredientService foodRecipeIngredientService;
	
	/**
	  * 分页列表查询
	 * @param foodRecipeIngredient
	 * @param pageNo
	 * @param pageSize
	 * @param req
	 * @return
	 */
	@GetMapping
	public Result<IPage<FoodRecipeIngredient>> queryPageList(FoodRecipeIngredient foodRecipeIngredient,
									  @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
									  @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
									  HttpServletRequest req) {
		Result<IPage<FoodRecipeIngredient>> result = new Result<IPage<FoodRecipeIngredient>>();
		QueryWrapper<FoodRecipeIngredient> queryWrapper = QueryGenerator.initQueryWrapper(foodRecipeIngredient, req.getParameterMap());
		Page<FoodRecipeIngredient> page = new Page<FoodRecipeIngredient>(pageNo, pageSize);
		IPage<FoodRecipeIngredient> pageList = foodRecipeIngredientService.page(page, queryWrapper);
		result.setSuccess(true);
		result.setResult(pageList);
		return result;
	}
	
	/**
	  *   添加
	 * @param foodRecipeIngredient
	 * @return
	 */
	@PostMapping
	public Result<FoodRecipeIngredient> add(@RequestBody FoodRecipeIngredient foodRecipeIngredient) {
		Result<FoodRecipeIngredient> result = new Result<FoodRecipeIngredient>();
		try {
			foodRecipeIngredientService.save(foodRecipeIngredient);
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
	 * @param foodRecipeIngredient
	 * @return
	 */
	@PutMapping
	public Result<FoodRecipeIngredient> edit(@RequestBody FoodRecipeIngredient foodRecipeIngredient) {
		Result<FoodRecipeIngredient> result = new Result<FoodRecipeIngredient>();
		FoodRecipeIngredient foodRecipeIngredientEntity = foodRecipeIngredientService.getById(foodRecipeIngredient.getId());
		if(foodRecipeIngredientEntity==null) {
			result.error500("未找到对应实体");
		}else {
			boolean ok = foodRecipeIngredientService.updateById(foodRecipeIngredient);
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
	public Result<FoodRecipeIngredient> delete(@PathVariable String id) {
		Result<FoodRecipeIngredient> result = new Result<FoodRecipeIngredient>();
		FoodRecipeIngredient foodRecipeIngredient = foodRecipeIngredientService.getById(id);
		if(foodRecipeIngredient==null) {
			result.error500("未找到对应实体");
		}else {
			boolean ok = foodRecipeIngredientService.removeById(id);
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
	public Result<FoodRecipeIngredient> queryById(@PathVariable String id) {
		Result<FoodRecipeIngredient> result = new Result<FoodRecipeIngredient>();
		FoodRecipeIngredient foodRecipeIngredient = foodRecipeIngredientService.getById(id);
		if(foodRecipeIngredient==null) {
			result.error500("未找到对应实体");
		}else {
			result.setResult(foodRecipeIngredient);
			result.setSuccess(true);
		}
		return result;
	}

}
