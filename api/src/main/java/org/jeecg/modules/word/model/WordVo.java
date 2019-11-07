package org.jeecg.modules.word.model;

import lombok.Data;
import org.jeecg.modules.word.entity.Sentence;
import org.jeecg.modules.word.entity.Word;

@Data
public class WordVo extends Word{
    private boolean selected;
    public WordVo(String wordName){
        super(wordName);
    }
}
