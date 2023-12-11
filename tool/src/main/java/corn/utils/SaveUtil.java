package corn.utils;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.util.FileCopyUtils;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URL;
import java.net.URLConnection;

@Slf4j
public class SaveUtil {

    public static void saveFromUrl(String url,String backupPath){
        if(StringUtils.isNotBlank(url)){
            String newUrl = backupPath + url.substring(url.indexOf("/upload/")+7);
            OutputStream out = null;
            try {
                //如果文件夹不存在要创建
                File newFolder = new File(newUrl.substring(0, newUrl.lastIndexOf("/")));
                if (!newFolder.exists()) {
                    newFolder.mkdirs();
                }else{
                    //如果文件已存在则跳过
                    File newFile = new File(newUrl);
                    if(newFile.exists()){
                        return;
                    }
                }

                out = new FileOutputStream(newUrl);
                URL urlObj = new URL(url);
                URLConnection connection = urlObj.openConnection();
                connection.setConnectTimeout(5000); // 设置连接超时时间
                FileCopyUtils.copy(connection.getInputStream(), out);
                log.info("保存成功：{}", newUrl);
            } catch (IOException e) {
                if (out != null) {
                    try {
                        out.close();
                    } catch (IOException ex) {
                        ex.printStackTrace();
                    }
                }

            } finally {
            }
        }
    }
}
