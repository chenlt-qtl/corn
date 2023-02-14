package org.seed.modules.note.service;

import com.baomidou.mybatisplus.extension.service.IService;
import org.seed.modules.note.entity.NoteOpenHistory;
import org.seed.modules.note.model.NoteModel;

import java.util.List;

/**
 * @Description: 打开历史
 * @author： jeecg-boot
 * @date：   2020-11-13
 * @version： V1.0
 */
public interface INoteOpenHistoryService extends IService<NoteOpenHistory> {

    /**
     * 增加history
     * @param history
     * @return
     */
    public NoteOpenHistory addHistory(NoteOpenHistory history);

    public List<NoteModel> queryNotes();
}
