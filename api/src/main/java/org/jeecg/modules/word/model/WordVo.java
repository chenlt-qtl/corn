package org.jeecg.modules.word.model;

import lombok.Data;
import org.apache.commons.beanutils.PropertyUtils;
import org.jeecg.common.util.UpLoadUtil;
import org.jeecg.modules.word.entity.IcibaSentence;
import org.jeecg.modules.word.entity.Sentence;
import org.jeecg.modules.word.entity.Word;
import org.jeecg.modules.word.entity.WordUser;

import java.util.List;

@Data
public class WordVo extends Word {

    public WordVo(Word word) throws Exception {
        PropertyUtils.copyProperties(this,word);
        this.setPhAnMp3(UpLoadUtil.dbToReal(word.getPhAnMp3()));

    }

    List<Sentence> sentences;

    List<IcibaSentence> icibaSentences;

    WordUser wordUserRel;
}
