package org.seed.modules.note.controller;

import lombok.extern.slf4j.Slf4j;
import org.seed.common.api.vo.Result;
import org.seed.common.util.ResultUtils;
import org.seed.modules.note.entity.NoteOpenHistory;
import org.seed.modules.note.service.INoteOpenHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * @Title: Controller
 * @Description: 打开历史
 * @author： jeecg-boot
 * @date： 2020-11-13
 * @version： V1.0
 */
@RestController
@RequestMapping("/note/openHistory")
@Slf4j
public class NoteOpenHistoryController {
    @Autowired
    private INoteOpenHistoryService noteOpenHistoryService;

    /**
     * 添加
     *
     * @param noteOpenHistory
     * @return
     */
    @PostMapping(value = "/add")
    public Result add(@RequestBody NoteOpenHistory noteOpenHistory) {
        noteOpenHistoryService.addHistory(noteOpenHistory);
        return ResultUtils.ok();
    }

    /**
     * 编辑
     *
     * @param noteOpenHistory
     * @return
     */
    @PutMapping(value = "/edit")
    public Result edit(@RequestBody NoteOpenHistory noteOpenHistory) {
        NoteOpenHistory noteOpenHistoryEntity = noteOpenHistoryService.getById(noteOpenHistory.getId());
        if (noteOpenHistoryEntity == null) {
            return ResultUtils.error("未找到对应实体");
        } else {
            noteOpenHistoryService.updateById(noteOpenHistory);
            return ResultUtils.ok();
        }
    }

    /**
     * 查询笔记数据
     *
     * @return
     */
    @GetMapping(value = "/query")
    public Result queryNotes() {
        return ResultUtils.okData(noteOpenHistoryService.queryNotes());
    }

}
