package org.seed.tools;

import net.coobird.thumbnailator.Thumbnails;

import java.io.IOException;

/**
 * 图片压缩
 */
public class ImagePress {

    /**
     * 缩小图片，图片尺寸和大小都会变小
     * @param imagePath
     * @param newImagePath
     * @param scale
     * @throws IOException
     */
    public void press(String imagePath,String newImagePath,float scale) throws IOException {
        Thumbnails.of(imagePath)
                .scale(scale)
                .outputFormat("png")
                .toFile(newImagePath);
    }

    public static void main(String[] args) throws IOException {

        ImagePress imagePress = new ImagePress();
        int j = 1;
        for (int i = 1; i <= 128; i++) {
            imagePress.press("E:\\资料\\孩子\\英语\\词根\\图片\\" + (j) + ".png",
                    "E:\\资料\\孩子\\英语\\词根\\图片1\\" + (j++) + ".png", 0.7f);
        }
        System.out.println("OK");
    }
}
