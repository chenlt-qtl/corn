package org.jeecg.modules.word.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.jeecg.modules.word.entity.Acceptation;
import org.jeecg.modules.word.mapper.AcceptationMapper;
import org.jeecg.modules.word.service.IAcceptationService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

/**
 * @Description: acceptation
 * @author： jeecg-boot
 * @date：   2019-08-22
 * @version： V1.0
 */
@Service
public class AcceptationServiceImpl extends ServiceImpl<AcceptationMapper, Acceptation> implements IAcceptationService {

    @Resource
    private AcceptationMapper acceptationMapper;
    @Override
    public String getByWord(String wordId) {
        return acceptationMapper.getByWord(wordId);
    }
}
