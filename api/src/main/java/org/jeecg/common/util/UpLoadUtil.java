package org.jeecg.common.util;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.jeecg.common.exception.JeecgBootException;
import org.jeecg.modules.system.entity.SysUser;
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
public class UpLoadUtil {

    public static final String IMG_PRE = "baseUrl/";
    public static final String WORD_DIR = "word";
    public static final String WORD_PRON = "pron";
    public static final String USER = "user";
    public static final String GYM = "gym";

    /**
     * 处理视频和图片
     * @param uploadPath
     */
    public static String replace(String uploadPath,String oldUrl,String newUrl,String type){
        if(StringUtils.isNotBlank(newUrl)) {
            log.info("============newUrl:" + newUrl);
            HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
            log.info("============ContextPath:" + request.getContextPath());
            int index = newUrl.indexOf(request.getContextPath() + "/" + type + "/");
            log.info("============index:" + index);
            if(index!=-1){
                newUrl = UpLoadUtil.IMG_PRE + newUrl.substring(index+(request.getContextPath() + "/").length());
            }
        }
        if(oldUrl!=null && !oldUrl.equals(newUrl)){//删除旧文件
            oldUrl = oldUrl.substring(oldUrl.indexOf(UpLoadUtil.IMG_PRE)+UpLoadUtil.IMG_PRE.length());
            log.info("============delete old vedio:" + oldUrl);
            UpLoadUtil.delImg(uploadPath,oldUrl);
        }
        return newUrl;

    }

    /**
     * 处理数据库里的图片路径
     * @return
     */
    public static String parseUrlText(String text) {
        if(StringUtils.isNotBlank(text)) {
            String result = getPreUrl() + text.substring(text.indexOf(UpLoadUtil.IMG_PRE)+UpLoadUtil.IMG_PRE.length());
            log.info("===========url:"+result);
            return result;
        }else {
            return "";
        }

    }

