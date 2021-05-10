package org.jeecg.modules.note.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.jeecg.modules.note.entity.NoteFavorite;
import org.jeecg.modules.note.mapper.NoteFavoriteMapper;
import org.jeecg.modules.note.model.NoteModel;
import org.jeecg.modules.note.service.INoteFavoriteService;
import org.jeecg.modules.note.service.INoteService;
import org.jeecg.modules.system.entity.SysUser;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;

/**
 * @Description: 收藏夹
 * @author： jeecg-boot
 * @date：   2021-01-04
 * @version： V1.0
 */
@Service
public class NoteFavoriteServiceImpl extends ServiceImpl<NoteFavoriteMapper, NoteFavorite> implements INoteFavoriteService {

    @Resource
    private INoteService noteService;

    @Override
    public void edit(String noteIds){

        //删除旧的
        SysUser sysUser = (SysUser) SecurityUtils.getSubject().getPrincipal();
        QueryWrapper<NoteFavorite> queryWrapper = new QueryWrapper();
        queryWrapper.eq("create_by",sysUser.getUsername());
        this.remove(queryWrapper);

        //增加新的
        NoteFavorite noteFavorite = new NoteFavorite();
        noteFavorite.setNoteIds(noteIds);
        this.save(noteFavorite);
    }

    @Override
    public List<NoteModel> queryNotes(String username) {
        QueryWrapper<NoteFavorite> queryWrapper = new QueryWrapper();
        queryWrapper.eq("create_by",username);

        NoteFavorite noteFavorite = getOne(queryWrapper);
        if(noteFavorite != null){
            String noteIds = noteFavorite.getNoteIds();
            if(StringUtils.isNotBlank(noteIds)){
                return noteService.getModelByIds(noteIds.split(","));
            }
        }
        return new ArrayList<>();
    }
}
