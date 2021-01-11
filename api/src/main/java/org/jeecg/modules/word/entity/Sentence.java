package org.jeecg.modules.word.entity;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.jeecg.common.util.UpLoadUtil;
import org.springframework.format.annotation.DateTimeFormat;
import org.jeecgframework.poi.excel.annotation.Excel;

/**
 * @Description: word_sentence
 * @author： jeecg-boot
 * @date：   2019-08-22
 * @version： V1.0
 */
@Data
@TableName("word_sentence")
public class Sentence implements Serializable {
    private static final long serialVersionUID = 1L;
    
	/**id*/
	@TableId(type = IdType.UUID)
	private java.lang.String id;
	/**articleId*/
	@Excel(name = "articleId", width = 15)
	private java.lang.String articleId;
	/**content*/
	@Excel(name = "content", width = 15)
	private java.lang.String content;

	@Excel(name = "mp3", width = 15)
	private java.lang.String mp3;

	@Excel(name = "picture", width = 15)
	private java.lang.String picture;

	@Excel(name = "idx", width = 15)
	private int idx;
	/**status*/
	@Excel(name = "status", width = 15)
	private java.lang.String status;
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
