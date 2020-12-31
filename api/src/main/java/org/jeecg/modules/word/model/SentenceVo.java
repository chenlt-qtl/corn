package org.jeecg.modules.word.model;

import lombok.Data;
import org.jeecg.common.util.UpLoadUtil;
import org.jeecg.modules.word.entity.Sentence;
import org.jeecg.modules.word.entity.Word;

import java.util.List;

@Data
public class SentenceVo extends Sentence{

    private List<Word> words;

    public Sentence toSentence(){
        Sentence sentence = new Sentence();
        sentence.setContent(this.getContent().trim());
        sentence.setPicture(UpLoadUtil.parseUrlToBase(this.getPicture(),""));
        sentence.setMp3(UpLoadUtil.parseUrlToBase(this.getMp3(),""));
        return sentence;
    }

    public void transSentence(Sentence sentence){
        sentence.setContent(this.getContent().trim());
        sentence.setPicture(UpLoadUtil.parseUrlToBase(this.getPicture(),""));
        sentence.setMp3(UpLoadUtil.parseUrlToBase(this.getMp3(),""));
    }
}
