package org.seed.modules.read.service.impl;

import org.seed.modules.read.entity.Read;
import org.seed.modules.read.mapper.ReadMapper;
import org.seed.modules.read.service.IReadService;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

/**
 * @Description: 点读
 * @author： jeecg-boot
 * @date：   2023-07-30
 * @version： V1.0
 */
@Service
public class ReadServiceImpl extends ServiceImpl<ReadMapper, Read> implements IReadService {

}
