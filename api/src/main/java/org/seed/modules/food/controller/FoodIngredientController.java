package org.seed.modules.food.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;
import org.seed.common.api.vo.Result;
import org.seed.common.system.query.QueryGenerator;
import org.seed.modules.food.entity.FoodIngredient;
import org.seed.modules.food.service.IFoodIngredientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

 /**
 * @Title: Controller
 * @Description: 食材
 * @author： jeecg-boot
 * @date：   2023-01-30
 * @version： V1.0
 */
@RestController
@RequestMapping("/food/ingredient")
@Slf4j
public class FoodIngredientController {
	@Autowired
	private IFoodIngredientService foodIngredientService;
	
	/**
	  * 分页列表查询
	 * @param foodIngredient
	 * @param pageNo
	 * @param pageSize
	 * @param req
	 * @return
	 */
	@GetMapping
	public Result<IPage<FoodIngredient>> queryPageList(FoodIngredient foodIngredient,
                                                       @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
                                                       @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
                                                       HttpServletRequest req) {
		Result<IPage<FoodIngredient>> result = new Result<IPage<FoodIngredient>>();
		QueryWrapper<FoodIngredient> queryWrapper = QueryGenerator.initQueryWrapper(foodIngredient, req.getParameterMap());
		Page<FoodIngredient> page = new Page<FoodIngredient>(pageNo, pageSize);
		IPage<FoodIngredient> pageList = foodIngredientService.page(page, queryWrapper);
		result.setSuccess(true);
		result.setResult(pageList);
		return result;
	}
	
	/**
	  *   添加
	 * @param foodIngredient
	 * @return
	 */
	@PostMapping
	public Result<FoodIngredient> add(@RequestBody FoodIngredient foodIngredient) {
		Result<FoodIngredient> result = new Result<FoodIngredient>();
		try {
			foodIngredientService.save(foodIngredient);
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
	 * @param foodIngredient
	 * @return
	 */
	@PutMapping
	public Result<FoodIngredient> edit(@RequestBody FoodIngredient foodIngredient) {
		Result<FoodIngredient> result = new Result<FoodIngredient>();
		FoodIngredient foodIngredientEntity = foodIngredientService.getById(foodIngredient.getId());
		if(foodIngredientEntity==null) {
			result.error500("未找到对应实体");
		}else {
			boolean ok = foodIngredientService.updateById(foodIngredient);
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
	public Result<FoodIngredient> delete(@PathVariable String id) {
		Result<FoodIngredient> result = new Result<FoodIngredient>();
		FoodIngredient foodIngredient = foodIngredientService.getById(id);
		if(foodIngredient==null) {
			result.error500("未找到对应实体");
		}else {
			boolean ok = foodIngredientService.removeById(id);
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
	public Result<FoodIngredient> queryById(@PathVariable String id) {
		Result<FoodIngredient> result = new Result<FoodIngredient>();
		FoodIngredient foodIngredient = foodIngredientService.getById(id);
		if(foodIngredient==null) {
			result.error500("未找到对应实体");
		}else {
			result.setResult(foodIngredient);
			result.setSuccess(true);
		}
		return result;
	}

}
