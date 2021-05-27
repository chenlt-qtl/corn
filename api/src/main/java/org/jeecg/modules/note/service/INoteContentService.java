package org.jeecg.modules.note.service;

import org.jeecg.modules.note.entity.NoteContent;
import com.baomidou.mybatisplus.extension.service.IService;
import org.jeecg.modules.note.model.NoteModel;

/**
 * @Description: 内容
 * @author： jeecg-boot
 * @date：   2021-05-19
 * @version： V1.0
 */
public interface INoteContentService extends IService<NoteContent> {

    public NoteContent addContent(NoteModel model);
}
