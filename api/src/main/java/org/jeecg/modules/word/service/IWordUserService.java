package org.jeecg.modules.word.service;

import com.baomidou.mybatisplus.extension.service.IService;
import org.jeecg.modules.word.entity.WordUser;

import java.util.List;

/**
 * @Description: test
 * @author： jeecg-boot
 * @date：   2019-11-05
 * @version： V1.0
 */
public interface IWordUserService extends IService<WordUser> {

    void saveRel(String wordId);

    WordUser getRel(String wordId);

    void removeByWordIds(List<String> wordIds);
}
