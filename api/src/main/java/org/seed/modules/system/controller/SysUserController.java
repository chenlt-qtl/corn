package org.seed.modules.system.controller;


import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.seed.common.api.vo.Result;
import org.seed.common.exception.CornException;
import org.seed.common.system.query.QueryGenerator;
import org.seed.common.util.PasswordUtil;
import org.seed.common.util.ResultUtils;
import org.seed.common.util.oConvertUtils;
import org.seed.modules.shiro.authc.util.JwtUtil;
import org.seed.modules.system.entity.SysUser;
import org.seed.modules.system.entity.SysUserDepart;
import org.seed.modules.system.entity.SysUserRole;
import org.seed.modules.system.model.DepartIdModel;
import org.seed.modules.system.model.SysUserDepartsVO;
import org.seed.modules.system.service.ISysUserDepartService;
import org.seed.modules.system.service.ISysUserRoleService;
import org.seed.modules.system.service.ISysUserService;
import org.jeecgframework.poi.excel.ExcelImportUtil;
import org.jeecgframework.poi.excel.def.NormalExcelConstants;
import org.jeecgframework.poi.excel.entity.ExportParams;
import org.jeecgframework.poi.excel.entity.ImportParams;
import org.jeecgframework.poi.excel.view.JeecgEntityExcelView;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

/**
 * <p>
 * 用户表 前端控制器
 * </p>
 *
 * @author scott
 * @since 2018-12-20
 */
@Slf4j
@RestController
@RequestMapping("/sys/user")
public class SysUserController {

    @Autowired
    private ISysUserService sysUserService;

    @Autowired
    private ISysUserRoleService sysUserRoleService;

    @Autowired
    private ISysUserDepartService sysUserDepartService;

    @Autowired
    private ISysUserRoleService userRoleService;

    @RequestMapping(value = "/list", method = RequestMethod.GET)
    public Result queryPageList(SysUser user, @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize, HttpServletRequest req) {
        QueryWrapper<SysUser> queryWrapper = QueryGenerator.initQueryWrapper(user, req.getParameterMap());
        Page<SysUser> page = new Page<SysUser>(pageNo, pageSize);
        IPage<SysUser> pageList = sysUserService.page(page, queryWrapper);

        return ResultUtils.okData(pageList);

    }

    @RequestMapping(value = "/add", method = RequestMethod.POST)

    public Result add(@RequestBody JSONObject jsonObject) {
        String selectedRoles = jsonObject.getString("selectedroles");

        SysUser user = JSON.parseObject(jsonObject.toJSONString(), SysUser.class);
        user.setCreateTime(new Date());//设置创建时间
        String salt = oConvertUtils.randomGen(8);
        user.setSalt(salt);
        String passwordEncode = PasswordUtil.encrypt(user.getUsername(), user.getPassword(), salt);
        user.setPassword(passwordEncode);
        user.setStatus(1);
        user.setDelFlag("0");
        sysUserService.addUserWithRole(user, selectedRoles);
        return ResultUtils.ok("添加成功！");


    }

    @RequestMapping(value = "/edit", method = RequestMethod.PUT)

    public Result edit(@RequestBody JSONObject jsonObject) {

        SysUser sysUser = sysUserService.getById(jsonObject.getString("id"));
        if (sysUser == null) {
            throw new CornException("未找到对应实体");
        } else {
            SysUser user = JSON.parseObject(jsonObject.toJSONString(), SysUser.class);
            user.setUpdateTime(new Date());
            //String passwordEncode = PasswordUtil.encrypt(user.getUsername(), user.getPassword(), sysUser.getSalt());
            user.setPassword(sysUser.getPassword());
            String roles = jsonObject.getString("selectedroles");
            sysUserService.editUserWithRole(user, roles);
            return ResultUtils.ok("修改成功!");
        }


    }

    @RequestMapping(value = "/delete", method = RequestMethod.DELETE)

    public Result delete(@RequestParam(name = "id", required = true) String id) {
        // 定义SysUserDepart实体类的数据库查询LambdaQueryWrapper
        LambdaQueryWrapper<SysUserDepart> query = new LambdaQueryWrapper<SysUserDepart>();
        SysUser sysUser = sysUserService.getById(id);
        if (sysUser == null) {
            throw new CornException("未找到对应实体");
        } else {
            // 当某个用户被删除时,删除其ID下对应的部门数据
            query.eq(SysUserDepart::getUserId, id);
            boolean ok = sysUserService.removeById(id);
            sysUserDepartService.remove(query);
            return ResultUtils.ok("删除成功!");

        }


    }

    @RequestMapping(value = "/deleteBatch", method = RequestMethod.DELETE)

