package corn.controller;

import corn.service.NoteContentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BatchController {

    @Autowired
    NoteContentService noteContentService;

    /**
     * 备份笔记
     * @return
     */
    @RequestMapping("/backup")
    public String backupImg(){

        try {
            noteContentService.runBackupImgJob();
        } catch (Exception e) {
            return "操作失败"+e.getMessage();
        }
        return "操作成功";
    }

    /**
     * 删除无用的content
     * @return
     */
    @RequestMapping("/clean")
    public String cleanContent(){

        noteContentService.removeUselessContent();

        return "操作成功";
    }

    /**
     * 创建note索引
     * @return
     */
    @RequestMapping("/index/note")
    public String createNoteIndex() {
        try {
            noteContentService.runCreateIndex();
        } catch (Exception e) {
            return "操作失败" + e.getMessage();
        }
        return "操作成功";
    }
}
