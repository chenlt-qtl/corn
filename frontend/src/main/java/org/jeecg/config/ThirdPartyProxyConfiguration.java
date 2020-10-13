package org.jeecg.config;

import javax.servlet.http.HttpServlet;

import org.jeecg.servlet.ApiProxyServlet;
import org.mitre.dsmiley.httpproxy.ProxyServlet;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class ThirdPartyProxyConfiguration {

	@Value("${corn.openapi}")
	private String openapi;

	@Value("${corn.apiPrefix}")
	private String apiPrefix;

	@Bean
	public ServletRegistrationBean<HttpServlet> apiProxyServletBean() {
		ServletRegistrationBean<HttpServlet> servletRegistrationBean = new ServletRegistrationBean<HttpServlet>(apiProxyServlet(), apiPrefix);

		servletRegistrationBean.addInitParameter("targetUri", openapi);
		servletRegistrationBean.addInitParameter(ProxyServlet.P_LOG, "false");
		return servletRegistrationBean;
	}

	@Bean
	public HttpServlet apiProxyServlet() {
		return new ApiProxyServlet();
	}

}
