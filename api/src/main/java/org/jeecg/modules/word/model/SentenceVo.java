package org.jeecg.modules.word.model;

import lombok.Data;
import org.jeecg.modules.word.entity.Article;
import org.jeecg.modules.word.entity.Sentence;

import java.util.List;

@Data
public class SentenceVo extends Sentence{

    private List<WordVo> words;

    public Sentence getSentence(){
        Sentence sentence = new Sentence();
        sentence.setContent(getContent());
        return sentence;
    }
}
