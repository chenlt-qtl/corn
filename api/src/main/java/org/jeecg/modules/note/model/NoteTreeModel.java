package org.jeecg.modules.note.model;

import org.jeecg.common.util.tree.TreeModel;
import org.jeecg.modules.note.entity.Note;

public class NoteTreeModel extends TreeModel<Note> {
	
    private static final long serialVersionUID = 1L;

    private String parentIds;

    public NoteTreeModel(Note note) {
        this.setParentIds(note.getParentIds());
        this.setKey(note.getId());
        this.setTitle(note.getName());
        this.setParentId(note.getParentId());
    }

    public String getParentIds() {
        return parentIds;
    }

    public void setParentIds(String parentIds) {
        this.parentIds = parentIds;
    }
}
