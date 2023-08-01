package org.seed.modules.word.model;

import lombok.Data;
import org.seed.common.util.UpLoadUtil;
import org.seed.modules.word.entity.Sentence;
import org.seed.modules.word.entity.Word;

import java.util.List;

@Data
public class SentenceVo extends Sentence{

    private List<Word> words;

    public Sentence toSentence(){
        Sentence sentence = new Sentence();
        sentence.setContent(this.getContent().trim());
        sentence.setPicture(UpLoadUtil.realToDb(this.getPicture()));
        sentence.setMp3(UpLoadUtil.realToDb(this.getMp3()));
        sentence.setMp3Time(this.getMp3Time());
        return sentence;
    }

    public void transSentence(Sentence sentence){
        sentence.setContent(this.getContent().trim());
        sentence.setPicture(UpLoadUtil.realToDb(this.getPicture()));
        sentence.setMp3(UpLoadUtil.realToDb(this.getMp3()));
        sentence.setMp3Time(this.getMp3Time());
        sentence.setIdx(this.getIdx());
    }
}
