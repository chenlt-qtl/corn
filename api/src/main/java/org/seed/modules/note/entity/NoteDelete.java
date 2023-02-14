package org.seed.modules.note.entity;

import java.io.Serializable;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.beans.BeanUtils;
import org.springframework.format.annotation.DateTimeFormat;
import org.jeecgframework.poi.excel.annotation.Excel;

/**
 * @Description: delete
 * @author： jeecg-boot
 * @date：   2019-07-09
 * @version： V1.0
 */
@Data
@TableName("note_info_delete")
public class NoteDelete implements Serializable {
    private static final long serialVersionUID = 1L;
    
	/**id*/
	@TableId(type = IdType.UUID)
	private java.lang.String id;
	/**noteId*/
	@Excel(name = "noteId", width = 15)
	private java.lang.String noteId;
	/**name*/
	@Excel(name = "name", width = 15)
	private java.lang.String name;
	/**parentId*/
	@Excel(name = "parentId", width = 15)
	private java.lang.String parentId;
	/**parentIds*/
	@Excel(name = "parentIds", width = 15)
	private java.lang.String parentIds;
	/**text*/
	@Excel(name = "text", width = 15)
	private java.lang.Object text;
	/**tag*/
	@Excel(name = "tag", width = 15)
	private java.lang.String tag;
	/**source*/
	@Excel(name = "source", width = 15)
	private java.lang.String source;
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

	public NoteDelete(Note note){
		BeanUtils.copyProperties(note,this);
		this.setNoteId(note.getId());
		this.setId(null);
		this.setNoteId(note.getId());
	}
}
