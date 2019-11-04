package org.jeecg.common.util;

import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.SecurityUtils;
import org.jeecg.modules.system.entity.SysUser;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
public class UpLoadUtil {

    public static final String IMG_PRE = "baseUrl/";
    public static final String WORD_DIR = "word";

    /**
     * 获取用户文件夹path
     * @param uploadpath
     * @param type
     * @return
     */
    public static String[] getUserFilePath(String uploadpath, String type){
        log.info("========upload path:"+uploadpath);
        String nowday = new SimpleDateFormat("yyyyMMdd").format(new Date());
        SysUser sysUser = (SysUser) SecurityUtils.getSubject().getPrincipal();
        String bizPath = "user"+ File.separator + nowday + File.separator + sysUser.getUsername();
        File file = new File(uploadpath + File.separator + bizPath );
        if (!file.exists()) {
            file.mkdirs();// 创建文件根目录
        }

        String fileName = System.currentTimeMillis() + type;
        String[] result = new String[2];
        result[0] = file.getPath() + File.separator + fileName;
        log.info("========realPath:"+result[0]);
        String dbpath = bizPath + File.separator + fileName;
        if (dbpath.contains("\\")) {
            dbpath = dbpath.replace("\\", "/");
        }
        result[1] = dbpath;
        return result;
    }

    /**
     * 获取单词文件夹path
     * @param uploadpath
     * @param name
     * @return
     */
    public static String[] getWordFilePath(String uploadpath,String name){
        log.info("========upload path:"+uploadpath);
        File file = new File(uploadpath + File.separator + WORD_DIR );
        if (!file.exists()) {
            file.mkdirs();// 创建文件根目录
        }

        String fileName = name;
        String[] result = new String[2];
        result[0] = file.getPath() + File.separator + fileName;
        log.info("========realPath:"+result[0]);
        String dbpath = WORD_DIR + File.separator + fileName;
        if (dbpath.contains("\\")) {
            dbpath = dbpath.replace("\\", "/");
        }
        result[1] = dbpath;
        return result;
    }

    public static String parseOldImg(String text,String contextPath){
        StringBuffer sbr = new StringBuffer();
        Pattern imgPattern = Pattern.compile("(?<=<img src=\")([/|:|0-9a-z]+?)"+contextPath+"/");
        Matcher matcher = imgPattern.matcher(text);
        while (matcher.find()) {
            log.info("============ContextPath:"+matcher.group(0));
            matcher.appendReplacement(sbr, IMG_PRE);
        }

        matcher.appendTail(sbr);
        return sbr.toString();
    }

    /**
     * 获取text包含的图片url
     * @param text
     * @param contextPath
     * @return
     */
    public static String[] getImgUrls(String text,String contextPath){
        List<String> result = new ArrayList<>();
        text = parseOldImg(text,contextPath);
        Pattern imgPattern = Pattern.compile("(?<=<img src=\""+IMG_PRE+")([/|0-9a-z]+?)\\.(jpeg|png|gif|jpg|bmp)");
        Matcher matcher = imgPattern.matcher(text);
        while (matcher.find()) {
            result.add(matcher.group(0));
        }

        return result.toArray(new String[]{});
    }

    /**
     * 根据图片url删除图片
     * @param uploadpath
     * @param imgUrl
     */
    public static void delImg(String uploadpath,String imgUrl){
        File file = new File(uploadpath + File.separator + imgUrl );
        if(file.exists()){
            file.delete();
        }
    }

    public static void main(String args[]){
        Pattern imgPattern = Pattern.compile("(?<=<img src=\""+IMG_PRE+")([/|0-9a-z]+?)\\.(jpeg|png|gif|jpg|bmp)");
        Matcher matcher = imgPattern.matcher("<p><img src=\"baseUrl/user/20191024/damu/1571887545610jpg.jpg\" alt=\"\" width=\"650\" height=\"366\" /><img src=\"baseUrl/user/20191024/damu/1571891981499.png\" alt=\"\" />123</p>");
        while (matcher.find()) {
            System.out.println(matcher.group(0));
        }
    }
}
