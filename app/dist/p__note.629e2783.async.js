(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[14],{"2fiX":function(e,t,n){e.exports={view:"view___RQaT-",toc:"toc___1wBj5",title:"title___2X1xP",text:"text___2jNE4"}},DHr5:function(e,t,n){e.exports={color0:"color0___185fN",color1:"color1___1S--c",color2:"color2___2iYAu",color3:"color3___2HLna",color4:"color4___2rISU",color5:"color5___34hrO",color6:"color6___1z796",main:"main___1rquz",icon:"icon___1AyJp",item:"item___15t1x",shortLogo:"shortLogo___2S5Hp",label:"label___1j4bL",showLabel:"showLabel___r5ci0",active:"active___3C-Cp",modal:"modal___pxpwq",title:"title___17TDX",buttons:"buttons___2vXZ5",searchList:"searchList___1ICeu",loading:"loading___2uYet",listItem:"listItem___3F9xz",select:"select___2U5GY",content:"content____zv-n",searchTb:"searchTb___30dkh"}},MjzT:function(e,t,n){"use strict";n.r(t);n("T2oS");var a=n("W9HT"),c=n("q1tI"),r=n.n(c),o=n("9kvl"),l=(n("/zsF"),n("PArb")),i=(n("+L6B"),n("2/Rp")),u=(n("qVdP"),n("jsC+")),s=(n("/xke"),n("TeRw")),d=n("k1fw"),m=n("oBTY"),f=(n("lUTK"),n("BvKs")),v=n("tJVT"),p=(n("2qtc"),n("kLXV")),b=n("73BT"),_=n("djQt"),h=n("RCxd"),E=n("UESt"),y=n("8Skl"),O=n("xvlK"),j=n("5bA4"),M=n("lzHC"),g=n.n(M),N=(n("Mwp2"),n("VXEj")),C=n("l+S1"),k=n("eFNv"),w=n("w5pM"),I=n("4i/N"),x=n("DHr5"),T=n.n(x),S=n("0Owb"),L=(n("5NDa"),n("5rEg")),A=(n("miYZ"),n("tsqr")),q=n("9og8"),F=(n("y8nQ"),n("Vl3Y")),R=n("WmNS"),z=n.n(R),B=n("bPPy"),V={labelCol:{span:6},wrapperCol:{span:12}},H=function(e){var t=e.modalVisible,n=e.onCancel,a=e.note,o=F["a"].useForm(),l=Object(v["a"])(o,1),i=l[0];return Object(c["useEffect"])((function(){i.setFieldsValue(a)}),[a]),r.a.createElement(p["a"],{title:"\u8be6\u7ec6\u4fe1\u606f",visible:t,onCancel:function(){return n(!1)},style:{top:20},onOk:Object(q["a"])(z.a.mark((function e(){var t,c,r,o,l;return z.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,i.validateFields();case 2:return t=e.sent,c=Object(d["a"])(Object(d["a"])({},a),t),e.next=6,Object(B["k"])(c);case 6:r=e.sent,o=r.success,l=r.message,o?(A["default"].success("\u64cd\u4f5c\u6210\u529f!"),n(!0)):A["default"].error(l);case 10:case"end":return e.stop()}}),e)})))},r.a.createElement(F["a"],Object(S["a"])({},V,{form:i}),r.a.createElement(F["a"].Item,{label:"\u6807\u9898",name:"name",rules:[{required:!0,message:"Please input your title!"}]},r.a.createElement(L["a"],null))))},P=H,D=n("c+yx"),U=n("56rK"),Q=n.n(U),Y=n("DlQD"),K=n.n(Y),X=n("RotF"),J=n.n(X),Z=20,G=function(e){var t=e.modalVisible,n=e.onCancel,o=Object(c["useState"])(""),l=Object(v["a"])(o,2),u=l[0],s=l[1],d=Object(c["useState"])([]),f=Object(v["a"])(d,2),b=f[0],_=f[1],h=Object(c["useState"])({}),E=Object(v["a"])(h,2),y=E[0],O=E[1],j=Object(c["useState"])(1),M=Object(v["a"])(j,2),g=M[0],k=M[1],w=Object(c["useState"])(0),x=Object(v["a"])(w,2),S=x[0],A=x[1],F=Object(c["useState"])(!1),R=Object(v["a"])(F,2),V=R[0],H=R[1],P=Object(c["useState"])(!1),D=Object(v["a"])(P,2),U=D[0],Y=D[1],X=function(){var e=Object(q["a"])(z.a.mark((function e(t){var n;return z.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return 1==t&&H(!0),Y(!0),e.next=4,Object(B["i"])({pageNo:t,pageSize:Z,searchStr:u});case 4:n=e.sent,n&&n.success?(A(n.result.total),_(1==t?n.result.records:[].concat(Object(m["a"])(b),Object(m["a"])(n.result.records)))):(A(0),_([])),Y(!1),H(!1);case 8:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),G=function(){X(g+1),k(g+1)},W=function(e){O(e)},$=function(){var t=y.parentIds;if(t){var n=t.split("/");n.push(y.id),e.dispatch({type:"noteMenu/updateActiveTop",payload:n[1]}),n[2]&&e.dispatch({type:"noteMenu/refreshActiveMenu1Id",payload:n[2]}),n[3]&&e.dispatch({type:"noteMenu/refreshActiveMenu2Id",payload:n[3]}),n[4]&&e.dispatch({type:"noteMenu/refreshActiveMenu3Id",payload:n[4]}),e.dispatch({type:"note/queryNote",payload:y.id}),e.onCancel()}};return Object(c["useEffect"])((function(){X(g)}),[g]),r.a.createElement(p["a"],{visible:t,closable:!1,footer:!1,style:{top:20}},r.a.createElement("div",{className:T.a.modal},r.a.createElement("div",{className:T.a.title,style:{borderBottom:0}},r.a.createElement("span",null,"\u641c\u7d22\u7b14\u8bb0\u672c"),r.a.createElement("div",{className:T.a.buttons},r.a.createElement(i["a"],{type:"text",onClick:n},r.a.createElement(I["a"],null)))),r.a.createElement(L["a"],{prefix:r.a.createElement(C["a"],{className:"site-form-item-icon"}),onChange:function(e){return s(e.target.value)},onPressEnter:function(){return X(1)},onBlur:function(){return X(1)}}),r.a.createElement(a["a"],{spinning:V},r.a.createElement("div",{className:T.a.searchList},r.a.createElement(J.a,{initialLoad:!1,pageStart:0,loadMore:G,hasMore:!U&&b.length<S,useWindow:!1},r.a.createElement(N["b"],{size:"small",dataSource:b,renderItem:function(e){return r.a.createElement(N["b"].Item,{className:"".concat(T.a.listItem," ").concat(e.id==y.id?T.a.select:""),onClick:function(){return W(e)},key:e.id},e.name)}},U&&b.length<S&&r.a.createElement("div",{className:T.a.loading},r.a.createElement(a["a"],null)))))),r.a.createElement("div",{className:T.a.content},r.a.createElement(Q.a,{style:{border:0},value:y.text,renderHTML:function(){return K()(y.text||"")},config:{view:{menu:!1,md:!1}},readOnly:!0})),r.a.createElement("div",{className:T.a.searchTb},r.a.createElement(i["a"],{disabled:!y.id,onClick:$},"\u6253\u5f00"),r.a.createElement(i["a"],{onClick:n},"\u5173\u95ed"))))},W=Object(o["b"])()(G),$=function(e){var t=Object(c["useState"])(!1),n=Object(v["a"])(t,2),a=n[0],o=n[1],l=Object(c["useState"])(!1),u=Object(v["a"])(l,2),s=u[0],d=u[1],m=Object(c["useState"])(!1),f=Object(v["a"])(m,2),b=f[0],_=f[1],h=Object(c["useState"])(!1),E=Object(v["a"])(h,2),y=E[0],O=E[1],j=Object(c["useState"])({}),M=Object(v["a"])(j,2),g=M[0],x=M[1];Object(c["useEffect"])((function(){S()}),[]);var S=function(){e.dispatch({type:"noteMenu/queryTopMenu",payload:"0"})},L=function(){O(!0),x({name:"",id:Object(D["c"])()})},A=function(t,n){e.dispatch({type:"noteMenu/updateActiveTop",payload:t}),o(!1)},q=function(){d(!1)},F=function(){d(!0)},R=function(){_(!0)},z=function(e){O(!0),x(e)},B=function(e){},V=function(e){e&&S(),O(!1)},H=function(){var t=e.noteMenu,n=t.topMenuItem,c=t.activeTopId;return r.a.createElement("div",{className:T.a.main},r.a.createElement("div",{className:T.a.icon},r.a.createElement(C["a"],{onClick:R})),r.a.createElement("ul",{onMouseEnter:function(){return o(!0)},onMouseLeave:function(){return o(!1)}},n.map((function(e){var t=e.id==c;return r.a.createElement("li",{key:e.id,onClick:function(){return A(e.id,e.name)},className:"".concat(T.a.item," ").concat(t?T.a.active:"")},r.a.createElement("div",{className:T.a.shortLogo},e.name.substr(0,1)),r.a.createElement("div",{className:"".concat(T.a.label," ").concat(a?T.a.showLabel:"")},e.name))}))),r.a.createElement("div",{className:T.a.icon},r.a.createElement(k["a"],{onClick:F})),r.a.createElement(p["a"],{visible:s,closable:!1,footer:null,style:{top:20}},r.a.createElement("div",{className:T.a.modal},r.a.createElement("div",{className:T.a.title},r.a.createElement("span",null,"\u7ba1\u7406\u7b14\u8bb0\u672c"),r.a.createElement("div",{className:T.a.buttons},r.a.createElement(i["a"],{type:"text",onClick:L},r.a.createElement(w["a"],null)),r.a.createElement(i["a"],{type:"text",onClick:q},r.a.createElement(I["a"],null)))),r.a.createElement(N["b"],{dataSource:n,renderItem:function(e){return r.a.createElement(N["b"].Item,{actions:[r.a.createElement("a",{onClick:function(){z(e)}},"edit"),r.a.createElement("a",{onClick:function(){B(e.id)}},"delete")]},e.name)}}))),r.a.createElement(W,{modalVisible:b,onCancel:function(){_(!1)}}),r.a.createElement(P,{onCancel:V,note:g,modalVisible:y}))};return H()},ee=Object(o["b"])((function(e){var t=e.note,n=e.noteMenu,a=e.loading;return{note:t,noteMenu:n,loading:a}}))($),te=p["a"].confirm,ne=[{id:"open",name:"\u6700\u8fd1\u6253\u5f00",icon:r.a.createElement(b["a"],null)},{id:"favorate",name:"\u6536\u85cf\u5939",icon:r.a.createElement(_["a"],{className:g.a.favorate})}],ae={fontSize:"10px"},ce=function(e,t){var n=Object(c["useState"])(!1),a=Object(v["a"])(n,2),o=a[0],p=a[1],b=Object(c["useState"])([]),_=Object(v["a"])(b,2),M=_[0],N=_[1];Object(c["useEffect"])((function(){e.refreshMenu(2)}),[e.noteMenu.activeMenu1Id]),Object(c["useEffect"])((function(){e.refreshMenu(3)}),[e.noteMenu.activeMenu2Id]);var C=function(e){return"favorate"==e.id||"open"==e.id?r.a.createElement(r.a.Fragment,null):r.a.createElement(f["a"],{onClick:function(t){return T(t,e)}},r.a.createElement(f["a"].Item,{key:"add"},"\u589e\u52a0\u5b50\u7b14\u8bb0"),r.a.createElement(f["a"].Item,{key:"del"},"\u5220\u9664"))},k=function(e,t){N(e?M.filter((function(e){return e!=t})):[t].concat(Object(m["a"])(M)))},w=function(t){var n=x(t),a=n.id,c=(n.title,n.level);"open"!=a&&"favorate"!=a&&e.dispatch({type:"note/queryNote",payload:a}),1==c?e.dispatch({type:"noteMenu/refreshActiveMenu1Id",payload:a}):2==c?e.dispatch({type:"noteMenu/refreshActiveMenu2Id",payload:a}):e.dispatch({type:"noteMenu/refreshActiveMenu3Id",payload:a})},I=function(t){t==e.noteMenu.activeMenu1Id?e.dispatch({type:"noteMenu/refreshMenu3",payload:[]}):t==e.noteMenu.activeTopId&&(e.dispatch({type:"noteMenu/refreshMenu2",payload:[]}),e.dispatch({type:"noteMenu/refreshMenu3",payload:[]})),e.onAddNote(t)},x=function(e){var t,n=e.key||e.id,a=e.title||e.name;return t="favorate"==n||"open"==n?1:Object(D["a"])(e.parentIds),Object(d["a"])(Object(d["a"])({},e),{},{id:n,title:a,level:t})},T=function(t,n){var a=t.key,c=x(n),o=c.id,l=c.title,i=c.level;"add"==a||"del"==a&&te({title:"\u786e\u5b9a\u8981\u5220\u9664 ".concat(l,"?"),icon:r.a.createElement(h["a"],null),onOk:function(){e.dispatch({type:"note/deleteNote",payload:o}).then((function(){s["default"]["info"]({message:"\u5220\u9664\u6210\u529f"}),e.refreshMenu(i)}))}})},S=function(e){var t=e.level,n=e.id;if(t>=3){if(!e.leaf)return M.includes(n)?r.a.createElement(E["a"],{style:ae,onClick:function(){return k(!0,n)}}):r.a.createElement(y["a"],{style:ae,onClick:function(){return k(!1,n)}})}else if(e.icon)return e.icon},L=function e(t,n){if(t)return r.a.createElement("ul",null,t.map((function(t){var a=x(t),c=a.id,o=a.title,l=a.level,i=void 0===l?0:l,s=(i||0)>=3;return r.a.createElement("li",{key:c},r.a.createElement(u["a"],{overlay:C(t),trigger:["contextMenu"]},r.a.createElement("div",{className:"".concat(g.a.menu1Item," ").concat(n==c?g.a.active:"")},r.a.createElement("div",{className:g.a.label,onClick:function(){return w(t)},style:{paddingLeft:"".concat(s?8*(i-3)+12:12,"px")}},S(a),r.a.createElement("div",{className:g.a.noteTitle},"\xa0\xa0",o),i<=3&&"open"!=c&&"favorate"!=c?r.a.createElement("span",{className:g.a.addChild,onClick:function(e){e.stopPropagation(),e.preventDefault(),I(c)}},r.a.createElement(O["a"],{title:"\u589e\u52a0\u5b50\u7b14\u8bb0"})):""))),!t.children||M.includes(c)?"":e(t.children,n))})))},A=function(){var t=e.noteMenu,n=t.menu1Item,a=t.menu2Item,c=t.menu3Item;return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:"".concat(g.a.content," ").concat(o?g.a.hidden:g.a.show)},r.a.createElement("div",{className:g.a.fold},r.a.createElement(i["a"],{type:"primary",size:"small",onClick:function(){return p(!o)},shape:"circle",icon:o?r.a.createElement(E["a"],null):r.a.createElement(j["a"],null)})),r.a.createElement("div",{className:g.a.menu},r.a.createElement(ee,null),r.a.createElement("div",{className:g.a.menuContent},r.a.createElement("div",{className:g.a.title},e.noteMenu.title1),r.a.createElement("ul",null,L(ne,e.noteMenu.activeMenu1Id),r.a.createElement(l["a"],null),L(n,e.noteMenu.activeMenu1Id)),r.a.createElement("div",{className:g.a.button},r.a.createElement(i["a"],{block:!0,onClick:function(){return I(e.noteMenu.activeTopId)}},"\u589e\u52a0"))),a.length>0?r.a.createElement("div",{className:g.a.menuContent},r.a.createElement("div",{className:g.a.title},e.noteMenu.title2),L(a,e.noteMenu.activeMenu2Id),r.a.createElement("div",{className:g.a.button},r.a.createElement(i["a"],{block:!0,onClick:function(){return I(e.noteMenu.activeMenu1Id)}},"\u589e\u52a0"))):"",c.length>0?r.a.createElement("div",{className:g.a.menuContent},r.a.createElement("div",{className:g.a.title},e.noteMenu.title3),L(c,e.noteMenu.activeMenu3Id),r.a.createElement("div",{className:g.a.button},r.a.createElement(i["a"],{block:!0,onClick:function(){return I(e.noteMenu.activeMenu2Id)}},"\u589e\u52a0"))):"")))};return A()},re=Object(o["b"])((function(e){var t=e.note,n=e.noteMenu,a=e.loading;return{note:t,noteMenu:n,loading:a}}))(ce),oe=n("uMRc"),le=n("u2V1"),ie=n("ye1Q"),ue=n("G3dp"),se=n("9BLJ"),de=n("xiY8"),me=n.n(de),fe=n("2fiX"),ve=n.n(fe),pe=n("RVw9"),be=(n("i8oR"),n("FIf5")),_e=n.n(be),he=(n("bi5S"),n("fWQN")),Ee=n("mtLc"),ye=(n("5GOC"),n("JsLm")),Oe=n("LvDl"),je=ye["a"].Link,Me=function(){function e(){var t=this;Object(he["a"])(this,e),this.anchors=void 0,this.tocItems=[],this.i=0,this.reset=function(){t.tocItems=[],t.anchors=[],t.i=0},this.i=0,this.anchors=[],this.tocItems=[]}return Object(Ee["a"])(e,[{key:"add",value:function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"",a=(n||e)+this.i++;this.anchors.push(a);var c={anchor:a,level:t,text:e},r=this.tocItems;if(0===r.length)r.push(c);else{var o=Object(Oe["last"])(r);if(c.level>o.level)for(var l=o.level+1;l<=6;l++){var i=o,u=i.children;if(!u){o.children=[c];break}if(o=Object(Oe["last"])(u),c.level<=o.level){u.push(c);break}}else r.push(c)}return a}},{key:"renderToc",value:function(e){var t=this;return e.map((function(e){return r.a.createElement(je,{key:e.anchor,href:"#".concat(e.anchor),title:e.text},e.children&&t.renderToc(e.children))}))}},{key:"render",value:function(){return r.a.createElement(ye["a"],{affix:!1,showInkInFixed:!0},this.renderToc(this.tocItems))}}]),e}(),ge=new Me,Ne=new K.a.Renderer;Ne.heading=function(e,t,n){var a=ge.add(e,t);return'<a id="'.concat(a,'" href="#').concat(a,'" class="anchor-fix"><h').concat(t,">").concat(e,"</h").concat(t,"></a>\n")},K.a.setOptions({renderer:Ne,highlight:function(e){return _e.a.highlightAuto(e).value},gfm:!0,pedantic:!1,sanitize:!1,tables:!0,breaks:!1,smartLists:!1,smartypants:!1}),Q.a.use(U["Plugins"].TabInsert,{tabMapValue:1});var Ce=r.a.forwardRef((function(e,t){var n=Object(c["useState"])(""),a=Object(v["a"])(n,2),o=a[0],l=a[1],i=Object(c["useState"])(!0),u=Object(v["a"])(i,2),s=u[0],d=u[1],m=Object(c["useState"])(""),f=Object(v["a"])(m,2),p=f[0],b=f[1];Object(c["useEffect"])((function(){var t=e.note.showNote.text||"";l(t),y(t),d(!0)}),[e.note.showNote]);var _=function(t){t.html;var n=t.text;l(n),e.handleChange()},h=function(){e.saveContent(o)},E=function(e,t){var n=new FileReader;n.onload=Object(q["a"])(z.a.mark((function e(){var a,c,r;return z.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return a=function(e){var t=e.split(","),n=t[0].match(/:(.*?);/)[1],a=atob(t[1]),c=a.length,r=new Uint8Array(c);while(c--)r[c]=a.charCodeAt(c);return new Blob([r],{type:n})},c=a(n.result),console.log(c),e.next=5,Object(B["l"])(n.result);case 5:r=e.sent,r.success?t(r.result):console.log(r.message);case 7:case"end":return e.stop()}}),e)}))),n.readAsDataURL(e)},y=function(e){ge.reset();var t=K()(e);return b(t),t},O=function(){var t=e.displayIndex;return r.a.createElement(r.a.Fragment,null,1==t?r.a.createElement("div",{className:ve.a.text,style:{display:1==t?"block":"none"}},r.a.createElement(Q.a,{value:o,style:{height:"600px"},renderHTML:y,onChange:_,onImageUpload:E,onBlur:h})):"",0==t?r.a.createElement("div",{className:ve.a.view},s?r.a.createElement("div",{className:ve.a.toc},r.a.createElement("div",{className:ve.a.title},r.a.createElement("span",null,"\u5927\u7eb2"),r.a.createElement(I["a"],{onClick:function(){d(!1)}})),ge&&ge.render()):r.a.createElement(pe["a"],{onClick:function(){d(!0)}}),r.a.createElement("div",{className:ve.a.text},r.a.createElement(Q.a,{value:o,style:{border:0},renderHTML:function(){return p},config:{view:{menu:!1,md:!1}},readOnly:!0}))):"")};return O()})),ke=Object(o["b"])((function(e){var t=e.note,n=e.noteMenu,a=e.loading;return{note:t,noteMenu:n,loading:a}}),null,null,{forwardRef:!0})(Ce),we=L["a"].TextArea,Ie={0:r.a.createElement(oe["a"],{twoToneColor:"#52c41a"}),1:r.a.createElement(le["a"],{twoToneColor:"#f1c40f"}),2:r.a.createElement(ie["a"],null)},xe="group",Te=r.a.forwardRef((function(e,t){var n=Object(c["useRef"])(),a=Object(c["useState"])(""),o=Object(v["a"])(a,2),l=o[0],i=o[1],u=Object(c["useState"])(null),s=Object(v["a"])(u,2),m=s[0],f=s[1],b=Object(c["useState"])(""),_=Object(v["a"])(b,2),h=_[0],E=_[1],y=Object(c["useState"])(!1),O=Object(v["a"])(y,2),j=O[0],M=O[1],g=Object(c["useState"])(-1),N=Object(v["a"])(g,2),C=N[0],k=N[1];Object(c["useImperativeHandle"])(t,(function(){return{handleAddNote:function(t){console.log("handleAddNote");var n=Object(D["c"])();f(1);var a={name:"\u65b0\u6587\u6863",parentId:t,id:n};E("\u65b0\u6587\u6863"),e.dispatch({type:"note/refreshShowNote",payload:a})}}}));var w=function(){M(!1)},I=function(e){var t=e.target.value;i(t)},x=function(e){f(1)},T=function(e){E(e.target.value),f(1)};Object(c["useEffect"])((function(){S(e.note.showNote)}),[e.note.showNote]);var S=function(e){console.log("handleShowNote"),E(e.name),k(0),f(0)},A=function(t,n){if(0!=m){var a,c=Object(d["a"])({},e.note.showNote);if(c.id)f(2),c.name=h,"title"==t?a="note/updateNoteTitle":(a="note/updateNoteText",c.text=n),e.dispatch({type:a,payload:c}).then((function(n){if(n){if(c.createTime)"title"==t&&e.refreshMenu(Object(D["a"])(c.parentIds));else{var a=n.result;c=a,e.refreshMenu(Object(D["a"])(a.parentIds))}e.dispatch({type:"openNotes/updateOpenNote",payload:c}),e.note.activeNoteId==c.id&&f(0)}}))}},q=function(e,t){"title"==t?A(t):e.relatedTarget&&e.relatedTarget.getAttribute("group")==xe||A(t)},F=function(){return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:me.a.main},e.children,r.a.createElement("div",{className:me.a.content},r.a.createElement("div",{className:me.a.buttons}," ",0==C?r.a.createElement(ue["a"],{onClick:function(){return k(1)}}):r.a.createElement(se["a"],{onClick:function(){k(0)}}),Ie[m]),r.a.createElement("div",{className:me.a.title},r.a.createElement(L["a"],{maxLength:100,ref:n,value:h,onBlur:function(e){return q(e,"title")},onInput:T})),r.a.createElement(ke,{handleChange:x,displayIndex:C,saveContent:function(e){return A("content",e)}}))),r.a.createElement(p["a"],{visible:j,onOk:w,onCancel:function(){return M(!1)}},r.a.createElement("div",{style:{marginBottom:"10px"}},"Source code"),r.a.createElement(we,{value:l,rows:10,onChange:I})))};return F()})),Se=Object(o["b"])((function(e){var t=e.note,n=e.noteMenu,a=e.loading;return{note:t,noteMenu:n,loading:a}}),null,null,{forwardRef:!0})(Te),Le=function(e){var t=Object(c["useRef"])(),n=function(t){var n,a="note/queryChildren";1==t?n=e.noteMenu.activeTopId:2==t?n=e.noteMenu.activeMenu1Id:(t=3,a="note/queryTabTree",n=e.noteMenu.activeMenu2Id),n?e.dispatch({type:a,payload:n}).then((function(n){if(n){var a=n.result;e.dispatch({type:"noteMenu/refreshMenu".concat(t),payload:a})}})):e.dispatch({type:"noteMenu/refreshMenu".concat(t),payload:[]})},o=function(e){t.current.handleAddNote(e)},l=function(){var c=e.loading.effects["note/queryNote"]||e.loading.effects["note/deleteNote"]||e.loading.effects["note/queryTabTree"]||e.loading.effects["note/queryChildren"]||!1;return r.a.createElement(a["a"],{spinning:c},r.a.createElement(Se,{ref:t,refreshMenu:n},r.a.createElement(re,{refreshMenu:n,onAddNote:o})))};return l()};t["default"]=Object(o["b"])((function(e){var t=e.note,n=e.noteMenu,a=e.loading;return{note:t,noteMenu:n,loading:a}}))(Le)},lzHC:function(e,t,n){e.exports={content:"content___2uth4",menu:"menu___2vaSs",menuContent:"menuContent___3Xryl",title:"title___1AGNm",button:"button___20vkB",fold:"fold___orsCT",item:"item___2yQYx",hidden:"hidden___3qPU6",show:"show___30Fr5",menuItem:"menuItem___1iUC9",label:"label___2sbm8",noteTitle:"noteTitle___3U-5R",addChild:"addChild___1LdKa",active:"active___1uxcK",parents:"parents___20Fe7",addBtn:"addBtn___2QKlK",favorate:"favorate___GFzku"}},xiY8:function(e,t,n){e.exports={toolbar:"toolbar___2DQO5",buttons:"buttons___cZ2Wh",status:"status___1y1qq",yellow:"yellow___3Mm9S",warning:"warning___3Z9FP",green:"green___32Amo",main:"main___1Zs_V",content:"content___1zE4Z",title:"title___xT2ET"}}}]);