package org.jeecg.modules.word.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.jeecg.modules.word.entity.ArticleWordRel;
import org.jeecg.modules.word.entity.Word;
import org.jeecg.modules.word.mapper.ArticleWordRelMapper;
import org.jeecg.modules.word.service.IArticleWordRelService;
import org.jeecg.modules.word.service.IWordService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;

/**
 * @Description: word_sentence_word_rel
 * @author： jeecg-boot
 * @date：   2019-08-22
 * @version： V1.0
 */
@Service
public class ArticleWordRelServiceImpl extends ServiceImpl<ArticleWordRelMapper, ArticleWordRel> implements IArticleWordRelService {

    @Resource
    private ArticleWordRelMapper articleWordRelMapper;

    @Resource
    private IWordService wordService;

    @Override
    public void saveWords(String articleId,String[] addWordNames,String[] removeWordNames){
        if(removeWordNames.length>0) {
            articleWordRelMapper.removeByWordName(articleId, removeWordNames);//删除
        }
        if(addWordNames.length>0) {
            List<ArticleWordRel> list = new ArrayList<>();
            for (String wordName : addWordNames) {
                ArticleWordRel articleWordRel = new ArticleWordRel();
                articleWordRel.setArticleId(articleId);
                try {
                    Word word = wordService.getWord(wordName);
                    articleWordRel.setWordId(word.getId());
                    list.add(articleWordRel);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            saveBatch(list);//批量新增
        }
    }
}
