package org.jeecg.modules.note.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.apache.commons.lang.StringUtils;
import org.jeecg.modules.note.entity.NoteOpenKeys;
import org.jeecg.modules.note.mapper.NoteOpenKeysMapper;
import org.jeecg.modules.note.model.NoteOpenKeyModel;
import org.jeecg.modules.note.service.INoteOpenKeysService;
import org.jeecg.modules.note.service.INoteService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

/**
 * @Description: 打开记录
 * @author： jeecg-boot
 * @date：   2019-07-10
 * @version： V1.0
 */
@Service
public class NoteOpenKeysServiceImpl extends ServiceImpl<NoteOpenKeysMapper, NoteOpenKeys> implements INoteOpenKeysService {
    @Resource
    private NoteOpenKeysMapper noteOpenKeysMapper;

    @Resource
    private INoteService noteService;

    @Override
    public NoteOpenKeys getByTopKey(String topKey,String createBy) {
        return noteOpenKeysMapper.getByTopKey(topKey,createBy);
    }

    @Override
    public NoteOpenKeyModel getOpenNote(String topKey, String createBy) {
        NoteOpenKeys noteOpenKeys = getByTopKey(topKey,createBy);
        if(noteOpenKeys!=null&& StringUtils.isNotBlank(noteOpenKeys.getOpenKeys())){
            NoteOpenKeyModel model = (NoteOpenKeyModel)noteOpenKeys;
            model.setOpenNotes(noteService.getByIds(noteOpenKeys.getOpenKeys().split(",")));
            return model;
        }else {
            return new NoteOpenKeyModel();
        }
    }
}
