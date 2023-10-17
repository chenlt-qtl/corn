package org.seed.modules.word.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import org.seed.modules.word.entity.WordEnglist;
import org.seed.modules.word.model.SentenceVo;

import java.util.List;
import java.util.Map;

/**
 * @Description: word
 * @author： jeecg-boot
 * @date： 2019-08-22
 * @version： V1.0
 */
public interface IWordEnglistService extends IService<WordEnglist> {

    WordEnglist getWord(String wordName) ;

    IPage<Map> pageSearchWord(String wordName, int pageNo, int pageSize);

    List<Map> searchWordByArticle(String articleId);

    void saveWord(SentenceVo sentenceVo);

}
