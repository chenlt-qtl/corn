package org.seed.modules.demo.test.service.impl;

import java.util.List;

import org.seed.modules.demo.test.entity.JeecgOrderTicket;
import org.seed.modules.demo.test.mapper.JeecgOrderTicketMapper;
import org.seed.modules.demo.test.service.ISeedOrderTicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

/**
 * @Description: 订单机票
 * @author： jeecg-boot
 * @date：   2019-02-15
 * @version： V1.0
 */
@Service
public class SeedOrderTicketServiceImpl extends ServiceImpl<JeecgOrderTicketMapper, JeecgOrderTicket> implements ISeedOrderTicketService {
	@Autowired
	private JeecgOrderTicketMapper jeecgOrderTicketMapper;
	
	@Override
	public List<JeecgOrderTicket> selectTicketsByMainId(String mainId) {
		return jeecgOrderTicketMapper.selectTicketsByMainId(mainId);
	}

}
