(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[14],{AcTH:function(e,t,a){e.exports=a.p+"static/diamond_bg.8c5a2143.svg"},"L+oi":function(e,t,a){e.exports=a.p+"static/diamond.fded64d5.svg"},YUDb:function(e,t,a){"use strict";a.r(t);var n=a("oBTY"),r=a("9og8"),c=a("tJVT"),i=a("WmNS"),s=a.n(i),u=a("q1tI"),o=a.n(u),l=a("vsPd"),m=a.n(l),p=a("vAYo"),d=a("L+oi"),f=a.n(d),h=a("fAKW"),b=a.n(h),w=a("AcTH"),g=a.n(w),_=a("v1Hw"),j=a.n(_),v=["\u30ce","\u4e00","\u4e28","\u30d5","\u4e36"],O=[],E=function(e){var t=Object(u["useState"])([]),a=Object(c["a"])(t,2),i=a[0],l=a[1],d=Object(u["useState"])([]),h=Object(c["a"])(d,2),w=h[0],_=h[1],E=Object(u["useState"])(!0),y=Object(c["a"])(E,2),x=y[0],N=y[1],k=Object(u["useState"])(0),S=Object(c["a"])(k,2),M=S[0],T=S[1],A=Object(u["useState"])(0),F=Object(c["a"])(A,2),I=F[0],P=F[1],Y=Object(u["useState"])({}),q=Object(c["a"])(Y,2),B=q[0],H=q[1],G=Object(u["useState"])(-1),J=Object(c["a"])(G,2),Q=J[0],W=J[1],C=Object(u["useState"])(0),L=Object(c["a"])(C,2),D=L[0],K=L[1];Object(u["useEffect"])((function(){var t=e.match.params;R(t.id)}),[]),Object(u["useEffect"])((function(){i&&i.length>0&&w&&w.length>0&&U()}),[i,w]);var R=function(){var e=Object(r["a"])(s.a.mark((function e(t){var a,n,r,c;return s.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(!t){e.next=9;break}return e.next=3,Object(p["c"])(t);case 3:return a=e.sent,a&&a.success&&(n=a.result.records,l(n)),e.next=7,Object(p["g"])(t);case 7:r=e.sent,r&&r.success&&(c=r.result,_(c));case 9:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),U=function(){O=[],i.map((function(e){var t=Math.ceil(Math.random()*e.biHuaShu),a=Math.floor(4*Math.random()),r=e.biShun.split("")[t-1],c=[];Object(n["a"])(Array(4).keys()).forEach((function(e,t){if(t==a)c.push(r);else while(1){var n=v[Math.floor(5*Math.random())];if(n!=r&&!c.includes(n)){c.push(n);break}}})),a=Math.floor(4*Math.random()),c=[],Object(n["a"])(Array(4).keys()).forEach((function(t,n){if(n==a)c.push(e.pinYin);else while(1){var r=w[Math.floor(5*Math.random())];if(r.wordName!=e.wordName&&!c.includes(r.pinYin)){c.push(r.pinYin);break}}})),a=Math.floor(4*Math.random()),c=[];var i=Object(n["a"])(w);function s(e){var t;if(e.shortAcce)return e.shortAcce;var a=(null===(t=e.acceptation)||void 0===t?void 0:t.split("|"))||[];return a.length>1?a[1].split("\u3002").reduce((function(e,t){var a,n=t.split(".");return a=n.length>1?n[1].split("\uff1a"):n[0].split("\uff1a"),a.length>0&&(e&&(e+=","),e+=a[0]),e}),""):void 0}Object(n["a"])(Array(4).keys()).forEach((function(t,n){if(n==a)c.push(s(e));else while(1){var r=i.splice(Math.floor(Math.random()*i.length),1);if(console.log(i.length),r&&r[0].wordName!=e.wordName){console.log(r),c.push(s(r[0]));break}}})),O.push({wordName:e.wordName,question:"",answers:c,rightIndex:a})})),H(O[0]),T(0),P(O.length),N(!1)},V=function(e){var t=1e3;-1==Q&&(e==B.rightIndex&&(K(D+1),t=100),W(e),setTimeout((function(){T(M+1),M<I-1&&(W(-1),H(O[M+1]))}),t))},z=100*D/(.9*I);return z=z>100?100:z,o.a.createElement("div",{className:m.a.outer},x?o.a.createElement("div",null,"loading"):o.a.createElement("div",{className:m.a.main},o.a.createElement("header",null,o.a.createElement("div",{className:m.a.time},o.a.createElement("span",{className:m.a.start1},z>=50?o.a.createElement(o.a.Fragment,null,o.a.createElement("img",{src:f.a}),o.a.createElement("img",{src:g.a})):o.a.createElement(o.a.Fragment,null,o.a.createElement("img",{src:b.a}),o.a.createElement("img",{src:j.a}))),o.a.createElement("span",{className:m.a.start2},z>=80?o.a.createElement(o.a.Fragment,null,o.a.createElement("img",{src:f.a}),o.a.createElement("img",{src:g.a})):o.a.createElement(o.a.Fragment,null,o.a.createElement("img",{src:b.a}),o.a.createElement("img",{src:j.a}))),o.a.createElement("span",{className:m.a.start3},z>=90?o.a.createElement(o.a.Fragment,null,o.a.createElement("img",{src:f.a}),o.a.createElement("img",{src:g.a})):o.a.createElement(o.a.Fragment,null,o.a.createElement("img",{src:b.a}),o.a.createElement("img",{src:j.a}))),o.a.createElement("div",{className:m.a.bar,style:{width:z+"%"}}))),o.a.createElement("section",{className:m.a.content},I==M?o.a.createElement("div",null,z>=50?"\u6311\u6218\u6210\u529f!":"\u6311\u6218\u5931\u8d25"):o.a.createElement(o.a.Fragment,null,o.a.createElement("div",{className:m.a.wordName},B.wordName),o.a.createElement("div",{className:m.a.question},B.question),o.a.createElement("ul",{className:"".concat(m.a.answer," ")},B.answers.map((function(e,t){var a="";return-1!=Q&&(Q==t&&t==B.rightIndex?a=m.a.right:Q==t&&t!=B.rightIndex?a=m.a.wrong:Q!=t&&t==B.rightIndex&&(a=m.a.right)),o.a.createElement("li",{key:t,className:a,onClick:function(){return V(t)}},o.a.createElement("span",null,e))}))),o.a.createElement("div",{className:m.a.text},M+1,"/",I)))))};t["default"]=E},fAKW:function(e,t,a){e.exports=a.p+"static/diamond_gray.592857fc.svg"},v1Hw:function(e,t,a){e.exports=a.p+"static/diamond_gray_bg.54c1b14d.svg"},vAYo:function(e,t,a){"use strict";a.d(t,"f",(function(){return o})),a.d(t,"a",(function(){return m})),a.d(t,"i",(function(){return d})),a.d(t,"d",(function(){return h})),a.d(t,"b",(function(){return w})),a.d(t,"h",(function(){return _})),a.d(t,"e",(function(){return v})),a.d(t,"c",(function(){return E})),a.d(t,"g",(function(){return x}));var n=a("k1fw"),r=a("9og8"),c=a("WmNS"),i=a.n(c),s=a("sy1d"),u=a("Qyje");function o(){return l.apply(this,arguments)}function l(){return l=Object(r["a"])(i.a.mark((function e(){return i.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",Object(s["a"])("/api/game/game/list"));case 1:case"end":return e.stop()}}),e)}))),l.apply(this,arguments)}function m(e){return p.apply(this,arguments)}function p(){return p=Object(r["a"])(i.a.mark((function e(t){return i.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",Object(s["a"])("/api/game/game/add",{method:"POST",data:Object(n["a"])(Object(n["a"])({},t),{},{method:"post"})}));case 1:case"end":return e.stop()}}),e)}))),p.apply(this,arguments)}function d(e){return f.apply(this,arguments)}function f(){return f=Object(r["a"])(i.a.mark((function e(t){return i.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",Object(s["a"])("/api/game/game/edit",{method:"PUT",data:Object(n["a"])(Object(n["a"])({},t),{},{method:"put"})}));case 1:case"end":return e.stop()}}),e)}))),f.apply(this,arguments)}function h(e){return b.apply(this,arguments)}function b(){return b=Object(r["a"])(i.a.mark((function e(t){return i.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",Object(s["a"])("/api/word/word/listByGame?"+Object(u["stringify"])(t)));case 1:case"end":return e.stop()}}),e)}))),b.apply(this,arguments)}function w(e){return g.apply(this,arguments)}function g(){return g=Object(r["a"])(i.a.mark((function e(t){return i.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",Object(s["a"])("/api/wordChinese/listByGame?"+Object(u["stringify"])(t)));case 1:case"end":return e.stop()}}),e)}))),g.apply(this,arguments)}function _(e){return j.apply(this,arguments)}function j(){return j=Object(r["a"])(i.a.mark((function e(t){var a,n;return i.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return a=t.id,n=t.articleIds,e.abrupt("return",Object(s["a"])("/api/game/gameWordRel/add/"+a+"?articleIds="+n.join(","),{method:"POST",data:{method:"post"}}));case 2:case"end":return e.stop()}}),e)}))),j.apply(this,arguments)}function v(e){return O.apply(this,arguments)}function O(){return O=Object(r["a"])(i.a.mark((function e(t){return i.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",Object(s["a"])("/api/game/game/level?gameId="+t));case 1:case"end":return e.stop()}}),e)}))),O.apply(this,arguments)}function E(e){return y.apply(this,arguments)}function y(){return y=Object(r["a"])(i.a.mark((function e(t){return i.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",Object(s["a"])("/api/wordChinese/listByGameLevel/"+t));case 1:case"end":return e.stop()}}),e)}))),y.apply(this,arguments)}function x(){return N.apply(this,arguments)}function N(){return N=Object(r["a"])(i.a.mark((function e(){return i.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",Object(s["a"])("/api/wordChinese/listRand/"));case 1:case"end":return e.stop()}}),e)}))),N.apply(this,arguments)}},vsPd:function(e,t,a){e.exports={outer:"outer___3G_T6",main:"main___2krTx",time:"time___2-gjX",bar:"bar___tSy0F",start1:"start1___2neIt",start2:"start2___2Qi-h",start3:"start3___JS113",info:"info___3pbPe",process:"process___BT24O",circle:"circle___1f-ZT",num:"num___2bdmF",pecent:"pecent___1aPTy",content:"content___1D5-w",wordName:"wordName___1QBri",question:"question___3jJV8",unQuanswer:"unQuanswer___2Nzc9",answer:"answer___h97jT",right:"right___1G2bH",wrong:"wrong___36p3p",text:"text___2wF88"}}}]);