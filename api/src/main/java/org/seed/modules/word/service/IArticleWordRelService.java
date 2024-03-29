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

    void saveRels(Long articleId, int type, String[] addWordNames, String[] removeWordNames);

    void saveRels(Long articleId, String wordId);

    ArticleWordRel getRel(Long articleId, String wordId);

    void removeByWordNames(Long articleId, String[] wordNames);

    List<String> getRemoveWordIds(Long articleId, List<String> wordIds);

    void removeRelByArticle(Long articleId, String[] wordNames);

    void removeAricleRel(ArticleWordRel articleWordRel);
}
