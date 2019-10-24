package org.jeecg.common.util;

import org.apache.shiro.SecurityUtils;
import org.jeecg.modules.system.entity.SysUser;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;

public class UpLoadUtil {

    public static String[] getFilePath(String uploadpath,String type){
        HttpServletRequest request = ((ServletRequestAttributes)RequestContextHolder.getRequestAttributes()).getRequest();

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
        String dbpath = bizPath + File.separator + fileName;
        if (dbpath.contains("\\")) {
            dbpath = dbpath.replace("\\", "/");
        }
        result[1] = dbpath;
        return result;
    }
}
