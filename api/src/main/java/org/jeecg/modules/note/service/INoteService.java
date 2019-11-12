package org.jeecg.modules.note.service;

import com.baomidou.mybatisplus.extension.service.IService;
import org.jeecg.modules.note.entity.Note;
import org.jeecg.modules.note.model.NoteTreeModel;

import java.util.List;

/**
 * @Description: 笔记管理
 * @author： jeecg-boot
 * @date：   2019-04-23
 * @version： V1.0
 */
public interface INoteService extends IService<Note> {

    List<Note> listNote(String createBy,String parentId);

    List<Note> searchNote(String createBy,String parentId,String text);

    List<Note> getByIds(String[] ids);

    List<NoteTreeModel> queryTreeList(String createBy ,String parentId);

    void updateParent(Note note,String oldParents) throws Exception;

    void delete(String userName, String id);

    void setParents(Note note);

    boolean updateNote(Note note,String oldText) throws Exception;

    boolean saveNote(Note note) throws Exception;
}
