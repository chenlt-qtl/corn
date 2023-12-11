package corn.utils;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.FileCopyUtils;

import java.io.*;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Component
public class ImgUtil {

    public static final String DB_PATH_PRE = "baseUrl/";

    @Value(value = "${corn.path.backup}")
    private String backupPath;

    @Value(value = "${corn.resourceUrl}")
    private String resource;

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

    public void saveFile(String path) throws IOException {

        //1.从resource中读取图片
        InputStream in = new URL(resource + path).openConnection().getInputStream();//创建连接、输入流

        //2.得到目标图片地址
        String realPath = backupPath + path;
        File file = new File(realPath);
        //3.已经存在的图片不处理
        if (file.exists()) {
            log.info("图片 {} 已存在", path);
            return;
        }
        //4.检查父文件夹是否存在
        if (!file.getParentFile().exists()) {
            file.getParentFile().mkdirs();
        }

        //5.输出到备份文件夹
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


    /**
     * 获取text包含的图片url
     *
     * @param text
     * @return
     */
    public static String[] getImgUrls(String text) {
        List<String> result = new ArrayList<>();
        Pattern imgPattern1 = Pattern.compile("(?<=<img src=\"" + DB_PATH_PRE + ")([/|0-9a-z]+?)\\.(jpeg|png|gif|jpg|bmp)");
        Matcher matcher1 = imgPattern1.matcher(text);
        while (matcher1.find()) {
            result.add(matcher1.group(0));
        }


        Pattern imgPattern2 = Pattern.compile("(?<=][(]" + DB_PATH_PRE + ")([/|0-9a-z_]+?)\\.(jpeg|png|gif|jpg|bmp)");
        Matcher matcher2 = imgPattern2.matcher(text);
        while (matcher2.find()) {
            result.add(matcher2.group(0));
        }

        return result.toArray(new String[]{});
    }

    private void createDir(File file) {
        if (!file.getParentFile().exists()) {
            file.getParentFile().mkdirs();
        }
    }
}
