package org.seed.modules.word.entity;

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
 * @Description: 汉字
 * @author： jeecg-boot
 * @date：   2021-11-30
 * @version： V1.0
 */
@Data
@TableName("word_chinese")
public class WordChinese implements Serializable {
    private static final long serialVersionUID = 1L;
    
	/**id*/
	@TableId(type = IdType.UUID)
	private java.lang.String id;
	/**wordName*/
	@Excel(name = "wordName", width = 15)
	private java.lang.String wordName;
	/**pinYin*/
	@Excel(name = "pinYin", width = 15)
	private java.lang.String pinYin;
	/**biHuaShu*/
	@Excel(name = "biHuaShu", width = 15)
	private java.lang.Integer biHuaShu;
	/**buShou*/
	@Excel(name = "buShou", width = 15)
	private java.lang.String buShou;
	/**jieGou*/
	@Excel(name = "jieGou", width = 15)
	private java.lang.String jieGou;
	/**biShun*/
	@Excel(name = "biShun", width = 15)
	private java.lang.String biShun;
	/**wubi*/
	@Excel(name = "wubi", width = 15)
	private java.lang.String wubi;
	/**english*/
	@Excel(name = "english", width = 15)
	private java.lang.String english;
	private java.lang.String acceptation;
	private java.lang.String shortAcce;
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
