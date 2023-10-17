package org.seed.modules.word.mapper;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Constants;
import org.apache.ibatis.annotations.Param;
import org.seed.modules.word.entity.WordEnglist;

import java.util.List;
import java.util.Map;

/**
 * @Description: word
 * @author： jeecg-boot
 * @date：   2019-08-22
 * @version： V1.0
 */
public interface WordEnglishMapper extends BaseMapper<WordEnglist> {

    IPage<Map> pageSeachWord(IPage<Map> page, @Param(Constants.WRAPPER) Wrapper<Map> queryWrapper);

    List<Map> seachWordByArticle(@Param(Constants.WRAPPER) Wrapper<Map> queryWrapper);

}
