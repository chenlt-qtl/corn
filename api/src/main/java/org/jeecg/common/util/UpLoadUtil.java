package org.jeecg.common.util;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.jeecg.common.exception.JeecgBootException;
import org.jeecg.common.system.controller.CommonController;
import org.jeecg.modules.system.entity.SysUser;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.io.*;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Component
public class UpLoadUtil {

    public static final String DB_PATH_PRE = "baseUrl/";
    private static final Pattern BASE64_PATTERN = Pattern.compile("data\\:image/(jpeg|png|gif|jpg|bmp);base64\\,(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?");

    private static String realPre;

    private static String realPrePattern;



    @Value(value = "${jeecg.path.pre}")
    public void setRealPre(String pre) {
        UpLoadUtil.realPre = pre;
        UpLoadUtil.realPrePattern = "[\\\\/]?"+UpLoadUtil.realPre.replaceAll("^[\\\\/]","");
    }

    /**
     * 处理视频和图片
     *
     * @param uploadPath
     */
    public static String replace(String uploadPath, String oldUrl, String newUrl, String type) {
        if (StringUtils.isNotBlank(newUrl)) {
            log.info("============newUrl:" + newUrl);
            HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
            log.info("============ContextPath:" + request.getContextPath());
            int index = newUrl.indexOf(request.getContextPath() + "/" + type + "/");
            log.info("============index:" + index);
            if (index != -1) {
                newUrl = UpLoadUtil.DB_PATH_PRE + newUrl.substring(index + (request.getContextPath() + "/").length());
            }
        }
        if (oldUrl != null && !oldUrl.equals(newUrl)) {//删除旧文件
            oldUrl = oldUrl.substring(oldUrl.indexOf(UpLoadUtil.DB_PATH_PRE) + UpLoadUtil.DB_PATH_PRE.length());
            log.info("============delete old vedio:" + oldUrl);
            UpLoadUtil.delImg(uploadPath, oldUrl);
        }
        return newUrl;

    }


    /**
     * 获取文件夹path
     *
     * @param uploadpath
     * @return
     */
    public static String[] getFilePaths(String uploadpath, String dir, String fileType, String fileName) {
        log.info("******≧◔◡◔≦*******upload path:" + uploadpath);
        String nowday = new SimpleDateFormat("yyyyMMdd").format(new Date());

        SysUser sysUser = (SysUser) SecurityUtils.getSubject().getPrincipal();
        String dbpath = dir;//硬盘存放相对路径
        if (!CommonController.WORD_PRON.equals(dir)) {//单词发音文件不用区分用户日期
            dbpath = dbpath + File.separator + sysUser.getUsername() + File.separator + nowday;//硬盘存放相对路径
        }
        log.info("******≧◔◡◔≦*******dbpath:" + dbpath);
        if (StringUtils.isBlank(fileName)) {
            fileName = String.valueOf(System.currentTimeMillis());
        }
        return getFilePath(uploadpath, dbpath, fileName + fileType);
    }

    private static String[] getFilePath(String uploadpath, String relativePath, String fileName) {
        File file = new File(uploadpath + File.separator + relativePath);
        if (!file.exists()) {
            file.mkdirs();// 创建文件根目录
        }

        String[] result = new String[2];
        result[0] = file.getPath() + File.separator + fileName;
        log.info("========realPath:" + result[0]);
        String dbpath = relativePath + File.separator + fileName;
        if (dbpath.contains("\\")) {
            dbpath = dbpath.replace("\\", "/");
        }
        result[1] = DB_PATH_PRE + dbpath;
        return result;
    }

