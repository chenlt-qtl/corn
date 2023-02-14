package org.seed.modules.word.service;

import com.baomidou.mybatisplus.extension.service.IService;
import org.seed.modules.word.entity.ArticleWordRel;

import java.util.List;

/**
 * @Description: word_article_word_rel
 * @author： jeecg-boot
 * @date： 2019-08-22
 * @version： V1.0
 */
public interface IArticleWordRelService extends IService<ArticleWordRel> {

    void saveRels(String articleId, int type, String[] addWordNames, String[] removeWordNames);

    void saveRels(String articleId, String wordId);

    ArticleWordRel getRel(String articleId, String wordId);

    void removeByWordNames(String articleId, String[] wordNames);

    List<String> getRemoveWordIds(String articleId, List<String> wordIds);

    void removeRelByArticle(String articleId, String[] wordNames);

    void removeAricleRel(ArticleWordRel articleWordRel);
}
