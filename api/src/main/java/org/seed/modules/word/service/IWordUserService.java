package org.seed.modules.word.service;

import com.baomidou.mybatisplus.extension.service.IService;
import org.seed.modules.word.entity.WordUser;

import java.util.List;

/**
 * @Description: test
 * @author： jeecg-boot
 * @date：   2019-11-05
 * @version： V1.0
 */
public interface IWordUserService extends IService<WordUser> {

    void saveRel(Long wordId);

    WordUser getRel(Long wordId);

    void removeByWordIds(List<Long> wordIds);
}
