package org.seed.modules.card.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.seed.modules.card.entity.Card;
import org.seed.modules.card.mapper.CardMapper;
import org.seed.modules.card.service.ICardService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CardServiceImpl extends ServiceImpl<CardMapper, Card> implements ICardService {

    @Override
    @Transactional
    public void saveDetail(Card card) {
        //获取汇总
        Card totalCard = getTotal(card.getUserId());
        int total = card.getValue();
        if (totalCard != null) {
            total += totalCard.getTotal();
        }else {
            totalCard = new Card();
            totalCard.setStatus(1);
            totalCard.setUserId(card.getUserId());
        }

        //更新汇总
        totalCard.setTotal(total);
        saveOrUpdate(totalCard);

        //添加数据
        card.setTotal(total);
        card.setStatus(2);//明细
        save(card);


    }

    @Override
    public Card getTotal(Integer userId) {
        QueryWrapper<Card> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id", userId);
        queryWrapper.eq("status", 1);
        return getOne(queryWrapper);
    }
}
