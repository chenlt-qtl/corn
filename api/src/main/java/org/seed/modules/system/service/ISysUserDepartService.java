package org.seed.modules.system.service;


import java.util.List;

import org.seed.modules.system.entity.SysUser;
import org.seed.modules.system.entity.SysUserDepart;
import org.seed.modules.system.model.DepartIdModel;
import org.seed.modules.system.model.SysUserDepartsVO;

import com.baomidou.mybatisplus.extension.service.IService;

/**
 * <p>
 * SysUserDpeart用户组织机构service
 * </p>
 * @author ZhiLin
 *
 */
public interface ISysUserDepartService extends IService<SysUserDepart> {
	
	/**
	 * 根据指定用户添加部门信息
	 * @param sysUserDepartsVO
	 * @return
	 */
	boolean addSysUseWithrDepart(SysUserDepartsVO sysUserDepartsVO);
	
	/**
	 * 根据指定用户id查询部门信息
	 * @param userId
	 * @return
	 */
	List<DepartIdModel> queryDepartIdsOfUser(String userId);
	
	/**
	 * 根据指定用户id编辑部门信息
	 * @param sysUserDepartsVO
	 * @return
	 */
	boolean editSysUserWithDepart(SysUserDepartsVO sysUserDepartsVO);
	
	/**
	 * 根据部门id查询用户信息
	 * @param depId
	 * @return
	 */
	List<SysUser> queryUserByDepId(String depId);
}
