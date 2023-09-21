package org.seed.modules.note.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;
import org.seed.modules.note.entity.Note;

import java.util.List;

/**
 * @Description: 笔记管理
 * @author： jeecg-boot
 * @date： 2019-04-23
 * @version： V1.0
 */
public interface NoteMapper extends BaseMapper<Note> {

    List<Note> getChildren(@Param("parentId") Long parentId);
}
