package org.seed.modules.card.service;

import org.seed.modules.card.entity.Card;
import com.baomidou.mybatisplus.extension.service.IService;


public interface ICardService extends IService<Card> {

    void saveDetail(Card card);

    Card getTotal(Integer userId);
}
