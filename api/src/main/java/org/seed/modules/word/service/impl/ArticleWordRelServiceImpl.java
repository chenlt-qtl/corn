package org.seed.modules.word.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.apache.shiro.SecurityUtils;
import org.seed.modules.system.entity.SysUser;
import org.seed.modules.word.entity.ArticleWordRel;
import org.seed.modules.word.entity.Word;
import org.seed.modules.word.entity.WordChinese;
import org.seed.modules.word.entity.WordUser;
import org.seed.modules.word.mapper.ArticleWordRelMapper;
import org.seed.modules.word.service.IArticleWordRelService;
import org.seed.modules.word.service.IWordChineseService;
import org.seed.modules.word.service.IWordService;
import org.seed.modules.word.service.IWordUserService;
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

    @Resource
    private IWordChineseService wordChineseService;

    @Override
    public void saveRels(Long articleId,int type, String[] addWordNames, String[] removeWordNames) {
        if (removeWordNames.length > 0) {
            removeRelByArticle(articleId, removeWordNames);//删除与文章、用户的关联
        }
        if (addWordNames.length > 0) {
            List<ArticleWordRel> awlist = new ArrayList<>();
            List<WordUser> wulist = new ArrayList<>();
            SysUser sysUser = (SysUser) SecurityUtils.getSubject().getPrincipal();

            for (String wordName : addWordNames) {
                String wordId = null;
                try {
                    if(type == 0) {
                        Word word = wordService.getWord(wordName);
                        wordId = word.getId();
                    }else{
                        WordChinese wordChinese = wordChineseService.getWord(wordName);
                        wordId = wordChinese.getId();
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
                if(wordId != null) {
                    //与文章关联
                    ArticleWordRel articleWordRel = getRel(articleId, wordId);
                    if (articleWordRel == null) {
                        articleWordRel = new ArticleWordRel();
                        articleWordRel.setArticleId(articleId);
                        articleWordRel.setWordId(wordId);
                        awlist.add(articleWordRel);
                    }
                    //与用户关联
                    WordUser wordUser = wordUserService.getRel(wordId);
                    if (wordUser == null) {
                        wordUser = new WordUser();
                        wordUser.setAddFrom(1);
                        wordUser.setUser(sysUser.getUsername());
                        wordUser.setWordId(wordId);
                        wulist.add(wordUser);
                    }
                }
            }
            saveBatch(awlist);//批量新增与文章关联
            wordUserService.saveBatch(wulist);
        }
    }

    @Override
    public void saveRels(Long articleId, String wordId) {


        SysUser sysUser = (SysUser) SecurityUtils.getSubject().getPrincipal();

        ArticleWordRel rel = getRel(articleId, wordId);
        if(rel==null) {

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
    }

    @Override
    public ArticleWordRel getRel(Long articleId, String wordId) {
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
    public void removeByWordNames(Long articleId, String[] wordNames) {
        articleWordRelMapper.removeByWordName(articleId, wordNames);
    }

    @Override
    public void removeRelByArticle(Long articleId, String[] wordNames) {
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
    public List<String> getRemoveWordIds(Long articleId, List<String> wordIds) {

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
