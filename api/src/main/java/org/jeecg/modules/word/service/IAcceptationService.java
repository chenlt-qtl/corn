package org.jeecg.modules.word.service;

import org.jeecg.modules.word.entity.Acceptation;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * @Description: acceptation
 * @author： jeecg-boot
 * @date：   2019-08-22
 * @version： V1.0
 */
public interface IAcceptationService extends IService<Acceptation> {

    String getByWord(String wordId);
}
