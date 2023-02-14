package org.seed.modules.demo.test.service;

import java.util.List;

import org.seed.modules.demo.test.entity.JeecgOrderCustomer;

import com.baomidou.mybatisplus.extension.service.IService;

/**
 * @Description: 订单客户
 * @author： jeecg-boot
 * @date：   2019-02-15
 * @version： V1.0
 */
public interface ISeedOrderCustomerService extends IService<JeecgOrderCustomer> {
	
	public List<JeecgOrderCustomer> selectCustomersByMainId(String mainId);
}
