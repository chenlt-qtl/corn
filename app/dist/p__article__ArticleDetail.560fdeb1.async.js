(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[12],{"8txm":function(e,t,a){},Cvku:function(e,t,a){"use strict";a.r(t);a("2qtc");var n=a("kLXV"),c=(a("+L6B"),a("2/Rp")),r=a("tJVT"),l=a("q1tI"),i=a.n(l),o=a("tQT+"),s=a("w9TN"),m=a.n(s),u=a("jhfD"),d=a("G3dp"),p=a("/MfK"),f=a("E+aV"),b=(a("T2oS"),a("W9HT")),E=(a("R9oj"),a("ECub")),v=a("Q3Xe"),j=a.n(v),g=a("Drea"),O=(a("Q9mQ"),a("diRs")),N=(a("H1Ta"),a("X4VG")),_=a.n(N),h=a("9kvl"),w=function(e){var t=e.wordName,a=Object(l["useState"])({}),n=Object(r["a"])(a,2),c=n[0],o=n[1],s=Object(l["useRef"])(),m=Object(l["useState"])(""),u=Object(r["a"])(m,2),d=u[0],p=u[1];Object(l["useEffect"])((function(){p("");var a=e.word.wordMap.get(t);a?o(a):e.dispatch({type:"word/getWordByWordName",payload:t}).then((function(e){e?o(e):p("\u672a\u67e5\u8be2\u5230\u76f8\u5173\u5355\u8bcd")}))}),[t]);var f=function(){s.current.play()},E=function(){h["d"].push("/word/"+c.wordName)},v=e.loading.effects["word/getWordByWordName"];return i.a.createElement(i.a.Fragment,null,i.a.createElement(b["a"],{spinning:v},d||i.a.createElement("ul",{className:_.a.content},i.a.createElement("li",{className:_.a.wordName},c.wordName,i.a.createElement("span",{onClick:E},"\u66f4\u591a\u91ca\u4e49",i.a.createElement("i",{className:"fa fa-angle-double-right"}))),i.a.createElement("li",{className:_.a.phAm},"/",c.phAm,"/ ",i.a.createElement("i",{className:"fa fa-volume-up",onClick:f})),i.a.createElement("li",{className:_.a.acceptation},c.acceptation&&c.acceptation.split("|").map((function(e){return e?e+"\n":""}))))),i.a.createElement("audio",{ref:s},i.a.createElement("source",{src:c.mp3,type:"audio/mpeg"}),"\u60a8\u7684\u6d4f\u89c8\u5668\u4e0d\u652f\u6301 audio \u5143\u7d20\u3002"))},y=Object(h["b"])((function(e){var t=e.loading,a=e.word;return{loading:t,word:a}}))(w),C=function(e){var t=i.a.createElement(y,{wordName:e.wordName});return i.a.createElement(i.a.Fragment,null,i.a.createElement(O["a"],{content:t,placement:"bottomLeft"},e.children))},k=C,x=function(e){var t=e.articleId,a=Object(l["useState"])([]),n=Object(r["a"])(a,2),c=n[0],o=n[1];Object(l["useEffect"])((function(){s()}),[]);var s=function(){e.dispatch({type:"word/getWordByArticle",payload:t}).then((function(t){t&&t.success&&(o(t.result.records),e.setWordsNum(t.result.records.length))}))},m=e.loading.effects["word/getWordByArticle"];return i.a.createElement(i.a.Fragment,null,i.a.createElement("div",{className:j.a.module},i.a.createElement("div",{className:j.a.moduleTitle},"\u5355\u8bcd\u5217\u8868")),i.a.createElement(b["a"],{spinning:m},i.a.createElement("div",{className:j.a.wordList},c.length>0?i.a.createElement("ul",null,c.map((function(e){return i.a.createElement("li",{key:e.id,className:j.a.row},i.a.createElement("ul",null,i.a.createElement("li",{className:j.a.wordName},i.a.createElement(k,{wordName:e.wordName},e.wordName)),i.a.createElement("li",{className:j.a.phAm},i.a.createElement(k,{wordName:e.wordName},"/",e.phAm,"/")),i.a.createElement("li",{className:j.a.play},i.a.createElement(g["a"],null)),i.a.createElement("li",{className:j.a.acceptation},i.a.createElement(k,{wordName:e.wordName},e.acceptation))))}))):i.a.createElement(E["a"],null))))},S=Object(h["b"])((function(e){var t=e.word,a=e.loading;return{word:t,loading:a}}))(x),I=(a("bbsP"),a("/wGt")),T=(a("DjyN"),a("NUBc")),V=(a("Mwp2"),a("VXEj")),W=(a("P2fV"),a("NJEC")),F=(a("miYZ"),a("tsqr")),L=a("9og8"),P=a("WmNS"),z=a.n(P),Q=a("Pp7k"),M=a.n(Q),R=a("w5pM"),A={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0042 42h216v494zM544 472c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v108H372c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h108v108c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V644h108c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H544V472z"}}]},name:"file-add",theme:"outlined"},B=A,D=a("6VBw"),H=function(e,t){return l["createElement"](D["a"],Object.assign({},e,{ref:t,icon:B}))};H.displayName="FileAddOutlined";var q=l["forwardRef"](H),J=a("0Owb"),X=a("oBTY"),Z=a("k1fw"),U=(a("FJo9"),a("L41K")),Y=(a("y8nQ"),a("Vl3Y")),G=(a("5NDa"),a("5rEg")),K=a("RyZv"),$=a("E3uV"),ee=/[\n]+/,te=function(e){var t=[],a=/([a-z|'|-]+)/gi,n=null;return e.reduce((function(e,t){if(t){var c={allWords:[]},r=0;while(n=a.exec(t)){var l=n[0];n.index>r&&c.allWords.push({text:t.slice(r,n.index).trim(),isWord:!1}),c.allWords.push({text:l,isWord:!0}),r=n.index+l.length}r<t.length&&c.allWords.push({text:t.slice(r).trim(),isWord:!1}),e.push(c)}return e}),t)},ae=G["a"].TextArea,ne=Y["a"].Item,ce=U["a"].Step,re={labelCol:{span:3},wrapperCol:{span:18}},le=function(e){var t=e.modalVisible,a=e.onCancel,s=e.sentence,m=void 0===s?{}:s,u=e.articleId,d=e.single,p=Object(l["useState"])(0),f=Object(r["a"])(p,2),E=f[0],v=f[1],j=Object(l["useState"])([]),g=Object(r["a"])(j,2),O=g[0],N=g[1],_=Object(l["useState"])([]),h=Object(r["a"])(_,2),w=h[0],y=h[1],C=Object(l["useState"])(""),k=Object(r["a"])(C,2),x=k[0],S=k[1],I=Object(l["useState"])(""),T=Object(r["a"])(I,2),V=T[0],W=T[1],F=Object(l["useState"])(!1),P=Object(r["a"])(F,2),Q=P[0],R=P[1],A=Y["a"].useForm(),B=Object(r["a"])(A,1),D=B[0];Object(l["useEffect"])((function(){if(D.setFieldsValue(m),v(0),m.id){var e=m.picture,t=void 0===e?"":e,a=m.mp3,n=void 0===a?"":a;S(t),W(n),R(!0),Object(o["f"])(m.id).then((function(e){if(e&&e.result){var t=e.result.records;N(t.map((function(e){return e.wordName})))}R(!1)}))}}),[m]);var H=function(){var e=Object(L["a"])(z.a.mark((function e(){var t,a,n;return z.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,D.validateFields();case 2:if(t=e.sent,0!==E){e.next=8;break}v(E+1),y(te(t.content.split(ee))),e.next=17;break;case 8:return R(!0),a={id:u},a.sentences=w.map((function(e){return Object(Z["a"])(Object(Z["a"])({},e),{},{content:e.allWords.reduce((function(e,t){var a=t.text;return e+=a,t.text.endsWith(" ")||(e+=" "),e})," "),words:e.allWords.filter((function(e){return O.includes(e.text.toLowerCase())})).map((function(e){return{wordName:e.text}}))})})),d&&a.sentences[0]&&(V&&(a.sentences[0].mp3=V),x&&(a.sentences[0].picture=x),m.id&&(a.sentences[0].id=m.id)),e.next=14,Object(o["k"])(a);case 14:n=e.sent,n&&q(!0),R(!1);case 17:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),q=function(e){a(e)},G=function(){return v(E-1)},le=function(e){var t=O.indexOf(e.toLowerCase());t>-1?O.splice(t,1):O.push(e.toLowerCase()),N(Object(X["a"])(O))},ie=function(e){S(e)},oe=function(e){W(e)},se=function(){return 1===E?i.a.createElement(i.a.Fragment,null,i.a.createElement(c["a"],{onClick:function(){return q(!1)}},"\u53d6\u6d88"),i.a.createElement(c["a"],{onClick:G},"\u4e0a\u4e00\u6b65"),i.a.createElement(c["a"],{type:"primary",onClick:H,loading:Q},"\u5b8c\u6210")):i.a.createElement(i.a.Fragment,null,i.a.createElement(c["a"],{onClick:function(){return q(!1)}},"\u53d6\u6d88"),i.a.createElement(c["a"],{type:"primary",onClick:H},"\u4e0b\u4e00\u6b65"))},me=0;return i.a.createElement(n["a"],{title:m.id?"\u4fee\u6539\u53e5\u5b50":d?"\u589e\u52a0\u53e5\u5b50":"\u6279\u91cf\u589e\u52a0\u53e5\u5b50",visible:t,onCancel:function(){return q(!1)},style:{top:20},footer:se(),onOk:H},i.a.createElement(b["a"],{spinning:Q},i.a.createElement(U["a"],{style:{marginBottom:28},size:"small",current:E},i.a.createElement(ce,{title:"\u8f93\u5165\u53e5\u5b50"}),i.a.createElement(ce,{title:"\u9009\u62e9\u751f\u8bcd"}),i.a.createElement(ce,{title:"\u5b8c\u6210"})),i.a.createElement(Y["a"],Object(J["a"])({},re,{form:D}),0===E?i.a.createElement(i.a.Fragment,null,i.a.createElement(ne,{name:"content",label:"\u5185\u5bb9",rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u5185\u5bb9\uff01"}]},i.a.createElement(ae,{rows:d?4:10})),d?i.a.createElement(i.a.Fragment,null,i.a.createElement(ne,{name:"picture",label:"\u56fe\u7247"},i.a.createElement(K["a"],{picture:x,onChange:ie})),i.a.createElement(ne,{name:"mp3",label:"\u97f3\u9891"},i.a.createElement($["a"],{mp3:V,onChange:oe}))):i.a.createElement("span",{className:M.a.tip},"\u4e0d\u540c\u53e5\u5b50\u8bf7\u7528\u56de\u8f66\u5206\u9694")):i.a.createElement("div",{className:M.a.words},w.map((function(e){return i.a.createElement("p",{key:++me},e.allWords.map((function(e){var t=e.text,a=e.isWord;return a?i.a.createElement("span",{key:++me,className:O.includes(t.toLowerCase())?M.a.selected:null,onClick:function(){le(t)}},t):i.a.createElement(l["Fragment"],{key:++me},t,ee.test(t)?i.a.createElement("br",{key:++me}):"")})))}))))))},ie=le,oe=(a("5GOC"),a("JsLm")),se=a("Xe+o"),me=a.n(se),ue=a("djQt"),de=a("Tm+p"),pe=oe["a"].Link,fe=function(e){var t=e.match.params.wordName,a=Object(l["useState"])({}),o=Object(r["a"])(a,2),s=o[0],m=o[1],u=Object(l["useState"])([]),d=Object(r["a"])(u,2),p=d[0],f=d[1],v=Object(l["useRef"])(),j=Object(l["useRef"])(),g=[Object(l["useRef"])(),Object(l["useRef"])()];Object(l["useEffect"])((function(){e.dispatch({type:"word/getWordFromDb",payload:t}).then((function(e){e&&m(e)})),e.dispatch({type:"word/getSentenceByWord",payload:t}).then((function(e){e&&f(e)}))}),[]);var O=function(e){console.log(e),e&&(j.current.src=e),v.current.load(),v.current.play()},N=function(){},_=e.loading.effects["word/getWordFromDb"],h=e.loading.effects["word/getSentenceByWord"],w=/^[\s]/;return i.a.createElement(n["a"],{title:"\u5355\u8bcd\u8be6\u60c5",width:660,visible:e.isModalVisible,onCancel:function(){e.hideWordModal()},footer:i.a.createElement(c["a"],{onClick:function(){e.hideWordModal()}},"\u5173\u95ed")},i.a.createElement(b["a"],{spinning:_},i.a.createElement("main",{className:me.a.word},i.a.createElement("header",{className:me.a.wordName},s.wordName,i.a.createElement("div",{className:me.a.star},s.wordUserRel?i.a.createElement(ue["a"],{className:me.a.favorate}):i.a.createElement(de["a"],{onClick:N,className:me.a.notFavorate}))),i.a.createElement("section",{className:me.a.phAm},"/",s.phAm,"/",i.a.createElement("i",{className:"fa fa-volume-up ".concat(me.a.trumpet),onClick:function(){O(s.phAnMp3)}})),i.a.createElement("nav",{id:"acceptation"},i.a.createElement(oe["a"],{targetOffset:30},i.a.createElement(pe,{href:"#acceptation",title:"\u89e3\u91ca"}),i.a.createElement(pe,{href:"#cblj",title:"\u8bcd\u9738\u4f8b\u53e5"}),i.a.createElement(pe,{href:"#zdylj",title:"\u81ea\u5b9a\u4e49\u4f8b\u53e5"}),i.a.createElement(pe,{href:"#gdlj",title:"\u5168\u90e8\u4f8b\u53e5"}))),i.a.createElement("section",{className:me.a.acceptation},s.acceptation),i.a.createElement("section",{className:me.a.acceptation},s.icibaSentences?i.a.createElement(i.a.Fragment,null,i.a.createElement("div",{id:"cblj",ref:g[0],className:me.a.title},"\u8bcd\u9738\u4f8b\u53e5"),s.icibaSentences.map((function(e,t){return i.a.createElement("div",{className:me.a.sentence,key:e.id},t+1,".   ",i.a.createElement("span",null,e.orig.replace(w,""),e.trans.replace(w,"")))}))):""),i.a.createElement("section",{className:me.a.acceptation},s.sentences?i.a.createElement(i.a.Fragment,null,i.a.createElement("div",{id:"zdylj",ref:g[1],className:me.a.title},"\u81ea\u5b9a\u4e49\u4f8b\u53e5"),s.sentences.map((function(e,t){return i.a.createElement("div",{className:me.a.sentence,key:e.id},i.a.createElement("section",{className:me.a.content},t+1,".   ",i.a.createElement("span",null,e.content,e.mp3?i.a.createElement("i",{className:"fa fa-volume-up ".concat(me.a.trumpet),onClick:function(){return O(e.mp3)}}):"")),e.picture?i.a.createElement("section",{className:me.a.img},i.a.createElement("img",{src:e.picture})):"")}))):""),i.a.createElement("section",{className:me.a.acceptation},i.a.createElement("div",{id:"gdlj",ref:g[1],className:me.a.title},"\u5168\u90e8\u4f8b\u53e5"),i.a.createElement(b["a"],{spinning:h},p.length>0?p.map((function(e,t){return i.a.createElement("div",{className:me.a.sentence,key:e.id},i.a.createElement("section",{className:me.a.content},t+1,".   ",i.a.createElement("span",null,e.content,e.mp3?i.a.createElement("i",{className:"fa fa-volume-up ".concat(me.a.trumpet),onClick:function(){return O(e.mp3)}}):"")),e.picture?i.a.createElement("section",{className:me.a.img},i.a.createElement("img",{src:e.picture})):"")})):i.a.createElement(E["a"],null))))),i.a.createElement("audio",{ref:v},i.a.createElement("source",{ref:j,src:s.phAnMp3,type:"audio/mpeg"}),"\u60a8\u7684\u6d4f\u89c8\u5668\u4e0d\u652f\u6301 audio \u5143\u7d20\u3002"))},be=Object(h["b"])((function(e){var t=e.loading;return{loading:t}}))(fe),Ee=function(e){var t=e.articleId,a=e.play,n=e.edit,c=void 0!==n&&n,s=Object(l["useState"])([]),m=Object(r["a"])(s,2),u=m[0],f=m[1],E=Object(l["useState"])({}),v=Object(r["a"])(E,2),j=v[0],O=v[1],N=Object(l["useState"])(!1),_=Object(r["a"])(N,2),h=_[0],w=_[1],C=Object(l["useState"])(!0),k=Object(r["a"])(C,2),x=k[0],S=k[1],P=Object(l["useState"])(!0),Q=Object(r["a"])(P,2),A=Q[0],B=Q[1],D=Object(l["useState"])(""),H=Object(r["a"])(D,2),J=H[0],X=H[1],Z=Object(l["useState"])(!1),U=Object(r["a"])(Z,2),Y=U[0],G=U[1],K=Object(l["useState"])(0),$=Object(r["a"])(K,2),ee=$[0],ae=$[1],ne=Object(l["useState"])(0),ce=Object(r["a"])(ne,2),re=ce[0],le=ce[1],oe=Object(l["useState"])(!1),se=Object(r["a"])(oe,2),me=se[0],ue=se[1];Object(l["useEffect"])((function(){de()}),[re]);var de=function(){Object(o["d"])({articleId:t,pageNo:re,pageSize:10}).then((function(t){t&&(B(!1),t.success&&t.result&&(f(t.result.records),ae(t.result.total),e.setSenteceNum(t.result.total)))}))},pe=function(e,t){O(e),w(!0),S(t)},fe=function(){var e=Object(L["a"])(z.a.mark((function e(t){var a;return z.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return B(!0),e.next=3,Object(o["j"])(t);case 3:a=e.sent,a&&a.success?(F["default"].success("\u5220\u9664\u6210\u529f"),de()):F["default"].error("\u5220\u9664\u5931\u8d25"),B(!1);case 6:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),Ee=function(e){var t=[i.a.createElement(d["a"],{onClick:function(){pe(e,!0)}})];return e.mp3&&t.push(i.a.createElement(g["a"],null)),t.push(i.a.createElement(W["a"],{title:"\u786e\u8ba4\u8981\u5220\u9664\u8fd9\u4e2a\u53e5\u5b50?",onConfirm:function(){fe(e.id)},okText:"\u662f",cancelText:"\u5426"},i.a.createElement(p["a"],null))),t},ve=function(e){var t=te([e]),a=t.length>0&&t[0].allWords.map((function(e){var t=e.text;return e.isWord?i.a.createElement("span",{className:M.a.words,onClick:function(){return je(t)}},"\xa0",t):t}));return a},je=function(e){X(e),G(!0)};return i.a.createElement(b["a"],{spinning:A},c?i.a.createElement("div",{className:M.a.module},i.a.createElement("div",{className:M.a.moduleTitle},"\u53e5\u5b50\u5217\u8868"),i.a.createElement("div",{className:M.a.toolbar},i.a.createElement(R["a"],{title:"\u589e\u52a0\u53e5\u5b50",onClick:function(){pe({},!0)}}),i.a.createElement(q,{title:"\u6279\u91cf\u589e\u52a0\u53e5\u5b50",onClick:function(){pe({},!1)}}))):"",i.a.createElement(V["b"],{className:M.a.sentenceList,itemLayout:"vertical",size:"large",pagination:!1,dataSource:u,renderItem:function(e){return i.a.createElement(V["b"].Item,{className:M.a.item,key:e.id,actions:Ee(e)},i.a.createElement("pre",null,ve(e.content),e.mp3?i.a.createElement("i",{className:"fa fa-volume-up ".concat(M.a.trumpet),onClick:function(){return a(e.mp3)}}):""))}}),i.a.createElement(T["a"],{className:M.a.page,size:"small",total:ee,showSizeChanger:!1,onChange:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;le(e)}}),c?i.a.createElement(ie,{articleId:t,sentence:j,single:x,onCancel:function(e){e&&de(),w(!1)},modalVisible:h}):"",i.a.createElement(I["a"],{title:J,placement:"right",closable:!1,visible:Y,onClose:function(){G(!1)}},i.a.createElement(y,{wordName:J})),i.a.createElement(be,{wordName:J,isModalVisible:me,hideWordModal:function(){return ue(!1)}}))},ve=Ee,je=function(e){var t=e.match.params.id,a=Object(l["useState"])({}),s=Object(r["a"])(a,2),b=s[0],E=s[1],v=Object(l["useState"])(!1),j=Object(r["a"])(v,2),g=j[0],O=j[1],N=Object(l["useState"])(!1),_=Object(r["a"])(N,2),h=_[0],w=_[1],y=Object(l["useState"])(0),C=Object(r["a"])(y,2),k=C[0],x=C[1],I=Object(l["useState"])(0),T=Object(r["a"])(I,2),V=T[0],W=T[1],F=Object(l["useRef"])(),L=Object(l["useRef"])(),P=Object(l["useRef"])();Object(l["useEffect"])((function(){z()}),[]);var z=function(){Object(o["b"])(t).then((function(e){e&&e.success&&E(e.result.article)}))},Q=function(){F.current.setFormValue(b),w(!0)},M=function(e){console.log(e),e&&(P.current.src=e,L.current.load(),L.current.play())};return i.a.createElement(i.a.Fragment,null,i.a.createElement("main",{className:m.a.main},i.a.createElement("header",{className:m.a.header},i.a.createElement("div",{className:m.a.title},i.a.createElement("h1",null,b.title)),i.a.createElement("div",{className:m.a.toolbar},i.a.createElement(u["a"],null),i.a.createElement(d["a"],{onClick:Q}),i.a.createElement(p["a"],null))),i.a.createElement("div",{className:m.a.moduleTitle},"\u8be6\u7ec6\u4fe1\u606f"),i.a.createElement("div",{className:m.a.info},i.a.createElement("div",{className:m.a.left},b.mp3?i.a.createElement("div",{className:m.a.infoItem},i.a.createElement("audio",{controls:!0},i.a.createElement("source",{src:b.mp3,type:"audio/mpeg"}),"\u60a8\u7684\u6d4f\u89c8\u5668\u4e0d\u652f\u6301 audio \u5143\u7d20\u3002")):"",i.a.createElement("div",{className:m.a.infoItem},i.a.createElement("div",{className:m.a.itemLabel},"\u53e5\u5b50\u6570"),i.a.createElement("div",{className:m.a.itemValue},k)),i.a.createElement("div",{className:m.a.infoItem},i.a.createElement("div",{className:m.a.itemLabel},"\u5355\u8bcd\u6570"),i.a.createElement("div",{className:m.a.itemValue},V))),b.picture?i.a.createElement("a",{target:"_blank",className:m.a.right,href:b.picture},i.a.createElement("img",{className:m.a.img,src:b.picture})):""),i.a.createElement(ve,{articleId:t,setSenteceNum:x,play:M,edit:!0}),i.a.createElement(S,{articleId:t,setWordsNum:W})),i.a.createElement(n["a"],{title:"\u67e5\u770b\u56fe\u7247",width:660,visible:g,onCancel:function(){O(!1)},footer:i.a.createElement(c["a"],{onClick:function(){O(!1)}},"\u5173\u95ed")},i.a.createElement("img",{width:600,src:b.picture})),i.a.createElement(f["a"],{ref:F,onCancel:function(e){w(!1),e&&z()},modalVisible:h}),i.a.createElement("audio",{ref:L},i.a.createElement("source",{ref:P,type:"audio/mpeg"}),"\u60a8\u7684\u6d4f\u89c8\u5668\u4e0d\u652f\u6301 audio \u5143\u7d20\u3002"))};t["default"]=je},"E+aV":function(e,t,a){"use strict";a("2qtc");var n=a("kLXV"),c=a("0Owb"),r=(a("5NDa"),a("5rEg")),l=(a("miYZ"),a("tsqr")),i=a("k1fw"),o=a("9og8"),s=(a("y8nQ"),a("Vl3Y")),m=a("tJVT"),u=a("WmNS"),d=a.n(u),p=a("q1tI"),f=a.n(p),b=a("27j4"),E=a.n(b),v=a("tQT+"),j=a("RyZv"),g=a("E3uV"),O={labelCol:{span:6},wrapperCol:{span:12}},N=f.a.forwardRef((function(e,t){var a=e.modalVisible,u=e.onCancel,b=Object(p["useState"])(""),N=Object(m["a"])(b,2),_=N[0],h=N[1],w=Object(p["useState"])(!1),y=Object(m["a"])(w,2),C=y[0],k=y[1],x=Object(p["useState"])(""),S=Object(m["a"])(x,2),I=S[0],T=S[1],V=Object(p["useState"])({}),W=Object(m["a"])(V,2),F=W[0],L=W[1],P=s["a"].useForm(),z=Object(m["a"])(P,1),Q=z[0],M=function(){var e=Object(o["a"])(d.a.mark((function e(){var t,a;return d.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return k(!0),e.next=3,Q.validateFields();case 3:if(t=e.sent,t.picture=_,t.mp3=I,!F.id){e.next=13;break}return t=Object(i["a"])(Object(i["a"])({},F),t),e.next=10,Object(v["l"])(t);case 10:a=e.sent,e.next=16;break;case 13:return e.next=15,Object(v["a"])(t);case 15:a=e.sent;case 16:a&&(a.success?(l["default"].success("\u4fdd\u5b58\u6210\u529f!"),u(!0)):l["default"].error(a.message)),k(!1);case 18:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),R=function(e){h(e)},A=function(e){T(e)};return Object(p["useImperativeHandle"])(t,(function(){return{setFormValue:function(e){var t=e.title,a=e.mp3,n=void 0===a?"":a,c=e.picture,r=void 0===c?"":c,l=e.comment;L(e),Q.setFieldsValue({title:t,comment:l}),h(r),T(n)}}}),[]),f.a.createElement(n["a"],{title:"\u589e\u52a0\u6587\u7ae0",visible:a,onCancel:function(){u(!1)},style:{top:20},onOk:M,confirmLoading:C},f.a.createElement(s["a"],Object(c["a"])({},O,{form:Q,name:"article"}),f.a.createElement(s["a"].Item,{label:"\u6807\u9898",name:"title",rules:[{required:!0,message:"Please input your title!"}]},f.a.createElement(r["a"],null)),f.a.createElement(s["a"].Item,{label:"\u5c01\u9762",name:"picture"},f.a.createElement(j["a"],{picture:_,onChange:R})),f.a.createElement(s["a"].Item,{label:"\u97f3\u9891",name:"mp3"},f.a.createElement(g["a"],{mp3:I,onChange:A})),f.a.createElement(s["a"].Item,{label:"\u5907\u6ce8",name:"comment"},f.a.createElement(E.a,{rows:4}))))}));t["a"]=N},E3uV:function(e,t,a){"use strict";a("DZo9");var n=a("8z0m"),c=a("jrin"),r=(a("miYZ"),a("tsqr")),l=a("tJVT"),i=a("q1tI"),o=a.n(i),s=a("ye1Q"),m=a("xvlK"),u=(a("H1Ta"),o.a.forwardRef((function(e,t){var a=e.mp3,u=e.type,d=e.onChange,p=Object(i["useState"])(!1),f=Object(l["a"])(p,2),b=f[0],E=f[1],v=Object(i["useState"])(!0),j=Object(l["a"])(v,2),g=j[0],O=j[1],N=Object(i["useRef"])();function _(e){var t="audio/mpeg"===e.type;t||r["default"].error("You can only upload MP3 file!");var a=e.size/1024/1024<100;return a||r["default"].error("Mp3 must smaller than 100MB!"),t&&a}Object(i["useImperativeHandle"])(t,(function(){return{getPlayTime:function(){return N.current.getStartDate()}}}),[]);var h=function(e){"uploading"!==e.file.status?"done"===e.file.status&&(d(e.file.response.result),E(!1)):E(!0)},w=o.a.createElement("div",null,b?o.a.createElement(s["a"],null):o.a.createElement(m["a"],null),o.a.createElement("div",{style:{marginTop:8}},"Upload")),y=function(e,t){e.stopPropagation(),e.preventDefault(),t?N.current.pause():(N.current.load(),N.current.play()),O(t)},C={fontSize:"18px",color:"rgba(0,0,0,0.7)"};return o.a.createElement(o.a.Fragment,null,o.a.createElement(n["a"],{listType:"picture-card",className:"avatar-uploader",showUploadList:!1,headers:Object(c["a"])({},"X-Access-Token",localStorage.getItem("jwToken")||""),action:"/api/sys/common/uploadMp3/"+(u||"word"),beforeUpload:_,onChange:h},a?g?o.a.createElement("i",{style:C,className:"fa fa-play",onClick:function(e){y(e,!1)}}):o.a.createElement("i",{style:C,className:"fa fa-pause",onClick:function(e){y(e,!0)}}):w),o.a.createElement("audio",{ref:N},o.a.createElement("source",{src:a,type:"audio/mpeg"}),"\u60a8\u7684\u6d4f\u89c8\u5668\u4e0d\u652f\u6301 audio \u5143\u7d20\u3002"))})));t["a"]=u},FJo9:function(e,t,a){"use strict";a("cIOH"),a("8txm"),a("MXD1")},L41K:function(e,t,a){"use strict";var n=a("wx14"),c=a("rePB"),r=a("q1tI"),l=a.n(r),i=a("bT9E"),o=a("VTBJ"),s=a("Ff2n"),m=a("1OyB"),u=a("vuIU"),d=a("Ji7U"),p=a("LK+K"),f=a("Zm9Q"),b=a("TSYQ"),E=a.n(b);function v(e){return"string"===typeof e}var j=function(e){Object(d["a"])(a,e);var t=Object(p["a"])(a);function a(){var e;return Object(m["a"])(this,a),e=t.apply(this,arguments),e.onClick=function(){var t=e.props,a=t.onClick,n=t.onStepClick,c=t.stepIndex;a&&a.apply(void 0,arguments),n(c)},e}return Object(u["a"])(a,[{key:"renderIconNode",value:function(){var e,t,a=this.props,n=a.prefixCls,r=a.progressDot,i=a.stepIcon,o=a.stepNumber,s=a.status,m=a.title,u=a.description,d=a.icon,p=a.iconPrefix,f=a.icons,b=E()("".concat(n,"-icon"),"".concat(p,"icon"),(e={},Object(c["a"])(e,"".concat(p,"icon-").concat(d),d&&v(d)),Object(c["a"])(e,"".concat(p,"icon-check"),!d&&"finish"===s&&(f&&!f.finish||!f)),Object(c["a"])(e,"".concat(p,"icon-cross"),!d&&"error"===s&&(f&&!f.error||!f)),e)),j=l.a.createElement("span",{className:"".concat(n,"-icon-dot")});return t=r?"function"===typeof r?l.a.createElement("span",{className:"".concat(n,"-icon")},r(j,{index:o-1,status:s,title:m,description:u})):l.a.createElement("span",{className:"".concat(n,"-icon")},j):d&&!v(d)?l.a.createElement("span",{className:"".concat(n,"-icon")},d):f&&f.finish&&"finish"===s?l.a.createElement("span",{className:"".concat(n,"-icon")},f.finish):f&&f.error&&"error"===s?l.a.createElement("span",{className:"".concat(n,"-icon")},f.error):d||"finish"===s||"error"===s?l.a.createElement("span",{className:b}):l.a.createElement("span",{className:"".concat(n,"-icon")},o),i&&(t=i({index:o-1,status:s,title:m,description:u,node:t})),t}},{key:"render",value:function(){var e,t=this.props,a=t.className,n=t.prefixCls,r=t.style,i=t.active,m=t.status,u=void 0===m?"wait":m,d=(t.iconPrefix,t.icon),p=(t.wrapperStyle,t.stepNumber,t.disabled),f=t.description,b=t.title,v=t.subTitle,j=(t.progressDot,t.stepIcon,t.tailContent),g=(t.icons,t.stepIndex,t.onStepClick),O=t.onClick,N=Object(s["a"])(t,["className","prefixCls","style","active","status","iconPrefix","icon","wrapperStyle","stepNumber","disabled","description","title","subTitle","progressDot","stepIcon","tailContent","icons","stepIndex","onStepClick","onClick"]),_=E()("".concat(n,"-item"),"".concat(n,"-item-").concat(u),a,(e={},Object(c["a"])(e,"".concat(n,"-item-custom"),d),Object(c["a"])(e,"".concat(n,"-item-active"),i),Object(c["a"])(e,"".concat(n,"-item-disabled"),!0===p),e)),h=Object(o["a"])({},r),w={};return g&&!p&&(w.role="button",w.tabIndex=0,w.onClick=this.onClick),l.a.createElement("div",Object.assign({},N,{className:_,style:h}),l.a.createElement("div",Object.assign({onClick:O},w,{className:"".concat(n,"-item-container")}),l.a.createElement("div",{className:"".concat(n,"-item-tail")},j),l.a.createElement("div",{className:"".concat(n,"-item-icon")},this.renderIconNode()),l.a.createElement("div",{className:"".concat(n,"-item-content")},l.a.createElement("div",{className:"".concat(n,"-item-title")},b,v&&l.a.createElement("div",{title:"string"===typeof v?v:void 0,className:"".concat(n,"-item-subtitle")},v)),f&&l.a.createElement("div",{className:"".concat(n,"-item-description")},f))))}}]),a}(l.a.Component),g=function(e){Object(d["a"])(a,e);var t=Object(p["a"])(a);function a(){var e;return Object(m["a"])(this,a),e=t.apply(this,arguments),e.onStepClick=function(t){var a=e.props,n=a.onChange,c=a.current;n&&c!==t&&n(t)},e}return Object(u["a"])(a,[{key:"render",value:function(){var e,t=this,a=this.props,n=a.prefixCls,i=a.style,m=void 0===i?{}:i,u=a.className,d=a.children,p=a.direction,b=a.type,v=a.labelPlacement,j=a.iconPrefix,g=a.status,O=a.size,N=a.current,_=a.progressDot,h=a.stepIcon,w=a.initial,y=a.icons,C=a.onChange,k=Object(s["a"])(a,["prefixCls","style","className","children","direction","type","labelPlacement","iconPrefix","status","size","current","progressDot","stepIcon","initial","icons","onChange"]),x="navigation"===b,S=_?"vertical":v,I=E()(n,"".concat(n,"-").concat(p),u,(e={},Object(c["a"])(e,"".concat(n,"-").concat(O),O),Object(c["a"])(e,"".concat(n,"-label-").concat(S),"horizontal"===p),Object(c["a"])(e,"".concat(n,"-dot"),!!_),Object(c["a"])(e,"".concat(n,"-navigation"),x),e));return l.a.createElement("div",Object.assign({className:I,style:m},k),Object(f["a"])(d).map((function(e,a){var c=w+a,l=Object(o["a"])({stepNumber:"".concat(c+1),stepIndex:c,key:c,prefixCls:n,iconPrefix:j,wrapperStyle:m,progressDot:_,stepIcon:h,icons:y,onStepClick:C&&t.onStepClick},e.props);return"error"===g&&a===N-1&&(l.className="".concat(n,"-next-error")),e.props.status||(l.status=c===N?g:c<N?"finish":"wait"),l.active=c===N,Object(r["cloneElement"])(e,l)})))}}]),a}(l.a.Component);g.Step=j,g.defaultProps={type:"default",prefixCls:"rc-steps",iconPrefix:"rc",direction:"horizontal",labelPlacement:"horizontal",initial:0,current:0,status:"process",size:"",progressDot:!1};var O=g,N=a("bRQS"),_=a("4i/N"),h=a("H84U"),w=a("CFYs"),y=a("5OYt"),C=function(e){var t,a=e.percent,l=e.size,o=e.className,s=e.direction,m=e.responsive,u=Object(y["a"])(),d=u.xs,p=r["useContext"](h["b"]),f=p.getPrefixCls,b=p.direction,v=r["useCallback"]((function(){return m&&d?"vertical":s}),[d,s]),j=f("steps",e.prefixCls),g=f("",e.iconPrefix),C=E()((t={},Object(c["a"])(t,"".concat(j,"-rtl"),"rtl"===b),Object(c["a"])(t,"".concat(j,"-with-progress"),void 0!==a),t),o),k={finish:r["createElement"](N["a"],{className:"".concat(j,"-finish-icon")}),error:r["createElement"](_["a"],{className:"".concat(j,"-error-icon")})},x=function(e){var t=e.node,n=e.status;if("process"===n&&void 0!==a){var c="small"===l?32:40,i=r["createElement"]("div",{className:"".concat(j,"-progress-icon")},r["createElement"](w["a"],{type:"circle",percent:a,width:c,strokeWidth:4,format:function(){return null}}),t);return i}return t};return r["createElement"](O,Object(n["a"])({icons:k},Object(i["a"])(e,["percent","responsive"]),{direction:v(),stepIcon:x,prefixCls:j,iconPrefix:g,className:C}))};C.Step=O.Step,C.defaultProps={current:0};t["a"]=C},Pp7k:function(e,t,a){e.exports={tip:"tip___3zQz3",words:"words___3r5RX",selected:"selected___1ftM_",trumpet:"trumpet___2crQm",module:"module___yym-o",moduleTitle:"moduleTitle___3Pg1l",toolbar:"toolbar___1th-o",sentenceList:"sentenceList___HFQE-",item:"item___398lH",page:"page___3E8a3"}},Q3Xe:function(e,t,a){e.exports={module:"module___i1JWn",toolbar:"toolbar___3Sjbr",moduleTitle:"moduleTitle___3dte3",wordList:"wordList___1f2yQ",row:"row___1ZTES",phAm:"phAm___wUw4P",wordName:"wordName___3ag8P",play:"play___2Zr7Z",acceptation:"acceptation___2H55g"}},RyZv:function(e,t,a){"use strict";a("DZo9");var n=a("8z0m"),c=a("jrin"),r=(a("miYZ"),a("tsqr")),l=a("tJVT"),i=a("q1tI"),o=a.n(i),s=a("ye1Q"),m=a("xvlK"),u=function(e){var t=e.picture,a=e.onChange,u=Object(i["useState"])(!1),d=Object(l["a"])(u,2),p=d[0],f=d[1];function b(e){var t="image/jpeg"===e.type||"image/png"===e.type;t||r["default"].error("You can only upload JPG/PNG file!");var a=e.size/1024/1024<2;return a||r["default"].error("Image must smaller than 2MB!"),t&&a}var E=function(e){"uploading"!==e.file.status?"done"===e.file.status&&(a(e.file.response.result),f(!1)):f(!0)},v=o.a.createElement("div",null,p?o.a.createElement(s["a"],null):o.a.createElement(m["a"],null),o.a.createElement("div",{style:{marginTop:8}},"Upload"));return o.a.createElement(o.a.Fragment,null,o.a.createElement(n["a"],{listType:"picture-card",className:"avatar-uploader",showUploadList:!1,headers:Object(c["a"])({},"X-Access-Token",localStorage.getItem("jwToken")||""),action:"/api/sys/common/uploadImg/word",beforeUpload:b,onChange:E},t?o.a.createElement("img",{src:t,alt:"avatar",style:{width:"100%"}}):v))};t["a"]=u},X4VG:function(e,t,a){e.exports={content:"content___JxWlV",wordName:"wordName___G-efa",phAm:"phAm___3TsOc",acceptation:"acceptation___Xt9KN"}},"Xe+o":function(e,t,a){e.exports={word:"word___2Dk_U",wordName:"wordName___135sB",star:"star___CzCV0",favorate:"favorate___I-HDN",notFavorate:"notFavorate___3A8Qi",phAm:"phAm___liHdx",trumpet:"trumpet___1x6HV",acceptation:"acceptation___3uQXw",title:"title___3pE7O",sentence:"sentence___32CPy",content:"content___1QGwT",img:"img___2akT9"}},djQt:function(e,t,a){"use strict";var n=a("q1tI"),c={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 00.6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0046.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3z"}}]},name:"star",theme:"filled"},r=c,l=a("6VBw"),i=function(e,t){return n["createElement"](l["a"],Object.assign({},e,{ref:t,icon:r}))};i.displayName="StarFilled";t["a"]=n["forwardRef"](i)},w9TN:function(e,t,a){e.exports={main:"main___1aQBH",header:"header___18vqi",title:"title___3ePi-",toolbar:"toolbar___1R-hF",info:"info___ZnwoH",left:"left___28aMt",infoItem:"infoItem___3fL0g",itemLabel:"itemLabel___32w-6",itemValue:"itemValue___22nQB",right:"right___38N_2",img:"img___3AKNY",moduleTitle:"moduleTitle___jzLuZ"}}}]);