package org.seed.modules.system.controller;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.seed.common.api.vo.Result;
import org.seed.common.exception.CornException;
import org.seed.common.system.query.QueryGenerator;
import org.seed.common.util.ResultUtils;
import org.seed.modules.system.entity.SysDataLog;
import org.seed.modules.system.service.ISysDataLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/sys/dataLog")
@Slf4j
public class SysDataLogController {
    @Autowired
    private ISysDataLogService service;

    @RequestMapping(value = "/list", method = RequestMethod.GET)
    public Result queryPageList(SysDataLog dataLog, @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize, HttpServletRequest req) {
        QueryWrapper<SysDataLog> queryWrapper = QueryGenerator.initQueryWrapper(dataLog, req.getParameterMap());
        Page<SysDataLog> page = new Page<SysDataLog>(pageNo, pageSize);
        IPage<SysDataLog> pageList = service.page(page, queryWrapper);
        log.info("查询当前页：" + pageList.getCurrent());
        log.info("查询当前页数量：" + pageList.getSize());
        log.info("查询结果数量：" + pageList.getRecords().size());
        log.info("数据总数：" + pageList.getTotal());

        return ResultUtils.okData(pageList);
    }

    /**
     * 查询对比数据
     *
     * @param req
     * @return
     */
    @RequestMapping(value = "/queryCompareList", method = RequestMethod.GET)
    public Result queryCompareList(HttpServletRequest req) {
        String dataId1 = req.getParameter("dataId1");
        String dataId2 = req.getParameter("dataId2");
        List<String> idList = new ArrayList<String>();
        idList.add(dataId1);
        idList.add(dataId2);

        List<SysDataLog> list = (List<SysDataLog>) service.listByIds(idList);
        return ResultUtils.okData(list);


    }

    /**
     * 查询版本信息
     *
     * @param req
     * @return
     */
    @RequestMapping(value = "/queryDataVerList", method = RequestMethod.GET)
    public Result queryDataVerList(HttpServletRequest req) {
        String dataTable = req.getParameter("dataTable");
        String dataId = req.getParameter("dataId");
        QueryWrapper<SysDataLog> queryWrapper = new QueryWrapper<SysDataLog>();
        queryWrapper.eq("data_table", dataTable);
        queryWrapper.eq("data_id", dataId);
        List<SysDataLog> list = service.list(queryWrapper);
        if (list == null || list.size() <= 0) {
            throw new CornException("未找到版本信息");
        } else {
            return ResultUtils.okData(list);
        }

    }

}
