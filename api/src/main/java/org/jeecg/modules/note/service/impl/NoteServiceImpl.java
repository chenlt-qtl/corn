package org.jeecg.modules.note.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.jeecg.common.util.tree.TreeModel;
import org.jeecg.common.util.tree.TreeUtil;
import org.jeecg.modules.note.entity.Note;
import org.jeecg.modules.note.mapper.NoteMapper;
import org.jeecg.modules.note.model.NoteTreeModel;
import org.jeecg.modules.note.service.INoteService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
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

    @Override
    public List<NoteTreeModel> queryTreeList(String createBy,String parentId) {
        List<Note> list = noteMapper.listChildNote(createBy,parentId);
        List<NoteTreeModel> treeList = new ArrayList<>();
        for(Note note:list){
            NoteTreeModel model = new NoteTreeModel(note);
            treeList.add(model);
        }
        // 调用wrapTreeDataToTreeList方法生成树状数据
        return TreeUtil.wrapTreeDataToTreeList(treeList,parentId);
    }
}
