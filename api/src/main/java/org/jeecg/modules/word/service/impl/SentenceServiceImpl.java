package org.jeecg.modules.word.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.jeecg.common.exception.CornException;
import org.jeecg.common.util.UpLoadUtil;
import org.jeecg.modules.word.entity.Sentence;
import org.jeecg.modules.word.entity.SentenceWordRel;
import org.jeecg.modules.word.mapper.SentenceMapper;
import org.jeecg.modules.word.model.SentenceVo;
import org.jeecg.modules.word.service.ISentenceService;
import org.jeecg.modules.word.service.ISentenceWordRelService;
import org.jeecg.modules.word.service.IWordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
import java.util.Locale;

/**
 * @Description: word_sentence
 * @author： jeecg-boot
 * @date：   2019-08-22
 * @version： V1.0
 */
@Service
public class SentenceServiceImpl extends ServiceImpl<SentenceMapper, Sentence> implements ISentenceService {

    @Autowired
    private IWordService wordService;

    @Autowired
    private ISentenceWordRelService sentenceWordRelService;

    @Resource
    private SentenceMapper sentenceMapper;

    @Override
    public List<Sentence> getSentencesByWord(String wordName) {
        List<Sentence> sentences = sentenceMapper.getByWord(wordName.toLowerCase(Locale.ROOT));
        for(Sentence sentence:sentences){
            sentence.setMp3(UpLoadUtil.dbToReal(sentence.getMp3()));
            sentence.setPicture(UpLoadUtil.dbToReal(sentence.getPicture()));
        }
        return sentences;
    }

    public void saveSentences(String articleId, List<SentenceVo> sentences){

        if(sentences.size()==1&&sentences.get(0).getId()!=null){//修改
            SentenceVo sentenceVo = sentences.get(0);
            if(sentenceVo.getContent() == null){
                throw new CornException("内容不能为空");
            }
            Sentence sentence = getById(sentenceVo.getId());
            sentenceVo.transSentence(sentence);
            updateById(sentence);

            //清除旧的关联数据
            QueryWrapper<SentenceWordRel> wrapper = new QueryWrapper<>();
            wrapper.eq("sentence_id",sentenceVo.getId());
            sentenceWordRelService.remove(wrapper);

            wordService.saveWord(sentenceVo);
        }else{
            int i = 0;
            for (SentenceVo sentenceVo : sentences) {
                if(sentenceVo.getContent()==null){
                    throw new CornException("内容不能为空");
                }
                Sentence sentence = sentenceVo.toSentence();
                sentence.setArticleId(articleId);
                sentence.setIdx(++i);
                save(sentence);

                sentenceVo.setId(sentence.getId());
                wordService.saveWord(sentenceVo);
            }
        }


    }
}
