package org.jeecg.modules.note.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.jeecg.common.exception.CornException;
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
import org.jeecg.modules.note.service.INoteHistoryService;
import org.jeecg.modules.note.service.INoteService;
import org.jeecg.modules.system.entity.SysUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.*;

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

    @Autowired
    private INoteHistoryService noteHistoryService;

    @Override
    public List<NoteModel> listNote(String createBy, String parentId) {
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
        }
        return list;
    }

    @Override
    public List<Note> getNameByIds(String[] ids) {
        return noteMapper.getNameByIds(ids);
    }

    @Override
    public List<NoteTreeModel> queryTreeMenu(String createBy, String parentId) {
        String rootId = parentId;

        QueryWrapper<Note> queryWrapper = new QueryWrapper();
        queryWrapper.select("id","name","parent_id","parent_ids","is_leaf");
        queryWrapper.eq("create_by", getUsername());
//        queryWrapper.eq("is_leaf",0);
        queryWrapper.orderByAsc("name");

        List<Note> list = list(queryWrapper);

        List<NoteTreeModel> treeList = new ArrayList<>();
        for (Note note : list) {
            NoteTreeModel model = new NoteTreeModel(note);
            model.encryption();//加密
            if (parentId.equals(model.getKey())) {
                rootId = model.getParentId();
            }
            treeList.add(model);
        }
        // 调用wrapTreeDataToTreeList方法生成树状数据
        return TreeUtil.wrapTreeDataToTreeList(treeList, rootId,false);
    }

    @Transactional
    @Override
    public void updateParent(Note note, String oldParents) {
        setParentIds(note);
        note.setUpdateBy(null);
        note.setUpdateTime(null);
        updateById(note);
        List<Note> list = noteMapper.listAllChildren(getUsername(), note.getId(), null, true);//子笔记
        for (Note child : list) {
            child.setParentIds(child.getParentIds().replace(oldParents, note.getParentIds()));
            updateById(child);
        }
    }


    public boolean updateText(NoteModel note, NoteContent content) {
        content.setText(UpLoadUtil.parseText(uploadpath, note.getText(), content.getText()));
        noteContentService.saveOrUpdate(content);
        noteHistoryService.addHistory(note);
        return saveOrUpdate(note.toNote());

    }

    public Note saveNote(NoteModel note) {
        try {
            if(note.getIsLeaf()) {
                note.setText(UpLoadUtil.parseText(uploadpath, note.getText(), ""));
                NoteContent content = noteContentService.addContent(note);
                note.setContentId(content.getId());
            }
            Note obj = note.toNote();
            save(obj);
            return obj;
        } catch (DataIntegrityViolationException e) {
            throw new CornException("笔记本目录最多只能60层!" + note.getParentIds());
        }
    }

    @Override
    public IPage<Map> searchNote(String searchStr, int pageNo, int pageSize) {
        IPage<Map> page = new Page<>();
        if(StringUtils.isBlank(searchStr)){
            page.setTotal(0l);
            page.setRecords(new ArrayList<>());
        }else {
            int offset = pageNo > 0 ? (pageNo - 1) * pageSize : 0;
            Integer count = noteMapper.getNoteCount(searchStr, getUsername());
            page.setTotal(count);

            List<Map> list = noteMapper.pageSearchNote(searchStr, getUsername(), pageSize, offset);
            page.setRecords(list);
        }
        return page;
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

    @Override
    public IPage<Note> getNewest(int pageNo, int pageSize) {

        QueryWrapper<Note> queryWrapper = new QueryWrapper();
        queryWrapper.eq("create_by", getUsername());
        queryWrapper.eq("is_leaf",1);
        queryWrapper.orderByDesc("update_time");

        Page<Note> page = new Page<Note>(pageNo, pageSize);
        return page(page, queryWrapper);
    }

    private String getUsername(){
        SysUser sysUser = (SysUser) SecurityUtils.getSubject().getPrincipal();
        return sysUser.getUsername();
    }
}
