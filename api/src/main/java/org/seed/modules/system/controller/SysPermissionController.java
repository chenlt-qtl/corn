package org.seed.modules.system.controller;


import java.util.ArrayList;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;

import org.seed.common.api.vo.Result;
import org.seed.common.exception.CornException;
import org.seed.common.util.MD5Util;
import org.seed.common.util.ResultUtils;
import org.seed.common.util.oConvertUtils;
import org.seed.modules.system.entity.SysPermission;
import org.seed.modules.system.entity.SysPermissionDataRule;
import org.seed.modules.system.entity.SysRolePermission;
import org.seed.modules.system.model.SysPermissionTree;
import org.seed.modules.system.model.TreeModel;
import org.seed.modules.system.service.ISysPermissionDataRuleService;
import org.seed.modules.system.service.ISysPermissionService;
import org.seed.modules.system.service.ISysRolePermissionService;
import org.seed.modules.system.util.PermissionDataUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;

import lombok.extern.slf4j.Slf4j;

/**
 * <p>
 * 菜单权限表 前端控制器
 * </p>
 *
 * @author scott
 * @since 2018-12-21
 */
@Slf4j
@RestController
@RequestMapping("/sys/permission")
public class SysPermissionController {

    @Autowired
    private ISysPermissionService sysPermissionService;

    @Autowired
    private ISysRolePermissionService sysRolePermissionService;

    @Autowired
    private ISysPermissionDataRuleService sysPermissionDataRuleService;


    /**
     * 加载数据节点
     *
     * @return
     */
    @RequestMapping(value = "/list", method = RequestMethod.GET)
    public Result list() {

        LambdaQueryWrapper<SysPermission> query = new LambdaQueryWrapper<SysPermission>();
        query.eq(SysPermission::getDelFlag, 0);
        query.orderByAsc(SysPermission::getSortNo);
        List<SysPermission> list = sysPermissionService.list(query);
        List<SysPermissionTree> treeList = new ArrayList<>();
        getTreeList(treeList, list, null);
        return ResultUtils.okData(treeList);

    }


    /**
     * 查询用户拥有的菜单权限和按钮权限（根据用户账号）
     *
     * @return
     */
    @RequestMapping(value = "/queryByUser", method = RequestMethod.GET)
    public Result queryByUser(HttpServletRequest req) {

        String username = req.getParameter("username");
        List<SysPermission> metaList = sysPermissionService.queryByUser(username);
        JSONArray jsonArray = new JSONArray();
        this.getPermissionJsonArray(jsonArray, metaList, null);
        return ResultUtils.okData(jsonArray);

    }


    @RequestMapping(value = "/add", method = RequestMethod.POST)

    public Result add(@RequestBody SysPermission permission) {

        permission = PermissionDataUtil.intelligentProcessData(permission);
        sysPermissionService.addPermission(permission);
        return ResultUtils.ok("添加成功！");

    }

    @RequestMapping(value = "/edit", method = {RequestMethod.PUT, RequestMethod.POST})

    public Result edit(@RequestBody SysPermission permission) {

        permission = PermissionDataUtil.intelligentProcessData(permission);
        sysPermissionService.editPermission(permission);
        return ResultUtils.ok("修改成功！");

    }

    @RequestMapping(value = "/delete", method = RequestMethod.DELETE)

    public Result delete(@RequestParam(name = "id", required = true) String id) {

        sysPermissionService.deletePermission(id);
        sysPermissionService.deletePermRuleByPermId(id);
        return ResultUtils.ok("删除成功!");
    }


    @RequestMapping(value = "/deleteBatch", method = RequestMethod.DELETE)

    public Result deleteBatch(@RequestParam(name = "ids", required = true) String ids) {

        String arr[] = ids.split(",");
        for (String id : arr) {
            if (oConvertUtils.isNotEmpty(id)) {
                sysPermissionService.deletePermission(id);
            }
        }
        return ResultUtils.ok("删除成功!");

    }

    /**
     * 获取全部的权限树
     *
     * @return
     */
    @RequestMapping(value = "/queryTreeList", method = RequestMethod.GET)
    public Result queryTreeList() {
        //全部权限ids
        List<String> ids = new ArrayList<>();

        LambdaQueryWrapper<SysPermission> query = new LambdaQueryWrapper<SysPermission>();
        query.eq(SysPermission::getDelFlag, 0);
        query.orderByAsc(SysPermission::getSortNo);
        List<SysPermission> list = sysPermissionService.list(query);
        for (SysPermission sysPer : list) {
            ids.add(sysPer.getId());
        }
        List<TreeModel> treeList = new ArrayList<>();
        getTreeModelList(treeList, list, null);

        Map<String, Object> resMap = new HashMap<String, Object>();
        resMap.put("treeList", treeList); //全部树节点数据
        resMap.put("ids", ids);//全部树ids
        return ResultUtils.okData(resMap);

    }

