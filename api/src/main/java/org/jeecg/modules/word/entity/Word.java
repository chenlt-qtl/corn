package org.jeecg.modules.word.entity;

import java.io.Serializable;
import java.util.Date;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.format.annotation.DateTimeFormat;
import org.jeecgframework.poi.excel.annotation.Excel;

/**
 * @Description: word
 * @author： jeecg-boot
 * @date：   2019-08-22
 * @version： V1.0
 */
@Data
@TableName("word")
public class Word implements Serializable {
    private static final long serialVersionUID = 1L;
    
	/**id*/
	@TableId(type = IdType.UUID)
	private java.lang.String id;
	/**wordName*/
	@Excel(name = "wordName", width = 15)
	private java.lang.String wordName;
	/**phAm*/
	@Excel(name = "phAm", width = 15)
	private java.lang.String phAm;
	/**exchange*/
	@Excel(name = "exchange", width = 15)
	private java.lang.String exchange;
	/**parts*/
	@Excel(name = "parts", width = 15)
	private java.lang.String parts;
	/**phAnMp3*/
	@Excel(name = "phAnMp3", width = 15)
	private byte[] phAnMp3;
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
