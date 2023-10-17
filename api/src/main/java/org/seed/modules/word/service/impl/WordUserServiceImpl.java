package org.seed.modules.word.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.apache.shiro.SecurityUtils;
import org.seed.modules.system.entity.SysUser;
import org.seed.modules.word.entity.WordUser;
import org.seed.modules.word.mapper.WordUserMapper;
import org.seed.modules.word.service.IWordUserService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

/**
 * @Description: test
 * @author： jeecg-boot
 * @date： 2019-11-05
 * @version： V1.0
 */
@Service
public class WordUserServiceImpl extends ServiceImpl<WordUserMapper, WordUser> implements IWordUserService {

    @Resource
    private WordUserMapper wordUserMapper;

    private static final int DEFAULT_SCORE = 7;

    @Override
    public void saveRel(Long wordId) {
        SysUser sysUser = (SysUser) SecurityUtils.getSubject().getPrincipal();
        if (getRel(wordId) == null) {
            WordUser wordUser = new WordUser();
            wordUser.setUser(sysUser.getUsername());
            wordUser.setFamiliarity(DEFAULT_SCORE);
            wordUser.setWordId(wordId);
            save(wordUser);
        }
    }

    @Override
    public WordUser getRel(Long wordId) {
        SysUser sysUser = (SysUser) SecurityUtils.getSubject().getPrincipal();
        QueryWrapper<WordUser> wrapper = new QueryWrapper();
        wrapper.eq("user", sysUser.getUsername());
        wrapper.eq("word_id", wordId);
        List<WordUser> list = wordUserMapper.selectList(wrapper);
        if (!list.isEmpty()) {
            return list.get(0);
        } else {
            return null;
        }
    }

    @Override
    public void removeByWordIds(List<Long> wordIds) {
        if (wordIds != null && !wordIds.isEmpty()) {
            SysUser sysUser = (SysUser) SecurityUtils.getSubject().getPrincipal();
            QueryWrapper<WordUser> wrapper = new QueryWrapper();
            wrapper.eq("user", sysUser.getUsername());
            wrapper.in("word_id", wordIds);
            wordUserMapper.delete(wrapper);
        }
    }
}
