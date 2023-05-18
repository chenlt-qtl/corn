import { request as req } from 'umi';
import { REMAIN_TIME_KEY, getLogoutTimeStamp } from '@/components/LoginTimer'

interface requestOption {
    method: "GET" | "POST" | "DELETE" | "PUT";
    data?: object;
    headers?: object
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [option] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url: string, option: requestOption = { method: "GET" }) {


    //如果是get 不缓存
    if (!option.method || option.method.toUpperCase() == "GET") {
        option = { ...option, headers: { pragma: "no-cache", 'Cache-Control': 'no-cache', ...option.headers || {} } }
    }


    return req(url, option).then(req => {
        localStorage.setItem(REMAIN_TIME_KEY, String(getLogoutTimeStamp()));
        return req;
    })
}

