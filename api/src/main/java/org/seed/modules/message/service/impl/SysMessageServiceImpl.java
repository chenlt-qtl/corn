package org.seed.modules.message.service.impl;

import org.seed.modules.message.entity.SysMessage;
import org.seed.modules.message.mapper.SysMessageMapper;
import org.seed.modules.message.service.ISysMessageService;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

/**
 * @Description: 消息
 * @author： jeecg-boot
 * @date：   2019-04-09
 * @version： V1.0
 */
@Service
public class SysMessageServiceImpl extends ServiceImpl<SysMessageMapper, SysMessage> implements ISysMessageService {

}
