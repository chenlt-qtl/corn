package org.jeecg.modules.system.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.modules.system.entity.SysData;
import org.jeecg.modules.system.service.ISysDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

 /**
 * @Title: Controller
 * @Description: 1
 * @author： jeecg-boot
 * @date：   2022-12-28
 * @version： V1.0
 */
@RestController
@RequestMapping("/sys/data")
@Slf4j
public class SysDataController {
	@Autowired
	private ISysDataService sysDataService;
	
	/**
	  * 分页列表查询
	 * @param sysData
	 * @param pageNo
	 * @param pageSize
	 * @param req
	 * @return
	 */
	@GetMapping
	public Result<IPage<SysData>> queryPageList(SysData sysData,
												@RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
												@RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
												HttpServletRequest req) {
		Result<IPage<SysData>> result = new Result<IPage<SysData>>();
		QueryWrapper<SysData> queryWrapper = QueryGenerator.initQueryWrapper(sysData, req.getParameterMap());
		Page<SysData> page = new Page<SysData>(pageNo, pageSize);
		IPage<SysData> pageList = sysDataService.page(page, queryWrapper);
		result.setSuccess(true);
		result.setResult(pageList);
		return result;
	}
	
	/**
	  *   添加
	 * @param sysData
	 * @return
	 */
	@PostMapping
	public Result<SysData> add(@RequestBody SysData sysData) {
		Result<SysData> result = new Result<SysData>();
		try {
			sysDataService.save(sysData);
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
	 * @param sysData
	 * @return
	 */
	@PutMapping
	public Result<SysData> edit(@RequestBody SysData sysData) {
		Result<SysData> result = new Result<SysData>();
		SysData sysDataEntity = sysDataService.getById(sysData.getId());
		if(sysDataEntity==null) {
			result.error500("未找到对应实体");
		}else {
			boolean ok = sysDataService.updateById(sysData);
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
	public Result<SysData> delete(@PathVariable String id) {
		Result<SysData> result = new Result<SysData>();
		SysData sysData = sysDataService.getById(id);
		if(sysData==null) {
			result.error500("未找到对应实体");
		}else {
			boolean ok = sysDataService.removeById(id);
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
	public Result<SysData> queryById(@PathVariable String id) {
		Result<SysData> result = new Result<SysData>();
		SysData sysData = sysDataService.getById(id);
		if(sysData==null) {
			result.error500("未找到对应实体");
		}else {
			result.setResult(sysData);
			result.setSuccess(true);
		}
		return result;
	}

}
