package org.jeecg.modules.note.mapper;

import org.apache.ibatis.annotations.Param;
import org.jeecg.modules.note.entity.Note;
import org.jeecg.modules.note.entity.NoteOpenKeys;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

import java.util.List;

/**
 * @Description: 打开记录
 * @author： jeecg-boot
 * @date：   2019-07-10
 * @version： V1.0
 */
public interface NoteOpenKeysMapper extends BaseMapper<NoteOpenKeys> {

    public NoteOpenKeys getByTopKey(@Param("topKey") String topKey, @Param("createBy")String createBy);

}
