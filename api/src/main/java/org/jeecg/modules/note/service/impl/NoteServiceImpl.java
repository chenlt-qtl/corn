package org.jeecg.modules.note.service.impl;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.jeecg.modules.note.entity.Note;
import org.jeecg.modules.note.mapper.NoteMapper;
import org.jeecg.modules.note.service.INoteService;
import org.jeecg.modules.system.mapper.SysPermissionMapper;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

/**
 * @Description: 笔记管理
 * @author： jeecg-boot
 * @date：   2019-04-23
 * @version： V1.0
 */
@Service
public class NoteServiceImpl extends ServiceImpl<NoteMapper, Note> implements INoteService {

    @Resource
    private NoteMapper noteMapper;

    @Override
    public List<Note> listNote(String createBy,String parentId) {
        return noteMapper.listNote(createBy,parentId);
    }
}
