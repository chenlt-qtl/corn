package org.seed.modules.read.service.impl;

import org.seed.common.exception.CornException;
import org.seed.modules.read.entity.Read;
import org.seed.modules.read.mapper.ReadMapper;
import org.seed.modules.read.service.IReadService;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import javax.annotation.Resource;
import java.util.List;

/**
 * @Description: 点读
 * @author： jeecg-boot
 * @date：   2023-07-30
 * @version： V1.0
 */
@Service
public class ReadServiceImpl extends ServiceImpl<ReadMapper, Read> implements IReadService {

    @Resource
    private ReadMapper readMapper;


    @Override
    public boolean update(Read read) {
        checkRead(read);
        return  this.updateById(read);
    }

    @Override
    public Read add(Read read) {
        checkRead(read);
        return this.add(read);
    }

    /**
     * 数据检查
     * @param read
     */
    private void checkRead(Read read){
        List<Read> readList = readMapper.getByArticleId(read.getArticleId(), read.getId());
        if(readList.size()>0){
            throw new CornException("article id 已存在");
        }
    }
}
