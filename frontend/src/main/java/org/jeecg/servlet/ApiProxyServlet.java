package org.jeecg.servlet;

import org.mitre.dsmiley.httpproxy.ProxyServlet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Locale;

public class ApiProxyServlet extends ProxyServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private static Logger logger = LoggerFactory.getLogger(ApiProxyServlet.class);

	private final static DateFormat DATE_FORMAT = new SimpleDateFormat("E, dd MMM yyyy HH:mm:ss Z", Locale.ENGLISH);

	@Override
	protected void service(HttpServletRequest servletRequest, HttpServletResponse servletResponse)
			throws ServletException, IOException {
		ApiProxyServletRequestWrapper httpReq = new ApiProxyServletRequestWrapper(servletRequest);
		super.service(httpReq, servletResponse);
	}
	
}
