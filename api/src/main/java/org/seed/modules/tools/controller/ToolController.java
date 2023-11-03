package org.seed.modules.tools.controller;


import lombok.extern.slf4j.Slf4j;
import org.seed.common.api.vo.Result;
import org.seed.common.util.ResultUtils;
import org.seed.modules.tools.service.ToolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/tool")
@Slf4j
public class ToolController {


    @Autowired
    private ToolService toolService;
    /**
     * PNG图片转成JPG
     * @return
     */
    @PostMapping(value = "/imageToJpg")
    public Result imageToJpg() throws IOException {
        toolService.imageToJpg();
        return ResultUtils.ok();
    }
}
