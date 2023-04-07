package org.seed.common.util;

import org.seed.common.api.vo.Result;

public class ResultUtils {


    private static final String SUCCESS_MSG = "操作成功";
    private static final String ERROR_MSG = "操作失败";


    public static Result ok() {
        return new Result(true, SUCCESS_MSG);
    }

    public static Result ok(String message) {
        return new Result(true, message);
    }

    public static Result okData(Object data) {
        return new Result(true, SUCCESS_MSG, data);
    }

    public static Result ok(String msg, Object data) {
        return new Result(true, msg, data);
    }

    public static Result error() {
        return new Result(false, ERROR_MSG);
    }

    public static Result error(String msg) {
        return new Result(false, msg);
    }
}
