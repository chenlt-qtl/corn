package org.seed.modules.system.controller;

import lombok.extern.slf4j.Slf4j;

import org.seed.common.api.vo.Result;
import org.seed.common.exception.CornException;
import org.seed.common.util.ResultUtils;
import org.seed.modules.shiro.authc.util.JwtUtil;
import org.seed.modules.system.entity.SysDepart;
import org.seed.modules.system.model.DepartIdModel;
import org.seed.modules.system.model.SysDepartTreeModel;
import org.seed.modules.system.service.ISysDepartService;
import org.seed.modules.system.util.FindsDepartsChildrenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

import javax.servlet.http.HttpServletRequest;

/**
 * <p>
 * 部门表 前端控制器
 * <p>
 *
 * @author： Steve @Since： 2019-01-22
 */
@RestController
@RequestMapping("/sysdepart/sysDepart")
@Slf4j
public class SysDepartController {

    @Autowired
    private ISysDepartService sysDepartService;

    /**
     * 查询数据 查出所有部门,并以树结构数据格式响应给前端
     *
     * @return
     */
    @RequestMapping(value = "/queryTreeList", method = RequestMethod.GET)
    public Result queryTreeList() {
        List<SysDepartTreeModel> list = sysDepartService.queryTreeList();
        return ResultUtils.okData(list);
    }

    /**
     * 添加新数据 添加用户新建的部门对象数据,并保存到数据库
     *
     * @param sysDepart
     * @return
     */
    @RequestMapping(value = "/add", method = RequestMethod.POST)

    public Result add(@RequestBody SysDepart sysDepart, HttpServletRequest request) {
        String username = JwtUtil.getUserNameByToken(request);

        sysDepart.setCreateBy(username);
        sysDepartService.saveDepartData(sysDepart, username);
        return ResultUtils.ok("添加成功！");
    }

    /**
     * 编辑数据 编辑部门的部分数据,并保存到数据库
     *
     * @param sysDepart
     * @return
     */
    @RequestMapping(value = "/edit", method = RequestMethod.PUT)

    public Result edit(@RequestBody SysDepart sysDepart, HttpServletRequest request) {

        String username = JwtUtil.getUserNameByToken(request);
        sysDepart.setUpdateBy(username);
        SysDepart sysDepartEntity = sysDepartService.getById(sysDepart.getId());
        if (sysDepartEntity == null) {
            throw new CornException("未找到对应实体");
        } else {
            boolean ok = sysDepartService.updateDepartDataById(sysDepart, username);
            return ResultUtils.ok("修改成功!");
        }

    }

    /**
     * 通过id删除
     *
     * @param id
     * @return
     */
    @RequestMapping(value = "/delete", method = RequestMethod.DELETE)

    public Result delete(@RequestParam(name = "id", required = true) String id) {

        SysDepart sysDepart = sysDepartService.getById(id);
        if (sysDepart == null) {
            throw new CornException("未找到对应实体");
        } else {
            boolean ok = sysDepartService.delete(id);
            return ResultUtils.ok("删除成功!");

        }

    }


    /**
     * 批量删除 根据前端请求的多个ID,对数据库执行删除相关部门数据的操作
     *
     * @param ids
     * @return
     */
    @RequestMapping(value = "/deleteBatch", method = RequestMethod.DELETE)

    public Result deleteBatch(@RequestParam(name = "ids", required = true) String ids) {

        if (ids == null || "".equals(ids.trim())) {
            throw new CornException("参数不识别！");
        } else {
            this.sysDepartService.removeByIds(Arrays.asList(ids.split(",")));
            return ResultUtils.ok("删除成功!");
        }

    }

    /**
     * 查询数据 添加或编辑页面对该方法发起请求,以树结构形式加载所有部门的名称,方便用户的操作
     *
     * @return
     */
    @RequestMapping(value = "/queryIdTree", method = RequestMethod.GET)
    public Result queryIdTree() {
        List<DepartIdModel> idList;
        idList = FindsDepartsChildrenUtil.wrapDepartIdModel();
        if (idList != null && idList.size() > 0) {
            return ResultUtils.okData(idList);
        } else {
            sysDepartService.queryTreeList();
            idList = FindsDepartsChildrenUtil.wrapDepartIdModel();
            return ResultUtils.okData(idList);
        }
    }

    /**
     * <p>
     * 部门搜索功能方法,根据关键字模糊搜索相关部门
     * </p>
     *
     * @param keyWord
     * @return
     */
    @RequestMapping(value = "/searchBy", method = RequestMethod.GET)
    public Result searchBy(@RequestParam(name = "keyWord", required = true) String keyWord) {
        try {
            List<SysDepartTreeModel> treeList = this.sysDepartService.searhBy(keyWord);
            if (treeList.size() == 0 || treeList == null) {
                throw new Exception();
            }
            return ResultUtils.okData(treeList);

        } catch (Exception e) {
            e.fillInStackTrace();
            return ResultUtils.error("查询失败或没有您想要的任何数据!");

        }
    }

}
