package org.seed.modules.note.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.SecurityUtils;
import org.seed.common.api.vo.Result;
import org.seed.common.util.BtoaEncode;
import org.seed.common.util.ResultUtils;
import org.seed.common.util.UpLoadUtil;
import org.seed.modules.note.entity.Note;
import org.seed.modules.note.entity.NoteContent;
import org.seed.modules.note.model.NoteModel;
import org.seed.modules.note.model.NoteTreeModel;
import org.seed.modules.note.service.INoteContentService;
import org.seed.modules.note.service.INoteFavoriteService;
import org.seed.modules.note.service.INoteService;
import org.seed.modules.system.entity.SysUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @Title: Controller
 * @Description: 笔记管理
 * @author： jeecg-boot
 * @date： 2019-04-23
 * @version： V1.0
 */
@RestController
@RequestMapping("/note")
@Slf4j
public class NoteController {
    @Autowired
    private INoteService noteService;

    @Autowired
    private INoteFavoriteService noteFavoriteService;

    @Autowired
    private INoteContentService noteContentService;


    /**
     * 分页列表查询
     *
     * @param searchStr
     * @param pageNo
     * @param pageSize
     * @return
     */
    @GetMapping(value = "/pageSearchNote")
    public Result pageSearchNote(@RequestParam String parentId, @RequestParam String searchStr, @RequestParam boolean withLeaf, @RequestParam Integer pageNo, @RequestParam Integer pageSize) {
        IPage<Note> pageList = noteService.pageSearchNote(parentId, searchStr, withLeaf, pageNo, pageSize);
        for (Note note : pageList.getRecords()) {
            if (note.getName() != null) {
                //加密名称
                note.setName(BtoaEncode.encryption(note.getName()));
            }
        }
        return ResultUtils.okData(pageList);
    }

    /**
     * 查询笔记本列表
     *
     * @return
     */
    @GetMapping(value = "/listNote")
    public Result queryNote(String parentId, String isLeaf) {
        SysUser sysUser = (SysUser) SecurityUtils.getSubject().getPrincipal();
        try {
            List<NoteModel> list = noteService.listNote(sysUser.getUsername(), parentId, isLeaf);

            for (NoteModel note : list) {
                note.encryption();
            }
            return ResultUtils.okData(list);
        } catch (Exception e) {
            e.printStackTrace();
            return ResultUtils.error(e.getMessage());
        }

    }

    /**
     * 查询最近笔记本
     *
     * @return
     */
    @GetMapping(value = "/queryNewest")
    public Result queryNewest(Integer pageNo, Integer pageSize) {

        if (pageNo == null) {
            pageNo = 0;
        }
        if (pageSize == null) {
            pageSize = 20;
        }
        IPage<Note> page = noteService.getNewest(pageNo, pageSize);

        for (Note note : page.getRecords()) {
            note.setName(BtoaEncode.encryption(note.getName()));
        }

        return ResultUtils.okData(page);
    }

    /**
     * 查询树目录
     *
     * @param parentId
     * @param withLeaf
     * @return
     */
    @RequestMapping(value = "/queryTreeMenu", method = RequestMethod.GET)
    public Result queryTree(Long parentId, boolean withLeaf) {
        SysUser sysUser = (SysUser) SecurityUtils.getSubject().getPrincipal();

        List<NoteTreeModel> list = noteService.queryTreeMenu(sysUser.getUsername(), parentId, withLeaf);
        return ResultUtils.okData(list);

    }

    /**
     * 添加
     *
     * @param note
     * @return
     */
    @PostMapping(value = "/add")
    public Result add(@RequestBody NoteModel note) {

        noteService.saveNote(note);
        return ResultUtils.okData(note.getId());

    }

    /**
     * 编辑
     *
     * @param note
     * @return
     */
    @PostMapping(value = "/updateTitle")
    public Result updateTitle(@RequestBody NoteModel note) {
        note.setName(BtoaEncode.decrypt(note.getName()));

        Note noteEntity = noteService.getById(note.getId());
        if (noteEntity == null) {//新增
            return ResultUtils.error("未找到对应实体");
        } else {
            note.setUpdateBy(null);
            note.setUpdateTime(null);
            noteService.updateById(note);
        }
        return ResultUtils.ok();
    }

    /**
     * 编辑内容
     *
     * @param note
     * @return
     */
    @PostMapping(value = "/updateText")
    public Result updateText(@RequestBody NoteModel note) {
        note.decrypt();

        Note noteEntity = noteService.getById(note.getId());
        if (noteEntity == null) {
            return ResultUtils.error("未找到对应实体");
        } else {
            NoteContent content = noteContentService.getById(noteEntity.getContentId());
            noteService.updateText(note, content);
            return ResultUtils.ok();
        }
    }

    /**
     * 编辑
     *
     * @param note
     * @return
     */
    @PutMapping(value = "/updateParent")
    public Result updateParent(@RequestBody Note note) {
        Note noteEntity = noteService.getById(note.getId());
        if (noteEntity == null) {
            return ResultUtils.error("未找到对应实体");
        } else {
            if (!noteEntity.getParentId().equals(note.getParentId()) && !note.getId().equals(note.getParentId())) {
                noteEntity.setParentId(note.getParentId());
                noteEntity.setUpdateBy(null);
                noteEntity.setUpdateTime(null);
                noteService.updateById(noteEntity);
                return ResultUtils.ok();
            } else {
                return ResultUtils.error("父节点不合法");
            }
        }

    }

    /**
     * 通过id删除
     *
     * @param id
     * @return
     */
    @DeleteMapping(value = "/delete")
    public Result delete(@RequestParam(name = "id", required = true) String id) {
        SysUser sysUser = (SysUser) SecurityUtils.getSubject().getPrincipal();

        noteService.delete(sysUser.getUsername(), id);
        return ResultUtils.ok();
    }

    /**
     * 通过id查询
     *
     * @param id
     * @return
     */
    @GetMapping(value = "/queryById")
    public Result queryById(@RequestParam(name = "id", required = true) String id) {

        Note note = noteService.getById(id);

        if (note == null) {
            return ResultUtils.error("未找到对应实体");
        } else {
            NoteContent content = noteContentService.getById(note.getContentId());
            NoteModel model = new NoteModel(note);

            if (content != null) {
                model.setText(UpLoadUtil.dbToReal(content.getText(), "md"));
            }
            model.setFav(noteFavoriteService.queryIfFavorite(id));
            model.encryption();
            return ResultUtils.okData(model);
        }
    }

}
