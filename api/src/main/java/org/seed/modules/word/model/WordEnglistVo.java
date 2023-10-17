package org.seed.modules.word.model;

import lombok.Data;
import org.apache.commons.beanutils.PropertyUtils;
import org.seed.common.exception.CornException;
import org.seed.common.util.UpLoadUtil;
import org.seed.modules.word.entity.IcibaSentence;
import org.seed.modules.word.entity.Sentence;
import org.seed.modules.word.entity.WordEnglist;


import java.lang.reflect.InvocationTargetException;
import java.util.List;

@Data
public class WordEnglistVo extends WordEnglist {

    public WordEnglistVo(WordEnglist word) {
        try {
            PropertyUtils.copyProperties(this, word);
        } catch (Exception e) {
            throw new CornException(e.getMessage());
        }
        this.setPhAnMp3(UpLoadUtil.dbToReal(word.getPhAnMp3()));
    }

    boolean relWithUser = false;

    boolean relWithArticle = false;

    List<Sentence> sentences;

    List<IcibaSentence> icibaSentences;

}
