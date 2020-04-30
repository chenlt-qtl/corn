package org.jeecg.modules.task.entity;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.format.annotation.DateTimeFormat;
import org.jeecgframework.poi.excel.annotation.Excel;

/**
 * @Description: 任务
 * @author： jeecg-boot
 * @date：   2019-12-10
 * @version： V1.0
 */
@Data
@TableName("task")
public class Task implements Serializable {
    private static final long serialVersionUID = 1L;

	/**id*/
	@TableId(type = IdType.UUID)
	private java.lang.String id;

	/**pId*/
	@Excel(name = "pId", width = 32)
	private java.lang.String pId;

	private java.lang.String pIds;

	/**title*/
	@Excel(name = "title", width = 15)
	private java.lang.String title;

	/**comment*/
	@Excel(name = "comment", width = 15)
	private java.lang.String comment;
	/**planTime*/
	@Excel(name = "planStartDate", width = 20, format = "yyyy-MM-dd")
	@JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd")
    @DateTimeFormat(pattern="yyyy-MM-dd")
	private java.util.Date planStartDate;

	/**workTime*/
	@Excel(name = "workTime", width = 15)
	private Float workTime;

	/**realTime*/
	@Excel(name = "realStartDate", width = 20, format = "yyyy-MM-dd")
	@JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd")
    @DateTimeFormat(pattern="yyyy-MM-dd")
	private java.util.Date realStartDate;

	/**importance*/
	@Excel(name = "importance", width = 15)
	private Integer importance;

	/**type*/
	@Excel(name = "type", width = 15)
	private Integer type;

	/**lesson*/
	@Excel(name = "lesson", width = 15)
	private java.lang.String lesson;

	/**status*/
	@Excel(name = "status", width = 15)
	private Integer status;

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

	private java.lang.String tag;

}
