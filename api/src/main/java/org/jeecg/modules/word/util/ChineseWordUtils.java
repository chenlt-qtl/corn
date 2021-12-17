/**
 * @(#)ParseIciba.java 2016年12月1日
 * <p>
 * Copyright 2000-2016 by ChinanetCenter Corporation.
 * <p>
 * All rights reserved.
 * <p>
 * This software is the confidential and proprietary information of
 * ChinanetCenter Corporation ("Confidential Information"). You
 * shall not disclose such Confidential Information and shall use
 * it only in accordance with the terms of the license agreement
 * you entered into with ChinanetCenter.
 */
package org.jeecg.modules.word.util;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.util.EntityUtils;
import org.jeecg.modules.word.entity.WordChinese;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 描述：
 *
 * @author chenlt
 */
public class ChineseWordUtils {

    private final static Logger logger = LoggerFactory.getLogger(ChineseWordUtils.class);
    private final static String KEY = "0566d61cd91b5411";

    public static WordChinese getWordFromApi(String wordName) throws Exception {
        WordChinese wordChinese = null;
        HttpRequestBase httpRequest = new HttpGet("https://api.jisuapi.com/zidian/word?appkey=" + KEY + "&word=" + wordName);
        CloseableHttpResponse response = HttpClientFactory.getHttpClient().execute(httpRequest);
        int status = response.getStatusLine().getStatusCode();
        if (status == 200) {
            wordChinese = ChineseWordUtils.parse(EntityUtils.toString(response.getEntity(), "UTF-8"), wordName);
        }
        return wordChinese;
    }

    /**
     * 解析查询结果
     *
     * @param text
     * @param wordName
     * @return
     * @throws Exception
     */
    private static WordChinese parse(String text, String wordName) throws Exception {
        logger.info("===========API查询结果 "+wordName+" : "+text," ============");
        WordChinese wordChinese = new WordChinese();
        JSONObject jsonObject = JSON.parseObject(text);
        if (jsonObject.getInteger("status") == 0) {
            wordChinese.setWordName(wordName);
            JSONObject data = jsonObject.getJSONObject("result");
            wordChinese.setPinYin(data.getString("pinyin"));
            wordChinese.setBiHuaShu(data.getInteger("bihua"));
            wordChinese.setBuShou(data.getString("bushou"));
            wordChinese.setJieGou(data.getString("jiegou"));
            wordChinese.setBiShun(data.getString("bishun"));
            wordChinese.setWubi(data.getString("wubi"));
            wordChinese.setEnglish(StringUtils.join(data.getJSONArray("english"), ","));
            JSONArray explains = data.getJSONArray("explain");

            String acceptation = "";
            for (Object explainObj : explains) {
                JSONObject explain = (JSONObject) explainObj;
                acceptation += String.format("%s|%s||",explain.getString("pinyin"),explain.getString("content"));
            }
            wordChinese.setAcceptation(acceptation);
        }

        return wordChinese;
    }

    public static void main(String args[]) throws IOException, Exception {
        WordChinese wordChinese = ChineseWordUtils.getWordFromApi("好");

        System.out.println(wordChinese);
    }
}
