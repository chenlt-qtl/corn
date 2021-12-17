package org.jeecg.modules.game.entity;

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
 * @Description: 关联
 * @author： jeecg-boot
 * @date：   2021-12-15
 * @version： V1.0
 */
@Data
@TableName("game_word_rel")
public class GameWordRel implements Serializable {
    private static final long serialVersionUID = 1L;
    
	/**id*/
	@TableId(type = IdType.UUID)
	private java.lang.String id;
	/**gameId*/
	@Excel(name = "gameId", width = 15)
	private java.lang.String gameId;
	/**level*/
	@Excel(name = "level", width = 15)
	private java.lang.Integer level;
	/**wordId*/
	@Excel(name = "wordId", width = 15)
	private java.lang.String wordId;
	/**createTime*/
	@Excel(name = "createTime", width = 20, format = "yyyy-MM-dd HH:mm:ss")
	@JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
	private java.util.Date createTime;
	/**createBy*/
	@Excel(name = "createBy", width = 15)
	private java.lang.String createBy;
}
