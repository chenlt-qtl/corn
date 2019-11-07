package org.jeecg.modules.word.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.apache.commons.lang.StringUtils;
import org.jeecg.modules.word.entity.Article;
import org.jeecg.modules.word.entity.Sentence;
import org.jeecg.modules.word.entity.SentenceWordRel;
import org.jeecg.modules.word.entity.Word;
import org.jeecg.modules.word.mapper.ArticleMapper;
import org.jeecg.modules.word.model.ArticalVo;
import org.jeecg.modules.word.model.SentenceVo;
import org.jeecg.modules.word.model.WordVo;
import org.jeecg.modules.word.service.IArticleService;
import org.jeecg.modules.word.service.ISentenceService;
import org.jeecg.modules.word.service.ISentenceWordRelService;
import org.jeecg.modules.word.service.IWordService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;

/**
 * @Description: article
 * @author： jeecg-boot
 * @date：   2019-08-22
 * @version： V1.0
 */
@Service
public class ArticleServiceImpl extends ServiceImpl<ArticleMapper, Article> implements IArticleService {

    private final static Logger logger = LoggerFactory.getLogger(ArticleServiceImpl.class);

    @Resource
    private ArticleMapper articleMapper;

    @Autowired
    private ISentenceService sentenceService;

    @Autowired
    private IWordService wordService;

    @Autowired
    private ISentenceWordRelService sentenceWordRelService;

    public Article saveOrUpdate(ArticalVo articalVo){
        Article article = articalVo.getArticle();
        if(StringUtils.isBlank(article.getId())) {
            articleMapper.insert(article);
        }else {//修改
            articleMapper.updateById(article);
            QueryWrapper<Sentence> wrapper = new QueryWrapper<>();
            wrapper.eq("article_id",article.getId());
            List<Sentence> sentenceList = sentenceService.list(wrapper);

            List<String> sentenceIds = new ArrayList<>();
            sentenceList.forEach((sentence -> {
                sentenceIds.add(sentence.getId());
            }));

            QueryWrapper<SentenceWordRel> wrapper1 = new QueryWrapper<>();
            wrapper1.in("sentence_id",sentenceIds);
            sentenceWordRelService.remove(wrapper1);

            sentenceService.remove(wrapper);
        }
        int i = 0;
        for (SentenceVo sentenceVo : articalVo.getSentences()) {
            sentenceVo.setContent(sentenceVo.getContent().replaceAll(" ", " "));
            if (StringUtils.isBlank(sentenceVo.getContent().trim())) {
                continue;
            }
            Sentence sentence = sentenceVo.getSentence();
            sentence.setArticleId(article.getId());
            sentence.setIdx(++i);
            sentenceService.save(sentence);

            if (sentenceVo.getWords() != null) {
                for (WordVo wordVo : sentenceVo.getWords()) {
                    if (wordVo.isSelected()) {
                        Word word = null;
                        try {
                            word = wordService.saveWord(wordVo.getWordName().toLowerCase());
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                        if(word != null) {
                            SentenceWordRel sentenceWordRel = new SentenceWordRel();
                            sentenceWordRel.setSentenceId(sentence.getId());
                            sentenceWordRel.setWordId(word.getId());
                            sentenceWordRelService.save(sentenceWordRel);
                        }
                    }
                }
            }
        }
        return articalVo;
    }
}
