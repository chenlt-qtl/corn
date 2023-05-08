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
    public List<NoteModel> getNoteModelByIds(String[] ids) {
        Collection<Note> notes = listByIds(Arrays.asList(ids));
        List<NoteModel> result = new ArrayList<>();
        for (Note note : notes) {
            NoteModel noteModel = new NoteModel(note);
            result.add(noteModel);
        }
        return result;
    }

    @Override
    public List<NoteTreeModel> queryTreeMenu(String createBy, Long parentId, boolean withLeaf) {

        QueryWrapper<Note> queryWrapper = new QueryWrapper();
        queryWrapper.select("id", "name", "parent_id", "is_leaf", "update_time");
        queryWrapper.eq("create_by", getUsername());
        queryWrapper.likeRight("parent_ids", parentId + "/");
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
            treeList.add(model);
        }
        // 调用wrapTreeDataToTreeList方法生成树状数据
        return TreeUtil.wrapTreeDataToTreeList(treeList, parentId, false);
    }

    @Override
    public boolean updateText(Note note, String text) {
        NoteContent content = noteContentService.getById(note.getContentId());
        content.setText(UpLoadUtil.parseText(uploadpath, text, content.getText()));
        noteContentService.saveOrUpdate(content);
        noteHistoryService.addHistory(new NoteModel(note, content));
        return updateById(note);
    }

    @Override
    public Note addNote(NoteModel note) {
        try {
            if (note.getIsLeaf()) {
                note.setText(UpLoadUtil.parseText(uploadpath, note.getText(), ""));
                NoteContent content = noteContentService.addContent(note);
                note.setContentId(content.getId());
            }
            Note obj = note.toNote();

            //设置parentIds
            Note parent = getById(obj.getParentId());
            if (parent == null) {
                throw new CornException("找不到父节点");
            }
            obj.setParentIds(parent.getParentIds() + obj.getParentId() + "/");

            save(obj);
            return obj;
        } catch (DataIntegrityViolationException e) {
            throw new CornException("笔记本目录最多只能60层!");
        }
    }

    @Override
    public IPage<Note> pageSearchNote(Long parentId, String searchStr, boolean withLeaf, int pageNo, int pageSize) {
        IPage<Note> result = new Page<>();

        Page<Note> page = new Page<>(pageNo, pageSize);
        QueryWrapper<Note> queryWrapper = new QueryWrapper();
        if (!withLeaf) {
            queryWrapper.eq("is_leaf", 1);
        }

        queryWrapper.like("parent_ids", parentId == 0L ? "0/%" : ("%/" + parentId + "/%"));
        queryWrapper.select("id", "name", "parent_id", "is_leaf");
        queryWrapper.eq("create_by", getUsername());

        if (StringUtils.isNotBlank(searchStr)) {
            queryWrapper.and(wrapper -> wrapper.like("name", searchStr).or()
                    .exists("select 1 from note_content  where note_content.id=note_info.content_id and note_content.text like '%" + searchStr + "%'"));
        }
        result = this.page(page, queryWrapper);

        return result;
    }

    @Transactional
    @Override
    public void delete(String userName, Note note) {
        List<Long> deleteNoteIds = new ArrayList<>();//要删除的note
        List<Long> deleteContentIds = new ArrayList<>();//对应的content
        List<NoteDelete> noteDeleteList = new ArrayList<>();//保存到删除历史表的数据

        //处理自己
        NoteModel model;
        deleteNoteIds.add(note.getId());
        if (note.getContentId() != null) {
            deleteContentIds.add(note.getContentId());
            NoteContent noteContent = noteContentService.getById(note.getContentId());
            model = new NoteModel(note, noteContent);
        } else {
            model = new NoteModel(note);
        }
        NoteDelete noteDelete = new NoteDelete(model);
        noteDeleteList.add(noteDelete);

        //处理孩子
        List<NoteModel> noteList = noteMapper.listAllChildrenDetail(userName, note.getParentIds()+note.getId()+"/");
        for (NoteModel noteModel : noteList) {
            deleteNoteIds.add(noteModel.getId());
            deleteContentIds.add(noteModel.getContentId());
            noteDelete = new NoteDelete(noteModel);
            noteDeleteList.add(noteDelete);
        }
        noteDeleteService.saveBatch(noteDeleteList);
        if (!deleteContentIds.isEmpty()) {
            noteContentService.removeByIds(deleteContentIds);
        }
        this.removeByIds(deleteNoteIds);
    }

    private String getUsername() {
        SysUser sysUser = (SysUser) SecurityUtils.getSubject().getPrincipal();
        return sysUser.getUsername();
    }

    @Override
    public boolean updateParent(Note note, Note parent) {
        String parentIds = parent.getParentIds() + parent.getId() + "/";


        List<Note> noteList = noteMapper.listAllChildren(getUsername(), note.getParentIds()+note.getId()+"/");

        for (Note child : noteList) {
            child.setParentIds(child.getParentIds().replace(note.getParentIds(), parentIds));
        }

        note.setParentId(parent.getId());
        note.setParentIds(parentIds);
        updateById(note);
        return updateBatchById(noteList);

    }
}
