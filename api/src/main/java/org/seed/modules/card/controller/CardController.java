package org.seed.modules.card.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.swagger.models.auth.In;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.seed.common.api.vo.Result;
import org.seed.common.exception.CornException;
import org.seed.common.system.query.QueryGenerator;
import org.seed.common.util.ResultUtils;
import org.seed.modules.card.entity.Card;
import org.seed.modules.card.service.ICardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/card")
@Slf4j
public class CardController {
    @Autowired
    private ICardService cardService;

    /**
     * 分页列表查询
     */
    @GetMapping("/{current}/{pageSize}")
    public Result queryPageList(@PathVariable Integer current,
                                @PathVariable Integer pageSize, Integer userId,String title) {
        QueryWrapper<Card> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq(userId!=null,"user_id",userId);
        queryWrapper.like(StringUtils.isNotBlank(title),"title",title);

        Page<Card> page = new Page(current, pageSize);
        IPage<Card> pageList = cardService.page(page, queryWrapper);
        return ResultUtils.okData(pageList);

    }


    @PostMapping
    public Result add(@RequestBody Card card) {
        try {
            cardService.saveDetail(card);
            return ResultUtils.ok("添加成功！");
        } catch (Exception e) {
            e.printStackTrace();
            log.info(e.getMessage());
            throw new CornException("操作失败");
        }

    }


    /**
     * 查询user对应的total
     *
     * @param userId
     * @return
     */
    @GetMapping(value = "/total/{userId}")
    public Result queryTotal(@PathVariable Integer userId) {
        Card card = cardService.getTotal(userId);
        if (card == null) {
            return ResultUtils.okData(0);
        } else {
            return ResultUtils.okData(card.getTotal());
        }

    }

}
