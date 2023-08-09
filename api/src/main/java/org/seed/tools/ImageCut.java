package org.seed.tools;

import java.awt.*;
import java.awt.image.BufferedImage;

import java.io.File;

import java.io.FileInputStream;

import java.io.IOException;

import java.util.Iterator;

import javax.imageio.ImageIO;

import javax.imageio.ImageReadParam;

import javax.imageio.ImageReader;

import javax.imageio.stream.ImageInputStream;

/**
 * 图片裁剪
 */
public class ImageCut {

    public void cut(int x, int y, int width, int height, String srcpath, String subpath) throws IOException {//裁剪方法

        FileInputStream is = null;

        ImageInputStream iis = null;

        try {

            is = new FileInputStream(srcpath); //读取原始图片

            Iterator it = ImageIO.getImageReadersByFormatName("jpg"); //ImageReader声称能够解码指定格式

            ImageReader reader = (ImageReader) it.next();

            iis = ImageIO.createImageInputStream(is); //获取图片流

            reader.setInput(iis, true); //将iis标记为true（只向前搜索）意味着包含在输入源中的图像将只按顺序读取

            ImageReadParam param = reader.getDefaultReadParam(); //指定如何在输入时从 Java Image I/O框架的上下文中的流转换一幅图像或一组图像

            Rectangle rect = new Rectangle(x, y, width, height); //定义空间中的一个区域

            param.setSourceRegion(rect); //提供一个 BufferedImage，将其用作解码像素数据的目标。

            BufferedImage bi = reader.read(0, param); //读取索引imageIndex指定的对象

            ImageIO.write(bi, "png", new File(subpath)); //保存新图片

        } finally {

            if (is != null) {
                is.close();
            }
            if (iis != null) {
                iis.close();
            }

        }

    }

    public static void main(String[] args) throws IOException {

        ImageCut pc = new ImageCut();

        int j = 1;

        for (int i = 1; i <= 64; i++) {

            String name = "Page" + i;

            //图片1
            pc.cut(14, 9, 460, 698, "E:\\资料\\孩子\\英语\\词根\\原图片\\" + name + ".jpg",
                    "E:\\资料\\孩子\\英语\\词根\\图片\\" + (j++) + ".png");

            //图片2
            pc.cut(485, 9, 461, 698, "E:\\资料\\孩子\\英语\\词根\\原图片\\" + name + ".jpg",
                    "E:\\资料\\孩子\\英语\\词根\\图片\\" + (j++) + ".png");
        }
        System.out.println("ok");

    }
}
