package org.jeecg;

import org.jeecg.common.util.UpLoadUtil;
import org.jeecg.modules.demo.mock.MockController;
import org.jeecg.modules.demo.test.entity.JeecgDemo;
import org.jeecg.modules.demo.test.mapper.JeecgDemoMapper;
import org.jeecg.modules.demo.test.service.IJeecgDemoService;
import org.jeecg.modules.system.service.ISysDataLogService;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.annotation.Resource;
import java.util.List;

@RunWith(SpringRunner.class)
public class UpLoadUtilTest {


	@Test
	public void test() {
		testGetGymFilePath();
	}

	public void testGetGymFilePath() {

		String[] result = UpLoadUtil.getGymFilePath("G://upFiles",".mp4");
		System.out.println(result[0]);
		System.out.println(result[1]);
	}

}
