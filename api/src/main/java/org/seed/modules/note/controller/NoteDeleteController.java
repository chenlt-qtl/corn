package org.seed.modules.note.controller;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.seed.common.api.vo.Result;
import org.seed.common.system.query.QueryGenerator;
import org.seed.common.util.ResultUtils;
import org.seed.common.util.oConvertUtils;
import org.seed.modules.note.entity.NoteDelete;
import org.seed.modules.note.service.INoteDeleteService;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;

import org.jeecgframework.poi.excel.ExcelImportUtil;
import org.jeecgframework.poi.excel.def.NormalExcelConstants;
import org.jeecgframework.poi.excel.entity.ExportParams;
import org.jeecgframework.poi.excel.entity.ImportParams;
import org.jeecgframework.poi.excel.view.JeecgEntityExcelView;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;
import com.alibaba.fastjson.JSON;

/**
 * @Title: Controller
 * @Description: delete
 * @author： jeecg-boot
 * @date： 2019-07-09
 * @version： V1.0
 */
@RestController
@RequestMapping("/org.seed.modules.note/noteDelete")
@Slf4j
public class NoteDeleteController {
    @Autowired
    private INoteDeleteService noteDeleteService;

    /**
     * 分页列表查询
     *
     * @param noteDelete
     * @param pageNo
     * @param pageSize
     * @param req
     * @return
     */
    @GetMapping(value = "/list")
    public Result queryPageList(NoteDelete noteDelete,
                                @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
                                HttpServletRequest req) {
        QueryWrapper<NoteDelete> queryWrapper = QueryGenerator.initQueryWrapper(noteDelete, req.getParameterMap());
        Page<NoteDelete> page = new Page<NoteDelete>(pageNo, pageSize);
        IPage<NoteDelete> pageList = noteDeleteService.page(page, queryWrapper);
        return ResultUtils.okData(pageList);
    }

    /**
     * 添加
     *
     * @param noteDelete
     * @return
     */
    @PostMapping(value = "/add")
    public Result add(@RequestBody NoteDelete noteDelete) {
        try {
            noteDeleteService.save(noteDelete);
            return ResultUtils.ok();
        } catch (Exception e) {
            e.printStackTrace();
            log.info(e.getMessage());
            return ResultUtils.error(e.getMessage());
        }
    }

    /**
     * 编辑
     *
     * @param noteDelete
     * @return
     */
    @PutMapping(value = "/edit")
    public Result edit(@RequestBody NoteDelete noteDelete) {
        NoteDelete noteDeleteEntity = noteDeleteService.getById(noteDelete.getId());
        if (noteDeleteEntity == null) {
            return ResultUtils.error("未找到对应实体");
        } else {
            noteDeleteService.updateById(noteDelete);
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

        NoteDelete noteDelete = noteDeleteService.getById(id);
        if (noteDelete == null) {
            return ResultUtils.error("未找到对应实体");
        } else {
            noteDeleteService.removeById(id);
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
        NoteDelete noteDelete = noteDeleteService.getById(id);
        if (noteDelete == null) {
			return ResultUtils.error("未找到对应实体");
        } else {
			return ResultUtils.okData(noteDelete);
        }
    }

}
