package org.seed.common.api.vo;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

/**
 *   接口返回数据格式
 * @author scott
 * @email jeecgos@163.com
 * @date  2019年1月19日
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Result implements Serializable {

	private static final long serialVersionUID = 1L;

	/**
	 * 是否成功
	 */
	private boolean success;

	/**
	 * 返回处理消息
	 */
	private String message;

	private Object result;

	public Result(boolean success, String message) {
		this.success = success;
		this.message = message;
	}

	public Result(boolean success, String message, Object result) {
		this.success = success;
		this.message = message;
		this.result = result;
	}
}
