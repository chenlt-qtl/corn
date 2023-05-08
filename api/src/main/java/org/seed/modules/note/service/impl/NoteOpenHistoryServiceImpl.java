package org.seed.modules.note.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.apache.shiro.SecurityUtils;
import org.seed.common.system.query.QueryGenerator;
import org.seed.modules.note.entity.NoteOpenHistory;
import org.seed.modules.note.mapper.NoteOpenHistoryMapper;
import org.seed.modules.note.model.NoteModel;
import org.seed.modules.note.service.INoteOpenHistoryService;
import org.seed.modules.note.service.INoteService;
import org.seed.modules.system.entity.SysUser;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;

/**
 * @Description: 打开历史
 * @author： jeecg-boot
 * @date：   2020-11-13
 * @version： V1.0
 */
@Service
public class NoteOpenHistoryServiceImpl extends ServiceImpl<NoteOpenHistoryMapper, NoteOpenHistory> implements INoteOpenHistoryService {

    @Resource
    private INoteService noteService;
    /**
     * 增加history
     * @param history
     * @return
     */
    @Override
    public NoteOpenHistory addHistory(NoteOpenHistory history){
        SysUser sysUser = (SysUser) SecurityUtils.getSubject().getPrincipal();
        history.setCreateBy(sysUser.getUsername());

        //删除旧数据
        NoteOpenHistory seachParam = new NoteOpenHistory();
        seachParam.setCreateBy(sysUser.getUsername());
        QueryWrapper<NoteOpenHistory> queryWrapper = QueryGenerator.initQueryWrapper(seachParam,null);
        this.remove(queryWrapper);

        this.save(history);
        return history;
    }

    @Override
    public List<NoteModel> queryNotes() {
        List<NoteModel> notes = new ArrayList<>();
        SysUser sysUser = (SysUser) SecurityUtils.getSubject().getPrincipal();

        NoteOpenHistory noteOpenHistory = new NoteOpenHistory();
        noteOpenHistory.setCreateBy(sysUser.getUsername());
        QueryWrapper<NoteOpenHistory> queryWrapper = QueryGenerator.initQueryWrapper(noteOpenHistory,null);

        List<NoteOpenHistory> list = this.list(queryWrapper);

        if(!list.isEmpty()) {
            NoteOpenHistory history = list.get(0);
            if(history.getOpenNoteIds() != null && history.getOpenNoteIds().length()>0){
                String[] noteIds = history.getOpenNoteIds().split(",");
                List<NoteModel> nodeList = noteService.getNoteModelByIds(noteIds);
                for(String noteId:noteIds) {
                    Integer index = null;
                    for (int i=0;i<nodeList.size();i++) {
                        NoteModel note = nodeList.get(i);
                        if(note.getId().equals(noteId)) {
                            notes.add(note);
                            index = i;
                            break;
                        }
                    }
                    if(index!=null){
                        nodeList.remove(index);
                    }
                }
            }
        }
        return notes;
    }
}
