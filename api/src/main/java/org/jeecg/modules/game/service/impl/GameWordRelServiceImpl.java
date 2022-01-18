package org.jeecg.modules.game.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.apache.commons.lang3.StringUtils;
import org.jeecg.common.exception.CornException;
import org.jeecg.modules.game.entity.Game;
import org.jeecg.modules.game.entity.GameWordRel;
import org.jeecg.modules.game.mapper.GameWordRelMapper;
import org.jeecg.modules.game.service.IGameService;
import org.jeecg.modules.game.service.IGameWordRelService;
import org.jeecg.modules.word.service.IWordChineseService;
import org.jeecg.modules.word.service.IWordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @Description: 关联
 * @author： jeecg-boot
 * @date：   2021-12-15
 * @version： V1.0
 */
@Service
public class GameWordRelServiceImpl extends ServiceImpl<GameWordRelMapper, GameWordRel> implements IGameWordRelService {

    @Autowired
    IGameService gameService;

    @Autowired
    private IWordService wordService;

    @Autowired
    private IWordChineseService wordChineseService;

    @Override
    public String addRelByArticle(String gameId, String[] articleIds) throws Exception {
        String result = "";
        QueryWrapper<GameWordRel> wrapper = new QueryWrapper();
        wrapper.eq("game_id", gameId);
        List<GameWordRel> relList = list(wrapper);

        List<String> existWords = new ArrayList<>();
        for(GameWordRel gameWordRel:relList){
            existWords.add(gameWordRel.getWordId());
        }


        Game game = gameService.getById(gameId);
        if(game==null){
            throw new CornException("Game Id 不存在");
        }
        for(String articleId:articleIds) {
            List<Map> words ;
            if(game.getType().intValue()==0) {
                words = wordService.searchWordByArticle(articleId);
            }else{
                words=wordChineseService.searchWordByArticle(articleId);
            }
            for(Map word:words){
                String wordId = (String)word.get("id");
                if(!existWords.contains(wordId)){//不存在的话才添加
                    GameWordRel gameWordRel = new GameWordRel();
                    gameWordRel.setWordId(wordId);
                    gameWordRel.setGameId(gameId);
                    this.save(gameWordRel);
                    existWords.add(wordId);
                    if(result.length()>0){
                        result +=", ";
                    }
                    result += word.get("wordName");
                }

            }
        }
        return result;
    }
}
