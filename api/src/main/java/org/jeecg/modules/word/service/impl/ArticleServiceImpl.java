package org.jeecg.modules.word.service.impl;

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

    public Article saveNewWord(ArticalVo articalVo){
        Article article = articalVo.getArticle();
        articleMapper.insert(article);
        for(SentenceVo sentenceVo:articalVo.getSentences()){
            sentenceVo.setContent(sentenceVo.getContent().replaceAll(" "," "));
            if(StringUtils.isBlank(sentenceVo.getContent().trim())){
                continue;
            }
            Sentence sentence = sentenceVo.getSentence();
            sentence.setArticleId(article.getId());
            sentenceService.save(sentence);
            if(sentenceVo.getWords()!=null){
                for(WordVo wordVo:sentenceVo.getWords()){
                    if(wordVo.isSelected()) {
                        Word word = wordVo.getWord();
                        wordService.saveWord(word);
                        SentenceWordRel sentenceWordRel = new SentenceWordRel();
                        sentenceWordRel.setSentenceId(sentence.getId());
                        sentenceWordRel.setWordId(word.getId());
                        sentenceWordRelService.save(sentenceWordRel);
                    }
                }
            }
        }
        return articalVo;
    }
}
