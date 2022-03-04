package org.jeecg.modules.note.model;

import org.jeecg.common.util.BtoaEncode;
import org.jeecg.common.util.tree.TreeModel;
import org.jeecg.modules.note.entity.Note;

public class NoteTreeModel extends TreeModel<Note> {
	
    private static final long serialVersionUID = 1L;

    private String parentIds;

    public NoteTreeModel(Note note) {
        this.setParentIds(note.getParentIds());
        this.setKey(note.getId());
        this.setTitle(note.getName());
        this.setName(note.getName());
        this.setParentId(note.getParentId());
        this.setIsLeaf(note.getIsLeaf());
    }

    public String getParentIds() {
        return parentIds;
    }

    public void setParentIds(String parentIds) {
        this.parentIds = parentIds;
    }


    public void decrypt() {
        this.setTitle(BtoaEncode.decrypt(this.getTitle()));
        this.setName(BtoaEncode.decrypt(this.getName()));
    }

    public void encryption() {
        this.setTitle(BtoaEncode.encryption(this.getTitle()));
        this.setName(BtoaEncode.encryption(this.getName()));
    }
}