    public static void saveFile(InputStream in, String path) {
        File file = new File(path);
        if (file.exists()) {
            file.delete();
        }
        OutputStream out = null;
        try {
            out = new FileOutputStream(file);
            FileCopyUtils.copy(in, out);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                out.close();
                in.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }


    public static String realToDb(String text) {
        return realToDb(text, null);
    }

    /**
     * 真实地址转成数据库地址
     *
     * @param text
     * @param type
     * @return
     */
    public static String realToDb(String text, String type) {
        if (StringUtils.isBlank(text)) {
            return "";
        }

        log.info("=========≧◔◡◔≦=========text:", text);
        StringBuffer sbr = new StringBuffer();
        Pattern imgPattern;
        if ("html".equals(type)) {
            imgPattern = Pattern.compile("(?<=<img src=\")(" + realPrePattern + ")");
        } else {
            imgPattern = Pattern.compile("^(" + realPrePattern + ")");
        }
        Matcher matcher = imgPattern.matcher(text);
        while (matcher.find()) {
            log.info("============ContextPath:" + matcher.group(0));
            matcher.appendReplacement(sbr, DB_PATH_PRE);
        }

        matcher.appendTail(sbr);
        return sbr.toString();
    }

    /**
     * 将数据库里的图片等数据转成可以显示的地址
     *
     * @return
     */
    public static String dbToReal(String text) {
        return dbToReal(text, null);
    }

    /**
     * 将数据库里的图片等数据转成可以显示的地址
     *
     * @return
     */
    public static String dbToReal(String text, String type) {
        if (StringUtils.isNotBlank(text)) {
            StringBuffer sbr = new StringBuffer();

            Pattern imgPattern;
            if ("html".equals(type)) {
                imgPattern = Pattern.compile("(?<=<img src=\")" + UpLoadUtil.DB_PATH_PRE);
            } else {
                imgPattern = Pattern.compile(UpLoadUtil.DB_PATH_PRE);
            }
            Matcher matcher = imgPattern.matcher(text);
            while (matcher.find()) {
                matcher.appendReplacement(sbr, realPre);
            }

            matcher.appendTail(sbr);
            return sbr.toString();
        } else {
            return "";
        }

    }


    /**
     * 获取text包含的图片url
     *
     * @param text
     * @return
     */
    public static String[] getImgUrls(String text) {
        List<String> result = new ArrayList<>();
        text = realToDb(text, "html");
        Pattern imgPattern = Pattern.compile("(?<=<img src=\"" + DB_PATH_PRE + ")([/|0-9a-z]+?)\\.(jpeg|png|gif|jpg|bmp)");
        Matcher matcher = imgPattern.matcher(text);
        while (matcher.find()) {
            result.add(matcher.group(0));
        }

        return result.toArray(new String[]{});
    }

    /**
     * 根据图片url删除图片
     *
     * @param uploadpath
     * @param imgUrl
     */
    public static void delImg(String uploadpath, String imgUrl) {
        if (StringUtils.isNotBlank(imgUrl)) {
            StringBuffer sbr = new StringBuffer();
            Pattern imgPattern = Pattern.compile(UpLoadUtil.DB_PATH_PRE);
            Matcher matcher = imgPattern.matcher(imgUrl);
            if (matcher.find()) {
                matcher.appendReplacement(sbr, "");
            }
            matcher.appendTail(sbr);

            log.info("******≧◔◡◔≦*******imgUrl:" + uploadpath + File.separator + sbr);
            File file = new File(uploadpath + File.separator + sbr);
            if (file.exists()) {
                log.info("******≧◔◡◔≦*******file exists : true ");
                file.delete();
            }
        }
    }


    /**
     * 将base64图片存到硬盘并将结果替换到原text中，删除旧的图片
     * 处理图片路径
     *
     * @param uploadPath
     */
    public static String parseText(String uploadPath, String text, String oldText) {
        if (StringUtils.isBlank(text)) {
            return "";
        }
        //---------------处理旧的数据----------------
        text = realToDb(text, "html");

        //---------------处理base64------------------
        Matcher matcher = BASE64_PATTERN.matcher(text);
        StringBuffer sbr = new StringBuffer();
        while (matcher.find()) {
            String data = matcher.group(0);//数据
            String type = matcher.group(1);//type
            if (data.startsWith("data:image") && data.contains(",")) {
                String imgData = data.split(",")[1];
                if (StringUtils.isNotBlank(imgData)) {
                    String pathArr[] = UpLoadUtil.getFilePaths(uploadPath, CommonController.NOTE, "." + type, null);
                    try {
                        if (Base64Utils.GenerateImage(imgData, pathArr[0])) {
                            matcher.appendReplacement(sbr, pathArr[1]);
                        }
                    } catch (IOException e) {
                        throw new JeecgBootException("保存图片出错");
                    }
                }
            }
        }

        matcher.appendTail(sbr);

        String newText = sbr.toString();

        if (StringUtils.isNotBlank(oldText)) {
            String[] imgs = UpLoadUtil.getImgUrls(oldText);
            for (String imgUrl : imgs) {
                if (newText.indexOf(imgUrl) == -1) {//图片被删除了
                    UpLoadUtil.delImg(uploadPath, imgUrl);
                }
            }
        }
        return newText;
    }


    public static void main(String[] args) {
//        Matcher matcher = BASE64_PATTERN.matcher("<p style=\"text-align: justify; line-height: 100%; margin-top: 0pt; margin-bottom: 0pt;\"><img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAAAuCAYAAACcYs/JAAAAdklEQVRoge3ZoQ3EMBBFQdeQYtPa1eJqNuSFHo3BPOlza7TMazQzM+vrB5wSiAJRa+89tl3EG4gCUSAKRIEoEAWiQNS6fvfYDQIECBAgQIAAAQIECBAgQIAAAQIEiDMGAgQIEH8hvv5YOSUQBaJAFIgCUSAKRD2TA12pbP/UpwAAAABJRU5ErkJggg==\" alt=\"\" /></p>\n" +
//                "<!--polaris office 260 -->");
//        StringBuffer sbr = new StringBuffer();
//        while (matcher.find()) {
//            System.out.println(matcher.group(0));
//            System.out.println(matcher.group(1));
//            matcher.appendReplacement(sbr, "www.test.com/1.jpg");
//        }
//
//        matcher.appendTail(sbr);
//        System.out.println(sbr);
//        System.out.println("=======================");
//
//        UpLoadUtil.realPre = "upload/";
//        System.out.println(UpLoadUtil.realPre.replaceAll("^[\\\\/]",""));
//        UpLoadUtil.realPre = "/upload/";
//        System.out.println(UpLoadUtil.realPre.replaceAll("^[\\\\/]",""));
//        UpLoadUtil.realPre = "\\upload/";
//        System.out.println(UpLoadUtil.realPre.replaceAll("^[\\\\/]",""));
        UpLoadUtil.realPre = "/upload/";
        UpLoadUtil.realPrePattern = "[\\\\/]?"+UpLoadUtil.realPre.replaceAll("^[\\\\/]","");
        String result = dbToReal("baseUrl/note/damu/20210111/1610355128657.png");
//        String result = realToDb("<p><img src=\"upload/note/damu/20210112/1610432817412.png\" alt=\"\" /></p>","html");
        System.out.println(result);
//
//        System.out.println("=======================");
//        sbr = new StringBuffer();
//        String preUrl = "http://localhost:8080/jeecg-boot/";
//        imgPattern = Pattern.compile("(?<=<img src=\")"+UpLoadUtil.IMG_PRE);
//        matcher = imgPattern.matcher("<p><img src=\"baseUrl/user/20191024/damu/1571887545610.jpg\" alt=\"\" width=\"650\" height=\"366\" /><img src=\"baseUrl/user/20191024/damu/1571891981499.png\" alt=\"\" /></p>");
//        while (matcher.find()) {
//            matcher.appendReplacement(sbr, preUrl);
//        }
//
//        matcher.appendTail(sbr);
//        System.out.println(sbr);

    }
}
