package org.seed.modules.demo.test.service.impl;

import java.util.List;

import org.seed.modules.demo.test.entity.JeecgOrderCustomer;
import org.seed.modules.demo.test.mapper.JeecgOrderCustomerMapper;
import org.seed.modules.demo.test.service.ISeedOrderCustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

/**
 * @Description: 订单客户
 * @author： jeecg-boot
 * @date：   2019-02-15
 * @version： V1.0
 */
@Service
public class SeedOrderCustomerServiceImpl extends ServiceImpl<JeecgOrderCustomerMapper, JeecgOrderCustomer> implements ISeedOrderCustomerService {

	@Autowired
	private JeecgOrderCustomerMapper jeecgOrderCustomerMapper;
	
	@Override
	public List<JeecgOrderCustomer> selectCustomersByMainId(String mainId) {
		return jeecgOrderCustomerMapper.selectCustomersByMainId(mainId);
	}

}
