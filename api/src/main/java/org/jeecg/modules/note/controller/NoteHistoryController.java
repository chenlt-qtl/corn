package org.jeecg.modules.note.controller;


import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.util.oConvertUtils;
import org.jeecg.modules.note.entity.NoteHistory;
import org.jeecg.modules.note.service.INoteHistoryService;
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

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * @Title: Controller
 * @Description: 历史记录
 * @author： jeecg-boot
 * @date：   2021-12-06
 * @version： V1.0
 */
@RestController
@RequestMapping("/noteHistory/noteHistory")
@Slf4j
public class NoteHistoryController {
    @Autowired
    private INoteHistoryService noteHistoryService;

    /**
     * 分页列表查询
     * @param noteHistory
     * @param pageNo
     * @param pageSize
     * @param req
     * @return
     */
    @GetMapping(value = "/list")
    public Result<IPage<NoteHistory>> queryPageList(NoteHistory noteHistory,
                                                    @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
                                                    @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
                                                    HttpServletRequest req) {
        Result<IPage<NoteHistory>> result = new Result<IPage<NoteHistory>>();
        QueryWrapper<NoteHistory> queryWrapper = QueryGenerator.initQueryWrapper(noteHistory, req.getParameterMap());
        Page<NoteHistory> page = new Page<NoteHistory>(pageNo, pageSize);
        IPage<NoteHistory> pageList = noteHistoryService.page(page, queryWrapper);
        result.setSuccess(true);
        result.setResult(pageList);
        return result;
    }

    /**
     *   添加
     * @param noteHistory
     * @return
     */
    @PostMapping(value = "/add")
    public Result<NoteHistory> add(@RequestBody NoteHistory noteHistory) {
        Result<NoteHistory> result = new Result<NoteHistory>();
        try {
            noteHistoryService.save(noteHistory);
            result.success("添加成功！");
        } catch (Exception e) {
            e.printStackTrace();
            log.info(e.getMessage());
            result.error500("操作失败");
        }
        return result;
    }

    /**
     *  编辑
     * @param noteHistory
     * @return
     */
    @PutMapping(value = "/edit")
    public Result<NoteHistory> edit(@RequestBody NoteHistory noteHistory) {
        Result<NoteHistory> result = new Result<NoteHistory>();
        NoteHistory noteHistoryEntity = noteHistoryService.getById(noteHistory.getId());
        if(noteHistoryEntity==null) {
            result.error500("未找到对应实体");
        }else {
            boolean ok = noteHistoryService.updateById(noteHistory);
            //TODO 返回false说明什么？
            if(ok) {
                result.success("修改成功!");
            }
        }

        return result;
    }

    /**
     *   通过id删除
     * @param id
     * @return
     */
    @DeleteMapping(value = "/delete")
    public Result<NoteHistory> delete(@RequestParam(name="id",required=true) String id) {
        Result<NoteHistory> result = new Result<NoteHistory>();
        NoteHistory noteHistory = noteHistoryService.getById(id);
        if(noteHistory==null) {
            result.error500("未找到对应实体");
        }else {
            boolean ok = noteHistoryService.removeById(id);
            if(ok) {
                result.success("删除成功!");
            }
        }

        return result;
    }

    /**
     *  批量删除
     * @param ids
     * @return
     */
    @DeleteMapping(value = "/deleteBatch")
    public Result<NoteHistory> deleteBatch(@RequestParam(name="ids",required=true) String ids) {
        Result<NoteHistory> result = new Result<NoteHistory>();
        if(ids==null || "".equals(ids.trim())) {
            result.error500("参数不识别！");
        }else {
            this.noteHistoryService.removeByIds(Arrays.asList(ids.split(",")));
            result.success("删除成功!");
        }
        return result;
    }

    /**
     * 通过id查询
     * @param id
     * @return
     */
    @GetMapping(value = "/queryById")
    public Result<NoteHistory> queryById(@RequestParam(name="id",required=true) String id) {
        Result<NoteHistory> result = new Result<NoteHistory>();
        NoteHistory noteHistory = noteHistoryService.getById(id);
        if(noteHistory==null) {
            result.error500("未找到对应实体");
        }else {
            result.setResult(noteHistory);
            result.setSuccess(true);
        }
        return result;
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
        QueryWrapper<NoteHistory> queryWrapper = null;
        try {
            String paramsStr = request.getParameter("paramsStr");
            if (oConvertUtils.isNotEmpty(paramsStr)) {
                String deString = URLDecoder.decode(paramsStr, "UTF-8");
                NoteHistory noteHistory = JSON.parseObject(deString, NoteHistory.class);
                queryWrapper = QueryGenerator.initQueryWrapper(noteHistory, request.getParameterMap());
            }
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }

        //Step.2 AutoPoi 导出Excel
        ModelAndView mv = new ModelAndView(new JeecgEntityExcelView());
        List<NoteHistory> pageList = noteHistoryService.list(queryWrapper);
        //导出文件名称
        mv.addObject(NormalExcelConstants.FILE_NAME, "历史记录列表");
        mv.addObject(NormalExcelConstants.CLASS, NoteHistory.class);
        mv.addObject(NormalExcelConstants.PARAMS, new ExportParams("历史记录列表数据", "导出人:Jeecg", "导出信息"));
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
    public Result<?> importExcel(HttpServletRequest request, HttpServletResponse response) {
        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
        Map<String, MultipartFile> fileMap = multipartRequest.getFileMap();
        for (Map.Entry<String, MultipartFile> entity : fileMap.entrySet()) {
            MultipartFile file = entity.getValue();// 获取上传文件对象
            ImportParams params = new ImportParams();
            params.setTitleRows(2);
            params.setHeadRows(1);
            params.setNeedSave(true);
            try {
                List<NoteHistory> listNoteHistorys = ExcelImportUtil.importExcel(file.getInputStream(), NoteHistory.class, params);
                for (NoteHistory noteHistoryExcel : listNoteHistorys) {
                    noteHistoryService.save(noteHistoryExcel);
                }
                return Result.ok("文件导入成功！数据行数：" + listNoteHistorys.size());
            } catch (Exception e) {
                log.error(e.getMessage());
                return Result.error("文件导入失败！");
            } finally {
                try {
                    file.getInputStream().close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return Result.ok("文件导入失败！");
    }

}
