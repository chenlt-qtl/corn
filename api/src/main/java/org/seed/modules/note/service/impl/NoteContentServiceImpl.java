package org.seed.modules.note.service.impl;

import org.seed.modules.note.entity.NoteContent;
import org.seed.modules.note.mapper.NoteContentMapper;
import org.seed.modules.note.model.NoteModel;
import org.seed.modules.note.service.INoteContentService;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

/**
 * @Description: 内容
 * @author： jeecg-boot
 * @date：   2021-05-19
 * @version： V1.0
 */
@Service
public class NoteContentServiceImpl extends ServiceImpl<NoteContentMapper, NoteContent> implements INoteContentService {

    @Override
    public NoteContent addContent(NoteModel model) {
        NoteContent content = new NoteContent();
        content.setText(model.getText());
        this.save(content);
        return content;
    }

}
