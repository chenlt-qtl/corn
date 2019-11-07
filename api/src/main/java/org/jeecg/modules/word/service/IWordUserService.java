package org.jeecg.modules.word.service;

import org.jeecg.modules.word.entity.WordUser;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * @Description: test
 * @author： jeecg-boot
 * @date：   2019-11-05
 * @version： V1.0
 */
public interface IWordUserService extends IService<WordUser> {

    void saveRel(String userName,String wordId);

}
