(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[16],{EAz3:function(e,t,a){"use strict";a.d(t,"a",(function(){return r})),a.d(t,"e",(function(){return i})),a.d(t,"d",(function(){return s})),a.d(t,"c",(function(){return l})),a.d(t,"b",(function(){return u}));var n,c=a("oBTY"),r=/[\n]+/,i=/^\[(\d{2}):(\d{2}\.\d{2})\](\[(\d{2}):(\d{2}\.\d{2})\])?/,s=function(e,t){var a=[],n=/([a-z|'|-]+)/gi;t&&(n=/([\u4e00-\u9fa5])/gi);var c=null;return e.reduce((function(e,t){if(t){var a={allWords:[]},r=0;while(c=n.exec(t)){var i=c[0];c.index>r&&a.allWords.push({text:t.slice(r,c.index).trim(),isWord:!1}),a.allWords.push({text:i,isWord:!0}),r=c.index+i.length}r<t.length&&a.allWords.push({text:t.slice(r).trim(),isWord:!1}),e.push(a)}return e}),a)},l=function(e){var t=e.match(i);if(t){var a,n,r=Object(c["a"])(t),s=(r[0],r[1]),l=r[2],u=(r[3],r[4]),o=r[5];if(s&&(a=60*Number.parseInt(s)+Number.parseFloat(l),u)){var m=60*Number.parseInt(u)+Number.parseFloat(o);n=m-a}return a+","+n}},u=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"0",a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"0",c=arguments.length>3&&void 0!==arguments[3]?arguments[3]:1;console.log("times",t,a),clearTimeout(n),e.pause();var r=parseInt(t),i=parseFloat(a);if(e.currentTime=r,e.playbackRate=c,e.play(),i){var s=i/c;console.log("duration",s),n=setTimeout((function(){e.pause()}),1e3*s)}}},FWUx:function(e,t,a){e.exports={chineseWin:"chineseWin___1kAAx",show:"show___2xf8n",hide:"hide___3sjqy",close:"close___1mSZT"}},TRe3:function(e,t,a){e.exports={toolbar:"toolbar___2bgI5",btnDiv:"btnDiv___3JAc8",label:"label___2xxtn",menuContent:"menuContent___2F-S4",title:"title___1G8G5",subTitle:"subTitle___3WNJk",activeMenu:"activeMenu___38R2y",caret:"caret___3ZATu"}},c71E:function(e,t,a){"use strict";a.r(t);a("T2oS");var n=a("W9HT"),c=a("tJVT"),r=a("q1tI"),i=a.n(r),s=a("dJx9"),l=a.n(s),u=(a("Q9mQ"),a("diRs")),o=(a("+L6B"),a("2/Rp")),m=a("9og8"),d=a("WmNS"),p=a.n(d),f=a("WHYC"),v=a("VTBJ"),b={icon:{tag:"svg",attrs:{viewBox:"0 0 1024 1024",focusable:"false"},children:[{tag:"path",attrs:{d:"M715.8 493.5L335 165.1c-14.2-12.2-35-1.2-35 18.5v656.8c0 19.7 20.8 30.7 35 18.5l380.8-328.4c10.9-9.4 10.9-27.6 0-37z"}}]},name:"caret-right",theme:"outlined"},h=b,_=a("6VBw"),E=function(e,t){return r["createElement"](_["a"],Object(v["a"])(Object(v["a"])({},e),{},{ref:t,icon:h}))};E.displayName="CaretRightOutlined";var O=r["forwardRef"](E),j=a("eyie"),N=a("5bA4"),g=a("UESt"),x=a("9kvl"),y=a("sy1d");function w(e){return k.apply(this,arguments)}function k(){return k=Object(m["a"])(p.a.mark((function e(t){return p.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",Object(y["a"])("/api/read/article/"+t));case 1:case"end":return e.stop()}}),e)}))),k.apply(this,arguments)}function T(){return S.apply(this,arguments)}function S(){return S=Object(m["a"])(p.a.mark((function e(){return p.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",Object(y["a"])("/api/read/menu"));case 1:case"end":return e.stop()}}),e)}))),S.apply(this,arguments)}var W,I=a("TRe3"),C=a.n(I),R=function(e){var t=e.setRate,a=e.setArticleId,n=Object(r["useState"])([]),s=Object(c["a"])(n,2),l=s[0],d=s[1],f=Object(r["useState"])(0),v=Object(c["a"])(f,2),b=v[0],h=v[1],_=Object(r["useState"])([]),E=Object(c["a"])(_,2),x=E[0],y=E[1],w=Object(r["useState"])(-1),k=Object(c["a"])(w,2),S=k[0],W=k[1];Object(r["useEffect"])((function(){I()}),[]);var I=function(){var e=Object(m["a"])(p.a.mark((function e(){var t,a;return p.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,T();case 2:t=e.sent,t.success&&(a=JSON.parse(t.result.value),y(a),R(a));case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();Object(r["useEffect"])((function(){R(x)}),[e.match.params.menuIndex]);var R=function(t){var n=e.match.params.menuIndex||0;if(1*n>=t.length&&(n=0),W(n),h(0),t.length>0){var c=t[n].ids||[];d(c),c.length>0&&a(c[0])}h(0)},A=function(t){e.history.push("/all/read/"+t)},J=function(e){h(e),a(l[e])},M=function(){var a=[1,.7,.5],n=e.rate,c=a.indexOf(n),r=0===c?2:c-1;t(a[r])},B=i.a.createElement("div",{className:C.a.menuContent},x.map((function(e,t){return i.a.createElement("div",{key:t,onClick:function(){return A(t)},className:S==t?C.a.activeMenu:""},S==t?i.a.createElement("div",{className:C.a.caret},i.a.createElement(O,null)):"",i.a.createElement("div",{className:C.a.title},"M",t+1),i.a.createElement("div",{className:C.a.subTitle},e.subTitle))})));return i.a.createElement("div",{className:C.a.toolbar},i.a.createElement("div",{className:C.a.btnDiv},i.a.createElement(u["a"],{content:B,trigger:"click"},i.a.createElement(o["a"],{type:"primary",shape:"circle",icon:i.a.createElement(j["a"],null)})),i.a.createElement("div",{className:C.a.label},"\u76ee\u5f55")),i.a.createElement("div",{className:C.a.btnDiv},i.a.createElement(o["a"],{onClick:M,type:"primary",shape:"circle"},e.rate),i.a.createElement("div",{className:C.a.label},"\u8bed\u901f")),i.a.createElement("div",{className:C.a.btnDiv},i.a.createElement(o["a"],{onClick:function(){return J(b-1)},type:"primary",shape:"circle",disabled:0==b,icon:i.a.createElement(N["a"],null)}),i.a.createElement("div",{className:C.a.label},"\u4e0a\u4e00\u9875")),i.a.createElement("div",{className:C.a.btnDiv},i.a.createElement(o["a"],{onClick:function(){return J(b+1)},type:"primary",shape:"circle",disabled:b>=l.length-1,icon:i.a.createElement(g["a"],null)}),i.a.createElement("div",{className:C.a.label},"\u4e0b\u4e00\u9875")))},A=Object(x["b"])((function(e){var t=e.read.rate;return{rate:t}}),(function(e){return{setRate:function(t){return e({type:"read/refreshRate",payload:t})},setArticleId:function(t){return e({type:"read/refreshArticleId",payload:t})}}}))(Object(f["k"])(R)),J=a("hPiM"),M=a.n(J),B=a("EAz3"),z=a("FWUx"),D=a.n(z),F=(a("H1Ta"),function(e){var t=e.className;return i.a.createElement("span",{className:"fa ".concat(t)})}),V=F,H=function(e){var t=e.chinese,a=e.visible,n=e.setVisible,c=function(e){e.stopPropagation(),!a&&n(!0)},r=function(e){e.stopPropagation(),n(!1)},s=function(){return i.a.createElement(i.a.Fragment,null,t?i.a.createElement("div",{className:"".concat(D.a.chineseWin," ").concat(a?D.a.show:D.a.hide)},a?i.a.createElement("div",{className:D.a.close,onClick:r}," ",i.a.createElement(V,{className:"fa-times-circle"})):null,i.a.createElement("div",{className:D.a.chinese,onClick:c},a?t:"\u663e\u793a\u4e2d\u6587")):null)};return s()},L=H,q=new Audio,P=function(e){var t=e.articleId,a=e.setLoading,n=e.rate,s=Object(r["useState"])(),l=Object(c["a"])(s,2),u=l[0],o=l[1],d=Object(r["useState"])(),f=Object(c["a"])(d,2),v=f[0],b=f[1],h=Object(r["useState"])(),_=Object(c["a"])(h,2),E=_[0],O=_[1],j=Object(r["useState"])(-1),N=Object(c["a"])(j,2),g=N[0],x=N[1],y=Object(r["useState"])(""),k=Object(c["a"])(y,2),T=k[0],S=k[1],I=Object(r["useState"])(!0),C=Object(c["a"])(I,2),R=C[0],A=C[1];Object(r["useEffect"])((function(){J()}),[t]);var J=function(){var e=Object(m["a"])(p.a.mark((function e(){var n,c,r,i,s,l;return p.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(t){e.next=2;break}return e.abrupt("return");case 2:return a(!0),x(-1),e.next=6,w(t);case 6:n=e.sent,c=n.result,r=c.article,i=c.sentences,s=c.read,W=i,o(r.picture),b((s.position||"").split("|")),q.src=r.mp3,q.load(),l=[],W=i.records,W.map((function(e){return l.push(e.mp3Time)})),O(l),Object(B["b"])(q,"0","0.0001",1),setTimeout((function(){return a(!1)}),0);case 19:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),z=function(e){x(e);var t=E[e].split(",");Object(B["b"])(q,t[0],t[1],n),S(W[e].acceptation)},D=function(){return i.a.createElement("div",{className:M.a.content},i.a.createElement("div",{className:M.a.picture},(E||[]).map((function(e,t){var a=v[t].split(",");return i.a.createElement("div",{key:t,onClick:function(){return z(t)},className:"".concat(M.a.mask," ").concat(t==g?M.a.active:""),style:{top:a[0],height:a[1]}},t==g?i.a.createElement(L,{chinese:T,visible:R,setVisible:A}):null)})),i.a.createElement("img",{src:u})))};return D()},U=Object(x["b"])((function(e){var t=e.read,a=t.rate,n=t.articleId;return{rate:a,articleId:n}}))(P),Z=function(e,t){var a=Object(r["useState"])(!1),s=Object(c["a"])(a,2),u=s[0],o=s[1],m=function(){return i.a.createElement("div",{className:l.a.container},i.a.createElement(n["a"],{spinning:u},i.a.createElement(U,{setLoading:o}),i.a.createElement(A,null)))};return m()};t["default"]=Z},dJx9:function(e,t,a){e.exports={container:"container___NODTb"}},eyie:function(e,t,a){"use strict";var n=a("VTBJ"),c=a("q1tI"),r={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M904 160H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0 624H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0-312H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8z"}}]},name:"menu",theme:"outlined"},i=r,s=a("6VBw"),l=function(e,t){return c["createElement"](s["a"],Object(n["a"])(Object(n["a"])({},e),{},{ref:t,icon:i}))};l.displayName="MenuOutlined";t["a"]=c["forwardRef"](l)},hPiM:function(e,t,a){e.exports={content:"content___Lovlt",picture:"picture___3IoIq",mask:"mask___14021",active:"active___c_Z9W"}}}]);