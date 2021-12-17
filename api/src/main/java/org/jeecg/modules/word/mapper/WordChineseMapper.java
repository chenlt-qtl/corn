package org.jeecg.modules.word.mapper;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.toolkit.Constants;
import org.apache.ibatis.annotations.Param;
import org.jeecg.modules.word.entity.WordChinese;

import java.util.List;
import java.util.Map;

/**
 * @Description: 汉字
 * @author： jeecg-boot
 * @date：   2021-11-30
 * @version： V1.0
 */
public interface WordChineseMapper extends BaseMapper<WordChinese> {

    List<Map> seachWordByArticle(@Param(Constants.WRAPPER) Wrapper<Map> queryWrapper);
}
