package org.seed.modules.word.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.jeecgframework.poi.excel.annotation.Excel;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

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

	@TableId(type = IdType.AUTO)
	private Long id;
	/**wordId*/
	@Excel(name = "wordId", width = 15)
	private Long wordId;
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
			orig = orig.replaceAll("%(?![0-9a-fA-F]{2})", "%25");
			return URLDecoder.decode(orig, "utf-8");
		} catch (UnsupportedEncodingException e) {
			return "";
		}
	}

	public String getTrans()  {
		try {
			trans = trans.replaceAll("%(?![0-9a-fA-F]{2})", "%25");
			return URLDecoder.decode(trans, "utf-8");
		} catch (UnsupportedEncodingException e) {
			return "";
		}
	}
}
