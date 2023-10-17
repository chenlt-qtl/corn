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
package org.seed.modules.word.util;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.util.EntityUtils;
import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.seed.common.exception.CornException;
import org.seed.common.system.controller.CommonController;
import org.seed.common.util.UpLoadUtil;
import org.seed.modules.word.entity.IcibaSentence;
import org.seed.modules.word.entity.WordEnglist;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.net.URLEncoder;
import java.util.*;

/**
 * 描述：
 *
 * @author chenlt
 */
public class ParseIciba {

    private final static Logger logger = LoggerFactory.getLogger(ParseIciba.class);
    private final static String KEY = "C772DB1F60B2839AD948507D91E7B04A";

    public static Map getWordFromIciba(String wordName, String uploadpath) {
        Map detailMap = new HashMap();
        try {


            HttpRequestBase httpRequest = new HttpGet("http://dict-co.iciba.com/api/dictionary.php?w=" + wordName + "&key=" + KEY);
            CloseableHttpResponse response = HttpClientFactory.getHttpClient().execute(httpRequest);
            int status = response.getStatusLine().getStatusCode();
            if (status == 200) {
                detailMap = ParseIciba.parse(EntityUtils.toString(response.getEntity(), "UTF-8"), uploadpath, wordName);
            }
        } catch (Exception e) {
            throw new CornException(e.getMessage());
        }
        return detailMap;
    }

    /**
     * 解析查询结果
     *
     * @param data
     * @param upload
     * @param wordName
     * @return
     * @throws Exception
     */
    private static Map parse(String data, String upload, String wordName) throws Exception {
        WordEnglist word = new WordEnglist(wordName);
        Map result = null;
        Document doc = DocumentHelper.parseText(data);
        Element rootElt = doc.getRootElement(); // 获取根节点
        Iterator phIter = rootElt.elementIterator("ps"); // 美式音标
        if (phIter.hasNext()) {
            result = new HashMap();
            while (phIter.hasNext()) {
                Element phElement = (Element) phIter.next();
                if (!phIter.hasNext()) {//最后一个元素
                    word.setPhAm(phElement.getTextTrim());
                }
            }
            Iterator pronIter = rootElt.elementIterator("pron"); // 美式发音
            while (pronIter.hasNext()) {//下载发音MP3
                Element pronElement = (Element) pronIter.next();
                logger.info("-----------" + pronElement.getText());
                if (!pronIter.hasNext()) {//最后一个元素

                    String pathArr[] = UpLoadUtil.getFilePaths(upload, CommonController.WORD_PRON, ".mp3", word.getWordName());//获取保存路径
                    try {
                        InputStream in = new URL(pronElement.getTextTrim()).openConnection().getInputStream();//创建连接、输入流
                        UpLoadUtil.saveFile(in, pathArr[0]);
                        word.setPhAnMp3(pathArr[1]);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }

            List posList = rootElt.elements("pos");
            List acceptationElements = rootElt.elements("acceptation");
            if (posList.size() != acceptationElements.size()) {
                throw new Exception("意思和时态配对失败");
            }

            String acceptation = "";

            for (int i = 0; i < posList.size(); i++) {

                Element posElement = (Element) posList.get(i);
                Element acceptationElement = (Element) acceptationElements.get(i);
                String pos = posElement.getText();
                if (StringUtils.isNotBlank(pos)) {
                    acceptation += pos + "  ";
                }
                acceptation += (acceptationElement.getText().replace("\n", "")) + "|";
            }
            word.setAcceptation(acceptation);

            List<IcibaSentence> isList = new ArrayList<IcibaSentence>();
            Iterator sentElement = rootElt.elementIterator("sent");
            while (sentElement.hasNext()) {
                Element sent = (Element) sentElement.next();
                Element orig = (Element) sent.element("orig");
                Element trans = (Element) sent.element("trans");
                IcibaSentence is = new IcibaSentence();
                is.setOrig(URLEncoder.encode(orig.getText(), "utf-8"));
                is.setTrans(URLEncoder.encode(trans.getText(), "utf-8"));
                isList.add(is);

            }

            result.put("icibaSentence", isList);
            result.put("word", word);
        }
        return result;
    }

    public static void main(String args[]) throws IOException, Exception {
        File file = new File("D://upFiles//a.xml");
        Map map = ParseIciba.parse(FileUtils.readFileToString(file, "UTF-8"), "D://upFiles", "identify");
        List list2 = (List) map.get("icibaSentence");
        System.out.println(list2);
    }
}
