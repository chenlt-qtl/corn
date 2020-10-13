package org.jeecg.servlet;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import java.util.*;

public class ApiProxyServletRequestWrapper extends HttpServletRequestWrapper {

	private Map headerMap;

	public void addHeader(String name, String value) {
		headerMap.put(name, new String(value));
	}

	public ApiProxyServletRequestWrapper(HttpServletRequest request) {
		super(request);
		headerMap = new HashMap();
	}

	@Override
	public Enumeration getHeaderNames() {
		HttpServletRequest request = (HttpServletRequest) getRequest();
		List list = new ArrayList();
		for (Enumeration e = request.getHeaderNames(); e.hasMoreElements();) {
			list.add(e.nextElement().toString());
		}
		for (Iterator i = headerMap.keySet().iterator(); i.hasNext();) {
			list.add(i.next());
		}
		return Collections.enumeration(list);
	}

	@Override
	public String getHeader(String name) {
		Object value;
		if ((value = headerMap.get("" + name)) != null) {
			return value.toString();
		} else {
			return ((HttpServletRequest) getRequest()).getHeader(name);
		}

	}

	@Override
	public Enumeration<String> getHeaders(String name) {
		List<String> values = new ArrayList<>();
		for (Enumeration e = super.getHeaders(name); e.hasMoreElements();) {
			values.add(e.nextElement().toString());
		}
		if (headerMap.containsKey(name)) {
			values.add((String) headerMap.get(name));
		}
		return Collections.enumeration(values);
	}

	@Override
	public String getPathInfo() {
		return this.getRequestURI();
	}

}