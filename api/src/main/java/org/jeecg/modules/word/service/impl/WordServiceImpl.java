package org.jeecg.modules.word.service.impl;

import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.util.EntityUtils;
import org.jeecg.modules.word.entity.Acceptation;
import org.jeecg.modules.word.entity.IcibaSentence;
import org.jeecg.modules.word.entity.Word;
import org.jeecg.modules.word.mapper.WordMapper;
import org.jeecg.modules.word.service.IAcceptationService;
import org.jeecg.modules.word.service.IIcibaSentenceService;
import org.jeecg.modules.word.service.IWordService;
import org.jeecg.modules.word.util.HttpClientFactory;
import org.jeecg.modules.word.util.ParseIciba;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/**
 * @Description: word
 * @author： jeecg-boot
 * @date：   2019-08-22
 * @version： V1.0
 */
@Service
public class WordServiceImpl extends ServiceImpl<WordMapper, Word> implements IWordService {

    private final static Logger logger = LoggerFactory.getLogger(WordServiceImpl.class);

    private final static String KEY="C772DB1F60B2839AD948507D91E7B04A";

    @Resource
    private WordMapper wordMapper;

    @Autowired
    private IAcceptationService acceptationService;

    @Autowired
    private IIcibaSentenceService icibaSentenceService;

    @Value(value = "${jeecg.path.upload}")
    private String uploadpath;

    @Override
    public void saveWord(Word word) {
        String wordName = word.getWordName();
        List<Word> list = wordMapper.selectByMap(new HashMap(){{this.put("word_name",wordName);}});
        if(!list.isEmpty()){
            word = list.get(0);//已存在数据库中
            return;
        }else {//查API
            Map detailMap = new HashMap();
            CloseableHttpResponse response = null;
            HttpRequestBase httpRequest = new HttpGet("http://dict-co.iciba.com/api/dictionary.php?w=" + wordName + "&key=" + KEY);
            try {
                response = HttpClientFactory.getHttpClient().execute(httpRequest);
            } catch (Exception e1) {
                logger.error("查词失败:", e1);
            }
            int status = response.getStatusLine().getStatusCode();
            if (status == 200) {
                try {
                    detailMap = ParseIciba.parse(EntityUtils.toString(response.getEntity(), "UTF-8"),uploadpath, word);
                } catch (Exception e) {
                    logger.error("解析查词结果失败:", e);
                }

            }
            save(word);
            if (detailMap.containsKey("acceptations")) {
                List<Acceptation> acceptations = (List) detailMap.get("acceptations");
                for (Acceptation acceptation:acceptations) {
                    acceptation.setWordId(word.getId());
                    acceptationService.save(acceptation);
                }
            }
            if (detailMap.containsKey("icibaSentence")) {
                List<IcibaSentence> icibaSentences = (List) detailMap.get("icibaSentence");
                for (IcibaSentence icibaSentence:icibaSentences) {
                    icibaSentence.setWordId(word.getId());
                    icibaSentenceService.save(icibaSentence);
                }
            }
        }
    }
}
