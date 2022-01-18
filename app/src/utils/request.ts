import { request as req } from 'umi';
import LoginTimer from "./loginTimer";

interface requestOption {
    method: ["GET" | "POST" | "DELETE" | "PUT"];
    data?: object;
}

const loginTimer = new LoginTimer;

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [option] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url: string, option?: requestOption) {
    return req(url, option).then(req => {
        loginTimer.resetTimer(url)
        return req;
    })
}

