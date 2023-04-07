package org.seed.modules.note.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.jeecgframework.poi.excel.annotation.Excel;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;

/**
 * @Description: 笔记管理
 * @author： chenlt
 * @date：   2019-04-23
 * @version： V1.0
 */
@Data
@TableName("note_info")
@Slf4j
public class Note implements Serializable {
    private static final long serialVersionUID = 1L;

	/**id*/
	@TableId(type = IdType.AUTO)
	private Long id;
	/**contentId*/
	@Excel(name = "contentId", width = 32)
	private Long contentId;
	/**name*/
	@Excel(name = "name", width = 15)
	private java.lang.String name;
	/**pId*/
	@Excel(name = "parentId", width = 15)
	private Long parentId;

	/**tag*/
	@Excel(name = "tag", width = 15)
	private java.lang.String tag;
	/**from*/
	@Excel(name = "source", width = 15)
	private java.lang.String source;

	@Excel(name = "isLeaf", width = 15)
	private Boolean isLeaf;
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
