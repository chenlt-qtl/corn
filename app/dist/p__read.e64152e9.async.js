(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[16],{DvM5:function(e,t,n){e.exports=n.p+"static/xiayibu.1833c47b.svg"},"N/z5":function(e,t,n){e.exports=n.p+"static/pointdown.2fc6b61e.svg"},YKg2:function(e,t,n){e.exports=n.p+"static/fanhui.41e61a14.svg"},c71E:function(e,t,n){"use strict";n.r(t);n("T2oS");var a=n("W9HT"),r=n("k1fw"),c=n("9og8"),i=n("tJVT"),s=n("WmNS"),u=n.n(s),o=n("q1tI"),p=n.n(o),l=n("dJx9"),m=n.n(l),f=n("sy1d");function b(e){return d.apply(this,arguments)}function d(){return d=Object(c["a"])(u.a.mark((function e(t){return u.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",Object(f["a"])("/api/read/article/"+t));case 1:case"end":return e.stop()}}),e)}))),d.apply(this,arguments)}var v=n("YKg2"),g=n.n(v),O=n("DvM5"),j=n.n(O),_=n("N/z5"),h=n.n(_),x=n("Qyje"),y=function(e,t){console.log(e);var n=e.location.query,s=n.ids,l=void 0===s?"":s,f=n.index,d=void 0===f?0:f,v=l.split(","),O=v[d],_=Object(o["useRef"])(),y=Object(o["useRef"])(),E=Object(o["useState"])(),w=Object(i["a"])(E,2),k=w[0],N=w[1],I=Object(o["useState"])([0,0]),T=Object(i["a"])(I,2),S=T[0],J=T[1],C=Object(o["useState"])(["",""]),D=Object(i["a"])(C,2),q=D[0],R=D[1],Y=Object(o["useState"])(!1),z=Object(i["a"])(Y,2),K=z[0],M=z[1];Object(o["useEffect"])((function(){W()}),[O]);var W=function(){var e=Object(c["a"])(u.a.mark((function e(){var t,n,a,r,c,i,s;return u.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return M(!0),e.next=3,b(O);case 3:t=e.sent,n=t.result,a=n.article,r=n.sentences,c=n.read,y.current.src=a.mp3,_.current.load(),N(a.picture),J((c.position||",").split(",")),i=[],s=r.records,s.map((function(e){return i.push(e.mp3Time)})),R(i),M(!1);case 14:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),Z=function(e){_.current.pause(),console.log(q[e]);var t=q[e].split(","),n=.7;_.current.currentTime=t[0],_.current.play(),_.current.playbackRate=n,setTimeout((function(){_.current.pause()}),parseInt(t[1])/n*1e3)},H=function(){var t=e.location,n=t.pathname,a=t.query;e.history.push(n+"?"+Object(x["stringify"])(Object(r["a"])(Object(r["a"])({},a),{},{index:parseInt(d)+1})))},L=function(){return p.a.createElement("div",{className:m.a.container},p.a.createElement("audio",{ref:_},p.a.createElement("source",{ref:y,type:"audio/mpeg"}),"\u60a8\u7684\u6d4f\u89c8\u5668\u4e0d\u652f\u6301 audio \u5143\u7d20\u3002"),p.a.createElement(a["a"],{spinning:K},p.a.createElement("div",{className:m.a.tip},p.a.createElement("img",{src:h.a}),"\u8bf7\u70b9\u8bfb"),0!=d?p.a.createElement("div",{className:m.a.prev,onClick:function(){return e.history.go(-1)}},p.a.createElement("img",{src:g.a})):"",d<v.length-1?p.a.createElement("div",{className:m.a.next,onClick:H},p.a.createElement("img",{src:j.a})):"",q.map((function(e,t){return p.a.createElement("div",{key:t},p.a.createElement("div",{onClick:function(){return Z(t)},className:m.a.mask,style:{top:S[t]+"px",height:0==t?S[1]-S[0]+"px":"100%"}}))})),p.a.createElement("img",{src:k,className:m.a.bgImg})))};return L()};t["default"]=y},dJx9:function(e,t,n){e.exports={container:"container___NODTb",mask:"mask___nIglY",tip:"tip___1i-o2",next:"next___2ZL_O",prev:"prev___1COcE",bgImg:"bgImg___1DZaj"}}}]);