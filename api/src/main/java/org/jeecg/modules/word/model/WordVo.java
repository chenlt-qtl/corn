package org.jeecg.modules.word.model;

import lombok.Data;
import org.apache.commons.beanutils.PropertyUtils;
import org.jeecg.modules.word.entity.IcibaSentence;
import org.jeecg.modules.word.entity.Sentence;
import org.jeecg.modules.word.entity.Word;
import org.jeecg.modules.word.entity.WordUser;

import java.util.List;

@Data
public class WordVo extends Word {

    public WordVo(Word word) throws Exception {
        PropertyUtils.copyProperties(this,word);
    }

    List<Sentence> sentences;

    List<IcibaSentence> icibaSentences;

    String acceptation;

    WordUser wordUserRel;
}
