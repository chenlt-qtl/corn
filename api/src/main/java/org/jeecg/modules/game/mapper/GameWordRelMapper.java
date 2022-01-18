package org.jeecg.modules.game.mapper;

import java.util.List;
import java.util.Map;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.toolkit.Constants;
import org.apache.ibatis.annotations.Param;
import org.jeecg.modules.game.entity.GameWordRel;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

/**
 * @Description: 关联
 * @author： jeecg-boot
 * @date：   2021-12-15
 * @version： V1.0
 */
public interface GameWordRelMapper extends BaseMapper<GameWordRel> {


    List<Map> getCnWordList(@Param(Constants.WRAPPER) Wrapper<Map> queryWrapper);

    List<Map> getEnWordList(@Param(Constants.WRAPPER) Wrapper<Map> queryWrapper);

}
