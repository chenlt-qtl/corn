package org.jeecg.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Controller
public class IndexController {
	private static Logger logger = LoggerFactory.getLogger(IndexController.class);

	public String index() {
		return "index";
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
