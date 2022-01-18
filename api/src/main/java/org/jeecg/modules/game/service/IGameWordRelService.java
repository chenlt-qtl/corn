package org.jeecg.modules.game.service;

import org.jeecg.modules.game.entity.GameWordRel;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * @Description: 关联
 * @author： jeecg-boot
 * @date：   2021-12-15
 * @version： V1.0
 */
public interface IGameWordRelService extends IService<GameWordRel> {

    public String addRelByArticle(String gameId,String[] articleIds) throws Exception;
}
