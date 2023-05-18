package org.seed.modules.note.model;

import lombok.Data;
import org.seed.common.util.BtoaEncode;
import org.seed.common.util.tree.TreeModel;
import org.seed.modules.note.entity.Note;

import java.util.Date;

@Data
public class NoteTreeModel extends TreeModel<Note> {
	
    private static final long serialVersionUID = 1L;
    private Date updateTime;

    public NoteTreeModel(Note note) {
        this.setId(note.getId());
        this.setKey(note.getId().toString());
        this.setTitle(note.getName());
        this.setName(note.getName());
        this.setParentId(note.getParentId());
        this.setIsLeaf(note.getIsLeaf());
        this.setUpdateTime(note.getUpdateTime());
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
