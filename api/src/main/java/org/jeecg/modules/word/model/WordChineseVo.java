package org.jeecg.modules.word.model;

import lombok.Data;
import org.apache.commons.beanutils.PropertyUtils;
import org.jeecg.common.util.UpLoadUtil;
import org.jeecg.modules.word.entity.*;

import java.util.List;

@Data
public class WordChineseVo extends WordChinese {

    public WordChineseVo(WordChinese wordChinese) throws Exception {
        PropertyUtils.copyProperties(this, wordChinese);
    }

    boolean relWithUser = false;

    boolean relWithArticle = false;

}
