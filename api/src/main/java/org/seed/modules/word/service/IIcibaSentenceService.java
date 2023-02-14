package org.seed.modules.word.service;

import org.seed.modules.word.entity.IcibaSentence;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
 * @Description: iciba_sentence
 * @author： jeecg-boot
 * @date：   2019-08-22
 * @version： V1.0
 */
public interface IIcibaSentenceService extends IService<IcibaSentence> {

    List<IcibaSentence> getByWordId(String wordId);
}
