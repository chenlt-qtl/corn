package org.seed.config;

import org.apache.shiro.mgt.DefaultSessionStorageEvaluator;
import org.apache.shiro.mgt.DefaultSubjectDAO;
import org.apache.shiro.mgt.SecurityManager;
import org.apache.shiro.spring.LifecycleBeanPostProcessor;
import org.apache.shiro.spring.security.interceptor.AuthorizationAttributeSourceAdvisor;
import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.web.mgt.DefaultWebSecurityManager;
import org.seed.modules.shiro.authc.MyRealm;
import org.seed.modules.shiro.authc.aop.JwtFilter;
import org.springframework.aop.framework.autoproxy.DefaultAdvisorAutoProxyCreator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;

import javax.servlet.Filter;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * @author: Scott
 * @date: 2018/2/7
 * @description: shiro 配置类
 */

@Configuration
public class ShiroConfig {
	
	/**
	 * Filter Chain定义说明 
	 * 
	 * 1、一个URL可以配置多个Filter，使用逗号分隔
	 * 2、当设置多个过滤器时，全部验证通过，才视为通过
	 * 3、部分过滤器可指定参数，如perms，roles
	 */
	@Bean("shiroFilter")
	public ShiroFilterFactoryBean shiroFilter(SecurityManager securityManager) {
		ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();
		shiroFilterFactoryBean.setSecurityManager(securityManager);
		// 拦截器
		Map<String, String> filterChainDefinitionMap = new LinkedHashMap<String, String>();
		// 配置不会被拦截的链接 顺序判断
		filterChainDefinitionMap.put("/api/sys/login", "anon"); //登录接口排除
		filterChainDefinitionMap.put("/auth/2step-code", "anon");//登录验证码
		filterChainDefinitionMap.put("/test/jeecgDemo/**", "anon"); //测试接口
		filterChainDefinitionMap.put("/test/jeecgOrderMain/**", "anon"); //测试接口
		filterChainDefinitionMap.put("/**/exportXls", "anon"); //导出接口
		filterChainDefinitionMap.put("/**/importExcel", "anon"); //导入接口
		filterChainDefinitionMap.put("/sys/common/view/**", "anon");//图片预览不限制token
		filterChainDefinitionMap.put("/", "anon");
		filterChainDefinitionMap.put("/**/*.js", "anon");
		filterChainDefinitionMap.put("/**/*.css", "anon");
		filterChainDefinitionMap.put("/**/*.html", "anon");
		filterChainDefinitionMap.put("/**/*.svg", "anon");
		filterChainDefinitionMap.put("/**/*.jpg", "anon");
		filterChainDefinitionMap.put("/**/*.png", "anon");
		filterChainDefinitionMap.put("/**/*.jpeg", "anon");
		filterChainDefinitionMap.put("/**/*.gif", "anon");
		filterChainDefinitionMap.put("/**/*.bmp", "anon");
		filterChainDefinitionMap.put("/**/*.ico", "anon");
		filterChainDefinitionMap.put("/**/*.mp3", "anon");
		filterChainDefinitionMap.put("/**/*.mp4", "anon");
		filterChainDefinitionMap.put("/**/*.flv", "anon");
		filterChainDefinitionMap.put("/**/*.woff", "anon");
		filterChainDefinitionMap.put("/**/*.woff2", "anon");
		filterChainDefinitionMap.put("/**/*.ttf", "anon");
		filterChainDefinitionMap.put("/api/read/**", "anon");
//		filterChainDefinitionMap.put("/druid/**", "anon");
//		filterChainDefinitionMap.put("/swagger-ui.html", "anon");
//		filterChainDefinitionMap.put("/swagger**/**", "anon");
		filterChainDefinitionMap.put("/webjars/**", "anon");
//		filterChainDefinitionMap.put("/v2/**", "anon");
		
		//性能监控
		filterChainDefinitionMap.put("/actuator/metrics/**", "anon");
		filterChainDefinitionMap.put("/actuator/httptrace/**", "anon");
		filterChainDefinitionMap.put("/redis/**", "anon");
		
		//TODO 排除Online请求
		filterChainDefinitionMap.put("/auto/cgform/**", "anon");
		filterChainDefinitionMap.put("/online/cgreport/api/exportXls/**", "anon");
        
		// 添加自己的过滤器并且取名为jwt
		Map<String, Filter> filterMap = new HashMap<String, Filter>(1);
		filterMap.put("jwt", new JwtFilter());
		shiroFilterFactoryBean.setFilters(filterMap);
		// <!-- 过滤链定义，从上向下顺序执行，一般将/**放在最为下边
		filterChainDefinitionMap.put("/**", "jwt");

		// 未授权界面;
		shiroFilterFactoryBean.setUnauthorizedUrl("/403");
		shiroFilterFactoryBean.setFilterChainDefinitionMap(filterChainDefinitionMap);
		return shiroFilterFactoryBean;
	}

	@Bean("securityManager")
	public DefaultWebSecurityManager securityManager(MyRealm myRealm) {
		DefaultWebSecurityManager securityManager = new DefaultWebSecurityManager();
		securityManager.setRealm(myRealm);

		/*
		 * 关闭shiro自带的session，详情见文档
		 * http://shiro.apache.org/session-management.html#SessionManagement-
		 * StatelessApplications%28Sessionless%29
		 */
		DefaultSubjectDAO subjectDAO = new DefaultSubjectDAO();
		DefaultSessionStorageEvaluator defaultSessionStorageEvaluator = new DefaultSessionStorageEvaluator();
		defaultSessionStorageEvaluator.setSessionStorageEnabled(false);
		subjectDAO.setSessionStorageEvaluator(defaultSessionStorageEvaluator);
		securityManager.setSubjectDAO(subjectDAO);

		return securityManager;
	}

	/**
	 * 下面的代码是添加注解支持
	 * @return
	 */
	@Bean
	@DependsOn("lifecycleBeanPostProcessor")
	public DefaultAdvisorAutoProxyCreator defaultAdvisorAutoProxyCreator() {
		DefaultAdvisorAutoProxyCreator defaultAdvisorAutoProxyCreator = new DefaultAdvisorAutoProxyCreator();
		defaultAdvisorAutoProxyCreator.setProxyTargetClass(true);
		return defaultAdvisorAutoProxyCreator;
	}

	@Bean
	public LifecycleBeanPostProcessor lifecycleBeanPostProcessor() {
		return new LifecycleBeanPostProcessor();
	}

	@Bean
	public AuthorizationAttributeSourceAdvisor authorizationAttributeSourceAdvisor(DefaultWebSecurityManager securityManager) {
		AuthorizationAttributeSourceAdvisor advisor = new AuthorizationAttributeSourceAdvisor();
		advisor.setSecurityManager(securityManager);
		return advisor;
	}

}
