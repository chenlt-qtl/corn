package org.jeecg.modules.word.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;
import org.jeecg.modules.word.entity.ArticleWordRel;

/**
 * @Description: word_article_word_rel
 * @author： jeecg-boot
 * @date：   2019-08-22
 * @version： V1.0
 */
public interface ArticleWordRelMapper extends BaseMapper<ArticleWordRel> {

    void removeByWordName(@Param("articleId") String articleId,@Param("removeWordNames") String[] removeWordNames);
}
