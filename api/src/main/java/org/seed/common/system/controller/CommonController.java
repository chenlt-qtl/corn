package org.seed.common.system.controller;

import lombok.extern.slf4j.Slf4j;
import org.seed.common.api.vo.Result;
import org.seed.common.exception.CornException;
import org.seed.common.util.Base64Utils;
import org.seed.common.util.ResultUtils;
import org.seed.common.util.UpLoadUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.HandlerMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.Map;
import java.util.regex.Matcher;

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
@RequestMapping("/sys/common")
public class CommonController {

    @Value(value = "${jeecg.path.upload}")
    private String uploadpath;

    public static final String WORD_IMG = "word/img";
    public static final String WORD_MP3 = "word/mp3";
    public static final String WORD_PRON = "word/pron";
    public static final String NOTE = "note";
    public static final String GYM = "gym";


    /**
     * 保存笔记中的图片，会转成JPG（有损压缩）
     *
     * @param param
     * @return
     */
    @PostMapping(value = "/uploadImg/note/{id}")
    public Result uploadNoteImg(@RequestBody Map param, @PathVariable Integer id) {
        if (param.containsKey("file")) {
            try {
                String file = String.valueOf(param.get("file"));
                Matcher matcher = UpLoadUtil.BASE64_PATTERN.matcher(file);
                if (matcher.find()) {
                    String data = matcher.group(0);//数据
                    String type = matcher.group(1);//type
                    String imgData = data.split(",")[1];
                    String dir = NOTE + "/" + id / 100 * 100;//路径（相对）
                    String fileName = id.toString() + "_" + System.currentTimeMillis();//文件名称
                    String[] path = UpLoadUtil.getFilePaths(uploadpath, dir, ".jpg", fileName);
                    if (Base64Utils.saveBase64Image(imgData, type, path[0])) {
                        return ResultUtils.ok(path[1], UpLoadUtil.dbToReal(path[1]));
                    }
                }

            } catch (IOException e) {
                e.printStackTrace();
                return ResultUtils.error(e.getMessage());
            }
        }
        return ResultUtils.error("没有找到图片信息");
    }

    @PostMapping(value = "/uploadImg/word")
    public Result uploadWordImg(HttpServletRequest request) {
        return upload(request, WORD_IMG);
    }

    @PostMapping(value = "/uploadMp3/word")
    public Result uploadMp3(HttpServletRequest request) {
        return upload(request, WORD_MP3);
    }

    /**
     * 预览图片
     * 请求地址：http://localhost:8080/common/view/{user/20190119/e1fe9925bc315c60addea1b98eb1cb1349547719_1547866868179.jpg}
     *
     * @param request
     * @param response
     */
    @GetMapping(value = "/view/**")
    public void view(HttpServletRequest request, HttpServletResponse response) {
        // ISO-8859-1 ==> UTF-8 进行编码转换
        String imgPath = extractPathFromPattern(request);
        // 其余处理略
        InputStream inputStream = null;
        OutputStream outputStream = null;
        try {
            imgPath = imgPath.replace("..", "");
            if (imgPath.endsWith(",")) {
                imgPath = imgPath.substring(0, imgPath.length() - 1);
            }
            response.setContentType("image/jpeg;charset=utf-8");
            String localPath = uploadpath;
            String imgurl = localPath + File.separator + imgPath;
            inputStream = new BufferedInputStream(new FileInputStream(imgurl));
            outputStream = response.getOutputStream();
            byte[] buf = new byte[1024];
            int len;
            while ((len = inputStream.read(buf)) > 0) {
                outputStream.write(buf, 0, len);
            }
            response.flushBuffer();
        } catch (IOException e) {
            log.info("预览图片失败" + e.getMessage());
            // e.printStackTrace();
        } finally {
            if (inputStream != null) {
                try {
                    inputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if (outputStream != null) {
                try {
                    outputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

    }

    private Result upload(HttpServletRequest request, String dir) {
        try {

            MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
            MultipartFile mf = multipartRequest.getFile("file");// 获取上传文件对象
            String orgName = mf.getOriginalFilename();// 获取文件名

            String[] path = UpLoadUtil.getFilePaths(uploadpath, dir, orgName.substring(orgName.indexOf(".")), null);
            File savefile = new File(path[0]);
            FileCopyUtils.copy(mf.getBytes(), savefile);
            return ResultUtils.ok(path[1], UpLoadUtil.dbToReal(path[1]));
        } catch (IOException e) {
            e.printStackTrace();
            throw new CornException(e);
        }

    }

    /**
     * 把指定URL后的字符串全部截断当成参数
     * 这么做是为了防止URL中包含中文或者特殊字符（/等）时，匹配不了的问题
     *
     * @param request
     * @return
     */
    private static String extractPathFromPattern(final HttpServletRequest request) {
        String path = (String) request.getAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE);
        String bestMatchPattern = (String) request.getAttribute(HandlerMapping.BEST_MATCHING_PATTERN_ATTRIBUTE);
        return new AntPathMatcher().extractPathWithinPattern(bestMatchPattern, path);
    }

}
