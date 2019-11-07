package org.jeecg.modules.word.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import org.jeecg.modules.word.entity.Word;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;
import java.util.Map;

/**
 * @Description: word
 * @author： jeecg-boot
 * @date：   2019-08-22
 * @version： V1.0
 */
public interface IWordService extends IService<Word> {

    public Word saveWord(String wordName) throws Exception;

    public IPage<Map> pageSearchWord(String wordName, int pageNo, int pageSize);

    public List<Map> searchWordByArticle(String articleId);
}
