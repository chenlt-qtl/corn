package org.jeecg.modules.word.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;
import org.jeecg.modules.word.entity.Sentence;

import java.util.List;

/**
 * @Description: word_sentence
 * @author： jeecg-boot
 * @date：   2019-08-22
 * @version： V1.0
 */
public interface SentenceMapper extends BaseMapper<Sentence> {

    List<Sentence> getByWord(@Param("wordName") String wordName);
}