    /**
     * 异步加载数据节点
     *
     * @return
     */
    @RequestMapping(value = "/queryListAsync", method = RequestMethod.GET)
    public Result queryAsync(@RequestParam(name = "pid", required = false) String parentId) {

        List<TreeModel> list = sysPermissionService.queryListByParentId(parentId);
        if (list == null || list.size() <= 0) {
            throw new CornException("未找到角色信息");
        } else {
            return ResultUtils.okData(list);
        }

    }


    /**
     * 查询角色授权
     *
     * @return
     */
    @RequestMapping(value = "/queryRolePermission", method = RequestMethod.GET)
    public Result queryRolePermission(@RequestParam(name = "roleId", required = true) String roleId) {

        List<SysRolePermission> list = sysRolePermissionService.list(new QueryWrapper<SysRolePermission>().lambda().eq(SysRolePermission::getRoleId, roleId));
        return ResultUtils.okData(list.stream().map(SysRolePermission -> String.valueOf(SysRolePermission.getPermissionId())).collect(Collectors.toList()));

    }

    /**
     * 保存角色授权
     *
     * @return
     */
    @RequestMapping(value = "/saveRolePermission", method = RequestMethod.POST)

    public Result saveRolePermission(@RequestBody JSONObject json) {

        String roleId = json.getString("roleId");
        String permissionIds = json.getString("permissionIds");
        this.sysRolePermissionService.saveRolePermission(roleId, permissionIds);
        return ResultUtils.ok("保存成功！");

    }


    private void getTreeList(List<SysPermissionTree> treeList, List<SysPermission> metaList, SysPermissionTree temp) {
        for (SysPermission permission : metaList) {
            String tempPid = permission.getParentId();
            SysPermissionTree tree = new SysPermissionTree(permission);
            if (temp == null && oConvertUtils.isEmpty(tempPid)) {
                treeList.add(tree);
                if (!tree.getIsLeaf()) {
                    getTreeList(treeList, metaList, tree);
                }
            } else if (temp != null && tempPid != null && tempPid.equals(temp.getId())) {
                temp.getChildren().add(tree);
                if (!tree.getIsLeaf()) {
                    getTreeList(treeList, metaList, tree);
                }
            }

        }
    }

    private void getTreeModelList(List<TreeModel> treeList, List<SysPermission> metaList, TreeModel temp) {
        for (SysPermission permission : metaList) {
            String tempPid = permission.getParentId();
            TreeModel tree = new TreeModel(permission);
            if (temp == null && oConvertUtils.isEmpty(tempPid)) {
                treeList.add(tree);
                if (!tree.getIsLeaf()) {
                    getTreeModelList(treeList, metaList, tree);
                }
            } else if (temp != null && tempPid != null && tempPid.equals(temp.getKey())) {
                temp.getChildren().add(tree);
                if (!tree.getIsLeaf()) {
                    getTreeModelList(treeList, metaList, tree);
                }
            }

        }
    }

    /**
     * 获取菜单JSON数组
     *
     * @param jsonArray
     * @param metaList
     * @param parentJson
     */
    private void getPermissionJsonArray(JSONArray jsonArray, List<SysPermission> metaList, JSONObject parentJson) {
        for (SysPermission permission : metaList) {
            if (permission.getMenuType() == null) {
                continue;
            }
            String tempPid = permission.getParentId();
            JSONObject json = getPermissionJsonObject(permission);
            if (parentJson == null && oConvertUtils.isEmpty(tempPid)) {
                jsonArray.add(json);
                if (!permission.isLeaf()) {
                    getPermissionJsonArray(jsonArray, metaList, json);
                }
            } else if (parentJson != null && oConvertUtils.isNotEmpty(tempPid) && tempPid.equals(parentJson.getString("id"))) {
                //类型( 0：一级菜单 1：子菜单  2：按钮 )
                if (permission.getMenuType() == 2) {
                    JSONObject metaJson = parentJson.getJSONObject("meta");
                    if (metaJson.containsKey("permissionList")) {
                        metaJson.getJSONArray("permissionList").add(json);
                    } else {
                        JSONArray permissionList = new JSONArray();
                        permissionList.add(json);
                        metaJson.put("permissionList", permissionList);
                    }
                    //类型( 0：一级菜单 1：子菜单  2：按钮 )
                } else if (permission.getMenuType() == 1 || permission.getMenuType() == 0) {
                    if (parentJson.containsKey("children")) {
                        parentJson.getJSONArray("children").add(json);
                    } else {
                        JSONArray children = new JSONArray();
                        children.add(json);
                        parentJson.put("children", children);
                    }

                    if (!permission.isLeaf()) {
                        getPermissionJsonArray(jsonArray, metaList, json);
                    }
                }
            }


        }
    }

