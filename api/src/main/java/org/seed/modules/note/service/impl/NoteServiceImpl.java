package org.seed.modules.note.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.seed.common.exception.CornException;
import org.seed.common.util.UpLoadUtil;
import org.seed.common.util.tree.TreeUtil;
import org.seed.modules.note.entity.Note;
import org.seed.modules.note.entity.NoteContent;
import org.seed.modules.note.entity.NoteDelete;
import org.seed.modules.note.mapper.NoteMapper;
import org.seed.modules.note.model.NoteModel;
import org.seed.modules.note.model.NoteTreeModel;
import org.seed.modules.note.service.INoteContentService;
import org.seed.modules.note.service.INoteDeleteService;
import org.seed.modules.note.service.INoteHistoryService;
import org.seed.modules.note.service.INoteService;
import org.seed.modules.system.entity.SysUser;
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
    public List<NoteModel> listNote(String createBy, String parentId, String isLeaf) {
        return noteMapper.listSon(createBy, parentId, isLeaf);
    }

    @Override
    public List<NoteModel> getModelByIds(String[] ids) {
        Collection<Note> notes = listByIds(Arrays.asList(ids));
        List<NoteModel> result = new ArrayList<>();
        for (Note note : notes) {
            NoteModel noteModel = new NoteModel(note);
            setParentNames(noteModel);
            result.add(noteModel);
        }
        return result;
    }

    @Override
    public List<Note> getNameByIds(String[] ids) {
        return noteMapper.getNameByIds(ids);
    }

    @Override
    public List<NoteTreeModel> queryTreeMenu(String createBy, String parentId, boolean withLeaf) {
        String rootId = parentId;

        QueryWrapper<Note> queryWrapper = new QueryWrapper();
        queryWrapper.select("id", "name", "parent_id", "parent_ids", "is_leaf");
        queryWrapper.eq("create_by", getUsername());
        queryWrapper.like("parent_ids", parentId);
        if (!withLeaf) {
            //不要叶子
            queryWrapper.eq("is_leaf", 0);
        }
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
        return TreeUtil.wrapTreeDataToTreeList(treeList, rootId, false);
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
            child.setParentIds(child.getParentIds().replaceFirst(oldParents, note.getParentIds()));
            updateById(child);
        }
    }

    @Override
    public boolean updateText(NoteModel note, NoteContent content) {
        content.setText(UpLoadUtil.parseText(uploadpath, note.getText(), content.getText()));
        noteContentService.saveOrUpdate(content);
        noteHistoryService.addHistory(note);
        return saveOrUpdate(note.toNote());

    }

    @Override
    public Note saveNote(NoteModel note) {
        try {
            if (note.getIsLeaf()) {
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
    public IPage<Note> pageSearchNote(String parentId, String searchStr, boolean withLeaf, int pageNo, int pageSize) {
        IPage<Note> result = new Page<>();
        if (StringUtils.isBlank(searchStr)) {
            result.setTotal(0L);
            result.setRecords(new ArrayList<>());
        } else {
            Page<Note> page = new Page<>(pageNo, pageSize);
            QueryWrapper<Note> queryWrapper = new QueryWrapper();
            if (!withLeaf) {
                queryWrapper.eq("is_leaf", 1);
            }
            if (StringUtils.isNotBlank(parentId)) {
                queryWrapper.eq("parent_id", parentId);
            }
            queryWrapper.select("id", "name", "parent_id", "parent_ids", "is_leaf");
            queryWrapper.eq("create_by", getUsername());
            queryWrapper.and(wrapper -> wrapper.like("name", searchStr).or()
                    .exists("select 1 from note_content  where note_content.id=note_info.content_id and note_content.text like '%" + searchStr + "%'"));
            result = this.page(page, queryWrapper);
        }
        return result;
    }

    @Transactional
    @Override
    public void delete(String userName, String id) {
        List<String> deleteNoteIds = new ArrayList<>();//要删除的note
        List<String> deleteContentIds = new ArrayList<>();//对应的content
        List<NoteDelete> noteDeleteList = new ArrayList<>();//保存到删除历史表的数据


        List<NoteModel> noteList = noteMapper.listAllChildrenDetail(userName, id);
        for (NoteModel noteModel : noteList) {
            deleteNoteIds.add(noteModel.getId());
            deleteContentIds.add(noteModel.getContentId());
            NoteDelete noteDelete = new NoteDelete(noteModel);
            noteDeleteList.add(noteDelete);
        }
        noteDeleteService.saveBatch(noteDeleteList);
        noteContentService.removeByIds(deleteContentIds);
        this.removeByIds(deleteNoteIds);
    }

    /**
     * 设置parentIds
     *
     * @param note
     */
    @Override
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
    @Override
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
        queryWrapper.eq("is_leaf", 1);
        queryWrapper.orderByDesc("update_time");

        Page<Note> page = new Page<Note>(pageNo, pageSize);
        return page(page, queryWrapper);
    }

    private String getUsername() {
        SysUser sysUser = (SysUser) SecurityUtils.getSubject().getPrincipal();
        return sysUser.getUsername();
    }
}
