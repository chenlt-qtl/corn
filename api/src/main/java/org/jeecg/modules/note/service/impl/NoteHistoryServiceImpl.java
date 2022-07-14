package org.jeecg.modules.note.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.apache.shiro.SecurityUtils;
import org.jeecg.modules.note.entity.NoteHistory;
import org.jeecg.modules.note.mapper.NoteHistoryMapper;
import org.jeecg.modules.note.model.NoteModel;
import org.jeecg.modules.note.service.INoteHistoryService;
import org.jeecg.modules.system.entity.SysUser;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import java.util.Date;
import java.util.List;

/**
 * @Description: 历史记录
 * @author： jeecg-boot
 * @date： 2021-12-06
 * @version： V1.0
 */
@Service
public class NoteHistoryServiceImpl extends ServiceImpl<NoteHistoryMapper, NoteHistory> implements INoteHistoryService {

    public static final int HISTORY_PERIOD = 1000 * 60 * 10; //10分钟

    @Override
    public void addHistory(NoteModel noteModel) {

        SysUser sysUser = (SysUser) SecurityUtils.getSubject().getPrincipal();
        QueryWrapper<NoteHistory> queryWrapper = new QueryWrapper();
        queryWrapper.eq("create_by", sysUser.getUsername());
        queryWrapper.eq("note_id", noteModel.getId());
        queryWrapper.orderByDesc("create_time");

        List<NoteHistory> list = this.list(queryWrapper);
        if (!list.isEmpty()) {
            NoteHistory history = list.get(0);

            if (System.currentTimeMillis() - history.getCreateTime().getTime() < HISTORY_PERIOD) {
                //间隔时间未到 不新增
                return;
            }
        }

        NoteHistory noteHistory = new NoteHistory();
        noteHistory.setNoteId(noteModel.getId());
        noteHistory.setText(noteModel.getText());
        save(noteHistory);
    }
}
