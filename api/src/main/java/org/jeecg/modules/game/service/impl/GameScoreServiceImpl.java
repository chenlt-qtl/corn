package org.jeecg.modules.game.service.impl;

import org.jeecg.modules.game.entity.GameScore;
import org.jeecg.modules.game.mapper.GameScoreMapper;
import org.jeecg.modules.game.service.IGameScoreService;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

/**
 * @Description: 分数
 * @author： jeecg-boot
 * @date：   2021-12-15
 * @version： V1.0
 */
@Service
public class GameScoreServiceImpl extends ServiceImpl<GameScoreMapper, GameScore> implements IGameScoreService {

}