    public Result deleteBatch(@RequestParam(name = "ids", required = true) String ids) {
        // 定义SysUserDepart实体类的数据库查询对象LambdaQueryWrapper
        LambdaQueryWrapper<SysUserDepart> query = new LambdaQueryWrapper<SysUserDepart>();
        String[] idArry = ids.split(",");
        if (ids == null || "".equals(ids.trim())) {
            throw new CornException("参数不识别！");
        } else {
            this.sysUserService.removeByIds(Arrays.asList(ids.split(",")));
            // 当批量删除时,删除在SysUserDepart中对应的所有部门数据
            for (String id : idArry) {
                query.eq(SysUserDepart::getUserId, id);
                this.sysUserDepartService.remove(query);
            }
            return ResultUtils.ok("删除成功!");
        }

    }

    /**
     * 冻结&解冻用户
     *
     * @param jsonObject
     * @return
     */

    @RequestMapping(value = "/frozenBatch", method = RequestMethod.PUT)
    public Result frozenBatch(@RequestBody JSONObject jsonObject) {

        String ids = jsonObject.getString("ids");
        String status = jsonObject.getString("status");
        String[] arr = ids.split(",");
        for (String id : arr) {
            if (oConvertUtils.isNotEmpty(id)) {
                this.sysUserService.update(new SysUser().setStatus(Integer.parseInt(status)),
                        new UpdateWrapper<SysUser>().lambda().eq(SysUser::getId, id));
            }
        }

        return ResultUtils.ok();

    }

    @RequestMapping(value = "/queryById", method = RequestMethod.GET)
    public Result queryById(@RequestParam(name = "id", required = true) String id) {
        SysUser sysUser = sysUserService.getById(id);
        if (sysUser == null) {
            throw new CornException("未找到对应实体");
        } else {
            return ResultUtils.okData(sysUser);

        }

    }

    @RequestMapping(value = "/queryUserRole", method = RequestMethod.GET)
    public Result queryUserRole(@RequestParam(name = "userid", required = true) String userid) {
        List<String> list = new ArrayList<String>();
        List<SysUserRole> userRole = sysUserRoleService.list(new QueryWrapper<SysUserRole>().lambda().eq(SysUserRole::getUserId, userid));
        if (userRole == null || userRole.size() <= 0) {
            throw new CornException("未找到用户相关角色信息");
        } else {
            for (SysUserRole sysUserRole : userRole) {
                list.add(sysUserRole.getRoleId());
            }

            return ResultUtils.okData(list);
        }

    }


    /**
     * 校验用户账号是否唯一<br>
     * 可以校验其他 需要检验什么就传什么。。。
     *
     * @param sysUser
     * @return
     */
    @RequestMapping(value = "/checkOnlyUser", method = RequestMethod.GET)
    public Result checkUsername(SysUser sysUser) {
        String id = sysUser.getId();
        log.info("--验证用户信息是否唯一---id:" + id);

        SysUser oldUser = null;
        if (oConvertUtils.isNotEmpty(id)) {
            oldUser = sysUserService.getById(id);
        } else {
            sysUser.setId(null);
        }
        //通过传入信息查询新的用户信息
        SysUser newUser = sysUserService.getOne(new QueryWrapper<SysUser>(sysUser));
        if (newUser != null) {
            //如果根据传入信息查询到用户了，那么就需要做校验了。
            if (oldUser == null) {
                //oldUser为空=>新增模式=>只要用户信息存在则返回false
                throw new CornException("用户账号已存在");

            } else if (!id.equals(newUser.getId())) {
                //否则=>编辑模式=>判断两者ID是否一致-
                throw new CornException("用户账号已存在");

            }
        }
        return ResultUtils.ok();

    }

    /**
     * 修改密码
     */
    @RequestMapping(value = "/changPassword", method = RequestMethod.PUT)

    public Result changPassword(@RequestBody SysUser sysUser) {
        String password = sysUser.getPassword();
        sysUser = this.sysUserService.getOne(new LambdaQueryWrapper<SysUser>().eq(SysUser::getUsername, sysUser.getUsername()));
        if (sysUser == null) {
            throw new CornException("未找到对应实体");
        } else {
            String salt = oConvertUtils.randomGen(8);
            sysUser.setSalt(salt);
            String passwordEncode = PasswordUtil.encrypt(sysUser.getUsername(), password, salt);
            sysUser.setPassword(passwordEncode);
            this.sysUserService.updateById(sysUser);
            return ResultUtils.ok("密码修改完成！");
        }

    }

    /**
     * 查询指定用户和部门关联的数据
     *
     * @param userId
     * @return
     */
    @RequestMapping(value = "/userDepartList", method = RequestMethod.GET)
    public Result getUserDepartsList(@RequestParam(name = "userId", required = true) String userId) {

        List<DepartIdModel> depIdModelList = this.sysUserDepartService.queryDepartIdsOfUser(userId);
        if (depIdModelList != null || depIdModelList.size() > 0) {
            return ResultUtils.okData(depIdModelList);
        } else {
            throw new CornException("查找失败");
        }
    }

