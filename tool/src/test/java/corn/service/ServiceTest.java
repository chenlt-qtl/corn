package corn.service;


import corn.Application;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;
import org.springframework.batch.core.JobParametersInvalidException;
import org.springframework.batch.core.repository.JobExecutionAlreadyRunningException;
import org.springframework.batch.core.repository.JobInstanceAlreadyCompleteException;
import org.springframework.batch.core.repository.JobRestartException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;


@RunWith(SpringRunner.class)
@SpringBootTest(classes = Application.class)
@WebAppConfiguration
@ActiveProfiles("prod")
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class ServiceTest {

    @Autowired
    NoteContentService noteContentService;

    @Autowired
    WordService wordService;

    @Autowired
    ArticleService articleService;

    @Autowired
    RestService restService;

    @Test
    public void backupImg() {
        //备份线上的图片到本地硬盘
        noteContentService.backupImg();
        System.out.println("OK");
    }

    @Test
    public void backupWordMp3() {
        //备份线上的图片到本地硬盘
        wordService.backupMp3();
        System.out.println("OK");
    }

    @Test
    public void backupArticle() {
        //备份线上的图片到本地硬盘
        articleService.backupArticle();
        System.out.println("OK");
    }
}
