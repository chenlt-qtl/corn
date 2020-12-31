package org.jeecg.modules.word.model;

import lombok.Data;
import org.jeecg.modules.word.entity.Article;

import java.util.List;

@Data
public class ArticalVo extends Article{
    private List<SentenceVo> sentences;
}
