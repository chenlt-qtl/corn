package corn.service;


import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import corn.modal.Result;
import corn.utils.BtoaEncode;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.NameValuePair;
import org.apache.http.client.utils.URLEncodedUtils;
import org.apache.http.message.BasicNameValuePair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class RestService {

    private static final String LOGIN_URL = "/sys/login";

    @Value("${corn.apiUrl}")
    String apiUrl;

    String token = "";

    @Autowired
    private RestTemplate restTemplate;

    public void login() {
        Map param = new HashMap(2);
        param.put("username", BtoaEncode.encryption("damu"));
        param.put("password", BtoaEncode.encryption("shmily@123"));
        Result post = post(LOGIN_URL, param);
        Map result = (Map) post.getResult();
        token = (String) result.get("token");
    }

    public Result get(String uri, Map<String, ?> param) {
        return restApi(parseUrl(uri, param), null, HttpMethod.GET);
    }

    public <R> Result post(String uri, R body) {
        return restApi(uri, body, HttpMethod.POST);
    }

    public <R> Result put(String uri, R body) {
        return restApi(uri, body, HttpMethod.PUT);
    }

    public <R> Result delete(String uri) {
        return restApi(uri, null, HttpMethod.DELETE);
    }

    private <R> Result restApi(String uri, R body, HttpMethod httpMethod) {

        //头部
        HttpHeaders headers = new HttpHeaders();
        //不是登录URL要设置token
        if (!LOGIN_URL.equals(uri)) {
            if (StringUtils.isBlank(token)) {
                login();
            }
            headers.set("X-Access-Token", token);
        }

        HttpEntity<R> requestEntity = new HttpEntity(body, headers);

        String url = apiUrl + uri;
        log.info("Request url: [{}], method: {}, RequestBody: {}, RequestHeader: {} ", url, httpMethod.name(), JSON.toJSONString(body), requestEntity.getHeaders());

        Result result;
        if(httpMethod.matches("GET")){
            //url已编码的请求调用该方法，直接传递URI,以避免restTemplate的再次编码
            result = restTemplate.exchange(URI.create(url), httpMethod, requestEntity, new ParameterizedTypeReference<Result>() {
            }).getBody();
        }else {
            result = restTemplate.exchange(url, httpMethod, requestEntity, new ParameterizedTypeReference<Result>() {
            }).getBody();
        }
        log.info("result: {}", result);
        return result;
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
