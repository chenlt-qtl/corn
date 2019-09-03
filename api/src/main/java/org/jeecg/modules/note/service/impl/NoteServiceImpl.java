package org.jeecg.modules.note.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.apache.shiro.SecurityUtils;
import org.jeecg.common.util.tree.TreeUtil;
import org.jeecg.modules.note.entity.Note;
import org.jeecg.modules.note.entity.NoteDelete;
import org.jeecg.modules.note.mapper.NoteMapper;
import org.jeecg.modules.note.model.NoteTreeModel;
import org.jeecg.modules.note.service.INoteDeleteService;
import org.jeecg.modules.note.service.INoteService;
import org.jeecg.modules.system.entity.SysUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.Date;
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

    @Autowired
    private INoteDeleteService noteDeleteService;

    @Override
    public List<Note> listNote(String createBy,String parentId) {
        return noteMapper.listSon(createBy,parentId);
    }

    @Override
    public List<Note> searchNote(String createBy,String parentId, String text) {
        return noteMapper.listAllChildren(createBy,parentId,text);
    }

    @Override
    public List<NoteTreeModel> queryTreeList(String createBy,String parentId) {
        String rootId = parentId;
        List<Note> list = noteMapper.listAllChildren(createBy,parentId,null);
        List<NoteTreeModel> treeList = new ArrayList<>();
        for(Note note:list){
            NoteTreeModel model = new NoteTreeModel(note);
            if(parentId.equals(model.getKey())){
                rootId = model.getParentId();
            }
            treeList.add(model);
        }
        // 调用wrapTreeDataToTreeList方法生成树状数据
        return TreeUtil.wrapTreeDataToTreeList(treeList,rootId);
    }

    public void delete(String userName, String id){
        List<String> deleteIds = new ArrayList<>();
        Date now = new Date();
        NoteDelete delete;

        List<Note> list = noteMapper.listAllChildren(userName,id,null);//子笔记
        list.add(getById(id));//自己
        for(Note child:list){
            deleteIds.add(child.getId());
            delete = new NoteDelete(child);
            delete.setUpdateBy(userName);
            delete.setUpdateTime(now);
            noteDeleteService.save(delete);
        }

        this.removeByIds(deleteIds);
    }
}
