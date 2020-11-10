import { RequestInterceptor, RequestOptionsInit } from "umi-request";
  
const tokenInterceptor:RequestInterceptor=(
    url:string,
    options:RequestOptionsInit
)=>{
    const token = localStorage.getItem('jwToken');
    
    const o = options;
    if(token){
        o.headers={
            ...options.headers,['X-Access-Token']:token,fromType:'itrip-admin',
        }
    }
    return {
        url,options:o
    }
}
  
  export default tokenInterceptor;