package org.seed.modules.system.service;

import org.seed.modules.system.entity.SysLog;

import com.baomidou.mybatisplus.extension.service.IService;

/**
 * <p>
 * 系统日志表 服务类
 * </p>
 *
 * @author zhangweijian
 * @since 2018-12-26
 */
public interface ISysLogService extends IService<SysLog> {

	/**
	 * @功能：清空所有日志记录
	 */
	public void removeAll();
	
	/**
	 * 获取系统总访问次数
	 *
	 * @return Long
	 */
	Long findTotalVisitCount();

	/**
	 * 获取系统今日访问次数
	 *
	 * @return Long
	 */
	Long findTodayVisitCount();

	/**
	 * 获取系统今日访问 IP数
	 *
	 * @return Long
	 */
	Long findTodayIp();

}
