(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[12],{"0db5":function(e,t,a){e.exports={container:"container___WsyHI",list:"list___3tCLx",toolbar:"toolbar___2_BY_",title:"title___2yx3-"}},"0pL4":function(e,t,a){e.exports={container:"container___1VGr-",list:"list___2eEcA",menuItem:"menuItem___P2Kdu",menu:"menu___3K7_5",noteTitle:"noteTitle___27vxM",active:"active___nuHWV"}},"3eer":function(e,t,a){e.exports={main:"main___szT1f",tabPane:"tabPane___2IdiP",btn:"btn___OfdW7",toggler:"toggler___1YkjS",active:"active___1tAVZ",menuBtn:"menuBtn___1NwFz",menuActive:"menuActive___1Smsu",tab:"tab___1chI2",title:"title___AsEuC",buttons:"buttons___3ckzr",content:"content___20fv5",fav:"fav___1iMS-",isMobile:"isMobile___3xC2E",toolbar:"toolbar___JdnWx"}},"G/16":function(e,t,a){e.exports={main:"main___2CQ3t",container:"container___rx9Zr",content:"content___244uc",isMobile:"isMobile___2oOvD"}},"L+oi":function(e,t,a){e.exports=a.p+"static/diamond.fded64d5.svg"},MjzT:function(e,t,a){"use strict";a.r(t);var n=a("tJVT"),c=a("q1tI"),r=a.n(c),o=a("9kvl"),i=a("G/16"),l=a.n(i),s=(a("qVdP"),a("jsC+")),u=(a("+L6B"),a("2/Rp")),d=a("9og8"),m=(a("/xke"),a("TeRw")),f=(a("lUTK"),a("BvKs")),p=(a("2qtc"),a("kLXV")),v=a("WmNS"),b=a.n(v),_=a("RCxd"),h=a("uqfK"),E=a("GZ0F"),y=a("0db5"),N=a.n(y),O=a("KDh5"),j=(a("5NDa"),a("5rEg")),g=a("jrin"),k=a("k1fw"),x=(a("y8nQ"),a("Vl3Y")),I=a("mAF4"),w=a("7rd8"),C=a("xvlK"),S=a("mcit"),T=a.n(S),M=a("QfEt"),L=a("c+yx"),P=x["a"].Item,D={},R=function(e,t){var a=Object(c["useState"])(!1),o=Object(n["a"])(a,2),i=o[0],l=o[1],m=x["a"].useForm(),v=Object(n["a"])(m,1),_=v[0];if(e.visible&&!i){l(!0);var h=e.node||{};_.setFieldsValue({foldName:h.name}),D=Object(k["a"])({id:h.key},h)}var E=function(t){var a=t.key;if("1"==a)l(!0),_.setFieldsValue({foldName:""}),D={parentId:e.note.listParentNote.id,isLeaf:!1};else{var n={id:Object(L["d"])(),name:"\u65b0\u6587\u6863",parentId:e.note.listParentNote.id,isLeaf:!0,isNew:!0};e.dispatch({type:"note/refreshOpenedNotes",payload:Object(k["a"])(Object(k["a"])({},e.note.openedNotes),{},Object(g["a"])({},n.id,n))}),e.dispatch({type:"note/refreshOpenedNoteId",payload:n.id}),e.isMobile&&e.dispatch({type:"note/refreshShowMenu",payload:!1})}},y=r.a.createElement(f["a"],{onClick:E},r.a.createElement(f["a"].Item,{key:"1",icon:r.a.createElement(I["a"],null)},"\u6587\u4ef6\u5939"),r.a.createElement(f["a"].Item,{key:"2",icon:r.a.createElement(w["a"],null)},"\u7b14\u8bb0")),N=function(){var t=Object(d["a"])(b.a.mark((function t(){var a,n;return b.a.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,_.validateFields();case 2:a=t.sent,n=a.foldName,e.dispatch({type:"note/updateNoteTitle",payload:Object(k["a"])(Object(k["a"])({},D),{},{name:n})}),e.onCancel(),l(!1);case 7:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),O=function(){return r.a.createElement("div",{className:e.className},r.a.createElement("div",{className:T.a.toolbar},r.a.createElement(s["a"],{overlay:y,trigger:["click"]},r.a.createElement(u["a"],{type:"primary",shape:"round",icon:r.a.createElement(C["a"],null)},"\u589e\u52a0"))),r.a.createElement(p["a"],{title:"\u8bf7\u8f93\u5165\u6587\u4ef6\u5939\u540d\u79f0...",visible:i,onOk:N,onCancel:function(){e.onCancel(),l(!1)}},r.a.createElement(x["a"],{form:_},r.a.createElement(P,{name:"foldName",rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u6587\u4ef6\u5939\u540d\u79f0!"}]},r.a.createElement(j["a"],{prefix:r.a.createElement(I["a"],null)})))))};return O()},B=Object(M["a"])(Object(o["b"])((function(e){var t=e.note,a=e.loading;return{note:t,loading:a}}))(R)),K=a("oBTY"),F=a("lkk+"),A=a("/MfK"),q=a("0pL4"),H=a.n(q),V=p["a"].confirm,z=50,G=function(e,t){var a=Object(c["useState"])(!1),o=Object(n["a"])(a,2),i=o[0],l=o[1],s=Object(c["useState"])(1),d=Object(n["a"])(s,2),f=d[0],p=d[1],v=Object(c["useState"])([]),b=Object(n["a"])(v,2),h=b[0],E=b[1],y=Object(c["useState"])(!1),N=Object(n["a"])(y,2),O=N[0],j=N[1];Object(c["useEffect"])((function(){g(1)}),[e.params]);var g=function(t){var a=e.getDataMethod,n=e.params;a&&(j(!0),a(Object(k["a"])(Object(k["a"])({pageSize:z},n),{},{pageNo:t})).then((function(e){var a,n=e.result,c=e.success;if(j(!1),c){if(n instanceof Array)a=n;else{var r=n.records,o=n.total,i=n.current;a=1==i?r:[].concat(Object(K["a"])(h),Object(K["a"])(r));var s=o>a.length;l(s),p(t)}x(a)}})))};Object(c["useEffect"])((function(){x(h)}),[e.sortType]);var x=function(t){var a=e.sortType;a&&("default"==a?t=t.sort((function(e,t){return e.isLeaf-t.isLeaf})):"date"==a?t=t.sort((function(e,t){return e.updateTime<t.updateTime?1:-1})):"name"==a&&(t=t.sort((function(e,t){return e.name>t.name})))),E(Object(K["a"])(t))},w=function(t){var a=e.isMobile;if(t.isLeaf){var n=e.note.openedNoteId;n!=t.id&&e.dispatch({type:"note/openNote",payload:t.id}),a&&e.dispatch({type:"note/refreshShowMenu",payload:!1})}else{var c=e.note.listParentNote;c.id!=t.id&&e.dispatch({type:"note/refreshListParentNote",payload:t})}},C=function(t,a){t.preventDefault(),t.stopPropagation(),V({title:"\u786e\u5b9a\u8981\u5220\u9664 ".concat(a.name,"?"),icon:r.a.createElement(_["a"],null),onOk:function(){e.dispatch({type:"note/deleteNote",payload:a}).then((function(){m["default"]["info"]({message:"\u5220\u9664\u6210\u529f"}),g(1)}))}})},S=function(e){var t=e.key||e.id,a=e.title||e.name;return Object(k["a"])(Object(k["a"])({},e),{},{id:t,title:a})},T=function(){g(f+1)},M=function(){var t=e.note.openedNoteId,a=e.data,n=void 0===a?h:a,c=e.noDelete;return r.a.createElement("div",{className:H.a.container,style:e.style},r.a.createElement("div",{className:H.a.list},r.a.createElement("ul",null," ",n.map((function(e){var a=S(e),n=a.id,o=a.title,i=t==n;return r.a.createElement("li",{key:n},r.a.createElement("div",{className:"".concat(H.a.menuItem," ").concat(i?H.a.active:""),onClick:function(){return w(e)}},e.isLeaf?r.a.createElement(F["a"],null):r.a.createElement(I["a"],null),r.a.createElement("div",{className:H.a.noteTitle,draggable:!0},"\xa0\xa0",o),c?"":r.a.createElement("div",{className:H.a.menu,onClick:function(e){return C(e,a)}},r.a.createElement(A["a"],null))))})),i?r.a.createElement("li",null,r.a.createElement(u["a"],{type:"link",loading:O,onClick:T},"\u52a0\u8f7d\u66f4\u591a")):"")))};return M()},W=Object(M["a"])(Object(o["b"])((function(e){var t=e.note,a=e.loading;return{note:t,loading:a}}))(G)),J=(p["a"].confirm,function(e,t){var a=Object(c["useState"])(!1),o=Object(n["a"])(a,2),i=o[0],l=o[1],m=Object(c["useState"])({}),p=Object(n["a"])(m,2),v=p[0],_=p[1],y=Object(c["useState"])("default"),j=Object(n["a"])(y,2),g=j[0],k=j[1];Object(c["useEffect"])((function(){x()}),[e.note.listParentNote]),Object(c["useEffect"])((function(){x()}),[e.note.listKey]);var x=function(){var t=e.note.listParentNote.id;k("default"),_({parentId:t})},I=function(e){k(e.key)},w=r.a.createElement(f["a"],{onClick:I},r.a.createElement(f["a"].Item,{key:"default"},"\u9ed8\u8ba4\u6392\u5e8f"),r.a.createElement(f["a"].Item,{key:"date"},"\u6309\u65f6\u95f4\u6392\u5e8f"),r.a.createElement(f["a"].Item,{key:"name"},"\u6309\u540d\u79f0\u6392\u5e8f")),C=function(){var t=Object(d["a"])(b.a.mark((function t(){var a,n,c,r,o=arguments;return b.a.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(a=o.length>0&&void 0!==o[0]&&o[0],c=e.note.listParentNote.parentId,a||0==c){t.next=7;break}return t.next=5,Object(O["f"])(c);case 5:r=t.sent,n=r.result;case 7:e.dispatch({type:"note/refreshListParentNote",payload:n});case 8:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),S=function(){var t=e.note.listParentNote,a="0"==t.id;return r.a.createElement("div",{className:N.a.container},r.a.createElement(B,{visible:i,node:{},onCancel:function(){return l(!1)}}),r.a.createElement("div",{className:N.a.toolbar},r.a.createElement(u["a"],{type:"text",disabled:a,onClick:function(){return C()}},r.a.createElement("span",{className:"iconfont"},"\ue7c3")),r.a.createElement("span",{className:N.a.title},t.name||"\u6240\u6709\u7b14\u8bb0"),a?r.a.createElement("div",null):r.a.createElement(u["a"],{type:"text",disabled:a,onClick:function(){return C(!0)}},r.a.createElement(h["a"],null)),r.a.createElement(s["a"],{overlay:w,trigger:["click"]},r.a.createElement(u["a"],{type:"text"},r.a.createElement(E["a"],null)))),r.a.createElement("div",{className:N.a.list},r.a.createElement(W,{getDataMethod:O["e"],params:v,sortType:g})))};return S()}),Q=Object(o["b"])((function(e){var t=e.note,a=e.loading;return{note:t,loading:a}}))(J),Y=(a("Znn+"),a("ZTPi")),U=a("uMRc"),Z=a("u2V1"),X=a("ye1Q"),$=a("p8w8"),ee=a("djQt"),te=a("Tm+p"),ae=a("G3dp"),ne=a("9BLJ"),ce=a("2BaD"),re=a("3eer"),oe=a.n(re),ie=a("ddak"),le=a.n(ie),se=a("4i/N"),ue=a("ZM0C"),de=(a("i8oR"),a("DlQD")),me=a.n(de),fe=a("FIf5"),pe=a.n(fe),ve=(a("R5gG"),a("fWQN")),be=a("mtLc"),_e=(a("5GOC"),a("JsLm")),he=a("LvDl"),Ee=_e["a"].Link,ye=function(){function e(){var t=this;Object(ve["a"])(this,e),this.anchors=void 0,this.tocItems=[],this.i=0,this.reset=function(){t.tocItems=[],t.anchors=[],t.i=0},this.i=0,this.anchors=[],this.tocItems=[]}return Object(be["a"])(e,[{key:"add",value:function(e,t){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"",n=(a||e)+this.i++;this.anchors.push(n);var c={anchor:n,level:t,text:e},r=this.tocItems;if(0===r.length)r.push(c);else{var o=Object(he["last"])(r);if(c.level>o.level)for(var i=o.level+1;i<=6;i++){var l=o,s=l.children;if(!s){o.children=[c];break}if(o=Object(he["last"])(s),c.level<=o.level){s.push(c);break}}else r.push(c)}return n}},{key:"renderToc",value:function(e){var t=this;return e.map((function(e){return r.a.createElement(Ee,{key:e.anchor,href:"#".concat(e.anchor),title:e.text},e.children&&t.renderToc(e.children))}))}},{key:"render",value:function(){return r.a.createElement(_e["a"],{affix:!1,showInkInFixed:!0},this.renderToc(this.tocItems))}}]),e}(),Ne=new ye,Oe=new me.a.Renderer;Oe.heading=function(e,t,a){var n=Ne.add(e,t);return'<a id="'.concat(n,'" href="#').concat(n,'" class="anchor-fix"><h').concat(t,">").concat(e,"</h").concat(t,"></a>\n")},me.a.setOptions({renderer:Oe,highlight:function(e){return pe.a.highlightAuto(e).value},gfm:!0,pedantic:!1,sanitize:!1,tables:!0,breaks:!1,smartLists:!1,smartypants:!1}),ue["b"].use(ue["a"].TabInsert,{tabMapValue:1});var je=r.a.forwardRef((function(e,t){var a=Object(c["useState"])(""),o=Object(n["a"])(a,2),i=o[0],l=o[1],s=Object(c["useState"])(""),u=Object(n["a"])(s,2),m=u[0],f=u[1];Object(c["useEffect"])((function(){var t=e.note,a=t.openedNoteId,n=t.openedNotes,c="";a&&(c=n[a].text||""),l(c),h(c),e.setShowToc(!1)}),[e.note.openedNoteId]);var p=function(t){t.html;var a=t.text;l(a),e.handleChange()},v=function(){e.saveContent(i)},_=function(e,t){var a=new FileReader;a.onload=Object(d["a"])(b.a.mark((function e(){var n,c;return b.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return n=function(e){var t=e.split(","),a=t[0].match(/:(.*?);/)[1],n=atob(t[1]),c=n.length,r=new Uint8Array(c);while(c--)r[c]=n.charCodeAt(c);return new Blob([r],{type:a})},n(a.result),e.next=4,Object(O["k"])(a.result);case 4:c=e.sent,c.success?t(c.result):console.log(c.message);case 6:case"end":return e.stop()}}),e)}))),a.readAsDataURL(e)},h=function(e){Ne.reset();var t=me()(e);return f(t),t},E=function(){var t=e.displayIndex,a=e.showToc,n=e.setShowToc,c=e.isMobile;return r.a.createElement(r.a.Fragment,null,1==t?r.a.createElement("div",{className:le.a.text,style:{display:1==t?"block":"none"}},r.a.createElement(ue["b"],{value:i,renderHTML:h,onChange:p,onImageUpload:_,onBlur:v,config:{view:{menu:!0,html:!c,md:!0}}})):"",0==t?r.a.createElement("div",{className:le.a.view},a?r.a.createElement("div",{className:le.a.toc},r.a.createElement("div",{className:le.a.title},r.a.createElement(se["a"],{onClick:function(){n(!1)}})),Ne&&Ne.render()):"",r.a.createElement("div",{className:le.a.text},r.a.createElement(ue["b"],{value:i,renderHTML:function(){return m},config:{view:{menu:!1,md:!1}},readOnly:!0}))):"")};return E()})),ge=Object(M["a"])(Object(o["b"])((function(e){var t=e.note,a=e.loading;return{note:t,loading:a}}),null,null,{forwardRef:!0})(je)),ke=(a("H1Ta"),Y["a"].TabPane),xe={0:r.a.createElement(U["a"],{key:"ok",twoToneColor:"#52c41a"}),1:r.a.createElement(Z["a"],{key:"unsave",twoToneColor:"#f1c40f"}),2:r.a.createElement(X["a"],{key:"saving"})},Ie="group",we=r.a.forwardRef((function(e,t){var a=Object(c["useRef"])(),o=Object(c["useState"])(0),i=Object(n["a"])(o,2),l=i[0],d=i[1],m=Object(c["useState"])(-1),p=Object(n["a"])(m,2),v=p[0],b=p[1],_=Object(c["useState"])(""),h=Object(n["a"])(_,2),E=h[0],y=h[1],N=Object(c["useState"])(!1),O=Object(n["a"])(N,2),x=O[0],I=O[1],w=Object(c["useState"])(!1),C=Object(n["a"])(w,2),S=C[0],T=C[1];Object(c["useEffect"])((function(){var t=e.note,a=t.openedNoteId,n=t.openedNotes;if(a){var c=n[a];c.isNew?b(1):b(0),y(c.name)}else y("")}),[e.note.openedNoteId]),Object(c["useImperativeHandle"])(t,(function(){return{handleAddNote:function(t){var a=Object(L["d"])();d(1);var n={name:"\u65b0\u6587\u6863",parentId:t,id:a};y("\u65b0\u6587\u6863"),e.dispatch({type:"note/refreshShowNote",payload:n})}}}));var M=function(e){d(1)},P=function(e){y(e.target.value),d(1)},D=function(t){var a=e.note.openedNoteId;a!=t&&(e.dispatch({type:"note/openNote",payload:t}),b(0),d(0))},R=function(t){var a={},n=e.note,c=n.openedNoteId,r=n.openedNotes;t?e.dispatch({type:"note/refreshOpenedNoteId"}):c&&r[c]&&(a=Object(g["a"])({},c,r[c])),e.dispatch({type:"note/refreshOpenedNotes",payload:a})},B=function(t,a){if(0!=l){var n,c=e.note,r=c.openedNoteId,o=c.openedNotes,i=Object(k["a"])({},o[r]);d(2),i.name=E,"title"==t?n="note/updateNoteTitle":(n="note/updateNoteText",i.text=a),e.dispatch({type:n,payload:i}).then((function(t){t&&e.note.openedNoteId==i.id&&d(0)}))}},K=function(e,t){"title"==t?B(t):e.relatedTarget&&e.relatedTarget.getAttribute("group")==Ie||B(t)},F=function(t){e.dispatch({type:"note/closeNote",payload:t}),b(0),d(0)},A=function(){var t=e.note,a=t.openedNoteId,n=t.openedNotes;e.dispatch({type:"note/editFav",payload:{noteId:a,isFav:!n[a].fav}})},q=function(){e.dispatch({type:"note/refreshShowMenu",payload:!0})},H=function(){u["a"],$["a"];var t=[],a=e.note,n=a.openedNoteId,c=a.openedNotes;if(n&&c[n])return c[n].fav?t.push(r.a.createElement(u["a"],{key:"noFav",onClick:A,type:"text"},r.a.createElement(ee["a"],{className:oe.a.fav}))):t.push(r.a.createElement(u["a"],{key:"fav",onClick:A,type:"text"},r.a.createElement(te["a"],null))),v?t.push(r.a.createElement(u["a"],{key:"edit",type:"text",onClick:function(){b(0)}},r.a.createElement(ne["a"],null))):t.push(r.a.createElement(u["a"],{key:"view",onClick:function(){return b(1)},type:"text"},r.a.createElement(ae["a"],null))),t.push(xe[l]),t},V=r.a.createElement(f["a"],{onClick:function(e){return R("1"!==e.key)}},r.a.createElement(f["a"].Item,{key:"1"},"\u5173\u95ed\u5176\u4ed6"),r.a.createElement(f["a"].Item,{key:"2"},"\u5173\u95ed\u6240\u6709")),z=[{icon:"&#xe88c;",name:"three"},{icon:"&#xe8bf;",name:"two"},{icon:"&#xe88e;",name:"one"}],G=(f["a"],function(){var t,n,c=e.isMobile,o=e.note,i=o.openedNoteId,l=o.openedNotes,d=e.menuStyle,m=e.setMenuStyle;e.loading.effects["note/openNote"];return r.a.createElement("div",{className:"".concat(oe.a.main," ").concat(c?oe.a.isMobile:"")},c?r.a.createElement("div",{className:oe.a.toolbar},r.a.createElement(u["a"],{shape:"circle",onClick:q},r.a.createElement("span",{className:"iconfont"},"\ue7c3")),r.a.createElement("div",{className:oe.a.buttons},null===(t=H())||void 0===t?void 0:t.map((function(e){return e})))):r.a.createElement("div",{className:oe.a.tabPane},r.a.createElement("div",{className:oe.a.btn},r.a.createElement("div",{className:oe.a.toggler},z.map((function(e){return r.a.createElement("span",{key:e.name,className:"iconfont ".concat(d==e.name?oe.a.active:""),dangerouslySetInnerHTML:{__html:e.icon},onClick:function(){return m(e.name)}})})))),r.a.createElement("div",{className:oe.a.tab},r.a.createElement(Y["a"],{hideAdd:!0,onTabClick:D,activeKey:i,type:"editable-card",onEdit:F},Object.keys(l).map((function(e){return r.a.createElement(ke,{tab:l[e].name,key:l[e].id})})))),r.a.createElement("div",{className:oe.a.btn},r.a.createElement(s["a"],{overlay:V,onVisibleChange:function(e){I(e)},visible:x},r.a.createElement("div",{className:oe.a.closeBtn},r.a.createElement(ce["a"],null))))),r.a.createElement("div",{className:oe.a.title},c?"":r.a.createElement(u["a"],{type:"text",onClick:function(){return T(!S)},disabled:!!v},r.a.createElement("span",{className:"iconfont"},"\ue7e3")),r.a.createElement(j["a"],{maxLength:100,ref:a,value:E,onBlur:function(e){return K(e,"title")},onInput:P}),c?"":r.a.createElement("div",{className:oe.a.buttons},null===(n=H())||void 0===n?void 0:n.map((function(e){return e})))),r.a.createElement("div",{className:oe.a.content},r.a.createElement(ge,{handleChange:M,showToc:S,setShowToc:T,displayIndex:v,saveContent:function(e){return B("content",e)}})))});return G()})),Ce=Object(M["a"])(Object(o["b"])((function(e){var t=e.note,a=e.loading;return{note:t,loading:a}}),null,null,{forwardRef:!0})(we)),Se=a("L+oi"),Te=a.n(Se),Me=a("lzHC"),Le=a.n(Me),Pe=(a("ozfa"),a("MJZm")),De=a("yOLg"),Re=a("NT1f"),Be=a("DRyX"),Ke=a("sKr2"),Fe=a.n(Ke),Ae=p["a"].confirm,qe=Pe["a"].DirectoryTree,He=function(e,t){var a=Object(c["useState"])([]),o=Object(n["a"])(a,2),i=o[0],l=o[1],s=Object(c["useState"])(!1),u=Object(n["a"])(s,2),d=u[0],f=u[1],p=Object(c["useState"])({}),v=Object(n["a"])(p,2),b=v[0],h=v[1],E=Object(c["useState"])([]),y=Object(n["a"])(E,2),N=y[0],j=y[1],g=Object(c["useState"])([]),k=Object(n["a"])(g,2),x=k[0],w=k[1];Object(c["useEffect"])((function(){Object(O["g"])("0",!0).then((function(e){var t=e.result;return w(t)}))}),[]),Object(c["useEffect"])((function(){Object(O["g"])("0",!0).then((function(e){var t=e.result;return w(t)}))}),[e.note.treeKey]),Object(c["useEffect"])((function(){var t=e.note,a=t.openedNoteId,n=t.openedNotes,c=n[a];if(c&&c.parentIds){var r=(c.parentIds||"").split("/");l([a].concat(Object(K["a"])(r)))}j([a])}),[e.note.openedNoteId]);var C=function(e){l(e)},S=function(t,a){var n=a.node,c=n.key,r=n.title,o=n.isLeaf,i=n.parentIds,l=n.parentId;o?e.onNoteClick({id:c,name:r,parentIds:i,isLeaf:o,parentId:l}):(e.dispatch({type:"note/refreshListParentNote",payload:{id:c,name:r}}),j([c]))},T=function(t){Ae({title:"\u786e\u5b9a\u8981\u5220\u9664 ".concat(t.title,"?"),icon:r.a.createElement(_["a"],null),onOk:function(){e.dispatch({type:"note/deleteNote",payload:{id:t.key,isLeaf:t.isLeaf,parentIds:t.parentIds,parentId:t.parentId}}).then((function(){m["default"]["info"]({message:"\u5220\u9664\u6210\u529f"})}))}})},M=function(e){f(!0),h(e)},L=function(t){var a=t.node,n=t.dragNode,c=a.key;n&&n.parentId!=c&&n.key!=c&&e.dispatch({type:"note/updateParent",payload:{id:n.key,parentId:c}})},P=function(){e.loading.effects["note/queryMenuTree"];return r.a.createElement("div",{className:Fe.a.content},r.a.createElement(B,{visible:d,node:b,onCancel:function(){return f(!1)}}),r.a.createElement("div",{className:Fe.a.tree},r.a.createElement(qe,{selectedKeys:N,blockNode:!0,multiple:!0,showIcon:!1,expandedKeys:i,treeData:x,onExpand:C,titleRender:function(e){var t,a={color:"rgba(0, 0, 0, 0.5)"};return t=e.isLeaf?r.a.createElement(F["a"],null):i.includes(e.key)?0==e.parentId?r.a.createElement(De["a"],{style:a}):r.a.createElement(Re["a"],null):0==e.parentId?r.a.createElement(Be["a"],{style:a}):r.a.createElement(I["a"],null),r.a.createElement("div",{className:Fe.a.treeNode},r.a.createElement("div",{className:Fe.a.title},t,e.title),r.a.createElement("div",{className:"noteTreeMenu",onClick:function(t){t.preventDefault(),t.stopPropagation(),M(e)}},r.a.createElement(ae["a"],null)),r.a.createElement("div",{className:"noteTreeMenu delete",onClick:function(t){t.preventDefault(),t.stopPropagation(),T(e)}},r.a.createElement(A["a"],null)))},autoExpandParent:!0,draggable:!0,onSelect:S,onDrop:L})))};return P()},Ve=Object(o["b"])((function(e){var t=e.note,a=e.loading;return{note:t,loading:a}}))(He),ze=(a("nRaC"),a("5RzL")),Ge=a("l+S1"),We=a("hPJ6"),Je=a.n(We),Qe=function(e,t){var a=Object(c["useState"])(""),o=Object(n["a"])(a,2),i=o[0],l=o[1],s=Object(c["useState"])(""),u=Object(n["a"])(s,2),d=u[0],m=u[1],f=Object(c["useState"])([]),p=Object(n["a"])(f,2),v=p[0],b=p[1],_=Object(c["useState"])({}),h=Object(n["a"])(_,2),E=h[0],y=h[1];Object(c["useEffect"])((function(){Object(O["g"])("0",!1).then((function(e){var t=e.result;return b(t)}))}),[]),Object(c["useEffect"])((function(){N()}),[d]);var N=function(){var e={parentId:d,searchStr:i,withLeaf:!1};y(e)},g=function(){return r.a.createElement("div",{className:Je.a.container,style:e.style},r.a.createElement("div",{className:Je.a.searchBar},r.a.createElement(j["a"],{className:Je.a.search,value:i,onChange:function(e){return l(e.currentTarget.value)},onPressEnter:N,suffix:r.a.createElement(Ge["a"],null)}),r.a.createElement("div",null,r.a.createElement("label",{className:Je.a.treeLabel},"\u4f4d\u7f6e :"),r.a.createElement(ze["a"],{style:{width:"100%"},value:d,dropdownStyle:{maxHeight:400,overflow:"auto"},treeData:v,placeholder:"Please select",onChange:function(e){return m(e)}}))),r.a.createElement("div",{className:Je.a.list},r.a.createElement(W,{getDataMethod:O["c"],params:E})))};return g()},Ye=Object(o["b"])((function(e){var t=e.note,a=e.loading;return{note:t,loading:a}}))(Qe),Ue=a("uqxR"),Ze=a.n(Ue),Xe=function(e,t){var a=Object(c["useState"])([]),o=Object(n["a"])(a,2),i=o[0],l=o[1];Object(c["useEffect"])((function(){Object(O["d"])().then((function(e){var t=e.result;return l(t)}))}),[e.note.favKey]);var s=function(){return r.a.createElement("div",{className:Ze.a.container},r.a.createElement(W,{data:i,noDelete:!0}))};return s()},$e=Object(o["b"])((function(e){var t=e.note;return{note:t}}))(Xe),et=function(e,t){var a=Object(c["useState"])("tree"),o=Object(n["a"])(a,2),i=o[0],l=o[1],s=function(){e.setMenuStyle("two")},u=function(t){"three"!=e.menuStyle&&e.setMenuStyle("three"),l(t)},d=function(t){var a=e.isMobile;if(t.isLeaf){var n=e.note.openedNoteId;n!=t.id&&e.dispatch({type:"note/openNote",payload:t.id}),a&&s()}else{var c=e.note.listParentNote;c.id!=t.id&&e.dispatch({type:"note/refreshListParentNote",payload:t})}},m={tree:{menuType:"tree",icon:"&#xe82d;",text:"\u6587\u4ef6\u5939"},list:{menuType:"list",icon:"&#xe8a8;",text:"\u5217\u8868"},search:{menuType:"search",icon:"&#xe893;",text:"\u641c\u7d22"},fav:{menuType:"fav",icon:"&#xe8b1;",text:"\u6536\u85cf\u5939"}},f=function(){return r.a.createElement("div",{className:"".concat(Le.a.container," ").concat(Le.a[e.menuStyle])},r.a.createElement("div",{className:Le.a.menu},r.a.createElement("span",{className:Le.a.avatar},r.a.createElement("img",{src:Te.a})),r.a.createElement("ul",null,Object.keys(m).map((function(e){return r.a.createElement("li",{key:e,onClick:function(){return u(e)},className:m[e].menuType==i?Le.a.active:""},r.a.createElement("span",{className:"iconfont",dangerouslySetInnerHTML:{__html:m[e].icon}}))})))),r.a.createElement("div",{className:Le.a.content},r.a.createElement("header",{className:Le.a.header},r.a.createElement("em",{className:Le.a.closeBtn},r.a.createElement("span",{className:"iconfont",onClick:s},"\ue86a")),m[i]?m[i].text:""),r.a.createElement("article",{className:Le.a.body},r.a.createElement("div",{className:"tree"==i?Le.a.show:Le.a.hide},r.a.createElement(Ve,{onNoteClick:d,getDragNote:function(){return dragNote}})),r.a.createElement("div",{className:"list"==i?Le.a.show:Le.a.hide},r.a.createElement(Q,{onNoteClick:d,setDragNote:function(){}})),r.a.createElement("div",{className:"search"==i?Le.a.show:Le.a.hide},r.a.createElement(Ye,{onNoteClick:d})),r.a.createElement("div",{className:"fav"==i?Le.a.show:Le.a.hide},r.a.createElement($e,{onNoteClick:d})))))};return f()},tt=Object(o["b"])((function(e){var t=e.note,a=e.loading;return{note:t,loading:a}}))(et),at=function(e){var t=Object(c["useState"])("three"),a=Object(n["a"])(t,2),o=a[0],i=a[1],s=function(t){var a=e.isMobile;if(t.isLeaf){var n=e.note.openedNote;n.id!=t.id&&e.dispatch({type:"note/openNote",payload:t.id}),a&&e.dispatch({type:"note/refreshShowMenu",payload:!1})}else{var c=e.note.listParentNote;c.id!=t.id&&e.dispatch({type:"note/refreshListParentNote",payload:t})}},u=function(){var t=e.isMobile;e.loading.effects["note/queryNote"]||e.loading.effects["note/deleteNote"]||e.loading.effects["note/updateNoteTitle"]||e.loading.effects["note/queryTabTree"]||e.loading.effects["note/queryChildren"];return r.a.createElement("div",{className:"".concat(l.a.main," ").concat(t?l.a.isMobile:"")},t?e.note.showMenu?r.a.createElement(Q,{onNoteClick:s,setDragNote:function(e){return e}}):r.a.createElement(Ce,{setMenuStyle:i,menuStyle:o}):r.a.createElement("div",{className:l.a.container},r.a.createElement(tt,{setMenuStyle:i,menuStyle:o}),r.a.createElement("div",{className:l.a.content},r.a.createElement(Ce,{setMenuStyle:i,menuStyle:o}))))};return u()};t["default"]=Object(M["a"])(Object(o["b"])((function(e){var t=e.note,a=e.loading;return{note:t,loading:a}}))(at))},QfEt:function(e,t,a){"use strict";var n=a("0Owb"),c=a("q1tI"),r=a.n(c),o=a("lU33"),i=function(e){return function(t){return r.a.createElement(o["a"],{query:"(max-width:900px)"},(function(a){return r.a.createElement(e,Object(n["a"])({},t,{isMobile:a}))}))}};t["a"]=i},ddak:function(e,t,a){e.exports={view:"view___CFH8I",toc:"toc___1DkbD",title:"title___3kzp9",text:"text___9cYVR"}},hPJ6:function(e,t,a){e.exports={container:"container___3qFCj",searchBar:"searchBar___h7W8C",search:"search___30H_5",treeLabel:"treeLabel___1IGyY",list:"list___22CGC"}},lzHC:function(e,t,a){e.exports={main:"main___3GVUh",container:"container___Ku18n",content:"content___2uth4",isMobile:"isMobile___1E54u",three:"three___2af9R",two:"two___1psg2",one:"one___5FtEX",menu:"menu___2vaSs",avatar:"avatar___3pPfy",active:"active___1uxcK",header:"header___3KYU-",closeBtn:"closeBtn___3eWHa",body:"body___1a_BY",show:"show___30Fr5",hide:"hide___2vNBK"}},mcit:function(e,t,a){e.exports={toolbar:"toolbar___2gR-C"}},sKr2:function(e,t,a){e.exports={content:"content___35fWD",tree:"tree___22diT",treeNode:"treeNode___18zdE",treeMenu:"treeMenu___7iaeS",title:"title___3-coS"}},uqxR:function(e,t,a){e.exports={main:"main___33xfB",container:"container___3aQ7f",content:"content___KAs_i",isMobile:"isMobile___30Y5W"}}}]);