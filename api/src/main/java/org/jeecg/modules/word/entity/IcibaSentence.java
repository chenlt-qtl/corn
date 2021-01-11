package org.jeecg.modules.word.entity;

import java.io.Serializable;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Date;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.format.annotation.DateTimeFormat;
import org.jeecgframework.poi.excel.annotation.Excel;

/**
 * @Description: iciba_sentence
 * @author： jeecg-boot
 * @date：   2019-08-22
 * @version： V1.0
 */
@Data
@TableName("word_iciba_sentence")
public class IcibaSentence implements Serializable {
    private static final long serialVersionUID = 1L;
    
	/**id*/
	@TableId(type = IdType.UUID)
	private java.lang.String id;
	/**wordId*/
	@Excel(name = "wordId", width = 15)
	private java.lang.String wordId;
	/**orig*/
	@Excel(name = "orig", width = 15)
	private java.lang.String orig;
	/**trans*/
	@Excel(name = "trans", width = 15)
	private java.lang.String trans;
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

	public String getOrig() {
		try {
			return URLDecoder.decode(orig, "utf-8");
		} catch (UnsupportedEncodingException e) {
			return "";
		}
	}

	public String getTrans()  {
		try {
			return URLDecoder.decode(trans, "utf-8");
		} catch (UnsupportedEncodingException e) {
			return "";
		}
	}
}
