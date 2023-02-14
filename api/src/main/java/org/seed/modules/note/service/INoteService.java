package org.seed.modules.note.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import org.seed.modules.note.entity.Note;
import org.seed.modules.note.entity.NoteContent;
import org.seed.modules.note.model.NoteModel;
import org.seed.modules.note.model.NoteTreeModel;

import java.util.List;

/**
 * @Description: 笔记管理
 * @author： jeecg-boot
 * @date： 2019-04-23
 * @version： V1.0
 */
public interface INoteService extends IService<Note> {

    List<NoteModel> listNote(String createBy, String parentId, String isLeaf);

    List<NoteModel> getModelByIds(String[] ids);

    List<Note> getNameByIds(String[] ids);

    List<NoteTreeModel> queryTreeMenu(String createBy, String parentId, boolean withLeaf);

    void updateParent(Note note, String oldParents);

    void delete(String userName, String id);

    void setParentIds(Note note);

    void setParentNames(NoteModel note);

    boolean updateText(NoteModel note, NoteContent content);

    Note saveNote(NoteModel note);

    IPage<Note> pageSearchNote(String parentId, String searchStr, boolean withLeaf, int pageNo, int pageSize);

    IPage<Note> getNewest(int pageNo, int pageSize);
}
