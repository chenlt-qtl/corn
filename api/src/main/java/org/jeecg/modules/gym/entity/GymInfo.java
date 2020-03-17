package org.jeecg.modules.gym.entity;

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
 * @Description: test
 * @author： jeecg-boot
 * @date：   2020-02-28
 * @version： V1.0
 */
@Data
@TableName("gym_info")
public class GymInfo implements Serializable {
    private static final long serialVersionUID = 1L;
    
	/**id*/
	@TableId(type = IdType.UUID)
	private String id;
	/**classId*/
	@Excel(name = "classId", width = 15)
	private String classId;
	private String className;
	/**calorie*/
	@Excel(name = "calorie", width = 15)
	private Integer calorie;
	/**totalTime*/
	@Excel(name = "totalTime", width = 15)
	private Integer totalTime;
	private String comment;
	/**createTime*/
	@Excel(name = "createTime", width = 20, format = "yyyy-MM-dd HH:mm:ss")
	@JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
	private Date createTime;
	/**createBy*/
	@Excel(name = "createBy", width = 15)
	private String createBy;
	/**updateTime*/
	@Excel(name = "updateTime", width = 20, format = "yyyy-MM-dd HH:mm:ss")
	@JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
	private Date updateTime;
	/**updateBy*/
	@Excel(name = "updateBy", width = 15)
	private String updateBy;
	/**status*/
	@Excel(name = "status", width = 15)
	private String status;
}
