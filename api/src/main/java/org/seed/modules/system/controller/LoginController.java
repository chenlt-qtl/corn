package org.seed.modules.system.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.seed.common.api.vo.Result;
import org.seed.common.constant.CommonConstant;
import org.seed.common.exception.CornException;
import org.seed.common.system.api.ISysBaseAPI;
import org.seed.common.util.BtoaEncode;
import org.seed.common.util.PasswordUtil;
import org.seed.common.util.RedisUtil;
import org.seed.common.util.ResultUtils;
import org.seed.modules.shiro.authc.util.JwtUtil;
import org.seed.modules.shiro.vo.DefContants;
import org.seed.modules.system.entity.SysUser;
import org.seed.modules.system.model.SysLoginModel;
import org.seed.modules.system.service.ISysLogService;
import org.seed.modules.system.service.ISysUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import com.alibaba.fastjson.JSONObject;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

/**
 * @author scott
 * @since 2018-12-17
 */
@RestController
@RequestMapping("/sys")
@Api("用户登录")
@Slf4j
public class LoginController {
	@Autowired
	private ISysUserService sysUserService;
	@Autowired
	private ISysBaseAPI sysBaseAPI;
	@Autowired
	private ISysLogService logService;
	@Autowired
    private RedisUtil redisUtil;
	

	@RequestMapping(value = "/login", method = RequestMethod.POST)
	@ApiOperation("登录接口")
	public Result login(@RequestBody SysLoginModel sysLoginModel) {
		String username = BtoaEncode.decrypt(sysLoginModel.getUsername());
		String password = BtoaEncode.decrypt(sysLoginModel.getPassword());
		SysUser sysUser = sysUserService.getUserByName(username);
		if(sysUser==null) {
			sysBaseAPI.addLog("登录失败，用户名:"+username+"不存在！", CommonConstant.LOG_TYPE_1, null);
			throw new CornException("该用户不存在");
		}else {
			//密码验证
			String userpassword = PasswordUtil.encrypt(username, password, sysUser.getSalt());
			String syspassword = sysUser.getPassword();
			if(!syspassword.equals(userpassword)) {
				throw new CornException("用户名或密码错误");
			}
			//生成token
			String token = JwtUtil.sign(username, syspassword);
			redisUtil.set(CommonConstant.PREFIX_USER_TOKEN + token, token);
			 //设置超时时间
			redisUtil.expire(CommonConstant.PREFIX_USER_TOKEN + token, JwtUtil.EXPIRE_TIME/1000);
			
			JSONObject obj = new JSONObject();
			obj.put("token", token);
			obj.put("userInfo", sysUser);
			sysBaseAPI.addLog("用户名: "+username+",登录成功！", CommonConstant.LOG_TYPE_1, null);
			return ResultUtils.okData(obj);
		}
	}
	
	/**
	 * 退出登录
	 * @return
	 */
	@RequestMapping(value = "/logout")
	public Result logout(HttpServletRequest request,HttpServletResponse response) {
		//用户退出逻辑
		Subject subject = SecurityUtils.getSubject();
		SysUser sysUser = (SysUser)subject.getPrincipal();
		sysBaseAPI.addLog("用户名: "+sysUser.getRealname()+",退出成功！", CommonConstant.LOG_TYPE_1, null);
		log.info(" 用户名:  "+sysUser.getRealname()+",退出成功！ ");
	    subject.logout();

	    String token = request.getHeader(DefContants.X_ACCESS_TOKEN);
	    //清空用户Token缓存
	    redisUtil.del(CommonConstant.PREFIX_USER_TOKEN + token);
	    //清空用户角色缓存
	    redisUtil.del(CommonConstant.PREFIX_USER_ROLE + sysUser.getUsername());
		return ResultUtils.ok();
	}
	
	/**
	 * 获取访问量
	 * @return
	 */
	@GetMapping("loginfo")
	public Result loginfo() {
		JSONObject obj = new JSONObject();
		// 获取系统访问记录
		Long totalVisitCount = logService.findTotalVisitCount();
		obj.put("totalVisitCount", totalVisitCount);
		Long todayVisitCount = logService.findTodayVisitCount();
		obj.put("todayVisitCount", todayVisitCount);
		Long todayIp = logService.findTodayIp();
		obj.put("todayIp", todayIp);
		return ResultUtils.okData(obj);
	}

}
