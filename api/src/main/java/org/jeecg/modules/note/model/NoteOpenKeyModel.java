package org.jeecg.modules.note.model;

import lombok.Data;
import org.jeecg.modules.note.entity.Note;
import org.jeecg.modules.note.entity.NoteOpenKeys;

import java.util.List;

@Data
public class NoteOpenKeyModel extends NoteOpenKeys {

    private static final long serialVersionUID = 1L;

    private List<NoteModel> openNotes;

}
