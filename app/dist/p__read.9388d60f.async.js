(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[16],{EAz3:function(e,t,a){"use strict";a.d(t,"a",(function(){return r})),a.d(t,"e",(function(){return i})),a.d(t,"d",(function(){return l})),a.d(t,"c",(function(){return s})),a.d(t,"b",(function(){return u}));var n,c=a("oBTY"),r=/[\n]+/,i=/^\[(\d{2}):(\d{2}\.\d{2})\](\[(\d{2}):(\d{2}\.\d{2})\])?/,l=function(e,t){var a=[],n=/([a-z|'|-]+)/gi;t&&(n=/([\u4e00-\u9fa5])/gi);var c=null;return e.reduce((function(e,t){if(t){var a={allWords:[]},r=0;while(c=n.exec(t)){var i=c[0];c.index>r&&a.allWords.push({text:t.slice(r,c.index).trim(),isWord:!1}),a.allWords.push({text:i,isWord:!0}),r=c.index+i.length}r<t.length&&a.allWords.push({text:t.slice(r).trim(),isWord:!1}),e.push(a)}return e}),a)},s=function(e){var t=e.match(i);if(t){var a,n,r=Object(c["a"])(t),l=(r[0],r[1]),s=r[2],u=(r[3],r[4]),o=r[5];if(l&&(a=60*Number.parseInt(l)+Number.parseFloat(s),u)){var m=60*Number.parseInt(u)+Number.parseFloat(o);n=m-a}return a+","+n}},u=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"0",a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"0",c=arguments.length>3?arguments[3]:void 0;console.log("times",t,a),clearTimeout(n),e.pause();var r=parseInt(t),i=parseFloat(a);if(e.currentTime=r,e.playbackRate=c,e.play(),i){var l=i/c;console.log("duration",l),n=setTimeout((function(){e.pause()}),1e3*l)}}},"N/z5":function(e,t,a){e.exports=a.p+"static/pointdown.2fc6b61e.svg"},c71E:function(e,t,a){"use strict";a.r(t);a("Q9mQ");var n=a("diRs"),c=(a("+L6B"),a("2/Rp")),r=(a("T2oS"),a("W9HT")),i=a("9og8"),l=a("tJVT"),s=a("WmNS"),u=a.n(s),o=a("q1tI"),m=a.n(o),d=a("dJx9"),p=a.n(d),v=a("sy1d");function b(e){return f.apply(this,arguments)}function f(){return f=Object(i["a"])(u.a.mark((function e(t){return u.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",Object(v["a"])("/api/read/article/"+t));case 1:case"end":return e.stop()}}),e)}))),f.apply(this,arguments)}var _=a("N/z5"),h=a.n(_),g=a("EAz3"),E=a("VTBJ"),N={icon:{tag:"svg",attrs:{viewBox:"0 0 1024 1024",focusable:"false"},children:[{tag:"path",attrs:{d:"M715.8 493.5L335 165.1c-14.2-12.2-35-1.2-35 18.5v656.8c0 19.7 20.8 30.7 35 18.5l380.8-328.4c10.9-9.4 10.9-27.6 0-37z"}}]},name:"caret-right",theme:"outlined"},O=N,j=a("6VBw"),y=function(e,t){return o["createElement"](j["a"],Object(E["a"])(Object(E["a"])({},e),{},{ref:t,icon:O}))};y.displayName="CaretRightOutlined";var w=o["forwardRef"](y),T=a("eyie"),x=a("5bA4"),k=a("UESt"),I=[{ids:[32,33,34,35],subTitle:"at,an,ap,ad"},{ids:[36,37,38,39],subTitle:"am,ag,ash,amp"},{ids:[40,41,42,43],subTitle:"and,ack,ant,ed"}],R=function(e,t){var a=e.match.params.mId,s=void 0===a?0:a;s>=I.length&&(s=0);var d=I[s].ids,v=Object(o["useRef"])(),f=Object(o["useRef"])(),_=Object(o["useState"])(),E=Object(l["a"])(_,2),N=E[0],O=E[1],j=Object(o["useState"])(),y=Object(l["a"])(j,2),R=y[0],z=y[1],S=Object(o["useState"])(),W=Object(l["a"])(S,2),B=W[0],C=W[1],D=Object(o["useState"])(!1),J=Object(l["a"])(D,2),M=J[0],V=J[1],F=Object(o["useState"])(-1),H=Object(l["a"])(F,2),A=H[0],U=H[1],q=Object(o["useState"])(0),Q=Object(l["a"])(q,2),L=Q[0],Y=Q[1];Object(o["useEffect"])((function(){Y(0),Z(0)}),[s]);var Z=function(){var e=Object(i["a"])(u.a.mark((function e(t){var a,n,c,r,i,l,s;return u.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return U(-1),V(!0),e.next=4,b(d[t]);case 4:a=e.sent,n=a.result,c=n.article,r=n.sentences,i=n.read,f.current.src=c.mp3,v.current.load(),O(c.picture),z((i.position||"").split("|")),l=[],s=r.records,s.map((function(e){return l.push(e.mp3Time)})),C(l),V(!1);case 15:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),G=function(e){U(e);var t=B[e].split(",");Object(g["b"])(v.current,t[0],t[1],.7)},K=m.a.createElement("div",{className:p.a.menuContent},I.map((function(e,t){return m.a.createElement("div",{key:t,onClick:function(){return P(t)},className:s==t?p.a.activeMenu:""},s==t?m.a.createElement("div",{className:p.a.caret},m.a.createElement(w,null)):"",m.a.createElement("div",{className:p.a.title},"M",t+1),m.a.createElement("div",{className:p.a.subTitle},e.subTitle))}))),P=function(t){e.history.push("/all/read/"+t)},X=function(e){Y(e),Z(e)},$=function(){return m.a.createElement("div",{className:p.a.container},m.a.createElement("audio",{ref:v},m.a.createElement("source",{ref:f,type:"audio/mpeg"}),"\u60a8\u7684\u6d4f\u89c8\u5668\u4e0d\u652f\u6301 audio \u5143\u7d20\u3002"),m.a.createElement(r["a"],{spinning:M},m.a.createElement("div",{className:p.a.content},m.a.createElement("div",{className:p.a.tip},m.a.createElement("img",{src:h.a}),"\u8bf7\u70b9\u8bfb"),(B||[]).map((function(e,t){var a=R[t].split(",");return m.a.createElement("div",{key:t},m.a.createElement("div",{onClick:function(){return G(t)},className:"".concat(p.a.mask," ").concat(t==A?p.a.active:""),style:{top:a[0],height:a[1]}}))})),m.a.createElement("img",{src:N,className:p.a.bgImg}))),m.a.createElement("div",{className:p.a.toolbar},m.a.createElement("div",{className:p.a.btnDiv},m.a.createElement(n["a"],{content:K,trigger:"click"},m.a.createElement(c["a"],{type:"primary",shape:"circle",icon:m.a.createElement(T["a"],null)})),m.a.createElement("div",{className:p.a.label},"\u76ee\u5f55")),m.a.createElement("div",{className:p.a.btnDiv},m.a.createElement(c["a"],{onClick:function(){return X(L-1)},type:"primary",shape:"circle",disabled:0==L,icon:m.a.createElement(x["a"],null)}),m.a.createElement("div",{className:p.a.label},"\u4e0a\u4e00\u9875")),m.a.createElement("div",{className:p.a.btnDiv},m.a.createElement(c["a"],{onClick:function(){return X(L+1)},type:"primary",shape:"circle",disabled:L>=d.length-1,icon:m.a.createElement(k["a"],null)}),m.a.createElement("div",{className:p.a.label},"\u4e0b\u4e00\u9875"))))};return $()};t["default"]=R},dJx9:function(e,t,a){e.exports={container:"container___NODTb",content:"content___1Vf4H",mask:"mask___nIglY",tip:"tip___1i-o2",bgImg:"bgImg___1DZaj",active:"active___1alFU",toolbar:"toolbar___1rU1I",btnDiv:"btnDiv___3RAZN",label:"label___IvxTx",menuContent:"menuContent___2UDRg",title:"title___3oFVO",subTitle:"subTitle___1kbou",activeMenu:"activeMenu___3Qq1m",caret:"caret___2ap6_"}},eyie:function(e,t,a){"use strict";var n=a("VTBJ"),c=a("q1tI"),r={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M904 160H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0 624H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0-312H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8z"}}]},name:"menu",theme:"outlined"},i=r,l=a("6VBw"),s=function(e,t){return c["createElement"](l["a"],Object(n["a"])(Object(n["a"])({},e),{},{ref:t,icon:i}))};s.displayName="MenuOutlined";t["a"]=c["forwardRef"](s)}}]);