package org.jeecg.modules.word.service;

import org.jeecg.modules.word.entity.Sentence;
import com.baomidou.mybatisplus.extension.service.IService;
import org.jeecg.modules.word.model.SentenceVo;

import java.util.List;

/**
 * @Description: word_sentence
 * @author： jeecg-boot
 * @date：   2019-08-22
 * @version： V1.0
 */
public interface ISentenceService extends IService<Sentence> {

    void saveSentences(String articleId, List<SentenceVo> sentences);

}
