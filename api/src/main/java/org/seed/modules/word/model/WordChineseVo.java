package org.seed.modules.word.model;

import lombok.Data;
import org.apache.commons.beanutils.PropertyUtils;
import org.seed.common.util.UpLoadUtil;
import org.seed.modules.word.entity.*;
import org.seed.modules.word.entity.WordChinese;

@Data
public class WordChineseVo extends WordChinese {

    public WordChineseVo(WordChinese wordChinese) throws Exception {
        PropertyUtils.copyProperties(this, wordChinese);
    }

    boolean relWithUser = false;

    boolean relWithArticle = false;

}
