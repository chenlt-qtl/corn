package com.quantil.hdt.controller;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.quantil.hdt.core.config.HdtConfig;

@Controller
@RequestMapping(value = "/hdt")
public class IndexController {
	private static Logger logger = LoggerFactory.getLogger(IndexController.class);
	
	@Resource
	private HdtConfig hdtConfig;

	@GetMapping(value = "/home")
	public String index() {
		String prefix = "";
		if (!StringUtils.isEmpty(hdtConfig.getUrlPrefix())) {
			prefix = hdtConfig.getUrlPrefix().replaceFirst("/", "") + "/";
		}
		String index = prefix + "index";
		logger.info("Request index: "+ index);
		return index;
	}

	@GetMapping(value = "/")
	public String rootIndex() {
		return index();
	}

	@GetMapping()
	public String rootIndex2() {
		return index();
	}
}