    private JSONObject getPermissionJsonObject(SysPermission permission) {
        JSONObject json = new JSONObject();
        //类型(0：一级菜单 1：子菜单  2：按钮)
        if (permission.getMenuType() == 2) {
            json.put("action", permission.getPerms());
            json.put("describe", permission.getName());
        } else if (permission.getMenuType() == 0 || permission.getMenuType() == 1) {
            json.put("id", permission.getId());
            if (permission.isRoute()) {
                json.put("route", "1");//表示生成路由
            } else {
                json.put("route", "0");//表示不生成路由
            }

            if (isWWWHttpUrl(permission.getUrl())) {
                json.put("path", MD5Util.MD5Encode(permission.getUrl(), "utf-8"));
            } else {
                json.put("path", permission.getUrl());
            }

            //重要规则：路由name (通过URL生成路由name,路由name供前端开发，页面跳转使用)
            if (oConvertUtils.isNotEmpty(permission.getComponentName())) {
                json.put("name", permission.getComponentName());
            } else {
                json.put("name", urlToRouteName(permission.getUrl()));
            }

            //是否隐藏路由，默认都是显示的
            if (permission.isHidden()) {
                json.put("hidden", true);
            }
            //聚合路由
            if (permission.isAlwaysShow()) {
                json.put("alwaysShow", true);
            }
            json.put("component", permission.getComponent());
            JSONObject meta = new JSONObject();
            //默认所有的菜单都加路由缓存，提高系统性能
            meta.put("keepAlive", "true");
            meta.put("title", permission.getName());
            if (oConvertUtils.isEmpty(permission.getParentId())) {
                //一级菜单跳转地址
                json.put("redirect", permission.getRedirect());
                if (oConvertUtils.isNotEmpty(permission.getIcon())) {
                    meta.put("icon", permission.getIcon());
                }
            } else {
                if (oConvertUtils.isNotEmpty(permission.getIcon())) {
                    meta.put("icon", permission.getIcon());
                }
            }
            if (isWWWHttpUrl(permission.getUrl())) {
                meta.put("url", permission.getUrl());
            }
            json.put("meta", meta);
        }

        return json;
    }

    /**
     * 判断是否外网URL 例如： http://localhost:8080/jeecg-boot/swagger-ui.html#/
     * 支持特殊格式：     {{ window._CONFIG['domianURL'] }}/druid/
     * {{ JS代码片段 }}，前台解析会自动执行JS代码片段
     *
     * @return
     */
    private boolean isWWWHttpUrl(String url) {
        if (url != null && (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("{{"))) {
            return true;
        }
        return false;
    }

    /**
     * 通过URL生成路由name（去掉URL前缀斜杠，替换内容中的斜杠‘/’为-）
     * 举例： URL = /isystem/role
     * RouteName = isystem-role
     *
     * @return
     */
    private String urlToRouteName(String url) {
        if (oConvertUtils.isNotEmpty(url)) {
            if (url.startsWith("/")) {
                url = url.substring(1);
            }
            url = url.replace("/", "-");

            //特殊标记
            url = url.replace(":", "@");
            return url;
        } else {
            return null;
        }
    }

    /**
     * 根据菜单id来获取其对应的权限数据
     *
     * @param sysPermissionDataRule
     * @return
     */
    @RequestMapping(value = "/getPermRuleListByPermId", method = RequestMethod.GET)
    public Result getPermRuleListByPermId(SysPermissionDataRule sysPermissionDataRule) {
        List<SysPermissionDataRule> permRuleList = sysPermissionDataRuleService.getPermRuleListByPermId(sysPermissionDataRule.getPermissionId());

        return ResultUtils.okData(permRuleList);

    }

    /**
     * 添加菜单权限数据
     *
     * @param sysPermissionDataRule
     * @return
     */
    @RequestMapping(value = "/addPermissionRule", method = RequestMethod.POST)
    public Result addPermissionRule(@RequestBody SysPermissionDataRule sysPermissionDataRule) {
        try {
            sysPermissionDataRule.setCreateTime(new Date());
            sysPermissionDataRuleService.save(sysPermissionDataRule);
            return ResultUtils.ok("添加成功！");
        } catch (Exception e) {
            e.printStackTrace();
            log.info(e.getMessage());
            throw new CornException("操作失败");
        }

    }

    @RequestMapping(value = "/editPermissionRule", method = {RequestMethod.PUT, RequestMethod.POST})
    public Result editPermissionRule(@RequestBody SysPermissionDataRule sysPermissionDataRule) {

        sysPermissionDataRuleService.saveOrUpdate(sysPermissionDataRule);
        return ResultUtils.ok("更新成功！");
    }

    /**
     * 删除菜单权限数据
     *
     * @return
     */
    @RequestMapping(value = "/deletePermissionRule", method = RequestMethod.DELETE)
    public Result deletePermissionRule(@RequestParam(name = "id", required = true) String id) {

        sysPermissionDataRuleService.removeById(id);
        return ResultUtils.ok("删除成功！");
    }

    /**
     * 查询菜单权限数据
     *
     * @param sysPermissionDataRule
     * @return
     */
    @RequestMapping(value = "/queryPermissionRule", method = RequestMethod.GET)
    public Result queryPermissionRule(SysPermissionDataRule sysPermissionDataRule) {

        List<SysPermissionDataRule> permRuleList = sysPermissionDataRuleService.queryPermissionRule(sysPermissionDataRule);
        return ResultUtils.okData(permRuleList);

    }

}
