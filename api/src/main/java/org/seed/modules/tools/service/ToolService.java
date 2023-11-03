package org.seed.modules.tools.service;


import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.commons.lang3.StringUtils;
import org.seed.common.util.UpLoadUtil;
import org.seed.modules.note.entity.NoteContent;
import org.seed.modules.note.service.INoteContentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;

@Service
public class ToolService {

    @Autowired
    private INoteContentService noteContentService;

    @Value(value = "${jeecg.path.upload}")
    private String uploadpath;

    /**
     * 笔记里png格式的图片转成jpg
     */
    public void imageToJpg() throws IOException {

        Integer pageSize = 4;
        Long total = pageSize.longValue();
        Integer pageNo = 1;

        for (; total >= (pageNo * pageSize); pageNo++) {
            Page<NoteContent> page = new Page(pageNo, pageSize);
            QueryWrapper<NoteContent> queryWrapper = new QueryWrapper();
            queryWrapper.select("id", "text");
            queryWrapper.like("text", "图片.png");
            IPage<NoteContent> result = noteContentService.page(page, queryWrapper);

            for (NoteContent note : result.getRecords()) {
                String text = note.getText();
                String[] imgUrls = UpLoadUtil.getImgUrls(text, "a");
                boolean isChange = false;
                for (String url : imgUrls) {
                    String newUrl = savePngToJpg(url);
                    if (StringUtils.isNotBlank(newUrl)) {
                        text = text.replace("![图片.png](baseUrl/"+url+")", "![图片.jpg](baseUrl/"+newUrl+")");
                        isChange = true;
                    }
                }
                if(isChange) {
                    note.setText(text);
                    System.out.println("id:" + note.getId());
                    noteContentService.updateById(note);
                }
            }
            total = result.getTotal();
        }

    }

    private String savePngToJpg(String url) throws IOException {
        String oldUrl = uploadpath + File.separator + url;
        String newUrl = uploadpath + File.separator + url.toLowerCase().replace(".png", ".jpg");
        OutputStream out = null;
        try {
            BufferedImage image = ImageIO.read(new File(oldUrl));
            if(image != null) {
                out = new FileOutputStream(newUrl);
                BufferedImage jpgBufferedImage = new BufferedImage(
                        image.getWidth(), image.getHeight(), BufferedImage.TYPE_INT_RGB);
                jpgBufferedImage.createGraphics().drawImage(image, 0, 0, Color.WHITE, null);
                ImageIO.write(jpgBufferedImage, "jpg", out);
                return url.toLowerCase().replace(".png", ".jpg");
            }
        } catch (FileNotFoundException e) {

        } catch (IOException e) {

        } finally {
            if (out != null) {
                out.flush();
                out.close();
            }
        }
        return null;
    }
}
