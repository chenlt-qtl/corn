package org.seed.modules.tools.service;

import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;
import org.seed.SeedApplication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import java.io.IOException;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = SeedApplication.class)
@WebAppConfiguration
@ActiveProfiles("dev")
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class ToolServiceTest {

    @Autowired
    ToolService toolService;

    @Test
    public void imageToJpg() throws IOException {
        toolService.imageToJpg();
        System.out.println("ok");
    }
}
