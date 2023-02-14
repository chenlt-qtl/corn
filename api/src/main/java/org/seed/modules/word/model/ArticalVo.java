package org.seed.modules.word.model;

import lombok.Data;
import org.seed.modules.word.entity.Article;

import java.util.List;

@Data
public class ArticalVo extends Article{
    private List<SentenceVo> sentences;
    private String[] addWordNames;
    private String[] removeWordNames;
}
