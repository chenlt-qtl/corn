package org.jeecg.modules.game.service.impl;

import org.jeecg.modules.game.entity.Game;
import org.jeecg.modules.game.mapper.GameMapper;
import org.jeecg.modules.game.service.IGameService;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

/**
 * @Description: 闯关游戏
 * @author： jeecg-boot
 * @date：   2021-12-15
 * @version： V1.0
 */
@Service
public class GameServiceImpl extends ServiceImpl<GameMapper, Game> implements IGameService {

}
