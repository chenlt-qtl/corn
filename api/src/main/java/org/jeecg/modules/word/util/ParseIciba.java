/**
* @(#)ParseIciba.java 2016年12月1日
* 
* Copyright 2000-2016 by ChinanetCenter Corporation.
*
* All rights reserved.
*
* This software is the confidential and proprietary information of
* ChinanetCenter Corporation ("Confidential Information"). You
* shall not disclose such Confidential Information and shall use
* it only in accordance with the terms of the license agreement
* you entered into with ChinanetCenter.
*
*/
package org.jeecg.modules.word.util;

import org.apache.commons.io.FileUtils;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.util.EntityUtils;
import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.jeecg.common.util.UpLoadUtil;
import org.jeecg.modules.word.entity.Acceptation;
import org.jeecg.modules.word.entity.IcibaSentence;
import org.jeecg.modules.word.entity.Word;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.FileCopyUtils;

import java.io.*;
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
	private final static String KEY="C772DB1F60B2839AD948507D91E7B04A";

	public static Map getWordFromIciba(String wordName, String uploadpath) throws Exception {
		Map detailMap = new HashMap();
		HttpRequestBase httpRequest = new HttpGet("http://dict-co.iciba.com/api/dictionary.php?w=" + wordName + "&key=" + KEY);
		CloseableHttpResponse response = HttpClientFactory.getHttpClient().execute(httpRequest);
		int status = response.getStatusLine().getStatusCode();
		if (status == 200) {
			detailMap = ParseIciba.parse(EntityUtils.toString(response.getEntity(), "UTF-8"),uploadpath, wordName);
		}
		return detailMap;
	}

	/**
	 * 解析查询结果
	 * @param data
	 * @param upload
	 * @param wordName
	 * @return
	 * @throws Exception
	 */
	private static Map parse(String data, String upload, String wordName) throws Exception{
		Word word = new Word(wordName);
		Map result = new HashMap();
		Document doc = DocumentHelper.parseText(data);
		Element rootElt = doc.getRootElement(); // 获取根节点
		Iterator phIter = rootElt.elementIterator("ps"); // 美式音标
		if(!phIter.hasNext()){
			throw new Exception("没有找到 "+wordName+" 对应的信息");
		}
		while (phIter.hasNext()) {
			Element phElement = (Element) phIter.next();
			if(!phIter.hasNext()) {//最后一个元素
				word.setPhAm(phElement.getTextTrim());
			}
		}
		Iterator pronIter = rootElt.elementIterator("pron"); // 美式发音
		while (pronIter.hasNext()) {//下载发音MP3
			Element pronElement = (Element) pronIter.next();
			logger.info("-----------"+pronElement.getText());
			if(!pronIter.hasNext()) {//最后一个元素

				String pathArr[] = UpLoadUtil.getWordFilePath(upload,word.getWordName()+".mp3",true);//获取保存路径
				try {
					InputStream in = new URL(pronElement.getTextTrim()).openConnection().getInputStream();//创建连接、输入流
					UpLoadUtil.saveFile(in,pathArr[0]);
					word.setPhAnMp3(pathArr[1]);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}
		
		List posList = rootElt.elements("pos"); 
		List acceptationElements = rootElt.elements("acceptation"); 
		if(posList.size()!=acceptationElements.size()){
			throw new Exception("意思和时态配对失败");
		}
		
		List<Acceptation> acceptationList = new ArrayList<Acceptation>();
				
		for(int i = 0 ;i<posList.size();i++){
			
			Element posElement = (Element) posList.get(i);
			Element acceptationElement = (Element) acceptationElements.get(i);
			Acceptation acceptation = new Acceptation();
			acceptation.setPos(posElement.getText());
			acceptation.setAcceptation(acceptationElement.getText().replace("\n",""));
			acceptationList.add(acceptation);
		}
		
		List<IcibaSentence> isList = new ArrayList<IcibaSentence>();
		Iterator sentElement = rootElt.elementIterator("sent"); 
		while(sentElement.hasNext()){
			Element sent = (Element)sentElement.next();
			Element orig = (Element)sent.element("orig");
			Element trans = (Element)sent.element("trans");
			IcibaSentence is = new IcibaSentence();
			is.setOrig(URLEncoder.encode(orig.getText(), "utf-8"));
			is.setTrans(URLEncoder.encode(trans.getText(), "utf-8"));
			isList.add(is);
			
		}
		
		result.put("acceptations", acceptationList);
		result.put("icibaSentence", isList);
		result.put("word", word);
		return result;
	}
	
	public static void main(String args[]) throws IOException, Exception{
		File file = new File("D://upFiles//a.xml");
		Map map = ParseIciba.parse(FileUtils.readFileToString(file, "UTF-8"),"D://upFiles","identify");
		List list1= (List)map.get("acceptations");
		List list2= (List)map.get("icibaSentence");
		System.out.println(map.get("acceptations").toString());
	}
}
