package org.seed.modules.system.controller;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Date;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSON;
import org.seed.common.api.vo.Result;
import org.seed.common.constant.CommonConstant;
import org.seed.common.constant.CommonSendStatus;
import org.seed.common.exception.CornException;
import org.seed.common.system.query.QueryGenerator;
import org.seed.common.util.ResultUtils;
import org.seed.common.util.oConvertUtils;
import org.seed.modules.shiro.authc.util.JwtUtil;
import org.seed.modules.system.entity.SysAnnouncement;
import org.seed.modules.system.service.ISysAnnouncementService;
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
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

/**
 * @Title: Controller
 * @Description: 系统通告表
 * @author： jeecg-boot
 * @date： 2019-01-02
 * @version： V1.0
 */
@RestController
@RequestMapping("/sys/annountCement")
@Slf4j
public class SysAnnouncementController {
    @Autowired
    private ISysAnnouncementService sysAnnouncementService;

    /**
     * 分页列表查询
     *
     * @param sysAnnouncement
     * @param pageNo
     * @param pageSize
     * @param req
     * @return
     */
    @RequestMapping(value = "/list", method = RequestMethod.GET)
    public Result queryPageList(SysAnnouncement sysAnnouncement,
                                @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
                                HttpServletRequest req) {
        sysAnnouncement.setDelFlag(CommonConstant.DEL_FLAG_0.toString());
        QueryWrapper<SysAnnouncement> queryWrapper = QueryGenerator.initQueryWrapper(sysAnnouncement, req.getParameterMap());
        Page<SysAnnouncement> page = new Page<SysAnnouncement>(pageNo, pageSize);
        IPage<SysAnnouncement> pageList = sysAnnouncementService.page(page, queryWrapper);
        return ResultUtils.okData(pageList);
    }

    /**
     * 添加
     *
     * @param sysAnnouncement
     * @return
     */
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public Result add(@RequestBody SysAnnouncement sysAnnouncement) {
        try {
            sysAnnouncement.setDelFlag(CommonConstant.DEL_FLAG_0.toString());
            sysAnnouncement.setSendStatus(CommonSendStatus.UNPUBLISHED_STATUS_0);//未发布
            sysAnnouncementService.save(sysAnnouncement);
            return ResultUtils.ok();
        } catch (Exception e) {
            e.printStackTrace();
            log.info(e.getMessage());
            return ResultUtils.error("操作失败");
        }
    }

