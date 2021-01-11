package org.jeecg.modules.word.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.jeecg.common.util.UpLoadUtil;
import org.jeecg.modules.system.entity.SysUser;
import org.jeecg.modules.word.entity.Acceptation;
import org.jeecg.modules.word.entity.IcibaSentence;
import org.jeecg.modules.word.entity.SentenceWordRel;
import org.jeecg.modules.word.entity.Word;
import org.jeecg.modules.word.mapper.WordMapper;
import org.jeecg.modules.word.model.SentenceVo;
import org.jeecg.modules.word.service.*;
import org.jeecg.modules.word.util.ParseIciba;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @Description: word
 * @author： jeecg-boot
 * @date： 2019-08-22
 * @version： V1.0
 */
@Service
public class WordServiceImpl extends ServiceImpl<WordMapper, Word> implements IWordService {

    private final static Logger logger = LoggerFactory.getLogger(WordServiceImpl.class);

    @Resource
    private WordMapper wordMapper;

    @Autowired
    private IAcceptationService acceptationService;

    @Autowired
    private IWordUserService wordUserService;

    @Autowired
    private IIcibaSentenceService icibaSentenceService;

    @Autowired
    private ISentenceWordRelService sentenceWordRelService;

    @Value(value = "${jeecg.path.upload}")
    private String uploadpath;

    @Override
    public Word saveWord(String wordName) throws Exception {
        SysUser sysUser = (SysUser) SecurityUtils.getSubject().getPrincipal();
        List<Word> list = wordMapper.selectByMap(new HashMap() {{
            this.put("word_name", wordName);
        }});
        Word word;
        if (!list.isEmpty()) {
            word = list.get(0);//已存在数据库中
        } else {//查API
            Map detailMap = ParseIciba.getWordFromIciba(wordName, uploadpath);
            word = (Word) detailMap.get("word");
            save(word);
            if (detailMap.containsKey("acceptations")) {//解释
                List<Acceptation> acceptations = (List) detailMap.get("acceptations");
                for (Acceptation acceptation : acceptations) {
                    acceptation.setWordId(word.getId());
                    acceptationService.save(acceptation);
                }
            }
            if (detailMap.containsKey("icibaSentence")) {//例句
                List<IcibaSentence> icibaSentences = (List) detailMap.get("icibaSentence");
                for (IcibaSentence icibaSentence : icibaSentences) {
                    icibaSentence.setWordId(word.getId());
                    icibaSentenceService.save(icibaSentence);
                }
            }
        }
        //保存word用户关联信息
        wordUserService.saveRel(sysUser.getUsername(), word.getId());

        return word;
    }

    /**
     * 分页查询word
     *
     * @param wordName
     * @param pageNo
     * @param pageSize
     * @return
     */
    @Override
    public IPage<Map> pageSearchWord(String wordName, int pageNo, int pageSize) {

        SysUser sysUser = (SysUser) SecurityUtils.getSubject().getPrincipal();
        QueryWrapper<Map> wrapper = new QueryWrapper();
        wrapper.like("wordName", wordName).eq("user", sysUser.getUsername());
        Page<Map> page = new Page<Map>(pageNo, pageSize);
        IPage<Map> mapIPage = wordMapper.pageSeachWord(page, wrapper);

        handleMapUrl(mapIPage.getRecords());
        return mapIPage;
    }

    @Override
    public List<Map> searchWordByArticle(String articleId) {
        QueryWrapper<Map> wrapper = new QueryWrapper();
        wrapper.eq("article_id", articleId);
        List<Map> list = wordMapper.seachWordByArticle(wrapper);
        handleMapUrl(list);
        return list;
    }

    @Override
    public List<Map> searchWordBySentence(String sentenceId) {
        QueryWrapper<Map> wrapper = new QueryWrapper();
        wrapper.eq("sentence_id", sentenceId);
        List<Map> list = wordMapper.searchWordBySentence(wrapper);
        handleMapUrl(list);
        return list;
    }

    private void handleMapUrl(List<Map> list) {
        list.forEach((map) -> {
            Object mp3 = map.get("mp3");
            if (null != mp3) {
                map.put("mp3", UpLoadUtil.dbToReal(String.valueOf(mp3)));
                //map.put("key", mp3Str);
            }
        });
    }

    @Override
    public void saveWord(SentenceVo sentenceVo) {
        if (sentenceVo.getWords() != null && !sentenceVo.getWords().isEmpty()) {
            for (Word wordVo : sentenceVo.getWords()) {
                Word word = null;
                try {
                    word = saveWord(wordVo.getWordName().toLowerCase());
                } catch (Exception e) {
                    e.printStackTrace();
                }
                if (word != null) {
                    SentenceWordRel sentenceWordRel = new SentenceWordRel();
                    sentenceWordRel.setSentenceId(sentenceVo.getId());
                    sentenceWordRel.setWordId(word.getId());
                    sentenceWordRelService.save(sentenceWordRel);
                }
            }
        }
    }
}
