package org.seed.modules.online.cgreport.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;

import org.seed.common.api.vo.Result;
import org.seed.common.exception.CornException;
import org.seed.common.system.query.QueryGenerator;
import org.seed.common.util.ResultUtils;
import org.seed.modules.online.cgreport.entity.OnlCgreportHead;
import org.seed.modules.online.cgreport.entity.OnlCgreportItem;
import org.seed.modules.online.cgreport.entity.OnlCgreportParam;
import org.seed.modules.online.cgreport.model.OnlCgreportModel;
import org.seed.modules.online.cgreport.service.IOnlCgreportHeadService;
import org.seed.modules.online.cgreport.service.IOnlCgreportItemService;
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
@RequestMapping("/online/cgreport/head")
@Slf4j
public class OnlCgreportHeadController {

    @Autowired
    private IOnlCgreportHeadService onlCgreportHeadService;
    @Autowired
    private IOnlCgreportParamService onlCgreportParamService;
    @Autowired
    private IOnlCgreportItemService onlCgreportItemService;

    /**
     * sql解析获取字段和参数
     *
     * @return
     */
    @GetMapping(value = "/parseSql")
    public Result parseSql(@RequestParam(name = "sql", required = true) String sql) {
        Map<String, Object> resultJson = new HashMap<String, Object>();
        //返回SQL解析字段
        List<OnlCgreportItem> onlCgreportItemList = new ArrayList<OnlCgreportItem>();
        //返回SQL解析参数
        List<OnlCgreportParam> onlCgreportParamList = new ArrayList<OnlCgreportParam>();
        List<String> fields = null;
        List<String> params = null;
        String dbKey = null;
        try {
            fields = onlCgreportHeadService.getSqlFields(sql, dbKey);
            params = onlCgreportHeadService.getSqlParams(sql);

            int i = 1;
            for (String f : fields) {
                OnlCgreportItem t = new OnlCgreportItem();
                t.setFieldName(f);
                t.setFieldTxt(f);
                t.setIsShow(1);
                t.setOrderNum(i);
                t.setId(i + "_" + System.currentTimeMillis());
                t.setFieldType("String");
                onlCgreportItemList.add(t);
                i++;
            }

            for (String p : params) {
                OnlCgreportParam param = new OnlCgreportParam();
                param.setParamName(p);
                param.setParamTxt(p);
                onlCgreportParamList.add(param);
            }
            resultJson.put("fields", onlCgreportItemList);
            resultJson.put("params", onlCgreportParamList);
        } catch (Exception e) {
            e.printStackTrace();
            String msg = "解析失败!<br><br>失败原因：";
            int i = e.getMessage().indexOf("Connection refused: connect");
            if (i != -1) {// 非链接异常
                msg += "数据源连接失败.";
            } else {
                msg += "SQL语法错误.";
            }
            return ResultUtils.error(msg);
        }
        return ResultUtils.okData(resultJson);
    }

    /**
     * 分页列表查询
     *
     * @param onlCgreportHead
     * @param pageNo
     * @param pageSize
     * @param req
     * @return
     */
    @GetMapping(value = "/list")
    public Result queryPageList(OnlCgreportHead onlCgreportHead, @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo, @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize, HttpServletRequest req) {
        QueryWrapper<OnlCgreportHead> queryWrapper = QueryGenerator.initQueryWrapper(onlCgreportHead, req.getParameterMap());
        Page<OnlCgreportHead> page = new Page<OnlCgreportHead>(pageNo, pageSize);
        IPage<OnlCgreportHead> pageList = onlCgreportHeadService.page(page, queryWrapper);
        return ResultUtils.okData(pageList);
    }

    /**
     * 添加
     *
     * @return
     */
    @PostMapping(value = "/add")
    public Result add(@RequestBody OnlCgreportModel values) {
        try {
            String uuid = UUID.randomUUID().toString().replace("-", "");

            OnlCgreportHead head = values.getHead();
            List<OnlCgreportParam> params = values.getParams();
            List<OnlCgreportItem> items = values.getItems();

            head.setId(uuid);
            for (OnlCgreportParam param : params) {
                param.setId(null);
                param.setCgrheadId(uuid);
            }
            for (OnlCgreportItem item : items) {
                item.setId(null);
                item.setCgrheadId(uuid);
            }

            onlCgreportHeadService.save(head);
            onlCgreportParamService.saveBatch(params);
            onlCgreportItemService.saveBatch(items);

            return ResultUtils.ok();
        } catch (Exception e) {
            e.printStackTrace();
            log.info(e.getMessage());
            return ResultUtils.error();
        }
    }

    /**
     * 编辑保存全部操作
     */
    @PutMapping(value = "/editAll")
    public Result editAll(@RequestBody OnlCgreportModel values) {

        try {
            return onlCgreportHeadService.editAll(values);

        } catch (Exception e) {
            e.printStackTrace();
            log.info(e.getMessage());
            return ResultUtils.error();
        }

    }

    /**
     * 编辑
     *
     * @param onlCgreportHead
     * @return
     */
    @PutMapping(value = "/edit")
    public Result edit(@RequestBody OnlCgreportHead onlCgreportHead) {
        OnlCgreportHead onlCgreportHeadEntity = onlCgreportHeadService.getById(onlCgreportHead.getId());
        if (onlCgreportHeadEntity == null) {
            throw new CornException("未找到对应实体");
        } else {
            onlCgreportHeadService.updateById(onlCgreportHead);
            return ResultUtils.ok();
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
        OnlCgreportHead onlCgreportHead = onlCgreportHeadService.getById(id);
        if (onlCgreportHead == null) {
            throw new CornException("未找到对应实体");
        } else {
            onlCgreportHeadService.removeById(id);
            return ResultUtils.ok();
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
            this.onlCgreportHeadService.removeByIds(Arrays.asList(ids.split(",")));
            return ResultUtils.ok();
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
        OnlCgreportHead onlCgreportHead = onlCgreportHeadService.getById(id);
        if (onlCgreportHead == null) {
            throw new CornException("未找到对应实体");
        } else {
            return ResultUtils.okData(onlCgreportHead);
        }
    }

}
