import { parse } from 'querystring';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

export const guid = () => {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }

  const time = String(new Date().getTime());
  return S4() + S4() + S4() + S4() + S4() + S4() + time.substring(time.length - 8);
}

export const isNormalNoteId = (id: string) => {
  if (id) {
    if (id != "search" && id != "fav" && id != "newest") {
      return true
    }
  }
  return false
}

/**
 * 加密
 * @param str 
 * @returns 
 */
export const encryption = (str: string = "") => {
  var encStr = encodeURIComponent(str);
  encStr = btoa(encStr);

  return addRandomStr(encStr);
}


export const decrypt = (str: string = "") => {
  var decStr = atob(removeRandomStr(str));
  decStr = decodeURIComponent(decStr);
  return decStr;
}



const addRandomStr = (text: string) => {
  if (text) {
    const length = Math.ceil(Math.random() * 4 + 5);
    const randomStr = guid();

    const start = randomStr.substr(0, length);
    const end = randomStr.substr(-length);

    return start + text + end + length;
  }
  return "";
}

const removeRandomStr = (text: string) => {
  if (text) {
    const length = Number(text.substring(text.length - 1));
    return text.substring(length, text.length - length - 1);
  }
  return "";
}