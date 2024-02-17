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
    public List<NoteTreeModel> queryTreeMenu(String createBy, boolean withLeaf) {

        QueryWrapper<Note> queryWrapper = new QueryWrapper();
        queryWrapper.select("id", "name", "parent_id", "is_leaf", "update_time");
        queryWrapper.eq("create_by", getUsername());
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
        return TreeUtil.wrapTreeDataToTreeList(treeList, 0L, false);
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
            save(obj);
            return obj;
        } catch (DataIntegrityViolationException e) {
            throw new CornException("笔记本目录最多只能60层!");
        }
    }

    @Override
    public IPage<Note> pageSearchNote(Long parentId, String searchStr, boolean withLeaf, int pageNo, int pageSize) {

        Page<Note> page = new Page<>(pageNo, pageSize);
        QueryWrapper<Note> queryWrapper = new QueryWrapper();
        if (!withLeaf) {
            queryWrapper.eq("is_leaf", 1);
        }

        queryWrapper.eq("parent_id", parentId);
        queryWrapper.select("id", "name", "parent_id", "is_leaf");
        queryWrapper.eq("create_by", getUsername());

        if (StringUtils.isNotBlank(searchStr)) {
            queryWrapper.and(wrapper -> wrapper.like("name", searchStr).or()
                    .exists("select 1 from note_content  where note_content.id=note_info.content_id and note_content.text like '%" + searchStr + "%'"));
        }
        IPage<Note> result = this.page(page, queryWrapper);

        return result;
    }

    @Transactional
    @Override
    public void delete(String userName, Note note) {

        //检查是否有子节点
        List<Note> children = noteMapper.getChildren(note.getId());
        if(!children.isEmpty()){
            throw new CornException("删除的文件夹有子文件，请先删除子文件");
        }

        //保存历史
        NoteModel model = new NoteModel(note);
        if (note.getContentId() != null) {
            NoteContent noteContent = noteContentService.getById(note.getContentId());
            model.setText(noteContent.getText());
        }
        noteDeleteService.save(new NoteDelete(model));

        //删除数据
        if (note.getContentId()!=null) {
            noteContentService.removeById(note.getContentId());
        }
        this.removeById(note.getId());
    }

    private String getUsername() {
        SysUser sysUser = (SysUser) SecurityUtils.getSubject().getPrincipal();
        return sysUser.getUsername();
    }

    @Override
    public boolean updateParent(Note note, Long parentId) {
        note.setParentId(parentId);
        return updateById(note);

    }
}