    /**
     * 给指定用户添加对应的部门
     *
     * @param sysUserDepartsVO
     * @return
     */
    @RequestMapping(value = "/addUDepartIds", method = RequestMethod.POST)
    public Result addSysUseWithrDepart(@RequestBody SysUserDepartsVO sysUserDepartsVO) {
        boolean ok = this.sysUserDepartService.addSysUseWithrDepart(sysUserDepartsVO);
        return ResultUtils.ok();
    }

    /**
     * 根据用户id编辑对应的部门信息
     *
     * @param sysUserDepartsVO
     * @return
     */
    @RequestMapping(value = "/editUDepartIds", method = RequestMethod.PUT)
    public Result editSysUserWithDepart(@RequestBody SysUserDepartsVO sysUserDepartsVO) {
        boolean ok = sysUserDepartService.editSysUserWithDepart(sysUserDepartsVO);
        return ResultUtils.ok();
    }

    /**
     * 生成在添加用户情况下没有主键的问题,返回给前端,根据该id绑定部门数据
     *
     * @return
     */
    @RequestMapping(value = "/generateUserId", method = RequestMethod.GET)
    public Result generateUserId() {
        System.out.println("我执行了,生成用户ID==============================");
        String userId = UUID.randomUUID().toString().replace("-", "");

        return ResultUtils.okData(userId);

    }

    /**
     * 根据部门id查询用户信息
     *
     * @param id
     * @return
     */
    @RequestMapping(value = "/queryUserByDepId", method = RequestMethod.GET)
    public Result queryUserByDepId(@RequestParam(name = "id", required = true) String id) {
        List<SysUser> userList = sysUserDepartService.queryUserByDepId(id);

        return ResultUtils.okData(userList);

    }

    /**
     * 查询所有用户所对应的角色信息
     *
     * @return
     */
    @RequestMapping(value = "/queryUserRoleMap", method = RequestMethod.GET)
    public Result queryUserRole() {
        Map<String, String> map = userRoleService.queryUserRole();
        return ResultUtils.okData(map);


    }

    @RequestMapping(value = "/currentUser", method = RequestMethod.GET)
    public Result getCurrentUser(HttpServletRequest request) {
        String username = JwtUtil.getUserNameByToken(request);
        if (username == null) {
            throw new CornException("未找到登录信息，请重新登录");
        } else {
            SysUser user = sysUserService.getUserByName(username);
            return ResultUtils.okData(user);
        }

    }

    /**
     * 导出excel
     *
     * @param request
     * @param response
     */
    @RequestMapping(value = "/exportXls")
    public ModelAndView exportXls(HttpServletRequest request, HttpServletResponse response) {
        // Step.1 组装查询条件
        QueryWrapper<SysUser> queryWrapper = null;
        try {
            String paramsStr = request.getParameter("paramsStr");
            if (oConvertUtils.isNotEmpty(paramsStr)) {
                String deString = URLDecoder.decode(paramsStr, "UTF-8");
                SysUser sysUser = JSON.parseObject(deString, SysUser.class);
                queryWrapper = QueryGenerator.initQueryWrapper(sysUser, request.getParameterMap());
            }
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }

        //Step.2 AutoPoi 导出Excel
        ModelAndView mv = new ModelAndView(new JeecgEntityExcelView());
        List<SysUser> pageList = sysUserService.list(queryWrapper);
        //导出文件名称
        mv.addObject(NormalExcelConstants.FILE_NAME, "用户列表");
        mv.addObject(NormalExcelConstants.CLASS, SysUser.class);
        mv.addObject(NormalExcelConstants.PARAMS, new ExportParams("用户列表数据", "导出人:Jeecg", "导出信息"));
        mv.addObject(NormalExcelConstants.DATA_LIST, pageList);
        return mv;
    }

    /**
     * 通过excel导入数据
     *
     * @param request
     * @param response
     * @return
     */
    @RequestMapping(value = "/importExcel", method = RequestMethod.POST)
    public Result importExcel(HttpServletRequest request, HttpServletResponse response) {
        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
        Map<String, MultipartFile> fileMap = multipartRequest.getFileMap();
        for (Map.Entry<String, MultipartFile> entity : fileMap.entrySet()) {
            MultipartFile file = entity.getValue();// 获取上传文件对象
            ImportParams params = new ImportParams();
            params.setTitleRows(2);
            params.setHeadRows(1);
            params.setNeedSave(true);
            try {
                List<SysUser> listSysUsers = ExcelImportUtil.importExcel(file.getInputStream(), SysUser.class, params);
                for (SysUser sysUserExcel : listSysUsers) {
                    if (sysUserExcel.getPassword() == null) {
                        // 密码默认为“123456”
                        sysUserExcel.setPassword("123456");
                    }
                    sysUserService.save(sysUserExcel);
                }
                return ResultUtils.ok("文件导入成功！数据行数：" + listSysUsers.size());
            } catch (Exception e) {
                log.error(e.getMessage());
                return ResultUtils.error("文件导入失败！");
            } finally {
                try {
                    file.getInputStream().close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return ResultUtils.ok("文件导入失败！");
    }
}
