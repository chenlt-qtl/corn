package org.seed.modules.gym.controller;

import java.io.File;
import java.util.List;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.seed.common.api.vo.Result;
import org.seed.common.exception.CornException;
import org.seed.common.system.controller.CommonController;
import org.seed.common.system.query.QueryGenerator;
import org.seed.common.util.ResultUtils;
import org.seed.common.util.UpLoadUtil;
import org.seed.common.util.VideoUtil;
import org.seed.common.util.oConvertUtils;
import org.seed.modules.gym.entity.GymClass;
import org.seed.modules.gym.service.IGymClassService;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;

import org.seed.modules.system.entity.SysUser;
import org.jeecgframework.poi.excel.def.NormalExcelConstants;
import org.jeecgframework.poi.excel.entity.ExportParams;
import org.jeecgframework.poi.excel.view.JeecgEntityExcelView;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;
import com.alibaba.fastjson.JSON;

/**
 * @Title: Controller
 * @Description: test
 * @author： jeecg-boot
 * @date： 2020-02-28
 * @version： V1.0
 */
@RestController
@RequestMapping("/gym/gymClass")
@Slf4j
public class GymClassController {
    @Autowired
    private IGymClassService gymClassService;

    @Value(value = "${jeecg.path.upload}")
    private String uploadpath;

    @PostMapping(value = "/uploadVedio")
    public Result uploadVedio(HttpServletRequest request) {
        try {

            MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
            MultipartFile mf = multipartRequest.getFile("file");// 获取上传文件对象
            String orgName = mf.getOriginalFilename();// 获取文件名

            String[] path = UpLoadUtil.getFilePaths(uploadpath, CommonController.GYM, orgName.substring(orgName.indexOf(".")), null);
            File savefile = new File(path[0]);
            FileCopyUtils.copy(mf.getBytes(), savefile);
            return ResultUtils.ok(path[1]);

        } catch (IOException e) {
            e.printStackTrace();
            throw new CornException(e);
        }

    }

    /**
     * 分页列表查询
     *
     * @param gymClass
     * @param pageNo
     * @param pageSize
     * @param req
     * @return
     */
    @GetMapping(value = "/list")
    public Result queryPageList(GymClass gymClass, @RequestParam(name = "searchText", defaultValue = "") String searchText,
                                @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
                                HttpServletRequest req) {
        QueryWrapper<GymClass> queryWrapper = QueryGenerator.initQueryWrapper(gymClass, req.getParameterMap());
        if (StringUtils.isNotBlank(searchText)) {
            queryWrapper.like("name", searchText);
        }
        queryWrapper.orderByDesc("update_time");
        Page<GymClass> page = new Page<GymClass>(pageNo, pageSize);
        IPage<GymClass> pageList = gymClassService.page(page, queryWrapper);
        for (GymClass gym : pageList.getRecords()) {
            gym.setUrl(UpLoadUtil.dbToReal(gym.getUrl()));
        }

        return ResultUtils.okData(pageList);

    }

    /**
     * 添加
     *
     * @param gymClass
     * @return
     */
    @PostMapping(value = "/add")
    public Result add(@RequestBody GymClass gymClass) {
        try {
            gymClass.setUrl(UpLoadUtil.replace(uploadpath, null, gymClass.getUrl(), CommonController.GYM));
            gymClass.setLastingTime(VideoUtil.getDuration(UpLoadUtil.dbToReal(gymClass.getUrl())));
            gymClassService.save(gymClass);
            return ResultUtils.okData(gymClass);
        } catch (Exception e) {
            e.printStackTrace();
            log.info(e.getMessage());
            throw new CornException("操作失败");
        }

    }

    /**
     * 编辑
     *
     * @param gymClass
     * @return
     */
    @PutMapping(value = "/edit")
    public Result edit(@RequestBody GymClass gymClass) throws IOException {
        GymClass gymClassEntity = gymClassService.getById(gymClass.getId());
        if (gymClassEntity == null) {
            throw new CornException("未找到对应实体");
        } else {
            gymClass.setUrl(UpLoadUtil.replace(uploadpath, gymClassEntity.getUrl(), gymClass.getUrl(), CommonController.GYM));
            gymClass.setLastingTime(VideoUtil.getDuration(UpLoadUtil.dbToReal(uploadpath, gymClass.getUrl())));
            boolean ok = gymClassService.updateById(gymClass);
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
        GymClass gymClass = gymClassService.getById(id);
        UpLoadUtil.replace(uploadpath, gymClass.getUrl(), "", CommonController.GYM);
        if (gymClass == null) {
            throw new CornException("未找到对应实体");
        } else {
            boolean ok = gymClassService.removeById(id);
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
        GymClass gymClass = gymClassService.getById(id);
        if (gymClass == null) {
            throw new CornException("未找到对应实体");
        } else {
            gymClass.setUrl(UpLoadUtil.dbToReal(gymClass.getUrl()));
            return ResultUtils.okData(gymClass);

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
        QueryWrapper<GymClass> queryWrapper = null;
        try {
            String paramsStr = request.getParameter("paramsStr");
            if (oConvertUtils.isNotEmpty(paramsStr)) {
                String deString = URLDecoder.decode(paramsStr, "UTF-8");
                GymClass gymClass = JSON.parseObject(deString, GymClass.class);
                queryWrapper = QueryGenerator.initQueryWrapper(gymClass, request.getParameterMap());
            }
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }

        //Step.2 AutoPoi 导出Excel
        ModelAndView mv = new ModelAndView(new JeecgEntityExcelView());
        List<GymClass> pageList = gymClassService.list(queryWrapper);
        //导出文件名称
        mv.addObject(NormalExcelConstants.FILE_NAME, "test列表");
        mv.addObject(NormalExcelConstants.CLASS, GymClass.class);
        mv.addObject(NormalExcelConstants.PARAMS, new ExportParams("test列表数据", "导出人:Jeecg", "导出信息"));
        mv.addObject(NormalExcelConstants.DATA_LIST, pageList);
        return mv;
    }

}
