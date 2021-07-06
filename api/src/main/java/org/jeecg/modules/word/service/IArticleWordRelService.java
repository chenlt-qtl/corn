package org.jeecg.modules.word.service;

import com.baomidou.mybatisplus.extension.service.IService;
import org.jeecg.modules.word.entity.ArticleWordRel;

/**
 * @Description: word_article_word_rel
 * @author： jeecg-boot
 * @date：   2019-08-22
 * @version： V1.0
 */
public interface IArticleWordRelService extends IService<ArticleWordRel> {
    void saveWords(String articleId,String[] addWordNames,String[] removeWordNames);

    ArticleWordRel getRel(String articleId,String wordId);
}
