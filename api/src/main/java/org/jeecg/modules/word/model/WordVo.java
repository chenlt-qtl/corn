package org.jeecg.modules.word.model;

import lombok.Data;
import org.jeecg.modules.word.entity.Sentence;
import org.jeecg.modules.word.entity.Word;

@Data
public class WordVo extends Word{
    private boolean selected;

    public Word getWord(){
        Word word = new Word();
        word.setWordName(getWordName());
        return word;
    }
}
