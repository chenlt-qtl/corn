package org.jeecg.common.exception;

public class CornException extends RuntimeException {
	private static final long serialVersionUID = 1L;

	public CornException(String message){
		super(message);
	}
	
	public CornException(Throwable cause)
	{
		super(cause);
	}
	
	public CornException(String message, Throwable cause)
	{
		super(message,cause);
	}
}
