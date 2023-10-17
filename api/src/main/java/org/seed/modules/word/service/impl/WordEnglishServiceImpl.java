package org.seed.modules.word.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.apache.shiro.SecurityUtils;
import org.seed.common.util.UpLoadUtil;
import org.seed.modules.system.entity.SysUser;
import org.seed.modules.word.entity.IcibaSentence;
import org.seed.modules.word.entity.WordEnglist;
import org.seed.modules.word.mapper.WordEnglishMapper;
import org.seed.modules.word.model.SentenceVo;
import org.seed.modules.word.service.IIcibaSentenceService;
import org.seed.modules.word.service.IWordEnglistService;
import org.seed.modules.word.util.ParseIciba;
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
public class WordEnglishServiceImpl extends ServiceImpl<WordEnglishMapper, WordEnglist> implements IWordEnglistService {

    @Resource
    private WordEnglishMapper wordMapper;

    @Autowired
    private IIcibaSentenceService icibaSentenceService;

    @Value(value = "${jeecg.path.upload}")
    private String uploadpath;

    @Override
    public WordEnglist getWord(String wordName) {
        String lowerCase = wordName.toLowerCase();//转小写
        List<WordEnglist> list = wordMapper.selectByMap(new HashMap() {{
            this.put("word_name", lowerCase);
        }});
        WordEnglist word = null;
        if (!list.isEmpty()) {
            word = list.get(0);//已存在数据库中
        } else {//查API
            Map detailMap = ParseIciba.getWordFromIciba(lowerCase, uploadpath);
            if(detailMap != null) {
                word = (WordEnglist) detailMap.get("word");
                save(word);
                if (detailMap.containsKey("icibaSentence")) {//例句
                    List<IcibaSentence> icibaSentences = (List) detailMap.get("icibaSentence");
                    for (IcibaSentence icibaSentence : icibaSentences) {
                        icibaSentence.setWordId(word.getId());
                        icibaSentenceService.save(icibaSentence);
                    }
                }
            }
        }
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


    private void handleMapUrl(List<Map> list) {
        list.forEach((map) -> {
            Object mp3 = map.get("mp3");
            if (null != mp3) {
                map.put("mp3", UpLoadUtil.dbToReal(String.valueOf(mp3)));
            }
        });
    }

    @Override
    public void saveWord(SentenceVo sentenceVo) {
        if (sentenceVo.getWords() != null && !sentenceVo.getWords().isEmpty()) {
            for (WordEnglist wordVo : sentenceVo.getWords()) {
                try {
                    getWord(wordVo.getWordName().toLowerCase());
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }


}
