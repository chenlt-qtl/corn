package org.seed.tool.controller;


import lombok.extern.slf4j.Slf4j;
import org.apache.lucene.queryparser.classic.ParseException;
import org.apache.lucene.search.highlight.InvalidTokenOffsetsException;
import org.seed.common.api.vo.Result;
import org.seed.common.util.ResultUtils;
import org.seed.modules.note.entity.Note;
import org.seed.tool.service.LucenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/tool/lucence")
@Slf4j
public class LucenceController {

    @Autowired
    private LucenceService  lucenceService;

    @GetMapping
    public Result search(String text) {
        try {
            List<Note> list = lucenceService.searchNote(text);
            return ResultUtils.okData(list);
        } catch (Exception e) {
            return ResultUtils.error(e.getMessage());
        }

    }


    @PostMapping("/note")
    public Result createNoteIndex() {
        //重新创建index
        try {
            lucenceService.createNoteIndex();
        } catch (IOException e) {
            return ResultUtils.error(e.getMessage());
        }
        return ResultUtils.okData("ok");
    }
}
