package org.seed.modules.word.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;
import org.seed.modules.word.entity.Sentence;

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
