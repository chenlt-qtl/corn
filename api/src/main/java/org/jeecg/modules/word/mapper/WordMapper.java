package org.jeecg.modules.word.mapper;

import java.util.List;
import java.util.Map;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Constants;
import org.apache.ibatis.annotations.Param;
import org.jeecg.modules.word.entity.Word;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

/**
 * @Description: word
 * @author： jeecg-boot
 * @date：   2019-08-22
 * @version： V1.0
 */
public interface WordMapper extends BaseMapper<Word> {

    IPage<Map> pageSeachWord(IPage<Map> page, @Param(Constants.WRAPPER) Wrapper<Map> queryWrapper);

    List<Map> seachWordByArticle(@Param(Constants.WRAPPER) Wrapper<Map> queryWrapper);

    List<Map> searchWordBySentence(@Param(Constants.WRAPPER) Wrapper<Map> queryWrapper);

}
