package org.seed.modules.system.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;
import org.seed.common.api.vo.Result;
import org.seed.common.exception.CornException;
import org.seed.common.system.query.QueryGenerator;
import org.seed.common.util.ResultUtils;
import org.seed.modules.system.entity.SysData;
import org.seed.modules.system.service.ISysDataService;
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
	public Result queryPageList(SysData sysData,
												@RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
												@RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
												HttpServletRequest req) {
		QueryWrapper<SysData> queryWrapper = QueryGenerator.initQueryWrapper(sysData, req.getParameterMap());
		Page<SysData> page = new Page<SysData>(pageNo, pageSize);
		IPage<SysData> pageList = sysDataService.page(page, queryWrapper);
		return ResultUtils.okData(pageList);

	}
	
	/**
	  *   添加
	 * @param sysData
	 * @return
	 */
	@PostMapping
	public Result add(@RequestBody SysData sysData) {
		try {
			sysDataService.save(sysData);
			return ResultUtils.ok("添加成功！");
		} catch (Exception e) {
			e.printStackTrace();
			log.info(e.getMessage());
			throw new CornException("操作失败");
		}

	}
	
	/**
	  *  编辑
	 * @param sysData
	 * @return
	 */
	@PutMapping
	public Result edit(@RequestBody SysData sysData) {
		SysData sysDataEntity = sysDataService.getById(sysData.getId());
		if(sysDataEntity==null) {
			throw new CornException("未找到对应实体");
		}else {
			boolean ok = sysDataService.updateById(sysData);
			return ResultUtils.ok("修改成功!");
		}

	}
	
	/**
	  *   通过id删除
	 * @param id
	 * @return
	 */
	@DeleteMapping(value = "/{id}")
	public Result delete(@PathVariable String id) {
		SysData sysData = sysDataService.getById(id);
		if(sysData==null) {
			throw new CornException("未找到对应实体");
		}else {
			boolean ok = sysDataService.removeById(id);
			return ResultUtils.ok("删除成功!");

		}

	}
	

	
	/**
	  * 通过id查询
	 * @param id
	 * @return
	 */
	@GetMapping(value = "/{id}")
	public Result queryById(@PathVariable String id) {
		SysData sysData = sysDataService.getById(id);
		if(sysData==null) {
			throw new CornException("未找到对应实体");
		}else {
			return ResultUtils.okData(sysData);

		}

	}

}
