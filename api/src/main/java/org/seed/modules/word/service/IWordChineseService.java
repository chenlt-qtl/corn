package org.seed.modules.word.service;

import com.baomidou.mybatisplus.extension.service.IService;
import org.seed.modules.word.entity.WordChinese;
import org.seed.modules.word.model.SentenceVo;

import java.util.List;
import java.util.Map;

/**
 * @Description: 汉字
 * @author： jeecg-boot
 * @date： 2021-11-30
 * @version： V1.0
 */
public interface IWordChineseService extends IService<WordChinese> {
    WordChinese getWord(String wordName);

    List<Map> searchWordByArticle(String articleId);

    void saveWord(SentenceVo sentenceVo);
}
