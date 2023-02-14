package org.seed.modules.gym.entity;

import java.io.Serializable;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.jeecgframework.poi.excel.annotation.Excel;

/**
 * @Description: test
 * @author： jeecg-boot
 * @date：   2020-02-28
 * @version： V1.0
 */
@Data
@TableName("gym_class")
@Slf4j
public class GymClass implements Serializable {
    private static final long serialVersionUID = 1L;

	/**id*/
	@TableId(type = IdType.UUID)
	private java.lang.String id;
	/**name*/
	@Excel(name = "name", width = 15)
	private java.lang.String name;

	@Excel(name = "type", width = 15)
	private java.lang.Integer type;
	/**tag*/
	@Excel(name = "tag", width = 15)
	private java.lang.String tag;
	/**img*/
	@Excel(name = "img", width = 15)
	private java.lang.String img;

	private Long lastingTime;
	/**url*/
	@Excel(name = "url", width = 15)
	private java.lang.String url;
	/**calorie*/
	@Excel(name = "calorie", width = 15)
	private java.lang.Integer calorie;
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
	/**status*/
	@Excel(name = "status", width = 15)
	private java.lang.String status;
}
