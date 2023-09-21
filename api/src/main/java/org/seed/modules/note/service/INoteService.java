package org.seed.modules.note.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import org.aspectj.weaver.ast.Not;
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

    List<NoteModel> getNoteModelByIds(String[] ids);

    List<NoteTreeModel> queryTreeMenu(String createBy, boolean withLeaf);

    void delete(String userName, Note note);

    boolean updateText(Note note, String text);

    Note addNote(NoteModel note);

    IPage<Note> pageSearchNote(Long parentId, String searchStr, boolean withLeaf, int pageNo, int pageSize);

    boolean updateParent(Note note, Note parent);
}
