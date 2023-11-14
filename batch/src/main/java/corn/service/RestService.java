package com.quantil.hdt.service;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.quantil.hdt.core.constant.HeaderConstants;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.NameValuePair;
import org.apache.http.client.utils.URLEncodedUtils;
import org.apache.http.message.BasicNameValuePair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.alibaba.fastjson.JSON;
import com.quantil.hdt.core.util.RequestHelper;

@Service
public abstract class RestService {
	private final static Logger log = LoggerFactory.getLogger(RestService.class);

	@Autowired
	private RestTemplate restTemplate;

	public <T, R> T restApi(String uri, R body, HttpMethod httpMethod,
			ParameterizedTypeReference<?> parameterizedTypeReference,Map<String, String> headersFromUser) {
		HttpEntity<R> requestEntity = new HttpEntity<>(body, getHeader(headersFromUser));
		String url = getUrl() + uri;
		log.info("Request url: [{}], method: {}, RequestBody: {}, RequestHeader: {} ", url, httpMethod.name(), JSON.toJSONString(body), requestEntity.getHeaders());
		T result = (T) restTemplate.exchange(url, httpMethod, requestEntity, parameterizedTypeReference).getBody();
		log.info("result: {}", JSON.toJSONString(result));
		return result;
	}

	public <R> Long restApiWithResponseHeader(String uri, R body, HttpMethod httpMethod,
	                                          ParameterizedTypeReference<?> parameterizedTypeReference, Map<String, String> headersFromUser) {
		HttpEntity<R> requestEntity = new HttpEntity<>(body, getHeader(headersFromUser));
		String url = getUrl() + uri;
		log.info("Request url: [{}], method: {}, RequestBody: {}, RequestHeader: {} ", url, httpMethod.name(), JSON.toJSONString(body), requestEntity.getHeaders());
		HttpHeaders headers = restTemplate.exchange(url, httpMethod, requestEntity, parameterizedTypeReference).getHeaders();
		String location = headers.getFirst(HeaderConstants.LOCATION);
		log.info("location: {}", location);
		//提取location的url中的id
		Long createdId = null;
		if (StringUtils.isNotBlank(location)) {
			int lastSlash = location.lastIndexOf("/");
			String createdIdStr = location.substring(lastSlash + 1);
			createdId = Long.valueOf(createdIdStr);
		}
		return createdId;
	}

	/**
	 * @Description url已编码的请求调用该方法，直接传递URI,以避免restTemplate的再次编码
	 * @Author cj
	 * @Param uri
	 * @Param body
	 * @Param httpMethod
	 * @Param parameterizedTypeReference
	 * @Return T
	 */
	public <T, R> T restApi(URI uri, R body, HttpMethod httpMethod,
	                        ParameterizedTypeReference<?> parameterizedTypeReference,Map<String, String> headersFromUser) {
		HttpEntity<R> requestEntity = new HttpEntity<>(body, getHeader(headersFromUser));
		log.info("Request url: [{}], method: {}, RequestBody: {}, RequestHeader: {} ", uri.toString(), httpMethod.name(), JSON.toJSONString(body), requestEntity.getHeaders());
		T result = (T) restTemplate.exchange(uri, httpMethod, requestEntity, parameterizedTypeReference).getBody();
		log.info("result: {}", JSON.toJSONString(result));
		return result;
	}

	abstract String getUrl();

	protected HttpHeaders getHeader(Map<String, String> headersFromUser) {
		HttpHeaders headers = null;
		try {
			headers = RequestHelper.getRequestHeader(headersFromUser);
		} catch (Exception e) {
			log.error("Fail to set http header", e);
		}
		return headers;
	}

	public String parseUrl(String url, Map<String, ?> params) {
		if (null == params || params.size() <= 0) {
			return url;
		}
		List<NameValuePair> pairs = new ArrayList<NameValuePair>();
		for (Map.Entry<String, ?> param : params.entrySet()) {
			pairs.add(new BasicNameValuePair(param.getKey(), String.valueOf(param.getValue())));
		}
		return url + "?" + URLEncodedUtils.format(pairs, "UTF-8");
	}

}
