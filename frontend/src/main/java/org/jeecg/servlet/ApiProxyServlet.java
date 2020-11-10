package org.jeecg.servlet;

import com.alibaba.druid.support.json.JSONUtils;
import com.alibaba.fastjson.JSONObject;
import org.mitre.dsmiley.httpproxy.ProxyServlet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
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
		ApiProxyServletResponseWrapper httpRes = new ApiProxyServletResponseWrapper(servletResponse);
		super.service(httpReq, httpRes);
		logger.info("**************"+httpReq.getPathInfo());
		byte[] content = httpRes.getContent();// 获取返回值
//		String result = null;
		// 判断是否有值
		if (null != content)
		{
//			result = new String(content, "UTF-8");
//			JSONObject jsonObject = JSONObject.parseObject(result);
//			logger.info(result);
//			if(jsonObject.containsKey("success") && jsonObject.getBoolean("success")) {
//				jsonObject.put("status", "ok");
//			}else{
//				jsonObject.put("status", "error");
//			}
//			jsonObject.remove("success");

			// 把返回值输出到客户端
			ServletOutputStream out = servletResponse.getOutputStream();
			out.write(content);
			out.flush();
		}
	}
	
}
