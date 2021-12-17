package org.jeecg.modules.word.service;

import org.apache.ibatis.annotations.Param;
import org.jeecg.modules.word.entity.Sentence;
import com.baomidou.mybatisplus.extension.service.IService;
import org.jeecg.modules.word.model.SentenceVo;

import java.util.List;
import java.util.Map;

/**
 * @Description: word_sentence
 * @author： jeecg-boot
 * @date： 2019-08-22
 * @version： V1.0
 */
public interface ISentenceService extends IService<Sentence> {

    void saveSentences(String articleId, int type, List<SentenceVo> sentences);

    List<Sentence> getSentencesByWord(@Param("wordName") String wordName);
}
