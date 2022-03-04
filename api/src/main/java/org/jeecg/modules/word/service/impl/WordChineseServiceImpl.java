package org.jeecg.modules.word.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.jeecg.common.exception.CornException;
import org.jeecg.modules.word.entity.Word;
import org.jeecg.modules.word.entity.WordChinese;
import org.jeecg.modules.word.mapper.WordChineseMapper;
import org.jeecg.modules.word.model.SentenceVo;
import org.jeecg.modules.word.service.IWordChineseService;
import org.jeecg.modules.word.util.ChineseWordUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @Description: 汉字
 * @author： jeecg-boot
 * @date： 2021-11-30
 * @version： V1.0
 */
@Service
public class WordChineseServiceImpl extends ServiceImpl<WordChineseMapper, WordChinese> implements IWordChineseService {

    @Resource
    private WordChineseMapper wordChineseMapper;


    @Override
    public WordChinese getWord(String wordName) {
        List<WordChinese> list = wordChineseMapper.selectByMap(new HashMap() {{
            this.put("word_name", wordName);
        }});
        WordChinese wordChinese = null;
        if (!list.isEmpty()) {
            wordChinese = list.get(0);//已存在数据库中
        } else {//查API
            try {
                wordChinese = ChineseWordUtils.getWordFromApi(wordName);
            } catch (Exception e) {
                e.printStackTrace();
                throw new CornException("查询新华字典API失败");
            }
            if (wordChinese != null) {
                save(wordChinese);
            }
        }
        return wordChinese;
    }

    @Override
    public List<Map> searchWordByArticle(String articleId) {
        QueryWrapper<Map> wrapper = new QueryWrapper();
        wrapper.eq("article_id", articleId);
        List<Map> list = wordChineseMapper.seachWordByArticle(wrapper);
        return list;
    }

    @Override
    public void saveWord(SentenceVo sentenceVo) {
        if (sentenceVo.getWords() != null && !sentenceVo.getWords().isEmpty()) {
            for (Word wordVo : sentenceVo.getWords()) {

                    getWord(wordVo.getWordName().toLowerCase());

            }
        }
    }
}
