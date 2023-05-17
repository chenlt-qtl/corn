package org.seed.modules.note.controller;


import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;
import org.seed.common.api.vo.Result;
import org.seed.common.system.query.QueryGenerator;
import org.seed.common.util.BtoaEncode;
import org.seed.common.util.ResultUtils;
import org.seed.modules.note.entity.NoteHistory;
import org.seed.modules.note.service.INoteHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

/**
 * @Title: Controller
 * @Description: 历史记录
 * @author： jeecg-boot
 * @date： 2021-12-06
 * @version： V1.0
 */
@RestController
@RequestMapping("/noteHistory")
@Slf4j
public class NoteHistoryController {
    @Autowired
    private INoteHistoryService noteHistoryService;

    /**
     * 分页列表查询
     *
     * @param pageNo
     * @param pageSize
     * @param req
     * @return
     */
    @GetMapping("")
    public Result queryPageList(@RequestParam Long noteId,
                                @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
                                HttpServletRequest req) {
        QueryWrapper<NoteHistory> queryWrapper = new QueryWrapper();
        queryWrapper.select("id","create_time");

        queryWrapper.eq("note_id",noteId);
        Page<NoteHistory> page = new Page<NoteHistory>(pageNo, pageSize);
        IPage<NoteHistory> pageList = noteHistoryService.page(page, queryWrapper);
        return ResultUtils.okData(pageList);
    }

    /**
     * 添加
     *
     * @param noteHistory
     * @return
     */
    @PostMapping(value = "/add")
    public Result add(@RequestBody NoteHistory noteHistory) {
        try {
            noteHistoryService.save(noteHistory);
            return ResultUtils.ok();
        } catch (Exception e) {
            e.printStackTrace();
            log.info(e.getMessage());
            return ResultUtils.error(e.getMessage());
        }
    }

    /**
     * 编辑
     *
     * @param noteHistory
     * @return
     */
    @PutMapping(value = "/edit")
    public Result edit(@RequestBody NoteHistory noteHistory) {
        NoteHistory noteHistoryEntity = noteHistoryService.getById(noteHistory.getId());
        if (noteHistoryEntity == null) {
            return ResultUtils.error("未找到对应实体");
        } else {
            noteHistoryService.updateById(noteHistory);
            return ResultUtils.ok();
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
        NoteHistory noteHistory = noteHistoryService.getById(id);
        if (noteHistory == null) {
            return ResultUtils.error("未找到对应实体");
        } else {
            noteHistoryService.removeById(id);
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
    public Result queryById(@PathVariable(name = "id", required = true) Long id) {
        NoteHistory noteHistory = noteHistoryService.getById(id);
        if (noteHistory == null) {
            return ResultUtils.error("未找到对应实体");
        } else {
            noteHistory.setText(BtoaEncode.encryption(noteHistory.getText()));
            return ResultUtils.okData(noteHistory);
        }
    }

}
