package org.jeecg;

import org.jeecg.common.util.UpLoadUtil;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.junit4.SpringRunner;

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
