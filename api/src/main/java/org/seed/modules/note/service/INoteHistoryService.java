package org.seed.modules.note.service;

import org.seed.modules.note.entity.NoteHistory;
import com.baomidou.mybatisplus.extension.service.IService;
import org.seed.modules.note.model.NoteModel;

/**
 * @Description: 历史记录
 * @author： jeecg-boot
 * @date：   2021-12-06
 * @version： V1.0
 */
public interface INoteHistoryService extends IService<NoteHistory> {

    void addHistory(NoteModel noteModel);
}
