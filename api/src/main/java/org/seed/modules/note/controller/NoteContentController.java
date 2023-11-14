package org.seed.modules.note.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.seed.common.api.vo.Result;
import org.seed.common.system.query.QueryGenerator;
import org.seed.common.util.BtoaEncode;
import org.seed.common.util.ResultUtils;
import org.seed.common.util.UpLoadUtil;
import org.seed.modules.game.entity.Game;
import org.seed.modules.game.entity.GameWordRel;
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

import java.io.UnsupportedEncodingException;
import java.util.List;

@RestController
@RequestMapping("/noteContent")
@Slf4j
public class NoteContentController {

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
    @GetMapping
    public Result pageSearchContent(@RequestParam String searchStr, @RequestParam Integer pageNo, @RequestParam Integer pageSize) throws UnsupportedEncodingException {

        QueryWrapper<NoteContent> queryWrapper = new QueryWrapper();
        if (StringUtils.isNotBlank(searchStr)) {
            queryWrapper.like("text", searchStr);
        }
        Page<NoteContent> page = new Page(pageNo, pageSize);
        IPage<NoteContent> pageList = noteContentService.page(page, queryWrapper);
        for (NoteContent note : pageList.getRecords()) {
            if (note.getText() != null) {
                //加密名称
                note.setText(BtoaEncode.encryption(note.getText()));
            }
        }
        return ResultUtils.okData(pageList);
    }

}
