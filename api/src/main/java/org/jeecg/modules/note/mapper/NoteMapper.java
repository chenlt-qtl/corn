package org.jeecg.modules.note.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;
import org.jeecg.modules.note.entity.Note;
import org.jeecg.modules.system.entity.SysPermission;

import java.util.List;

/**
 * @Description: 笔记管理
 * @author： jeecg-boot
 * @date：   2019-04-23
 * @version： V1.0
 */
public interface NoteMapper extends BaseMapper<Note> {
    public List<Note> listNote(@Param("createBy") String createBy,@Param("parentId") String parentId);

    public List<Note> listChildNote(@Param("createBy") String createBy,@Param("parentId") String parentId);

}
