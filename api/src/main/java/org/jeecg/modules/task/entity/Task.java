package org.jeecg.modules.task.entity;

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
	/**jiraNo*/
	@Excel(name = "jiraNo", width = 15)
	private java.lang.String jiraNo;
	/**jiraDesc*/
	@Excel(name = "jiraDesc", width = 15)
	private java.lang.String jiraDesc;
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

	/**dataChange*/
	@Excel(name = "dataChange", width = 15)
	private java.lang.String dataChange;

	/**importance*/
	@Excel(name = "importance", width = 15)
	private java.lang.String importance;

	/**lesson*/
	@Excel(name = "lesson", width = 15)
	private java.lang.String lesson;

	/**status*/
	@Excel(name = "status", width = 15)
	private Integer status;


	/**sprint*/
	@Excel(name = "sprint", width = 15)
	private Integer sprint;

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
