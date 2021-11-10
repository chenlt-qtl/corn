package org.jeecg.modules.note.model;

import lombok.Data;
import org.jeecg.modules.note.entity.Note;
import org.jeecg.modules.note.entity.NoteContent;
import org.springframework.beans.BeanUtils;


@Data
public class NoteModel extends Note {

    private static final long serialVersionUID = 1L;

    private java.lang.String parents;
    private java.lang.String text;
    private boolean isFav;

    public NoteModel(){

    }
    public NoteModel(Note note, NoteContent content){
        BeanUtils.copyProperties(note,this);
        if(content!=null) {
            this.setText(content.getText());
        }
    }

    public NoteModel(Note note){
        BeanUtils.copyProperties(note,this);
    }
    public Note getNote(){
        Note note = new Note();
        BeanUtils.copyProperties(this,note);
        return note;
    }

}
