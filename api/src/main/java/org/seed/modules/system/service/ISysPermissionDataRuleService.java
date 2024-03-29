package org.seed.modules.system.service;

import java.util.List;

import org.seed.modules.system.entity.SysPermissionDataRule;

import com.baomidou.mybatisplus.extension.service.IService;

/**
 * <p>
 * 菜单权限规则 服务类
 * </p>
 *
 * @author huangzhilin
 * @since 2019-04-01
 */
public interface ISysPermissionDataRuleService extends IService<SysPermissionDataRule> {

	/**
	 * 根据菜单id查询其对应的权限数据
	 * 
	 * @param permRule
	 */
	List<SysPermissionDataRule> getPermRuleListByPermId(String permissionId);

	/**
	 * 根据页面传递的参数查询菜单权限数据
	 * 
	 * @return
	 */
	List<SysPermissionDataRule> queryPermissionRule(SysPermissionDataRule permRule);
	
	
	/**
	  * 根据菜单ID和用户名查找数据权限配置信息
	 * @param permission
	 * @param username
	 * @return
	 */
	List<SysPermissionDataRule> queryPermissionDataRules(String username,String permissionId);
}
