package org.jeecg.modules.note.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.SecurityUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.util.UpLoadUtil;
import org.jeecg.modules.note.entity.Note;
import org.jeecg.modules.note.entity.NoteContent;
import org.jeecg.modules.note.model.NoteModel;
import org.jeecg.modules.note.model.NoteTreeModel;
import org.jeecg.modules.note.service.INoteContentService;
import org.jeecg.modules.note.service.INoteFavoriteService;
import org.jeecg.modules.note.service.INoteOpenHistoryService;
import org.jeecg.modules.note.service.INoteService;
import org.jeecg.modules.system.entity.SysUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

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
    private INoteOpenHistoryService noteOpenHistoryService;

    @Autowired
    private INoteContentService noteContentService;

    /**
     * 分页列表查询
     *
     * @param note
     * @param pageNo
     * @param pageSize
     * @param req
     * @return
     */
    @GetMapping(value = "/list")
    public Result<IPage<Note>> queryPageList(Note note,
                                             @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                             @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
                                             HttpServletRequest req) {
        Result<IPage<Note>> result = new Result<IPage<Note>>();
        QueryWrapper<Note> queryWrapper = QueryGenerator.initQueryWrapper(note, req.getParameterMap());
        Page<Note> page = new Page<Note>(pageNo, pageSize);
        IPage<Note> pageList = noteService.page(page, queryWrapper);
        result.setSuccess(true);
        result.setResult(pageList);
        return result;
    }


    /**
     * 分页列表查询
     *
     * @param searchStr
     * @param pageNo
     * @param pageSize
     * @return
     */
    @GetMapping(value = "/searchNote")
    public Result<IPage<Map>> pageSearchNote(@RequestParam String searchStr, @RequestParam Integer pageNo, @RequestParam Integer pageSize) {
        Result<IPage<Map>> result = new Result<IPage<Map>>();

        IPage<Map> pageList = noteService.searchNote(searchStr, pageNo, pageSize);
        result.setSuccess(true);
        result.setResult(pageList);
        return result;
    }

    /**
     * 查询笔记本(不分页)
     *
     * @param req
     * @return
     */
    @GetMapping(value = "/listNote")
    public Result<List> queryNote(String parentId, HttpServletRequest req) {
        Result<List> result = new Result<>();
        SysUser sysUser = (SysUser) SecurityUtils.getSubject().getPrincipal();
        try {
            List list;
            if (parentId.equals("favorate")) {//收藏夹
                list = noteFavoriteService.queryNotes(sysUser.getUsername());
            } else if (parentId.equals("open")) {//最近打开
                list = noteOpenHistoryService.queryNotes();
            } else {
                list = noteService.listNote(sysUser.getUsername(), parentId);
            }
            result.setResult(list);
            result.setSuccess(true);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    @RequestMapping(value = "/queryTreeList", method = RequestMethod.GET)
    public Result<List<NoteTreeModel>> queryTreeList(String parentId) {
        Result<List<NoteTreeModel>> result = new Result<>();
        SysUser sysUser = (SysUser) SecurityUtils.getSubject().getPrincipal();
        try {
            List<NoteTreeModel> list = noteService.queryTreeList(sysUser.getUsername(), parentId);
            result.setResult(list);
            result.setSuccess(true);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    /**
     * 添加
     *
     * @param note
     * @return
     */
    @PostMapping(value = "/add")
    public Result<Note> add(@RequestBody NoteModel note) {
        Result<Note> result = new Result<Note>();
        try {
            noteService.setParentIds(note);
            noteService.saveNote(note);
            result.setResult(note);
            result.success("添加成功！");
        } catch (Exception e) {
            e.printStackTrace();
            log.info(e.getMessage());
            result.error500("操作失败");
        }
        return result;
    }

    /**
     * 复制
     *
     * @return
     */
    @PostMapping(value = "/copy")
    public Result<Note> copy(@RequestBody NoteModel note) {
        Result<Note> result = new Result<Note>();
        try {
            Note parent = noteService.getById(note.getParentId());
            Note oldNote = noteService.getById(note.getId());
            NoteContent oldContent = noteContentService.getById(note.getContentId());
            NoteModel newNote = new NoteModel();
            newNote.setName(oldNote.getName() + "(1)");
            newNote.setText(oldContent.getText());
            newNote.setParentId(note.getParentId());
            newNote.setParentIds(parent.getParentIds() + "/" + note.getParentId());
            noteService.saveNote(newNote);
            result.setResult(newNote);
            result.success("复制成功！");
        } catch (Exception e) {
            e.printStackTrace();
            log.info(e.getMessage());
            result.error500("操作失败");
        }
        return result;
    }

    /**
     * 编辑
     *
     * @param note
     * @return
     */
    @PostMapping(value = "/updateTitle")
    public Result<Note> updateTitle(@RequestBody Note note) {
        Result<Note> result = new Result<Note>();
        Note noteEntity = noteService.getById(note.getId());
        if (noteEntity == null) {//新增
            noteService.setParentIds(note);
            noteService.saveNote(new NoteModel(note));

        } else {
            noteService.setParentIds(note);
            note.setUpdateBy(null);
            note.setUpdateTime(null);
            boolean ok = noteService.updateById(note);
        }
        result.setResult(note);
        result.success("保存成功!");
        return result;
    }

    /**
     * 编辑内容
     *
     * @param note
     * @return
     */
    @PostMapping(value = "/updateText")
    public Result<NoteModel> updateText(@RequestBody NoteModel note) {
        Result<NoteModel> result = new Result<NoteModel>();
        Note noteEntity = noteService.getById(note.getId());
        if (noteEntity == null) {//新增
            noteService.setParentIds(note);
            noteService.saveNote(note);
        } else {
            NoteContent content = noteContentService.getById(noteEntity.getContentId());
            noteService.setParentIds(note);
            note.setUpdateBy(null);
            note.setUpdateTime(null);
            boolean ok = noteService.updateText(note, content.getText());
            note.setText(UpLoadUtil.dbToReal(note.getText(), "html"));
            if (ok) {
                noteService.setParentNames(note);
            }
        }
        result.setResult(note);
        result.success("保存成功!");

        return result;
    }

    /**
     * 编辑
     *
     * @param note
     * @return
     */
    @PutMapping(value = "/updateParent")
    public Result<Note> updateParent(@RequestBody Note note) {
        Result<Note> result = new Result<Note>();
        Note noteEntity = noteService.getById(note.getId());
        if (noteEntity == null) {
            result.error500("未找到对应实体");
        } else {
            noteEntity.setParentId(note.getParentId());
            noteService.updateParent(noteEntity, noteEntity.getParentIds());
            result.setResult(note);
            result.success("修改成功!");
        }

        return result;
    }

    /**
     * 通过id删除
     *
     * @param id
     * @return
     */
    @DeleteMapping(value = "/delete")
    public Result<Note> delete(@RequestParam(name = "id", required = true) String id) {
        Result<Note> result = new Result<Note>();
        SysUser sysUser = (SysUser) SecurityUtils.getSubject().getPrincipal();

        noteService.delete(sysUser.getUsername(), id);
        result.success("删除成功!");
        return result;
    }

    /**
     * 批量删除
     *
     * @param ids
     * @return
     */
    @DeleteMapping(value = "/deleteBatch")
    public Result<Note> deleteBatch(@RequestParam(name = "ids", required = true) String ids) {
        Result<Note> result = new Result<Note>();
        if (ids == null || "".equals(ids.trim())) {
            result.error500("参数不识别！");
        } else {
            this.noteService.removeByIds(Arrays.asList(ids.split(",")));
            result.success("删除成功!");
        }
        return result;
    }

    /**
     * 通过id查询
     *
     * @param id
     * @return
     */
    @GetMapping(value = "/queryById")
    public Result<NoteModel> queryById(@RequestParam(name = "id", required = true) String id) {
        Result<NoteModel> result = new Result<NoteModel>();

        Note note = noteService.getById(id);

        if (note == null) {
            result.error500("未找到对应实体");
        } else {
            NoteContent content = noteContentService.getById(note.getContentId());
            NoteModel model = new NoteModel(note, content);

            noteService.setParentNames(model);//设置父节点名称
            model.setText(UpLoadUtil.dbToReal(content.getText(), "md"));
            result.setResult(model);
            result.setSuccess(true);
        }
        return result;
    }

    /**
     * 通过text查询
     *
     * @param text
     * @param parentId
     * @return
     */
    @GetMapping(value = "/queryByText")
    public Result<List> queryByText(String text, String parentId) {
        Result<List> result = new Result<List>();
        SysUser sysUser = (SysUser) SecurityUtils.getSubject().getPrincipal();
        List<Note> noteList = noteService.searchNote(sysUser.getUsername(), parentId, text);
        result.setResult(noteList);
        result.setSuccess(true);
        return result;
    }

}
