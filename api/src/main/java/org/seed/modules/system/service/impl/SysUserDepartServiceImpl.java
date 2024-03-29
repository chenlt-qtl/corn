package org.seed.modules.system.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.seed.modules.system.entity.SysDepart;
import org.seed.modules.system.entity.SysUser;
import org.seed.modules.system.entity.SysUserDepart;
import org.seed.modules.system.mapper.SysUserDepartMapper;
import org.seed.modules.system.model.DepartIdModel;
import org.seed.modules.system.model.SysUserDepartsVO;
import org.seed.modules.system.service.ISysDepartService;
import org.seed.modules.system.service.ISysUserDepartService;
import org.seed.modules.system.service.ISysUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

/**
 * <p>
 * 用户部门表实现类
 * <p/>
 *
 * @author ZhiLin
 * @since 2019-02-22
 */
@Service
public class SysUserDepartServiceImpl extends ServiceImpl<SysUserDepartMapper, SysUserDepart> implements ISysUserDepartService {

    @Autowired
    private ISysDepartService sysDepartService;
    @Autowired
    private ISysUserService sysUserService;

    /**
     * 根据用户id添加部门信息
     */
    @Override
    public boolean addSysUseWithrDepart(SysUserDepartsVO sysUserDepartsVO) {
        LambdaQueryWrapper<SysUserDepart> query = new LambdaQueryWrapper<SysUserDepart>();
        if (sysUserDepartsVO != null) {
            String userId = sysUserDepartsVO.getUserId();
            List<String> departIdList = sysUserDepartsVO.getDepartIdList();
            if (departIdList != null && departIdList.size() > 0) {
                for (String depId : departIdList) {
                    query.eq(SysUserDepart::getDepId, depId);
                    query.eq(SysUserDepart::getUserId, userId);
                    List<SysUserDepart> uDepList = list(query);
                    if (uDepList == null || uDepList.size() == 0) {
                        save(new SysUserDepart("", userId, depId));
                    }
                }
            }
            return true;
        } else {
            return false;
        }

    }

    /**
     * 根据用户id查询部门信息
     */
    @Override
    public List<DepartIdModel> queryDepartIdsOfUser(String userId) {
        LambdaQueryWrapper<SysUserDepart> queryUDep = new LambdaQueryWrapper<SysUserDepart>();
        LambdaQueryWrapper<SysDepart> queryDep = new LambdaQueryWrapper<SysDepart>();
        try {
            queryUDep.eq(SysUserDepart::getUserId, userId);
            List<String> depIdList = new ArrayList<>();
            List<DepartIdModel> depIdModelList = new ArrayList<>();
            List<SysUserDepart> userDepList = this.list(queryUDep);
            if (userDepList != null && userDepList.size() > 0) {
                for (SysUserDepart userDepart : userDepList) {
                    depIdList.add(userDepart.getDepId());
                }
                queryDep.in(SysDepart::getId, depIdList);
                List<SysDepart> depList = sysDepartService.list(queryDep);
                if (depList != null || depList.size() > 0) {
                    for (SysDepart depart : depList) {
                        depIdModelList.add(new DepartIdModel().convertByUserDepart(depart));
                    }
                }
                return depIdModelList;
            }
        } catch (Exception e) {
            e.fillInStackTrace();
        }
        return null;


    }

    /**
     * 根据用户id修改部门信息
     */
    @Override
    public boolean editSysUserWithDepart(SysUserDepartsVO sysUserDepartsVO) {
        LambdaQueryWrapper<SysUserDepart> queryDep = new LambdaQueryWrapper<SysUserDepart>();
        List<String> depIdList = sysUserDepartsVO.getDepartIdList();
        if (depIdList != null && depIdList.size() > 0) {
            queryDep.eq(SysUserDepart::getUserId, sysUserDepartsVO.getUserId());
            boolean ok = this.remove(queryDep);
            for (String str : depIdList) {
                this.save(new SysUserDepart("", sysUserDepartsVO.getUserId(), str));
            }
            return ok;
        }

        queryDep.eq(SysUserDepart::getUserId, sysUserDepartsVO.getUserId());
        boolean ok = remove(queryDep);
        return ok;
    }

    /**
     * 根据部门id查询用户信息
     */
    @Override
    public List<SysUser> queryUserByDepId(String depId) {
        LambdaQueryWrapper<SysUserDepart> queryUDep = new LambdaQueryWrapper<SysUserDepart>();
        queryUDep.eq(SysUserDepart::getDepId, depId);
        List<String> userIdList = new ArrayList<>();
        List<SysUserDepart> uDepList = this.list(queryUDep);
        if (uDepList != null && uDepList.size() > 0) {
            for (SysUserDepart uDep : uDepList) {
                userIdList.add(uDep.getUserId());
            }
            List<SysUser> userList = (List<SysUser>) sysUserService.listByIds(userIdList);
            return userList;
        }
        return new ArrayList<SysUser>();
    }

}