    /**
     * 编辑
     *
     * @param sysAnnouncement
     * @return
     */
    @RequestMapping(value = "/edit", method = RequestMethod.PUT)
    public Result edit(@RequestBody SysAnnouncement sysAnnouncement) {
        SysAnnouncement sysAnnouncementEntity = sysAnnouncementService.getById(sysAnnouncement.getId());
        if (sysAnnouncementEntity == null) {
            throw new CornException("未找到对应实体");
        } else {
            sysAnnouncementService.updateById(sysAnnouncement);
            return ResultUtils.ok();
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
        SysAnnouncement sysAnnouncement = sysAnnouncementService.getById(id);
        if (sysAnnouncement == null) {
            throw new CornException("未找到对应实体");
        } else {
            sysAnnouncement.setDelFlag(CommonConstant.DEL_FLAG_1.toString());
            sysAnnouncementService.updateById(sysAnnouncement);
            return ResultUtils.ok();
        }
    }

    /**
     * 批量删除
     *
     * @param ids
     * @return
     */
    @RequestMapping(value = "/deleteBatch", method = RequestMethod.DELETE)
    public Result deleteBatch(@RequestParam(name = "ids", required = true) String ids) {
        if (ids == null || "".equals(ids.trim())) {
            throw new CornException("参数不识别！");
        } else {
            String[] id = ids.split(",");
            for (int i = 0; i < id.length; i++) {
                SysAnnouncement announcement = sysAnnouncementService.getById(id[i]);
                announcement.setDelFlag(CommonConstant.DEL_FLAG_1.toString());
                sysAnnouncementService.updateById(announcement);
            }
            return ResultUtils.ok();
        }
    }

    /**
     * 通过id查询
     *
     * @param id
     * @return
     */
    @RequestMapping(value = "/queryById", method = RequestMethod.GET)
    public Result queryById(@RequestParam(name = "id", required = true) String id) {
        SysAnnouncement sysAnnouncement = sysAnnouncementService.getById(id);
        if (sysAnnouncement == null) {
            throw new CornException("未找到对应实体");
        } else {
            return ResultUtils.okData(sysAnnouncement);
        }
    }

    /**
     * 更新发布操作
     *
     * @param id
     * @return
     */
    @RequestMapping(value = "/doReleaseData", method = RequestMethod.GET)
    public Result doReleaseData(@RequestParam(name = "id", required = true) String id, HttpServletRequest request) {
        SysAnnouncement sysAnnouncement = sysAnnouncementService.getById(id);
        if (sysAnnouncement == null) {
            throw new CornException("未找到对应实体");
        } else {
            sysAnnouncement.setSendStatus(CommonSendStatus.PUBLISHED_STATUS_1);//发布中
            sysAnnouncement.setSendTime(new Date());
            String currentUserName = JwtUtil.getUserNameByToken(request);
            sysAnnouncement.setSender(currentUserName);
            boolean ok = sysAnnouncementService.updateById(sysAnnouncement);
            return ResultUtils.ok("该系统通知发布成功");

        }
    }

    /**
     * 更新撤销操作
     *
     * @param id
     * @return
     */
    @RequestMapping(value = "/doReovkeData", method = RequestMethod.GET)
    public Result doReovkeData(@RequestParam(name = "id", required = true) String id, HttpServletRequest request) {
        SysAnnouncement sysAnnouncement = sysAnnouncementService.getById(id);
        if (sysAnnouncement == null) {
            throw new CornException("未找到对应实体");
        } else {
            sysAnnouncement.setSendStatus(CommonSendStatus.REVOKE_STATUS_2);//撤销发布
            sysAnnouncement.setCancelTime(new Date());
            boolean ok = sysAnnouncementService.updateById(sysAnnouncement);
            return ResultUtils.ok("该系统通知撤销成功");
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
        QueryWrapper<SysAnnouncement> queryWrapper = null;
        try {
            String paramsStr = request.getParameter("paramsStr");
            if (oConvertUtils.isNotEmpty(paramsStr)) {
                String deString = URLDecoder.decode(paramsStr, "UTF-8");
                SysAnnouncement sysAnnouncement = JSON.parseObject(deString, SysAnnouncement.class);
                queryWrapper = QueryGenerator.initQueryWrapper(sysAnnouncement, request.getParameterMap());
            }
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }

        //Step.2 AutoPoi 导出Excel
        ModelAndView mv = new ModelAndView(new JeecgEntityExcelView());
        List<SysAnnouncement> pageList = sysAnnouncementService.list(queryWrapper);
        //导出文件名称
        mv.addObject(NormalExcelConstants.FILE_NAME, "系统通告列表");
        mv.addObject(NormalExcelConstants.CLASS, SysAnnouncement.class);
        mv.addObject(NormalExcelConstants.PARAMS, new ExportParams("系统通告列表数据", "导出人:Jeecg", "导出信息"));
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
                List<SysAnnouncement> listSysAnnouncements = ExcelImportUtil.importExcel(file.getInputStream(), SysAnnouncement.class, params);
                for (SysAnnouncement sysAnnouncementExcel : listSysAnnouncements) {
                    if (sysAnnouncementExcel.getDelFlag() == null) {
                        sysAnnouncementExcel.setDelFlag("0");
                    }
                    sysAnnouncementService.save(sysAnnouncementExcel);
                }
                return ResultUtils.ok("文件导入成功！数据行数：" + listSysAnnouncements.size());
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
