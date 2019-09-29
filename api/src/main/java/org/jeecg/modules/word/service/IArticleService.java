package org.jeecg.modules.word.service;

import org.jeecg.modules.word.entity.Article;
import com.baomidou.mybatisplus.extension.service.IService;
import org.jeecg.modules.word.entity.Sentence;
import org.jeecg.modules.word.model.ArticalVo;

import java.util.List;

/**
 * @Description: article
 * @author： jeecg-boot
 * @date：   2019-08-22
 * @version： V1.0
 */
public interface IArticleService extends IService<Article> {

    Article saveNewWord(ArticalVo articleVo);
}
