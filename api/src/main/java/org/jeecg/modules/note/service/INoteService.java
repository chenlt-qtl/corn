package org.jeecg.modules.note.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import org.jeecg.modules.note.entity.Note;
import org.jeecg.modules.note.entity.NoteContent;
import org.jeecg.modules.note.model.NoteModel;
import org.jeecg.modules.note.model.NoteTreeModel;

import java.util.List;
import java.util.Map;

/**
 * @Description: 笔记管理
 * @author： jeecg-boot
 * @date： 2019-04-23
 * @version： V1.0
 */
public interface INoteService extends IService<Note> {

    List<NoteModel> listNote(String createBy, String parentId);

    List<Note> searchNote(String createBy, String parentId, String text);

    List<NoteModel> getModelByIds(String[] ids);

    List<Note> getNameByIds(String[] ids);

    List<NoteTreeModel> queryTreeMenu(String createBy, String parentId);

    void updateParent(Note note, String oldParents);

    void delete(String userName, String id);

    void setParentIds(Note note);

    void setParentNames(NoteModel note);

    boolean updateText(NoteModel note, NoteContent content);

    Note saveNote(NoteModel note);

    IPage<Map> searchNote(String searchStr, int pageNo, int pageSize);

    IPage<Note> getNewest(int pageNo, int pageSize);
}
