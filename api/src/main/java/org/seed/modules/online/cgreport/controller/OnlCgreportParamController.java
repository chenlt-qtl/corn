package org.seed.modules.online.cgreport.controller;

import java.util.Arrays;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.seed.common.api.vo.Result;
import org.seed.common.exception.CornException;
import org.seed.common.system.query.QueryGenerator;
import org.seed.common.util.ResultUtils;
import org.seed.modules.online.cgreport.entity.OnlCgreportParam;
import org.seed.modules.online.cgreport.service.IOnlCgreportParamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import lombok.extern.slf4j.Slf4j;

/**
 * @Title: Controller
 * @Description: 在线报表配置
 * @author: jeecg-boot
 * @date: 2019-03-08
 * @version: V1.0
 */
@RestController
@RequestMapping("/online/cgreport/param")
@Slf4j
public class OnlCgreportParamController {

    @Autowired
    private IOnlCgreportParamService onlCgreportParamService;

    /**
     * 根据 headId 查询出 所有的 param
     */
    @GetMapping(value = "/listByHeadId")
    public Result queryPageListByHeadId(String headId) {

        QueryWrapper<OnlCgreportParam> queryWrapper = new QueryWrapper<OnlCgreportParam>();
        queryWrapper.eq("cgrhead_id", headId);
        queryWrapper.orderByAsc("order_num");
        List<OnlCgreportParam> list = onlCgreportParamService.list(queryWrapper);


        return ResultUtils.okData(list);

    }

    /**
     * 分页列表查询
     *
     * @param onlCgreportParam
     * @param pageNo
     * @param pageSize
     * @param req
     * @return
     */
    @GetMapping(value = "/list")
    public Result queryPageList(OnlCgreportParam onlCgreportParam, @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo, @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize, HttpServletRequest req) {
        QueryWrapper<OnlCgreportParam> queryWrapper = QueryGenerator.initQueryWrapper(onlCgreportParam, req.getParameterMap());
        Page<OnlCgreportParam> page = new Page<OnlCgreportParam>(pageNo, pageSize);
        IPage<OnlCgreportParam> pageList = onlCgreportParamService.page(page, queryWrapper);

        return ResultUtils.okData(pageList);

    }

    /**
     * 添加
     *
     * @param onlCgreportParam
     * @return
     */
    @PostMapping(value = "/add")
    public Result add(@RequestBody OnlCgreportParam onlCgreportParam) {
        try {
            onlCgreportParamService.save(onlCgreportParam);
            return ResultUtils.ok("添加成功！");
        } catch (Exception e) {
            e.printStackTrace();
            log.info(e.getMessage());
            throw new CornException("操作失败");
        }

    }

    /**
     * 编辑
     *
     * @param onlCgreportParam
     * @return
     */
    @PutMapping(value = "/edit")
    public Result edit(@RequestBody OnlCgreportParam onlCgreportParam) {
        OnlCgreportParam onlCgreportParamEntity = onlCgreportParamService.getById(onlCgreportParam.getId());
        if (onlCgreportParamEntity == null) {
            throw new CornException("未找到对应实体");
        } else {
            boolean ok = onlCgreportParamService.updateById(onlCgreportParam);
            return ResultUtils.ok("修改成功!");

        }


    }

    /**
     * 通过id删除
     *
     * @param id
     * @return
     */
    @DeleteMapping(value = "/delete")
    public Result delete(@RequestParam(name = "id", required = true) String id) {
        OnlCgreportParam onlCgreportParam = onlCgreportParamService.getById(id);
        if (onlCgreportParam == null) {
            throw new CornException("未找到对应实体");
        } else {
            boolean ok = onlCgreportParamService.removeById(id);
            return ResultUtils.ok("删除成功!");

        }


    }

    /**
     * 批量删除
     *
     * @param ids
     * @return
     */
    @DeleteMapping(value = "/deleteBatch")
    public Result deleteBatch(@RequestParam(name = "ids", required = true) String ids) {
        if (ids == null || "".equals(ids.trim())) {
            throw new CornException("参数不识别！");
        } else {
            this.onlCgreportParamService.removeByIds(Arrays.asList(ids.split(",")));
            return ResultUtils.ok("删除成功!");
        }

    }

    /**
     * 通过id查询
     *
     * @param id
     * @return
     */
    @GetMapping(value = "/queryById")
    public Result queryById(@RequestParam(name = "id", required = true) String id) {
        OnlCgreportParam onlCgreportParam = onlCgreportParamService.getById(id);
        if (onlCgreportParam == null) {
            throw new CornException("未找到对应实体");
        } else {
            return ResultUtils.okData(onlCgreportParam);

        }

    }

}
