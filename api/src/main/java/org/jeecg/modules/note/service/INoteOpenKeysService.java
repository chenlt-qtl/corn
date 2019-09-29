package org.jeecg.modules.note.service;

import org.jeecg.modules.note.entity.Note;
import org.jeecg.modules.note.entity.NoteOpenKeys;
import com.baomidou.mybatisplus.extension.service.IService;
import org.jeecg.modules.note.model.NoteOpenKeyModel;

import java.util.List;
import java.util.Map;

/**
 * @Description: 打开记录
 * @author： jeecg-boot
 * @date：   2019-07-10
 * @version： V1.0
 */
public interface INoteOpenKeysService extends IService<NoteOpenKeys> {

    public NoteOpenKeys getByTopKey(String topKey,String createBy);

    public NoteOpenKeyModel getOpenNote(String topKey, String createBy);
}
