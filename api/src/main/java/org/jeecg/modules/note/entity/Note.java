package org.jeecg.modules.note.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.jeecg.common.exception.JeecgBootException;
import org.jeecg.common.util.Base64Utils;
import org.jeecg.common.util.UpLoadUtil;
import org.jeecgframework.poi.excel.annotation.Excel;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.io.Serializable;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * @Description: 笔记管理
 * @author： chenlt
 * @date：   2019-04-23
 * @version： V1.0
 */
@Data
@TableName("note_info")
@Slf4j
public class Note implements Serializable {
    private static final long serialVersionUID = 1L;
	private static final Pattern BASE64_PATTERN = Pattern.compile("data\\:image/(jpeg|png|gif|jpg|bmp);base64\\,(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?");


	/**
	 * 将base64图片存到硬盘
	 * 处理图片路径
	 * @param uploadPath
	 */
    public void preSave(String uploadPath,String oldText) throws Exception {
		StringBuffer sbr = new StringBuffer();
		//---------------处理旧的数据----------------
		HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
		log.info("============ContextPath:"+request.getContextPath());
		text = UpLoadUtil.parseOldImg(text,request.getContextPath());

		//---------------处理base64------------------
		Matcher matcher = BASE64_PATTERN.matcher(text);
		sbr = new StringBuffer();
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
		setText(newText);
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
	}

	/**id*/
	@TableId(type = IdType.UUID)
	private java.lang.String id;
	/**name*/
	@Excel(name = "name", width = 15)
	private java.lang.String name;
	/**pId*/
	@Excel(name = "parentId", width = 15)
	private java.lang.String parentId;
	/**pIds*/
	@Excel(name = "parentIds", width = 15)
	private java.lang.String parentIds;
	/**text*/
	@Excel(name = "text", width = 15)
	private java.lang.String text;
	/**tag*/
	@Excel(name = "tag", width = 15)
	private java.lang.String tag;
	/**from*/
	@Excel(name = "source", width = 15)
	private java.lang.String source;
	/**createTime*/
	@Excel(name = "createTime", width = 20, format = "yyyy-MM-dd HH:mm:ss")
	@JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
	private java.util.Date createTime;
	/**createBy*/
	@Excel(name = "createBy", width = 15)
	private java.lang.String createBy;
	/**updateTime*/
	@Excel(name = "updateTime", width = 20, format = "yyyy-MM-dd HH:mm:ss")
	@JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
	private java.util.Date updateTime;
	/**updateBy*/
	@Excel(name = "updateBy", width = 15)
	private java.lang.String updateBy;

}
