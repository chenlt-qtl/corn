package org.jeecg.modules.note.model;

import org.jeecg.common.util.tree.TreeModel;
import org.jeecg.modules.note.entity.Note;

public class NoteTreeModel extends TreeModel<Note> {
	
    private static final long serialVersionUID = 1L;


    public NoteTreeModel(Note note) {
        super(note);
        this.setKey(note.getId());
        this.setTitle(note.getName());
        this.setParentId(note.getParentId());
    }

}
