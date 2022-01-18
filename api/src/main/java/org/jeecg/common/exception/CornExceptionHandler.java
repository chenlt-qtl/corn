package org.jeecg.common.exception;

import org.apache.shiro.authz.AuthorizationException;
import org.jeecg.common.api.vo.Result;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;

import lombok.extern.slf4j.Slf4j;

/**
 * 异常处理器
 * 
 * @author scott
 * @date 2019
 */
@RestControllerAdvice
@Slf4j
public class CornExceptionHandler {

	/**
	 * 处理自定义异常
	 */
	@ExceptionHandler(CornException.class)
	public Result<?> handleRRException(CornException e){
		log.error(e.getMessage(), e);
		return Result.error(e.getMessage());
	}

	@ExceptionHandler(Exception.class)
	public Result<?> handleException(Exception e){
		log.error(e.getMessage(), e);
		return Result.error(e.getMessage());
	}
}