    public static String getRealPath(String uploadPath, String baseUrl){
        baseUrl = baseUrl.substring(baseUrl.indexOf(UpLoadUtil.IMG_PRE)+UpLoadUtil.IMG_PRE.length());
        return uploadPath + File.separator + baseUrl;
    }

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
        String bizPath = USER + File.separator + nowday + File.separator + sysUser.getUsername();
        return getFilePath(uploadpath,bizPath ,System.currentTimeMillis() + type);
    }


    /**
     * 获取单词文件夹path
     * @param uploadpath
     * @param name
     * @return
     */
    public static String[] getWordFilePath(String uploadpath,String name,boolean isWord){
        log.info("========upload path:"+uploadpath);
        String dbpath = WORD_DIR;

        String nowday = new SimpleDateFormat("yyyyMMdd").format(new Date());
        if(!isWord) {//文章
            SysUser sysUser = (SysUser) SecurityUtils.getSubject().getPrincipal();
            dbpath = dbpath + File.separator + USER + File.separator + nowday + File.separator + sysUser.getUsername();
            name = System.currentTimeMillis() + name.substring(name.indexOf("."));
        }else{
            dbpath = dbpath + File.separator + WORD_PRON + File.separator + nowday ;
        }

        return getFilePath(uploadpath,dbpath ,name);
    }

    /**
     * 获取单词文件夹path
     * @param uploadpath
     * @param type
     * @return
     */
    public static String[] getGymFilePath(String uploadpath, String type){
        log.info("========upload path:"+uploadpath);
        String nowday = new SimpleDateFormat("yyyyMMdd").format(new Date());
        String dbpath = GYM + File.separator + nowday ;
        return getFilePath(uploadpath,dbpath ,System.currentTimeMillis() + type);
    }

    private static String[] getFilePath(String uploadpath,String relativePath ,String fileName){
        File file = new File(uploadpath + File.separator + relativePath);
        if (!file.exists()) {
            file.mkdirs();// 创建文件根目录
        }

        String[] result = new String[2];
        result[0] = file.getPath() + File.separator + fileName;
        log.info("========realPath:"+result[0]);
        String dbpath = relativePath + File.separator + fileName;
        if (dbpath.contains("\\")) {
            dbpath = dbpath.replace("\\", "/");
        }
        result[1] = dbpath;
        return result;
    }

    public static void saveFile(InputStream in,String path){
        File file = new File(path);
        if(file.exists()){
            file.delete();
        }
        OutputStream out = null;
        try {
            out = new FileOutputStream(file);
            FileCopyUtils.copy(in,out);
        } catch (Exception e) {
            e.printStackTrace();
        } finally{
            try {
                out.close();
                in.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public static String parseOldImg(String text,String contextPath){
        StringBuffer sbr = new StringBuffer();
        Pattern imgPattern = Pattern.compile("(?<=<img src=\")((http|https)://[/|:|0-9a-z]+?)"+contextPath+"/");
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
        log.info("-----------------imgUrl:"+uploadpath + File.separator + imgUrl);
        File file = new File(uploadpath + File.separator + imgUrl );
        if(file.exists()){
            log.info("-----------------file exists : true ");
            file.delete();
        }
    }

    /**
     * 将数据库里的图片数据转成可以显示的地址
     * @return
     */
    public static String parseImgText(String text) {
        if(StringUtils.isNotBlank(text)) {
            StringBuffer sbr = new StringBuffer();
            String preUrl = getPreUrl();

            Pattern imgPattern = Pattern.compile("(?<=<img src=\")" + UpLoadUtil.IMG_PRE);
            Matcher matcher = imgPattern.matcher(text);
            while (matcher.find()) {
                matcher.appendReplacement(sbr, preUrl);
            }

            matcher.appendTail(sbr);
            return sbr.toString();
        }else {
            return " ";
        }

    }

    /**
     * 获取文件的url前缀
     * @return
     */
    public static String getPreUrl() {
            HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
            String preUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath() + "/";
            log.info("******≧◔◡◔≦*******preUrl:"+preUrl);
            return preUrl;

    }


    private static final Pattern BASE64_PATTERN = Pattern.compile("data\\:image/(jpeg|png|gif|jpg|bmp);base64\\,(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?");


    /**
     * 将base64图片存到硬盘并将结果替换到原text中，删除旧的图片
     * 处理图片路径
     * @param uploadPath
     */
    public static String parseText(String uploadPath,String text,String oldText){
        if(StringUtils.isBlank(text)){
            return "";
        }
        //---------------处理旧的数据----------------
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        log.info("============ContextPath:"+request.getContextPath());
        text = parseOldImg(text,request.getContextPath());

        //---------------处理base64------------------
        Matcher matcher = BASE64_PATTERN.matcher(text);
        StringBuffer sbr = new StringBuffer();
        while (matcher.find()) {
            String data = matcher.group(0);//数据
            String type = matcher.group(1);//type
            if(data.startsWith("data:image")&&data.contains(",")){
                String imgData = data.split(",")[1];
                if(StringUtils.isNotBlank(imgData)){
                    String pathArr[] = UpLoadUtil.getUserFilePath(uploadPath,"."+type);
                    try {
                        if(Base64Utils.GenerateImage(imgData,pathArr[0])) {
                            matcher.appendReplacement(sbr, UpLoadUtil.IMG_PRE+pathArr[1]);
                        }
                    } catch (IOException e) {
                        throw new JeecgBootException("保存图片出错");
                    }
                }
            }
        }

        matcher.appendTail(sbr);

        String newText = sbr.toString();

        if(StringUtils.isNotBlank(oldText)){
            String[] imgs = UpLoadUtil.getImgUrls(oldText, request.getContextPath());
            for(String imgUrl:imgs){
                if(newText.indexOf(imgUrl)==-1){//图片被删除了
                    UpLoadUtil.delImg(uploadPath,imgUrl);
                }
            }
        }
        return newText;
    }


    public static void main(String[] args){
        Matcher matcher = BASE64_PATTERN.matcher("<p style=\"text-align: justify; line-height: 100%; margin-top: 0pt; margin-bottom: 0pt;\"><img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAAAuCAYAAACcYs/JAAAAdklEQVRoge3ZoQ3EMBBFQdeQYtPa1eJqNuSFHo3BPOlza7TMazQzM+vrB5wSiAJRa+89tl3EG4gCUSAKRIEoEAWiQNS6fvfYDQIECBAgQIAAAQIECBAgQIAAAQIEiDMGAgQIEH8hvv5YOSUQBaJAFIgCUSAKRD2TA12pbP/UpwAAAABJRU5ErkJggg==\" alt=\"\" /></p>\n" +
                "<!--polaris office 260 -->");
        StringBuffer sbr = new StringBuffer();
        while (matcher.find()) {
            System.out.println(matcher.group(0));
            System.out.println(matcher.group(1));
            matcher.appendReplacement(sbr, "www.test.com/1.jpg");
        }

        matcher.appendTail(sbr);
        System.out.println(sbr);
        System.out.println("=======================");

        Pattern imgPattern = Pattern.compile("(?<=<img src=\")([/|:|0-9a-z]+?)"+"/jeecg-boot/");
        matcher = imgPattern.matcher("<p><img src=\"http://localhost:8089/jeecg-boot/user/20191024/damu/1571887153443.jpg\" alt=\"\" width=\"656\" height=\"369\" /></p>\n");
        sbr = new StringBuffer();
        while (matcher.find()) {
            System.out.println("group0"+matcher.group(0));
            matcher.appendReplacement(sbr, "baseUrl/");
        }

        matcher.appendTail(sbr);
        System.out.println(sbr);

        System.out.println("=======================");
        sbr = new StringBuffer();
        String preUrl = "http://localhost:8080/jeecg-boot/";
        imgPattern = Pattern.compile("(?<=<img src=\")"+UpLoadUtil.IMG_PRE);
        matcher = imgPattern.matcher("<p><img src=\"baseUrl/user/20191024/damu/1571887545610.jpg\" alt=\"\" width=\"650\" height=\"366\" /><img src=\"baseUrl/user/20191024/damu/1571891981499.png\" alt=\"\" /></p>");
        while (matcher.find()) {
            matcher.appendReplacement(sbr, preUrl);
        }

        matcher.appendTail(sbr);
        System.out.println(sbr);

        /*Pattern imgPattern = Pattern.compile("(?<=<img src=\""+IMG_PRE+")([/|0-9a-z]+?)\\.(jpeg|png|gif|jpg|bmp)");
        Matcher matcher = imgPattern.matcher("<p><img src=\"baseUrl/user/20191024/damu/1571887545610jpg.jpg\" alt=\"\" width=\"650\" height=\"366\" /><img src=\"baseUrl/user/20191024/damu/1571891981499.png\" alt=\"\" />123</p>");
        while (matcher.find()) {
            System.out.println(matcher.group(0));
        }*/
    }
}
