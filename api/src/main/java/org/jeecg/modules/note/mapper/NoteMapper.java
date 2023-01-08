package org.jeecg.modules.note.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;
import org.jeecg.modules.note.entity.Note;
import org.jeecg.modules.note.model.NoteModel;

import java.util.List;
import java.util.Map;

/**
 * @Description: 笔记管理
 * @author： jeecg-boot
 * @date： 2019-04-23
 * @version： V1.0
 */
public interface NoteMapper extends BaseMapper<Note> {
    /**
     * 只查询子note
     *
     * @param createBy
     * @param parentId
     * @return
     */
    public List<NoteModel> listSon(@Param("createBy") String createBy, @Param("parentId") String parentId, @Param("isLeaf") String isLeaf);

    /**
     * 查询所有 包括自己
     *
     * @param createBy
     * @param parentId
     * @return
     */
    public List<Note> listAllChildren(@Param("createBy") String createBy, @Param("parentId") String parentId, @Param("text") String text, @Param("detail") boolean detail);

    /**
     * 查询所有的note和text 包括自己
     *
     * @param createBy
     * @param parentId
     * @return
     */
    public List<NoteModel> listAllChildrenDetail(@Param("createBy") String createBy, @Param("parentId") String parentId);


    public List<Note> getNameByIds(@Param("ids") String[] ids);

    public List<Note> getByIds(@Param("ids") String[] ids);

    public Integer getNoteCount(@Param("searchStr") String searchStr, @Param("createBy") String createBy);

}
