package org.seed.modules.word.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.jeecgframework.poi.excel.annotation.Excel;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;

/**
 * @Description: test
 * @author： jeecg-boot
 * @date：   2019-11-05
 * @version： V1.0
 */
@Data
@TableName("word_user_rel")
public class WordUser implements Serializable {
    private static final long serialVersionUID = 1L;
    
	/**id*/
	@TableId(type = IdType.AUTO)
	private Long id;
	/**userId*/
	@Excel(name = "user", width = 15)
	private java.lang.String user;
	/**wordId*/
	@Excel(name = "wordId", width = 15)
	private Long wordId;

	@Excel(name = "addFrom", width = 15)
	private Integer addFrom;
	/**familiarity*/
	@Excel(name = "familiarity", width = 15)
	private java.lang.Integer familiarity = 7;
	/**status*/
	@Excel(name = "status", width = 15)
	private java.lang.String status = "1";
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
