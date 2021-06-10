package org.jeecg.modules.word.service.impl;

import org.jeecg.modules.word.entity.IcibaSentence;
import org.jeecg.modules.word.mapper.IcibaSentenceMapper;
import org.jeecg.modules.word.service.IIcibaSentenceService;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;

/**
 * @Description: iciba_sentence
 * @author： jeecg-boot
 * @date：   2019-08-22
 * @version： V1.0
 */
@Service
public class IcibaSentenceServiceImpl extends ServiceImpl<IcibaSentenceMapper, IcibaSentence> implements IIcibaSentenceService {

    @Override
    public List<IcibaSentence> getByWordId(String wordId) {
        Collection<IcibaSentence> icibaSentence = listByMap(new HashMap<String, Object>() {{
            put("word_id", wordId);
        }});

        return new ArrayList(icibaSentence);
    }
}
