package org.jeecg.modules.note.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;
import org.jeecg.modules.note.entity.Note;
import org.jeecg.modules.note.model.NoteModel;
import org.jeecg.modules.system.entity.SysPermission;

import java.util.List;

/**
 * @Description: 笔记管理
 * @author： jeecg-boot
 * @date：   2019-04-23
 * @version： V1.0
 */
public interface NoteMapper extends BaseMapper<Note> {
    /**
     * 只查询子note
     * @param createBy
     * @param parentId
     * @return
     */
    public List<Note> listSon(@Param("createBy") String createBy,@Param("parentId") String parentId);

    /**
     * 查询所有 包括自己
     * @param createBy
     * @param parentId
     * @return
     */
    public List<Note> listAllChildren(@Param("createBy") String createBy,@Param("parentId") String parentId,@Param("text") String text,@Param("detail") boolean detail);

    public List<Note> getNameByIds(@Param("ids") String[] ids);

    public List<NoteModel> getByIds(@Param("ids") String[] ids);

}
