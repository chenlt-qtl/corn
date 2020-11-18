package org.jeecg.modules.note.model;

import lombok.Data;
import org.jeecg.modules.note.entity.Note;
import org.springframework.beans.BeanUtils;


@Data
public class NoteModel extends Note {

    private static final long serialVersionUID = 1L;

    private java.lang.String parents;

    public NoteModel(){

    }
    public NoteModel(Note note){
        BeanUtils.copyProperties(note,this);
    }

}
