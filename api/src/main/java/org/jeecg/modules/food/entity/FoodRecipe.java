package org.jeecg.modules.food.entity;

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
 * @Description: 食谱
 * @author： jeecg-boot
 * @date：   2023-01-30
 * @version： V1.0
 */
@Data
@TableName("food_recipe")
public class FoodRecipe implements Serializable {
    private static final long serialVersionUID = 1L;
    
	/**id*/
	@TableId(type = IdType.AUTO)
	private java.lang.Integer id;
	/**name*/
	@Excel(name = "name", width = 15)
	private java.lang.String name;
	/**img*/
	@Excel(name = "img", width = 15)
	private java.lang.String img;
	/**type*/
	@Excel(name = "type", width = 15)
	private java.lang.String type;
	/**content*/
	@Excel(name = "content", width = 15)
	private java.lang.Object content;
	/**status*/
	@Excel(name = "status", width = 15)
	private java.lang.Integer status;
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
