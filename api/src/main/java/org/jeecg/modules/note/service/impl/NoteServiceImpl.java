package org.jeecg.modules.note.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.jeecg.common.exception.JeecgBootException;
import org.jeecg.common.util.UpLoadUtil;
import org.jeecg.common.util.tree.TreeUtil;
import org.jeecg.modules.note.entity.Note;
import org.jeecg.modules.note.entity.NoteContent;
import org.jeecg.modules.note.entity.NoteDelete;
import org.jeecg.modules.note.mapper.NoteMapper;
import org.jeecg.modules.note.model.NoteModel;
import org.jeecg.modules.note.model.NoteTreeModel;
import org.jeecg.modules.note.service.INoteContentService;
import org.jeecg.modules.note.service.INoteDeleteService;
import org.jeecg.modules.note.service.INoteService;
import org.jeecg.modules.system.entity.SysUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @Description: 笔记管理
 * @author： jeecg-boot
 * @date： 2019-04-23
 * @version： V1.0
 */
@Service
public class NoteServiceImpl extends ServiceImpl<NoteMapper, Note> implements INoteService {

    @Value(value = "${jeecg.path.upload}")
    private String uploadpath;

    @Resource
    private NoteMapper noteMapper;

    @Autowired
    private INoteDeleteService noteDeleteService;

    @Autowired
    private INoteContentService noteContentService;

    @Override
    public List<Note> listNote(String createBy, String parentId) {
        return noteMapper.listSon(createBy, parentId);
    }

    @Override
    public List<Note> searchNote(String createBy, String parentId, String text) {
        return noteMapper.listAllChildren(createBy, parentId, text, false);
    }

    @Override
    public List<NoteModel> getModelByIds(String[] ids) {
        List<NoteModel> list = noteMapper.getByIds(ids);
        for (NoteModel noteModel : list) {
            setParentNames(noteModel);
            noteModel.setText(UpLoadUtil.dbToReal(noteModel.getText(), "html"));
        }
        return list;
    }

    @Override
    public List<Note> getNameByIds(String[] ids) {
        return noteMapper.getNameByIds(ids);
    }

    @Override
    public List<NoteTreeModel> queryTreeList(String createBy, String parentId) {
        String rootId = parentId;
        List<Note> list = noteMapper.listAllChildren(createBy, parentId, null, false);
        List<NoteTreeModel> treeList = new ArrayList<>();
        for (Note note : list) {
            NoteTreeModel model = new NoteTreeModel(note);
            if (parentId.equals(model.getKey())) {
                rootId = model.getParentId();
            }
            treeList.add(model);
        }
        // 调用wrapTreeDataToTreeList方法生成树状数据
        return TreeUtil.wrapTreeDataToTreeList(treeList, rootId);
    }

    @Transactional
    @Override
    public void updateParent(Note note, String oldParents) {
        setParentIds(note);
        note.setUpdateBy(null);
        note.setUpdateTime(null);
        updateById(note);
        SysUser sysUser = (SysUser) SecurityUtils.getSubject().getPrincipal();
        List<Note> list = noteMapper.listAllChildren(sysUser.getUsername(), note.getId(), null, true);//子笔记
        for (Note child : list) {
            child.setParentIds(child.getParentIds().replace(oldParents, note.getParentIds()));
            updateById(child);
        }
    }


    public boolean updateText(NoteModel note, String oldNote) {
        note.setText(UpLoadUtil.parseText(uploadpath, note.getText(), oldNote));
        NoteContent content = noteContentService.addContent(note);
        note.setContentId(content.getId());
        return updateById(note);

    }

    public boolean saveNote(NoteModel note) {
        try {
            note.setText(UpLoadUtil.parseText(uploadpath, note.getText(), ""));
            NoteContent content = noteContentService.addContent(note);
            note.setContentId(content.getId());
            return save(note.getNote());
        } catch (DataIntegrityViolationException e) {
            throw new JeecgBootException("笔记本目录最多只能60层!" + note.getParentIds());
        }
    }

    public void delete(String userName, String id) {
        List<String> deleteIds = new ArrayList<>();
        Date now = new Date();
        NoteDelete delete;

        List<Note> list = noteMapper.listAllChildren(userName, id, null, true);//子笔记
        list.add(getById(id));//自己
        for (Note child : list) {
            deleteIds.add(child.getId());
            delete = new NoteDelete(child);
            delete.setUpdateBy(userName);
            delete.setUpdateTime(now);
            noteDeleteService.save(delete);
        }

        this.removeByIds(deleteIds);
    }

    /**
     * 设置parentIds
     *
     * @param note
     */
    public void setParentIds(Note note) {
        if (StringUtils.isBlank(note.getParentId()) || "0".equals(note.getParentId())) {
            note.setParentId("0");
            note.setParentIds("0");
        } else {
            Note parent = getById(note.getParentId());
            note.setParentIds(parent.getParentIds() + "/" + note.getParentId());
        }
    }

    /**
     * 设置parents
     *
     * @param note
     */
    public void setParentNames(NoteModel note) {
        String parentIds = note.getParentIds();
        String parents = "";
        if (parentIds != null) {
            String[] parentIdArr = parentIds.split("/");
            List<Note> parentNotes = this.getNameByIds(parentIdArr);
            for (Note parentNote : parentNotes) {
                parents += parents.length() > 0 ? "/" : "";
                parents += parentNote.getName();
            }
        }
        note.setParents(parents);
    }
}
