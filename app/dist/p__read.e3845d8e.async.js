(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[16],{EAz3:function(e,t,a){"use strict";a.d(t,"a",(function(){return c})),a.d(t,"e",(function(){return i})),a.d(t,"d",(function(){return u})),a.d(t,"c",(function(){return s})),a.d(t,"b",(function(){return l}));var n,r=a("oBTY"),c=/[\n]+/,i=/^\[(\d{2}):(\d{2}\.\d{2})\](\[(\d{2}):(\d{2}\.\d{2})\])?/,u=function(e,t){var a=[],n=/([a-z|'|-]+)/gi;t&&(n=/([\u4e00-\u9fa5])/gi);var r=null;return e.reduce((function(e,t){if(t){var a={allWords:[]},c=0;while(r=n.exec(t)){var i=r[0];r.index>c&&a.allWords.push({text:t.slice(c,r.index).trim(),isWord:!1}),a.allWords.push({text:i,isWord:!0}),c=r.index+i.length}c<t.length&&a.allWords.push({text:t.slice(c).trim(),isWord:!1}),e.push(a)}return e}),a)},s=function(e){var t=e.match(i);if(t){var a,n,c=Object(r["a"])(t),u=(c[0],c[1]),s=c[2],l=(c[3],c[4]),o=c[5];if(u&&(a=60*Number.parseInt(u)+Number.parseFloat(s),l)){var m=60*Number.parseInt(l)+Number.parseFloat(o);n=m-a}return a+","+n}},l=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"0",a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"0",r=arguments.length>3?arguments[3]:void 0;console.log("times",t,a),clearTimeout(n),e.pause();var c=parseInt(t),i=parseFloat(a);if(e.currentTime=c,e.playbackRate=r,e.play(),i){var u=i/r;console.log("duration",u),n=setTimeout((function(){e.pause()}),1e3*u)}}},TRe3:function(e,t,a){e.exports={toolbar:"toolbar___2bgI5",btnDiv:"btnDiv___3JAc8",label:"label___2xxtn",menuContent:"menuContent___2F-S4",title:"title___1G8G5",subTitle:"subTitle___3WNJk",activeMenu:"activeMenu___38R2y",caret:"caret___3ZATu"}},c71E:function(e,t,a){"use strict";a.r(t);a("T2oS");var n=a("W9HT"),r=a("tJVT"),c=a("q1tI"),i=a.n(c),u=a("dJx9"),s=a.n(u),l=(a("Q9mQ"),a("diRs")),o=(a("+L6B"),a("2/Rp")),m=a("9og8"),d=a("WmNS"),p=a.n(d),f=a("WHYC"),v=a("VTBJ"),b={icon:{tag:"svg",attrs:{viewBox:"0 0 1024 1024",focusable:"false"},children:[{tag:"path",attrs:{d:"M715.8 493.5L335 165.1c-14.2-12.2-35-1.2-35 18.5v656.8c0 19.7 20.8 30.7 35 18.5l380.8-328.4c10.9-9.4 10.9-27.6 0-37z"}}]},name:"caret-right",theme:"outlined"},h=b,O=a("6VBw"),E=function(e,t){return c["createElement"](O["a"],Object(v["a"])(Object(v["a"])({},e),{},{ref:t,icon:h}))};E.displayName="CaretRightOutlined";var _=c["forwardRef"](E),j=a("eyie"),g=a("5bA4"),N=a("UESt"),w=a("sy1d");function x(e){return y.apply(this,arguments)}function y(){return y=Object(m["a"])(p.a.mark((function e(t){return p.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",Object(w["a"])("/api/read/article/"+t));case 1:case"end":return e.stop()}}),e)}))),y.apply(this,arguments)}function k(){return T.apply(this,arguments)}function T(){return T=Object(m["a"])(p.a.mark((function e(){return p.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",Object(w["a"])("/api/read/menu"));case 1:case"end":return e.stop()}}),e)}))),T.apply(this,arguments)}var I=a("TRe3"),S=a.n(I),W=function(e,t){var a=e.setArticleId,n=Object(c["useState"])([]),u=Object(r["a"])(n,2),s=u[0],d=u[1],f=Object(c["useState"])(0),v=Object(r["a"])(f,2),b=v[0],h=v[1],O=Object(c["useState"])([]),E=Object(r["a"])(O,2),w=E[0],x=E[1],y=Object(c["useState"])(-1),T=Object(r["a"])(y,2),I=T[0],W=T[1];Object(c["useEffect"])((function(){R()}),[]);var R=function(){var e=Object(m["a"])(p.a.mark((function e(){var t,a;return p.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,k();case 2:t=e.sent,t.success&&(a=JSON.parse(t.result.value),x(a),J(a));case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();Object(c["useEffect"])((function(){J(w)}),[e.match.params.menuIndex]);var J=function(t){var n=e.match.params.menuIndex||0;if(1*n>=t.length&&(n=0),W(n),t.length>0){var r=t[n].ids||[];d(r),console.log("articleIds",r),r.length>0&&a(r[0])}},C=function(t){e.history.push("/all/read/"+t)},M=function(e){h(e),a(s[e])},B=i.a.createElement("div",{className:S.a.menuContent},w.map((function(e,t){return i.a.createElement("div",{key:t,onClick:function(){return C(t)},className:I==t?S.a.activeMenu:""},I==t?i.a.createElement("div",{className:S.a.caret},i.a.createElement(_,null)):"",i.a.createElement("div",{className:S.a.title},"M",t+1),i.a.createElement("div",{className:S.a.subTitle},e.subTitle))})));return i.a.createElement("div",{className:S.a.toolbar},i.a.createElement("div",{className:S.a.btnDiv},i.a.createElement(l["a"],{content:B,trigger:"click"},i.a.createElement(o["a"],{type:"primary",shape:"circle",icon:i.a.createElement(j["a"],null)})),i.a.createElement("div",{className:S.a.label},"\u76ee\u5f55")),i.a.createElement("div",{className:S.a.btnDiv},i.a.createElement(o["a"],{onClick:function(){return M(b-1)},type:"primary",shape:"circle",disabled:0==b,icon:i.a.createElement(g["a"],null)}),i.a.createElement("div",{className:S.a.label},"\u4e0a\u4e00\u9875")),i.a.createElement("div",{className:S.a.btnDiv},i.a.createElement(o["a"],{onClick:function(){return M(b+1)},type:"primary",shape:"circle",disabled:b>=s.length-1,icon:i.a.createElement(N["a"],null)}),i.a.createElement("div",{className:S.a.label},"\u4e0b\u4e00\u9875")))},R=Object(f["k"])(W),J=a("hPiM"),C=a.n(J),M=a("EAz3"),B=function(e){var t=e.articleId,a=e.setLoading,n=Object(c["useRef"])(),u=Object(c["useRef"])(),s=Object(c["useState"])(),l=Object(r["a"])(s,2),o=l[0],d=l[1],f=Object(c["useState"])(),v=Object(r["a"])(f,2),b=v[0],h=v[1],O=Object(c["useState"])(),E=Object(r["a"])(O,2),_=E[0],j=E[1],g=Object(c["useState"])(-1),N=Object(r["a"])(g,2),w=N[0],y=N[1];Object(c["useEffect"])((function(){k()}),[t]);var k=function(){var e=Object(m["a"])(p.a.mark((function e(){var r,c,i,s,l,o,m;return p.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(t){e.next=2;break}return e.abrupt("return");case 2:return y(-1),a(!0),e.next=6,x(t);case 6:r=e.sent,c=r.result,i=c.article,s=c.sentences,l=c.read,u.current.src=i.mp3,n.current.load(),d(i.picture),h((l.position||"").split("|")),o=[],m=s.records,m.map((function(e){return o.push(e.mp3Time)})),j(o),a(!1);case 17:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),T=function(e){y(e);var t=_[e].split(",");Object(M["b"])(n.current,t[0],t[1],.7)},I=function(){return i.a.createElement(i.a.Fragment,null,i.a.createElement("audio",{ref:n},i.a.createElement("source",{ref:u,type:"audio/mpeg"}),"\u60a8\u7684\u6d4f\u89c8\u5668\u4e0d\u652f\u6301 audio \u5143\u7d20\u3002"),i.a.createElement("div",{className:C.a.content},i.a.createElement("div",{className:C.a.picture},(_||[]).map((function(e,t){var a=b[t].split(",");return i.a.createElement("div",{key:t,onClick:function(){return T(t)},className:"".concat(C.a.mask," ").concat(t==w?C.a.active:""),style:{top:a[0],height:a[1]}})})),i.a.createElement("img",{src:o}))))};return I()},z=B,A=function(e,t){var a=Object(c["useState"])(!1),u=Object(r["a"])(a,2),l=u[0],o=u[1],m=Object(c["useState"])(0),d=Object(r["a"])(m,2),p=d[0],f=d[1],v=function(){return i.a.createElement("div",{className:s.a.container},i.a.createElement(n["a"],{spinning:l},i.a.createElement(z,{articleId:p,setLoading:o}),i.a.createElement(R,{setArticleId:f})))};return v()};t["default"]=A},dJx9:function(e,t,a){e.exports={container:"container___NODTb"}},eyie:function(e,t,a){"use strict";var n=a("VTBJ"),r=a("q1tI"),c={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M904 160H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0 624H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0-312H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8z"}}]},name:"menu",theme:"outlined"},i=c,u=a("6VBw"),s=function(e,t){return r["createElement"](u["a"],Object(n["a"])(Object(n["a"])({},e),{},{ref:t,icon:i}))};s.displayName="MenuOutlined";t["a"]=r["forwardRef"](s)},hPiM:function(e,t,a){e.exports={content:"content___Lovlt",picture:"picture___3IoIq",mask:"mask___14021",active:"active___c_Z9W"}}}]);