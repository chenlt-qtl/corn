package org.jeecg.modules.word.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.apache.shiro.SecurityUtils;
import org.jeecg.modules.system.entity.SysUser;
import org.jeecg.modules.word.entity.ArticleWordRel;
import org.jeecg.modules.word.entity.Word;
import org.jeecg.modules.word.entity.WordUser;
import org.jeecg.modules.word.mapper.ArticleWordRelMapper;
import org.jeecg.modules.word.service.IArticleWordRelService;
import org.jeecg.modules.word.service.IWordService;
import org.jeecg.modules.word.service.IWordUserService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @Description: word_sentence_word_rel
 * @author： jeecg-boot
 * @date： 2019-08-22
 * @version： V1.0
 */
@Service
public class ArticleWordRelServiceImpl extends ServiceImpl<ArticleWordRelMapper, ArticleWordRel> implements IArticleWordRelService {

    @Resource
    private ArticleWordRelMapper articleWordRelMapper;

    @Resource
    private IWordUserService wordUserService;

    @Resource
    private IWordService wordService;

    @Override
    public void saveRels(String articleId, String[] addWordNames, String[] removeWordNames) {
        if (removeWordNames.length > 0) {
            removeRelByArticle(articleId, removeWordNames);//删除与文章、用户的关联
        }
        if (addWordNames.length > 0) {
            List<ArticleWordRel> awlist = new ArrayList<>();
            List<WordUser> wulist = new ArrayList<>();
            SysUser sysUser = (SysUser) SecurityUtils.getSubject().getPrincipal();

            for (String wordName : addWordNames) {
                Word word = null;
                try {
                    word = wordService.getWord(wordName);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                //与文章关联
                ArticleWordRel articleWordRel = getRel(articleId, word.getId());
                if (articleWordRel == null) {
                    articleWordRel = new ArticleWordRel();
                    articleWordRel.setArticleId(articleId);
                    articleWordRel.setWordId(word.getId());
                    awlist.add(articleWordRel);
                }
                //与用户关联
                WordUser wordUser = wordUserService.getRel(word.getId());
                if (wordUser == null) {
                    wordUser = new WordUser();
                    wordUser.setAddFrom(1);
                    wordUser.setUser(sysUser.getUsername());
                    wordUser.setWordId(word.getId());
                    wulist.add(wordUser);
                }
            }
            saveBatch(awlist);//批量新增与文章关联
            wordUserService.saveBatch(wulist);
        }
    }

    @Override
    public void saveRels(String articleId, String wordId) {


        SysUser sysUser = (SysUser) SecurityUtils.getSubject().getPrincipal();


        ArticleWordRel articleWordRel = new ArticleWordRel();
        articleWordRel.setArticleId(articleId);
        articleWordRel.setWordId(wordId);
        save(articleWordRel);

        WordUser wordUser = new WordUser();
        wordUser.setAddFrom(1);
        wordUser.setUser(sysUser.getUsername());
        wordUser.setWordId(wordId);

        wordUserService.save(wordUser);

    }

    @Override
    public ArticleWordRel getRel(String articleId, String wordId) {
        SysUser sysUser = (SysUser) SecurityUtils.getSubject().getPrincipal();
        QueryWrapper<ArticleWordRel> wrapper = new QueryWrapper();
        wrapper.eq("article_id", articleId);
        wrapper.eq("word_id", wordId);
        List<ArticleWordRel> list = articleWordRelMapper.selectList(wrapper);
        if (!list.isEmpty()) {
            return list.get(0);
        } else {
            return null;
        }
    }

    @Override
    public void removeByWordNames(String articleId, String[] wordNames) {
        articleWordRelMapper.removeByWordName(articleId, wordNames);
    }

    @Override
    public void removeRelByArticle(String articleId, String[] wordNames) {
        removeByWordNames(articleId, wordNames);
        QueryWrapper<Word> wordWrapper = new QueryWrapper();
        wordWrapper.in("word_name", wordNames);
        List<Word> list = wordService.list(wordWrapper);
        List<String> wordIds = new ArrayList<>();
        for (Word word : list) {
            wordIds.add(word.getId());
        }

        List<String> usedWordIds = getRemoveWordIds(articleId, wordIds);
        wordUserService.removeByWordIds(usedWordIds);
    }

    @Override
    public void removeAricleRel(ArticleWordRel articleWordRel) {
        removeById(articleWordRel.getId());
        List<String> wordIds = getRemoveWordIds(articleWordRel.getArticleId(), Arrays.asList(articleWordRel.getWordId()));
        wordUserService.removeByWordIds(wordIds);
    }


    /**
     * 获取可以删除与用户关联的wordId
     *
     * @param articleId
     * @param wordIds
     * @return
     */
    @Override
    public List<String> getRemoveWordIds(String articleId, List<String> wordIds) {

        SysUser sysUser = (SysUser) SecurityUtils.getSubject().getPrincipal();
        List<String> usedWordIds = articleWordRelMapper.getUsedWordIds(articleId, sysUser.getUsername(), wordIds);//查出正在使用的wordId

        List<String> removeWordIds = wordIds.stream().filter(s -> !usedWordIds.contains(s)).collect(Collectors.toList());//剔除掉正在使用的wordId

        if (!removeWordIds.isEmpty()) {
            QueryWrapper<WordUser> wuWrapper = new QueryWrapper();
            wuWrapper.in("word_id", removeWordIds);
            wuWrapper.eq("add_from", 1);//add_from必须是1的
            List<WordUser> wuList = wordUserService.list(wuWrapper);
            if (!wuList.isEmpty()) {
                List<String> removeIds = new ArrayList<>();
                wuList.stream().forEach(wu -> removeIds.add(wu.getWordId()));
                return removeIds;
            }
        }
        return new ArrayList<String>();
    }
}
