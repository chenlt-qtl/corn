package org.seed.modules.note.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import lombok.extern.slf4j.Slf4j;
import org.apache.lucene.queryparser.classic.ParseException;
import org.apache.lucene.search.highlight.InvalidTokenOffsetsException;
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
import org.seed.tool.service.LucenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
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

    @Autowired
    private LucenceService lucenceService;

    /**
     * 分页列表查询
     *
     * @param searchStr
     * @param pageNo
     * @param pageSize
     * @return
     */
    @GetMapping(value = "/pageSearchNote")
    public Result pageSearchNote(@RequestParam Long parentId, @RequestParam String searchStr, @RequestParam boolean withLeaf, @RequestParam Integer pageNo, @RequestParam Integer pageSize) throws ParseException, InvalidTokenOffsetsException, IOException {
//        IPage<Note> pageList = noteService.pageSearchNote(parentId, searchStr, withLeaf, pageNo, pageSize);
        List<Note> list = lucenceService.searchNote(searchStr);
        for (Note note : list) {
            if (note.getName() != null) {
                //加密名称
                note.setName(BtoaEncode.encryption(note.getName()));
            }
        }
        return ResultUtils.okData(list);
    }

    /**
     * 查询树目录
     *
     * @param withLeaf
     * @return
     */
    @RequestMapping(value = "/queryTreeMenu", method = RequestMethod.GET)
    public Result queryTree(boolean withLeaf) {
        SysUser sysUser = (SysUser) SecurityUtils.getSubject().getPrincipal();
        List<NoteTreeModel> list = noteService.queryTreeMenu(sysUser.getUsername(), withLeaf);
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
        note.setName(BtoaEncode.decrypt(note.getName()));
        Note newNote = noteService.addNote(note);
        NoteModel result = new NoteModel(newNote);
        result.encryption();
        return ResultUtils.okData(result);
    }

    /**
     * 编辑
     *
     * @param note
     * @return
     */
    @PostMapping(value = "/updateTitle/{id}")
    public Result updateTitle(@RequestBody NoteModel note, @PathVariable Long id) {
        Note noteEntity = noteService.getById(note.getId());
        if (noteEntity == null) {
            return ResultUtils.error("未找到对应实体");
        } else {
            noteEntity.setName(BtoaEncode.decrypt(note.getName()));
            noteService.updateById(noteEntity);
        }
        return ResultUtils.ok();
    }

    /**
     * 编辑内容
     *
     * @param note
     * @return
     */
    @PostMapping(value = "/updateText/{id}")
    public Result updateText(@RequestBody NoteModel note, @PathVariable Long id) {
        Note noteEntity = noteService.getById(id);
        if (noteEntity == null) {
            return ResultUtils.error("未找到对应实体");
        } else {
            String text = BtoaEncode.decrypt(note.getText());
            noteService.updateText(noteEntity, text);
            return ResultUtils.ok();
        }
    }

    /**
     * 更改父节点
     *
     * @return
     */
    @PutMapping(value = "/updateParent/{id}")
    public Result updateParent(@PathVariable Long id, @RequestParam Long parentId) {
        Note noteEntity = noteService.getById(id);
        if (noteEntity == null) {
            return ResultUtils.error("未找到对应实体");
        } else {
            Note parent = noteService.getById(parentId);
            if (noteEntity.getParentId().equals(parentId) || id.equals(parentId) || (parentId!= 0 && parent == null)) {
                return ResultUtils.error("父节点不合法");
            } else {
                noteService.updateParent(noteEntity, parentId);
                return ResultUtils.ok();
            }
        }

    }

    /**
     * 删除
     *
     * @param id
     * @return
     */
    @DeleteMapping(value = "/{id}")
    public Result delete(@PathVariable Long id) {
        Note noteEntity = noteService.getById(id);
        if (noteEntity == null) {
            return ResultUtils.error("未找到对应实体");
        } else {
            SysUser sysUser = (SysUser) SecurityUtils.getSubject().getPrincipal();
            noteService.delete(sysUser.getUsername(), noteEntity);
            return ResultUtils.ok();
        }
    }

    /**
     * 通过id查询
     *
     * @param id
     * @return
     */
    @GetMapping(value = "/{id}")
    public Result queryById(@PathVariable Long id) {

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
