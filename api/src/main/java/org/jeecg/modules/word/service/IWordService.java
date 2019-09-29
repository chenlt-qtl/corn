package org.jeecg.modules.word.service;

import org.jeecg.modules.word.entity.Word;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * @Description: word
 * @author： jeecg-boot
 * @date：   2019-08-22
 * @version： V1.0
 */
public interface IWordService extends IService<Word> {

    public void saveWord(Word word);

}
