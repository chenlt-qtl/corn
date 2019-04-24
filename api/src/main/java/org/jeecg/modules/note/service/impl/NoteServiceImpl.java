package org.jeecg.modules.note.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.jeecg.modules.note.entity.Note;
import org.jeecg.modules.note.mapper.NoteMapper;
import org.jeecg.modules.note.service.INoteService;
import org.springframework.stereotype.Service;

/**
 * @Description: 笔记管理
 * @author： jeecg-boot
 * @date：   2019-04-23
 * @version： V1.0
 */
@Service
public class NoteServiceImpl extends ServiceImpl<NoteMapper, Note> implements INoteService {

}
