package org.seed.modules.word.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.seed.modules.word.entity.Article;
import org.seed.modules.word.mapper.ArticleMapper;
import org.seed.modules.word.service.IArticleService;
import org.springframework.stereotype.Service;

/**
 * @Description: article
 * @author： jeecg-boot
 * @date：   2019-08-22
 * @version： V1.0
 */
@Service
public class ArticleServiceImpl extends ServiceImpl<ArticleMapper, Article> implements IArticleService {


}
