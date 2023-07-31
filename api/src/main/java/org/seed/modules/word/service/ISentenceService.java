package org.seed.modules.word.service;

import org.apache.ibatis.annotations.Param;
import org.seed.modules.word.entity.Sentence;
import com.baomidou.mybatisplus.extension.service.IService;
import org.seed.modules.word.model.SentenceVo;

import java.util.List;

/**
 * @Description: word_sentence
 * @author： jeecg-boot
 * @date： 2019-08-22
 * @version： V1.0
 */
public interface ISentenceService extends IService<Sentence> {

    void saveSentences(Long articleId, int type, List<SentenceVo> sentences);

    List<Sentence> getSentencesByWord(@Param("wordName") String wordName);
}
