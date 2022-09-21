package corn.controller;

import corn.service.NoteContentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class NoteContentController {

    @Autowired
    NoteContentService noteContentService;

    @RequestMapping("/backup")
    public String backupImg(){

        try {
            noteContentService.runBackupImgJob();
        } catch (Exception e) {
            return "操作失败"+e.getMessage();
        }
        return "操作成功";
    }

    @RequestMapping("/clean")
    public String cleanContent(){

        noteContentService.removeUselessContent();

        return "操作成功";
    }
}
