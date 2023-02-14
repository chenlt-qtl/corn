package org.seed.modules.word.model;

import lombok.Data;
import org.apache.commons.beanutils.PropertyUtils;
import org.seed.common.util.UpLoadUtil;
import org.seed.modules.word.entity.IcibaSentence;
import org.seed.modules.word.entity.Sentence;
import org.seed.modules.word.entity.Word;

import java.util.List;

@Data
public class WordVo extends Word {

    public WordVo(Word word) throws Exception {
        PropertyUtils.copyProperties(this, word);
        this.setPhAnMp3(UpLoadUtil.dbToReal(word.getPhAnMp3()));
    }

    boolean relWithUser = false;

    boolean relWithArticle = false;

    List<Sentence> sentences;

    List<IcibaSentence> icibaSentences;

}
