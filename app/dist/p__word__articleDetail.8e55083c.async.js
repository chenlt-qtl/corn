(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[16],{"+PsN":function(e,t,a){"use strict";a("2qtc");var n=a("kLXV"),r=a("0Owb"),c=(a("5NDa"),a("5rEg")),i=(a("miYZ"),a("tsqr")),o=a("k1fw"),l=a("9og8"),s=(a("y8nQ"),a("Vl3Y")),u=a("tJVT"),f=a("WmNS"),d=a.n(f),m=a("q1tI"),p=a.n(m),h=a("27j4"),v=a.n(h),g=a("0EqQ"),b=(a("DZo9"),a("8z0m")),E=a("jrin"),w=a("ye1Q"),O=a("xvlK"),j=function(e){var t=e.picture,a=e.onChange,n=Object(m["useState"])(!1),r=Object(u["a"])(n,2),c=r[0],o=r[1];function l(e){var t="image/jpeg"===e.type||"image/png"===e.type;t||i["default"].error("You can only upload JPG/PNG file!");var a=e.size/1024/1024<2;return a||i["default"].error("Image must smaller than 2MB!"),t&&a}var s=function(e){"uploading"!==e.file.status?"done"===e.file.status&&(a(e.file.response.result),o(!1)):o(!0)},f=p.a.createElement("div",null,c?p.a.createElement(w["a"],null):p.a.createElement(O["a"],null),p.a.createElement("div",{style:{marginTop:8}},"Upload"));return p.a.createElement(p.a.Fragment,null,p.a.createElement(b["a"],{listType:"picture-card",className:"avatar-uploader",showUploadList:!1,headers:Object(E["a"])({},"X-Access-Token",localStorage.getItem("jwToken")||""),action:"/api/sys/common/uploadImg/word",beforeUpload:l,onChange:s},t?p.a.createElement("img",{src:t,alt:"avatar",style:{width:"100%"}}):f))},_=j,y=(a("H1Ta"),p.a.forwardRef((function(e,t){var a=e.mp3,n=e.type,r=e.onChange,c=Object(m["useState"])(!1),o=Object(u["a"])(c,2),l=o[0],s=o[1],f=Object(m["useState"])(!0),d=Object(u["a"])(f,2),h=d[0],v=d[1],g=Object(m["useRef"])();function j(e){var t="audio/mpeg"===e.type;t||i["default"].error("You can only upload MP3 file!");var a=e.size/1024/1024<100;return a||i["default"].error("Mp3 must smaller than 100MB!"),t&&a}Object(m["useImperativeHandle"])(t,(function(){return{getPlayTime:function(){return g.current.getStartDate()}}}),[]);var _=function(e){"uploading"!==e.file.status?"done"===e.file.status&&(r(e.file.response.result),s(!1)):s(!0)},y=p.a.createElement("div",null,l?p.a.createElement(w["a"],null):p.a.createElement(O["a"],null),p.a.createElement("div",{style:{marginTop:8}},"Upload")),k=function(e,t){e.stopPropagation(),e.preventDefault(),t?g.current.pause():(g.current.load(),g.current.play()),v(t)},N={fontSize:"18px",color:"rgba(0,0,0,0.7)"};return p.a.createElement(p.a.Fragment,null,p.a.createElement(b["a"],{listType:"picture-card",className:"avatar-uploader",showUploadList:!1,headers:Object(E["a"])({},"X-Access-Token",localStorage.getItem("jwToken")||""),action:"/api/sys/common/uploadMp3/"+(n||"word"),beforeUpload:j,onChange:_},a?h?p.a.createElement("i",{style:N,className:"fa fa-play",onClick:function(e){k(e,!1)}}):p.a.createElement("i",{style:N,className:"fa fa-pause",onClick:function(e){k(e,!0)}}):y),p.a.createElement("audio",{ref:g},p.a.createElement("source",{src:a,type:"audio/mpeg"}),"\u60a8\u7684\u6d4f\u89c8\u5668\u4e0d\u652f\u6301 audio \u5143\u7d20\u3002"))}))),k=y,N={labelCol:{span:6},wrapperCol:{span:12}},x=p.a.forwardRef((function(e,t){var a=e.modalVisible,f=e.onCancel,h=Object(m["useState"])(""),b=Object(u["a"])(h,2),E=b[0],w=b[1],O=Object(m["useState"])(!1),j=Object(u["a"])(O,2),y=j[0],x=j[1],C=Object(m["useState"])(""),S=Object(u["a"])(C,2),T=S[0],L=S[1],I=Object(m["useState"])({}),P=Object(u["a"])(I,2),A=P[0],M=P[1],B=s["a"].useForm(),z=Object(u["a"])(B,1),R=z[0],V=function(){var e=Object(l["a"])(d.a.mark((function e(){var t,a;return d.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return x(!0),e.next=3,R.validateFields();case 3:if(t=e.sent,t.picture=E,t.mp3=T,!A.id){e.next=13;break}return t=Object(o["a"])(Object(o["a"])({},A),t),e.next=10,Object(g["g"])(t);case 10:a=e.sent,e.next=16;break;case 13:return e.next=15,Object(g["a"])(t);case 15:a=e.sent;case 16:a&&(a.success?(i["default"].success("\u4fdd\u5b58\u6210\u529f!"),f(!0)):i["default"].error(a.message)),x(!1);case 18:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),W=function(e){w(e)},F=function(e){L(e)};return Object(m["useImperativeHandle"])(t,(function(){return{setFormValue:function(e){var t=e.title,a=e.mp3,n=void 0===a?"":a,r=e.picture,c=void 0===r?"":r,i=e.comment;M(e),R.setFieldsValue({title:t,comment:i}),w(c),L(n)}}}),[]),p.a.createElement(n["a"],{title:"\u6587\u7ae0\u8be6\u60c5",visible:a,onCancel:function(){f(!1)},style:{top:20},onOk:V,confirmLoading:y},p.a.createElement(s["a"],Object(r["a"])({},N,{form:R,name:"article"}),p.a.createElement(s["a"].Item,{label:"\u6807\u9898",name:"title",rules:[{required:!0,message:"Please input your title!"}]},p.a.createElement(c["a"],null)),p.a.createElement(s["a"].Item,{label:"\u5c01\u9762",name:"picture"},p.a.createElement(_,{picture:E,onChange:W})),p.a.createElement(s["a"].Item,{label:"\u97f3\u9891",name:"mp3"},p.a.createElement(k,{mp3:T,onChange:F})),p.a.createElement(s["a"].Item,{label:"\u5907\u6ce8",name:"comment"},p.a.createElement(v.a,{rows:4}))))}));t["a"]=x},"0EqQ":function(e,t,a){"use strict";a.d(t,"c",(function(){return s})),a.d(t,"d",(function(){return f})),a.d(t,"b",(function(){return m})),a.d(t,"e",(function(){return h})),a.d(t,"a",(function(){return g})),a.d(t,"f",(function(){return E})),a.d(t,"g",(function(){return O}));var n=a("k1fw"),r=a("9og8"),c=a("WmNS"),i=a.n(c),o=a("9kvl"),l=a("Qyje");function s(e){return u.apply(this,arguments)}function u(){return u=Object(r["a"])(i.a.mark((function e(t){return i.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",Object(o["f"])("/api/word/article/list",{params:t}));case 1:case"end":return e.stop()}}),e)}))),u.apply(this,arguments)}function f(e){return d.apply(this,arguments)}function d(){return d=Object(r["a"])(i.a.mark((function e(t){return i.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",Object(o["f"])("/api/word/sentence/listByArticle?"+Object(l["stringify"])(t)));case 1:case"end":return e.stop()}}),e)}))),d.apply(this,arguments)}function m(e){return p.apply(this,arguments)}function p(){return p=Object(r["a"])(i.a.mark((function e(t){return i.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",Object(o["f"])("/api/word/article/queryById?id="+t));case 1:case"end":return e.stop()}}),e)}))),p.apply(this,arguments)}function h(e){return v.apply(this,arguments)}function v(){return v=Object(r["a"])(i.a.mark((function e(t){return i.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",Object(o["f"])("/api/word/article/delete?id="+t,{method:"DELETE"}));case 1:case"end":return e.stop()}}),e)}))),v.apply(this,arguments)}function g(e){return b.apply(this,arguments)}function b(){return b=Object(r["a"])(i.a.mark((function e(t){return i.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",Object(o["f"])("/api/word/article/add",{method:"POST",data:Object(n["a"])(Object(n["a"])({},t),{},{method:"post"})}));case 1:case"end":return e.stop()}}),e)}))),b.apply(this,arguments)}function E(e){return w.apply(this,arguments)}function w(){return w=Object(r["a"])(i.a.mark((function e(t){return i.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",Object(o["f"])("/api/word/sentence/delete?id="+t,{method:"DELETE"}));case 1:case"end":return e.stop()}}),e)}))),w.apply(this,arguments)}function O(e){return j.apply(this,arguments)}function j(){return j=Object(r["a"])(i.a.mark((function e(t){return i.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",Object(o["f"])("/api/word/article/edit",{method:"PUT",data:Object(n["a"])(Object(n["a"])({},t),{},{method:"put"})}));case 1:case"end":return e.stop()}}),e)}))),j.apply(this,arguments)}},"15/o":function(e,t,a){},"5GOC":function(e,t,a){"use strict";a("cIOH"),a("b56q"),a("15/o")},G3dp:function(e,t,a){"use strict";var n=a("q1tI"),r={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 000-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 009.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3-362.7 362.6-88.9 15.7 15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z"}}]},name:"edit",theme:"outlined"},c=r,i=a("6VBw"),o=function(e,t){return n["createElement"](i["a"],Object.assign({},e,{ref:t,icon:c}))};o.displayName="EditOutlined";t["a"]=n["forwardRef"](o)},JsLm:function(e,t,a){"use strict";var n=a("wx14"),r=a("rePB"),c=a("1OyB"),i=a("vuIU"),o=a("JX7q"),l=a("Ji7U"),s=a("LK+K"),u=a("q1tI"),f=a("TSYQ"),d=a.n(f),m=a("zT1h"),p=a("U8pU"),h=a("bT9E"),v=a("6ner"),g=a("H84U"),b=a("KQm4"),E=a("wgJM");function w(e){var t,a=function(a){return function(){t=null,e.apply(void 0,Object(b["a"])(a))}},n=function(){if(null==t){for(var e=arguments.length,n=new Array(e),r=0;r<e;r++)n[r]=arguments[r];t=Object(E["a"])(a(n))}};return n.cancel=function(){return E["a"].cancel(t)},n}function O(){return function(e,t,a){var n=a.value,r=!1;return{configurable:!0,get:function(){if(r||this===e.prototype||this.hasOwnProperty(t))return n;var a=w(n.bind(this));return r=!0,Object.defineProperty(this,t,{value:a,configurable:!0,writable:!0}),r=!1,a}}}}function j(e){return e!==window?e.getBoundingClientRect():{top:0,bottom:window.innerHeight}}function _(e,t,a){if(void 0!==a&&t.top>e.top-a)return a+t.top}function y(e,t,a){if(void 0!==a&&t.bottom<e.bottom+a){var n=window.innerHeight-t.bottom;return a+n}}var k=["resize","scroll","touchstart","touchmove","touchend","pageshow","load"],N=[];function x(e,t){if(e){var a=N.find((function(t){return t.target===e}));a?a.affixList.push(t):(a={target:e,affixList:[t],eventHandlers:{}},N.push(a),k.forEach((function(t){a.eventHandlers[t]=Object(m["a"])(e,t,(function(){a.affixList.forEach((function(e){e.lazyUpdatePosition()}))}))})))}}function C(e){var t=N.find((function(t){var a=t.affixList.some((function(t){return t===e}));return a&&(t.affixList=t.affixList.filter((function(t){return t!==e}))),a}));t&&0===t.affixList.length&&(N=N.filter((function(e){return e!==t})),k.forEach((function(e){var a=t.eventHandlers[e];a&&a.remove&&a.remove()})))}var S,T=function(e,t,a,n){var r,c=arguments.length,i=c<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,a):n;if("object"===("undefined"===typeof Reflect?"undefined":Object(p["a"])(Reflect))&&"function"===typeof Reflect.decorate)i=Reflect.decorate(e,t,a,n);else for(var o=e.length-1;o>=0;o--)(r=e[o])&&(i=(c<3?r(i):c>3?r(t,a,i):r(t,a))||i);return c>3&&i&&Object.defineProperty(t,a,i),i};function L(){return"undefined"!==typeof window?window:null}(function(e){e[e["None"]=0]="None",e[e["Prepare"]=1]="Prepare"})(S||(S={}));var I=function(e){Object(l["a"])(a,e);var t=Object(s["a"])(a);function a(){var e;return Object(c["a"])(this,a),e=t.apply(this,arguments),e.state={status:S.None,lastAffix:!1,prevTarget:null},e.getOffsetTop=function(){var t=e.props.offsetBottom,a=e.props.offsetTop;return void 0===t&&void 0===a&&(a=0),a},e.getOffsetBottom=function(){return e.props.offsetBottom},e.savePlaceholderNode=function(t){e.placeholderNode=t},e.saveFixedNode=function(t){e.fixedNode=t},e.measure=function(){var t=e.state,a=t.status,n=t.lastAffix,r=e.props.onChange,c=e.getTargetFunc();if(a===S.Prepare&&e.fixedNode&&e.placeholderNode&&c){var i=e.getOffsetTop(),o=e.getOffsetBottom(),l=c();if(l){var s={status:S.None},u=j(l),f=j(e.placeholderNode),d=_(f,u,i),m=y(f,u,o);void 0!==d?(s.affixStyle={position:"fixed",top:d,width:f.width,height:f.height},s.placeholderStyle={width:f.width,height:f.height}):void 0!==m&&(s.affixStyle={position:"fixed",bottom:m,width:f.width,height:f.height},s.placeholderStyle={width:f.width,height:f.height}),s.lastAffix=!!s.affixStyle,r&&n!==s.lastAffix&&r(s.lastAffix),e.setState(s)}}},e.prepareMeasure=function(){e.setState({status:S.Prepare,affixStyle:void 0,placeholderStyle:void 0})},e.render=function(){var t=e.context.getPrefixCls,a=e.state,c=a.affixStyle,i=a.placeholderStyle,o=e.props,l=o.prefixCls,s=o.children,f=d()(Object(r["a"])({},t("affix",l),!!c)),m=Object(h["a"])(e.props,["prefixCls","offsetTop","offsetBottom","target","onChange"]);return u["createElement"](v["a"],{onResize:function(){e.updatePosition()}},u["createElement"]("div",Object(n["a"])({},m,{ref:e.savePlaceholderNode}),c&&u["createElement"]("div",{style:i,"aria-hidden":"true"}),u["createElement"]("div",{className:f,ref:e.saveFixedNode,style:c},u["createElement"](v["a"],{onResize:function(){e.updatePosition()}},s))))},e}return Object(i["a"])(a,[{key:"getTargetFunc",value:function(){var e=this.context.getTargetContainer,t=this.props.target;return void 0!==t?t:e||L}},{key:"componentDidMount",value:function(){var e=this,t=this.getTargetFunc();t&&(this.timeout=setTimeout((function(){x(t(),e),e.updatePosition()})))}},{key:"componentDidUpdate",value:function(e){var t=this.state.prevTarget,a=this.getTargetFunc(),n=null;a&&(n=a()||null),t!==n&&(C(this),n&&(x(n,this),this.updatePosition()),this.setState({prevTarget:n})),e.offsetTop===this.props.offsetTop&&e.offsetBottom===this.props.offsetBottom||this.updatePosition(),this.measure()}},{key:"componentWillUnmount",value:function(){clearTimeout(this.timeout),C(this),this.updatePosition.cancel(),this.lazyUpdatePosition.cancel()}},{key:"updatePosition",value:function(){this.prepareMeasure()}},{key:"lazyUpdatePosition",value:function(){var e=this.getTargetFunc(),t=this.state.affixStyle;if(e&&t){var a=this.getOffsetTop(),n=this.getOffsetBottom(),r=e();if(r&&this.placeholderNode){var c=j(r),i=j(this.placeholderNode),o=_(i,c,a),l=y(i,c,n);if(void 0!==o&&t.top===o||void 0!==l&&t.bottom===l)return}}this.prepareMeasure()}}]),a}(u["Component"]);I.contextType=g["b"],T([O()],I.prototype,"updatePosition",null),T([O()],I.prototype,"lazyUpdatePosition",null);var P=I,A=a("zAh6"),M=a("i6bk"),B=u["createContext"](null),z=B;function R(){return window}function V(e,t){if(!e.getClientRects().length)return 0;var a=e.getBoundingClientRect();return a.width||a.height?t===window?(t=e.ownerDocument.documentElement,a.top-t.clientTop):a.top-t.getBoundingClientRect().top:a.top}var W=/#(\S+)$/,F=function(e){Object(l["a"])(a,e);var t=Object(s["a"])(a);function a(){var e;return Object(c["a"])(this,a),e=t.apply(this,arguments),e.state={activeLink:null},e.wrapperRef=u["createRef"](),e.links=[],e.registerLink=function(t){e.links.includes(t)||e.links.push(t)},e.unregisterLink=function(t){var a=e.links.indexOf(t);-1!==a&&e.links.splice(a,1)},e.getContainer=function(){var t=e.context.getTargetContainer,a=e.props.getContainer,n=a||t||R;return n()},e.handleScrollTo=function(t){var a=e.props,n=a.offsetTop,r=a.targetOffset;e.setCurrentActiveLink(t);var c=e.getContainer(),i=Object(M["a"])(c,!0),o=W.exec(t);if(o){var l=document.getElementById(o[1]);if(l){var s=V(l,c),u=i+s;u-=void 0!==r?r:n||0,e.animating=!0,Object(A["a"])(u,{callback:function(){e.animating=!1},getContainer:e.getContainer})}}},e.saveInkNode=function(t){e.inkNode=t},e.setCurrentActiveLink=function(t){var a=e.state.activeLink,n=e.props,r=n.onChange,c=n.getCurrentAnchor;a!==t&&(e.setState({activeLink:"function"===typeof c?c():t}),null===r||void 0===r||r(t))},e.handleScroll=function(){if(!e.animating){var t=e.props,a=t.offsetTop,n=t.bounds,r=t.targetOffset,c=e.getCurrentAnchor(void 0!==r?r:a||0,n);e.setCurrentActiveLink(c)}},e.updateInk=function(){var t=Object(o["a"])(e),a=t.prefixCls,n=t.wrapperRef,r=n.current,c=null===r||void 0===r?void 0:r.getElementsByClassName("".concat(a,"-link-title-active"))[0];c&&(e.inkNode.style.top="".concat(c.offsetTop+c.clientHeight/2-4.5,"px"))},e.render=function(){var t=e.context,a=t.getPrefixCls,c=t.direction,i=e.props,o=i.prefixCls,l=i.className,s=void 0===l?"":l,f=i.style,m=i.offsetTop,p=i.affix,h=i.showInkInFixed,v=i.children,g=e.state.activeLink,b=a("anchor",o);e.prefixCls=b;var E=d()("".concat(b,"-ink-ball"),{visible:g}),w=d()("".concat(b,"-wrapper"),Object(r["a"])({},"".concat(b,"-rtl"),"rtl"===c),s),O=d()(b,{fixed:!p&&!h}),j=Object(n["a"])({maxHeight:m?"calc(100vh - ".concat(m,"px)"):"100vh"},f),_=u["createElement"]("div",{ref:e.wrapperRef,className:w,style:j},u["createElement"]("div",{className:O},u["createElement"]("div",{className:"".concat(b,"-ink")},u["createElement"]("span",{className:E,ref:e.saveInkNode})),v));return u["createElement"](z.Provider,{value:{registerLink:e.registerLink,unregisterLink:e.unregisterLink,activeLink:e.state.activeLink,scrollTo:e.handleScrollTo,onClick:e.props.onClick}},p?u["createElement"](P,{offsetTop:m,target:e.getContainer},_):_)},e}return Object(i["a"])(a,[{key:"componentDidMount",value:function(){this.scrollContainer=this.getContainer(),this.scrollEvent=Object(m["a"])(this.scrollContainer,"scroll",this.handleScroll),this.handleScroll()}},{key:"componentDidUpdate",value:function(){if(this.scrollEvent){var e=this.getContainer();this.scrollContainer!==e&&(this.scrollContainer=e,this.scrollEvent.remove(),this.scrollEvent=Object(m["a"])(this.scrollContainer,"scroll",this.handleScroll),this.handleScroll())}this.updateInk()}},{key:"componentWillUnmount",value:function(){this.scrollEvent&&this.scrollEvent.remove()}},{key:"getCurrentAnchor",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:5,a=[],n=this.getContainer();if(this.links.forEach((function(r){var c=W.exec(r.toString());if(c){var i=document.getElementById(c[1]);if(i){var o=V(i,n);o<e+t&&a.push({link:r,top:o})}}})),a.length){var r=a.reduce((function(e,t){return t.top>e.top?t:e}));return r.link}return""}}]),a}(u["Component"]);F.defaultProps={affix:!0,showInkInFixed:!1},F.contextType=g["b"];var U=function(e){Object(l["a"])(a,e);var t=Object(s["a"])(a);function a(){var e;return Object(c["a"])(this,a),e=t.apply(this,arguments),e.handleClick=function(t){var a=e.context,n=a.scrollTo,r=a.onClick,c=e.props,i=c.href,o=c.title;null===r||void 0===r||r(t,{title:o,href:i}),n(i)},e.renderAnchorLink=function(t){var a=t.getPrefixCls,n=e.props,c=n.prefixCls,i=n.href,o=n.title,l=n.children,s=n.className,f=n.target,m=a("anchor",c),p=e.context.activeLink===i,h=d()("".concat(m,"-link"),Object(r["a"])({},"".concat(m,"-link-active"),p),s),v=d()("".concat(m,"-link-title"),Object(r["a"])({},"".concat(m,"-link-title-active"),p));return u["createElement"]("div",{className:h},u["createElement"]("a",{className:v,href:i,title:"string"===typeof o?o:"",target:f,onClick:e.handleClick},o),l)},e}return Object(i["a"])(a,[{key:"componentDidMount",value:function(){this.context.registerLink(this.props.href)}},{key:"componentDidUpdate",value:function(e){var t=e.href,a=this.props.href;t!==a&&(this.context.unregisterLink(t),this.context.registerLink(a))}},{key:"componentWillUnmount",value:function(){this.context.unregisterLink(this.props.href)}},{key:"render",value:function(){return u["createElement"](g["a"],null,this.renderAnchorLink)}}]),a}(u["Component"]);U.defaultProps={href:"#"},U.contextType=z;var D=U;F.Link=D;t["a"]=F},YAFR:function(e,t,a){e.exports={tip:"tip___2SBeg",words:"words___1qAK0",selected:"selected___23jyg",related:"related___1ffkS",trumpet:"trumpet___3s2G4",module:"module___2o9CI",moduleTitle:"moduleTitle___2DwZf",toolbar:"toolbar___2zDxE",sentenceList:"sentenceList___WJaMM",item:"item___16w0B",page:"page___1ACQC"}},ZBHi:function(e,t,a){"use strict";a.r(t);a("2qtc");var n=a("kLXV"),r=(a("+L6B"),a("2/Rp")),c=a("tJVT"),i=a("q1tI"),o=a.n(i),l=a("0EqQ"),s=a("g+cS"),u=a.n(s),f=a("jhfD"),d=a("G3dp"),m=a("/MfK"),p=a("+PsN"),h=(a("T2oS"),a("W9HT")),v=(a("R9oj"),a("ECub")),g=a("siQF"),b=a.n(g),E=a("Drea"),w=a("9kvl"),O=function(e){var t=e.articleId;Object(i["useEffect"])((function(){a()}),[]);var a=function(){e.dispatch({type:"word/getWordByArticle",payload:t}).then((function(t){t&&t.success&&e.setWordsNum(e.word.words.length)}))},n=e.loading.effects["word/getWordByArticle"];return o.a.createElement(o.a.Fragment,null,o.a.createElement("div",{className:b.a.module},o.a.createElement("div",{className:b.a.moduleTitle},"\u5355\u8bcd\u5217\u8868")),o.a.createElement(h["a"],{spinning:n},o.a.createElement("div",{className:b.a.wordList},e.word.words.length>0?o.a.createElement("ul",null,e.word.words.map((function(e){return o.a.createElement("li",{key:e.id,className:b.a.row},o.a.createElement("ul",null,o.a.createElement("li",{className:b.a.wordName},e.wordName),o.a.createElement("li",{className:b.a.play},o.a.createElement(E["a"],null)),o.a.createElement("li",{className:b.a.phAm},"/",e.phAm,"/"),o.a.createElement("li",{className:b.a.acceptation},e.acceptation)))}))):o.a.createElement(v["a"],null))))},j=Object(w["b"])((function(e){var t=e.word,a=e.loading;return{word:t,loading:a}}))(O),_=(a("DjyN"),a("NUBc")),y=(a("Mwp2"),a("VXEj")),k=(a("P2fV"),a("NJEC")),N=(a("miYZ"),a("tsqr")),x=a("9og8"),C=a("WmNS"),S=a.n(C),T=a("YAFR"),L=a.n(T),I=a("w5pM"),P={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0042 42h216v494zM544 472c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v108H372c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h108v108c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V644h108c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H544V472z"}}]},name:"file-add",theme:"outlined"},A=P,M=a("6VBw"),B=function(e,t){return i["createElement"](M["a"],Object.assign({},e,{ref:t,icon:A}))};B.displayName="FileAddOutlined";var z=i["forwardRef"](B),R=function(e){var t=[],a=/([a-z|'|-]+)/gi,n=null;return e.reduce((function(e,t){if(t){var r={allWords:[]},c=0;while(n=a.exec(t)){var i=n[0];n.index>c&&r.allWords.push({text:t.slice(c,n.index).trim(),isWord:!1}),r.allWords.push({text:i,isWord:!0}),c=n.index+i.length}c<t.length&&r.allWords.push({text:t.slice(c).trim(),isWord:!1}),e.push(r)}return e}),t)},V=function(e){var t=e.articleId,a=e.play,n=e.onSearchWord,r=e.edit,s=void 0!==r&&r,u=Object(i["useState"])([]),f=Object(c["a"])(u,2),v=f[0],g=f[1],b=Object(i["useState"])({}),w=Object(c["a"])(b,2),O=w[0],j=w[1],C=Object(i["useState"])(!1),T=Object(c["a"])(C,2),P=T[0],A=T[1],M=Object(i["useState"])(!0),B=Object(c["a"])(M,2),V=B[0],W=B[1],F=Object(i["useState"])(!0),U=Object(c["a"])(F,2),D=U[0],H=U[1],q=Object(i["useState"])(0),J=Object(c["a"])(q,2),Q=J[0],X=J[1],Y=Object(i["useState"])(0),G=Object(c["a"])(Y,2),K=G[0],Z=G[1];Object(i["useEffect"])((function(){$()}),[K]);var $=function(){Object(l["d"])({articleId:t,pageNo:K,pageSize:10}).then((function(t){t&&(H(!1),t.success&&t.result&&(g(t.result.records),X(t.result.total),e.setSenteceNum(t.result.total)))}))},ee=function(e,t){j(e),A(!0),W(t)},te=function(){var e=Object(x["a"])(S.a.mark((function e(t){var a;return S.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return H(!0),e.next=3,Object(l["f"])(t);case 3:a=e.sent,a&&a.success?(N["default"].success("\u5220\u9664\u6210\u529f"),$()):N["default"].error("\u5220\u9664\u5931\u8d25"),H(!1);case 6:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),ae=function(e){var t=[o.a.createElement(d["a"],{onClick:function(){ee(e,!0)}})];return e.mp3&&t.push(o.a.createElement(E["a"],null)),t.push(o.a.createElement(k["a"],{title:"\u786e\u8ba4\u8981\u5220\u9664\u8fd9\u4e2a\u53e5\u5b50?",onConfirm:function(){te(e.id)},okText:"\u662f",cancelText:"\u5426"},o.a.createElement(m["a"],null))),t},ne=function(t){var a=R([t]),r=a.length>0&&a[0].allWords.map((function(t){var a=t.text,r=e.word.wordNames.includes(a.toLowerCase());return t.isWord?o.a.createElement("span",{className:"".concat(L.a.words," ").concat(r?L.a.related:""),onClick:function(){return n(a)}},a):a}));return r};return o.a.createElement(h["a"],{spinning:D},s?o.a.createElement("div",{className:L.a.module},o.a.createElement("div",{className:L.a.moduleTitle},"\u53e5\u5b50\u5217\u8868"),o.a.createElement("div",{className:L.a.toolbar},o.a.createElement(I["a"],{title:"\u589e\u52a0\u53e5\u5b50",onClick:function(){ee({},!0)}}),o.a.createElement(z,{title:"\u6279\u91cf\u589e\u52a0\u53e5\u5b50",onClick:function(){ee({},!1)}}))):"",o.a.createElement(y["b"],{className:L.a.sentenceList,itemLayout:"vertical",size:"large",pagination:!1,dataSource:v,renderItem:function(e){return o.a.createElement(y["b"].Item,{className:L.a.item,key:e.id,actions:ae(e)},o.a.createElement("pre",null,ne(e.content),e.mp3?o.a.createElement("i",{className:"fa fa-volume-up ".concat(L.a.trumpet),onClick:function(){return a(e.mp3)}}):""))}}),o.a.createElement(_["a"],{className:L.a.page,size:"small",total:Q,showSizeChanger:!1,onChange:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;Z(e)}}),s?o.a.createElement(p["a"],{articleId:t,sentence:O,single:V,onCancel:function(e){e&&$(),A(!1)},modalVisible:P}):"")},W=Object(w["b"])((function(e){var t=e.word,a=e.loading;return{word:t,loading:a}}))(V),F=(a("5GOC"),a("JsLm")),U=a("shIz"),D=a.n(U),H=(a("H1Ta"),a("djQt")),q=a("Tm+p"),J=F["a"].Link,Q=function(e){var t=e.match?e.match.params:e,a=t.wordName,l=Object(i["useState"])({}),s=Object(c["a"])(l,2),u=s[0],f=s[1],d=Object(i["useState"])([]),m=Object(c["a"])(d,2),p=(m[0],m[1],Object(i["useRef"])()),v=Object(i["useRef"])(),g=[Object(i["useRef"])(),Object(i["useRef"])()];Object(i["useEffect"])((function(){a&&e.dispatch({type:"word/getWordByWordName",payload:a}).then((function(e){e&&f(e)}))}),[a]);var b=function(e){console.log(e),e&&(v.current.src=e),p.current.load(),p.current.play()},E=function(){},w=e.loading.effects["word/getWordByWordName"],O=/^[\s]/;return o.a.createElement(n["a"],{title:"\u5355\u8bcd\u8be6\u60c5",width:660,visible:e.isModalVisible,onCancel:function(){e.hideWordModal()},footer:o.a.createElement(r["a"],{onClick:function(){e.hideWordModal()}},"\u5173\u95ed")},o.a.createElement(h["a"],{spinning:w},o.a.createElement("main",{className:D.a.word},o.a.createElement("header",{className:D.a.wordName},u.wordName,o.a.createElement("div",{className:D.a.star},u.wordUserRel?o.a.createElement(H["a"],{className:D.a.favorate}):o.a.createElement(q["a"],{onClick:E,className:D.a.notFavorate}))),o.a.createElement("section",{className:D.a.phAm},"/",u.phAm,"/",o.a.createElement("i",{className:"fa fa-volume-up ".concat(D.a.trumpet),onClick:function(){b(u.phAnMp3)}})),o.a.createElement("nav",{id:"acceptation"},o.a.createElement(F["a"],{targetOffset:30},o.a.createElement(J,{href:"#acceptation",title:"\u89e3\u91ca"}),o.a.createElement(J,{href:"#cblj",title:"\u8bcd\u9738\u4f8b\u53e5"}),o.a.createElement(J,{href:"#zdylj",title:"\u81ea\u5b9a\u4e49\u4f8b\u53e5"}))),o.a.createElement("section",{className:D.a.acceptation},u.acceptation),o.a.createElement("section",{className:D.a.acceptation},u.icibaSentences?o.a.createElement(o.a.Fragment,null,o.a.createElement("div",{id:"cblj",ref:g[0],className:D.a.title},"\u8bcd\u9738\u4f8b\u53e5"),u.icibaSentences.map((function(e,t){return o.a.createElement("div",{className:D.a.sentence,key:e.id},t+1,". \xa0",o.a.createElement("span",null,e.orig.replace(O,"")),o.a.createElement("p",null,e.trans.replace(O,"")))}))):""),o.a.createElement("section",{className:D.a.acceptation},u.sentences?o.a.createElement(o.a.Fragment,null,o.a.createElement("div",{id:"zdylj",ref:g[1],className:D.a.title},"\u81ea\u5b9a\u4e49\u4f8b\u53e5"),u.sentences.map((function(e,t){return o.a.createElement("div",{className:D.a.sentence,key:e.id},o.a.createElement("section",{className:D.a.content},t+1,".   ",o.a.createElement("span",null,e.content,e.mp3?o.a.createElement("i",{className:"fa fa-volume-up ".concat(D.a.trumpet),onClick:function(){return b(e.mp3)}}):"")),e.picture?o.a.createElement("section",{className:D.a.img},o.a.createElement("img",{src:e.picture})):"")}))):""))),o.a.createElement("audio",{ref:p},o.a.createElement("source",{ref:v,src:u.phAnMp3,type:"audio/mpeg"}),"\u60a8\u7684\u6d4f\u89c8\u5668\u4e0d\u652f\u6301 audio \u5143\u7d20\u3002"))},X=Object(w["b"])((function(e){var t=e.loading;return{loading:t}}))(Q),Y=function(e){var t=e.match.params.id,a=Object(i["useState"])({}),s=Object(c["a"])(a,2),h=s[0],v=s[1],g=Object(i["useState"])(!1),b=Object(c["a"])(g,2),E=b[0],w=b[1],O=Object(i["useState"])(!1),_=Object(c["a"])(O,2),y=_[0],k=_[1],N=Object(i["useState"])(!1),x=Object(c["a"])(N,2),C=x[0],S=x[1],T=Object(i["useState"])(0),L=Object(c["a"])(T,2),I=L[0],P=L[1],A=Object(i["useState"])(0),M=Object(c["a"])(A,2),B=M[0],z=M[1],R=Object(i["useState"])(""),V=Object(c["a"])(R,2),F=V[0],U=V[1],D=Object(i["useRef"])(),H=Object(i["useRef"])(),q=Object(i["useRef"])();Object(i["useEffect"])((function(){J()}),[]);var J=function(){Object(l["b"])(t).then((function(e){e&&e.success&&v(e.result.article)}))},Q=function(){D.current.setFormValue(h),k(!0)},Y=function(e){console.log(e),e&&(q.current.src=e,H.current.load(),H.current.play())},G=function(e){e&&(U(e),S(!0))};return o.a.createElement(o.a.Fragment,null,o.a.createElement("main",{className:u.a.main},o.a.createElement("header",{className:u.a.header},o.a.createElement("div",{className:u.a.title},o.a.createElement("h1",null,h.title)),o.a.createElement("div",{className:u.a.toolbar},o.a.createElement(f["a"],null),o.a.createElement(d["a"],{onClick:Q}),o.a.createElement(m["a"],null))),o.a.createElement("div",{className:u.a.moduleTitle},"\u8be6\u7ec6\u4fe1\u606f"),o.a.createElement("div",{className:u.a.info},o.a.createElement("div",{className:u.a.left},h.mp3?o.a.createElement("div",{className:u.a.infoItem},o.a.createElement("audio",{controls:!0},o.a.createElement("source",{src:h.mp3,type:"audio/mpeg"}),"\u60a8\u7684\u6d4f\u89c8\u5668\u4e0d\u652f\u6301 audio \u5143\u7d20\u3002")):"",o.a.createElement("div",{className:u.a.infoItem},o.a.createElement("div",{className:u.a.itemLabel},"\u53e5\u5b50\u6570"),o.a.createElement("div",{className:u.a.itemValue},I)),o.a.createElement("div",{className:u.a.infoItem},o.a.createElement("div",{className:u.a.itemLabel},"\u5355\u8bcd\u6570"),o.a.createElement("div",{className:u.a.itemValue},B))),h.picture?o.a.createElement("a",{target:"_blank",className:u.a.right,href:h.picture},o.a.createElement("img",{className:u.a.img,src:h.picture})):""),o.a.createElement(W,{articleId:t,onSearchWord:G,setSenteceNum:P,play:Y,edit:!0}),o.a.createElement(j,{articleId:t,onSearchWord:G,setWordsNum:z})),o.a.createElement(n["a"],{title:"\u67e5\u770b\u56fe\u7247",width:660,visible:E,onCancel:function(){w(!1)},footer:o.a.createElement(r["a"],{onClick:function(){w(!1)}},"\u5173\u95ed")},o.a.createElement("img",{width:600,src:h.picture})),o.a.createElement(p["a"],{ref:D,onCancel:function(e){k(!1),e&&J()},modalVisible:y}),o.a.createElement("audio",{ref:H},o.a.createElement("source",{ref:q,type:"audio/mpeg"}),"\u60a8\u7684\u6d4f\u89c8\u5668\u4e0d\u652f\u6301 audio \u5143\u7d20\u3002"),o.a.createElement(X,{wordName:F,isModalVisible:C,hideWordModal:function(){return S(!1)}}))};t["default"]=Y},b56q:function(e,t,a){},djQt:function(e,t,a){"use strict";var n=a("q1tI"),r={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 00.6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0046.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3z"}}]},name:"star",theme:"filled"},c=r,i=a("6VBw"),o=function(e,t){return n["createElement"](i["a"],Object.assign({},e,{ref:t,icon:c}))};o.displayName="StarFilled";t["a"]=n["forwardRef"](o)},"g+cS":function(e,t,a){e.exports={main:"main___2EW-v",header:"header___2MYkb",title:"title___1eD91",toolbar:"toolbar___w0-_s",info:"info___fj0tu",left:"left___3DGJC",infoItem:"infoItem___3j57T",itemLabel:"itemLabel___xsfFa",itemValue:"itemValue___3yXCX",right:"right___2Re6T",img:"img___c8NHf",moduleTitle:"moduleTitle___3M_CO"}},i6bk:function(e,t,a){"use strict";function n(e){return null!==e&&void 0!==e&&e===e.window}function r(e,t){var a;if("undefined"===typeof window)return 0;var r=t?"scrollTop":"scrollLeft",c=0;return n(e)?c=e[t?"pageYOffset":"pageXOffset"]:e instanceof Document?c=e.documentElement[r]:e&&(c=e[r]),e&&!n(e)&&"number"!==typeof c&&(c=null===(a=(e.ownerDocument||e).documentElement)||void 0===a?void 0:a[r]),c}a.d(t,"b",(function(){return n})),a.d(t,"a",(function(){return r}))},shIz:function(e,t,a){e.exports={word:"word___h9EjA",wordName:"wordName___3q36S",star:"star___C35Hz",favorate:"favorate___1-mmv",notFavorate:"notFavorate___31U8m",phAm:"phAm___1S_-V",trumpet:"trumpet___3XVYt",acceptation:"acceptation___2a4I7",title:"title___2geaw",sentence:"sentence___1gQEk",content:"content___3LPgP",img:"img___3LkxL"}},siQF:function(e,t,a){e.exports={module:"module___1bNmU",toolbar:"toolbar___2Tl-L",moduleTitle:"moduleTitle___3Dhbu",wordList:"wordList___3UpUJ",row:"row___WeXSg",wordName:"wordName___23AVF",phAm:"phAm___X7xJl",play:"play___1JaUh",acceptation:"acceptation___1em_b"}},w5pM:function(e,t,a){"use strict";var n=a("q1tI"),r={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M696 480H544V328c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v152H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h152v152c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V544h152c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z"}},{tag:"path",attrs:{d:"M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"}}]},name:"plus-circle",theme:"outlined"},c=r,i=a("6VBw"),o=function(e,t){return n["createElement"](i["a"],Object.assign({},e,{ref:t,icon:c}))};o.displayName="PlusCircleOutlined";t["a"]=n["forwardRef"](o)},zAh6:function(e,t,a){"use strict";a.d(t,"a",(function(){return i}));var n=a("wgJM"),r=a("i6bk");function c(e,t,a,n){var r=a-t;return e/=n/2,e<1?r/2*e*e*e+t:r/2*((e-=2)*e*e+2)+t}function i(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},a=t.getContainer,i=void 0===a?function(){return window}:a,o=t.callback,l=t.duration,s=void 0===l?450:l,u=i(),f=Object(r["a"])(u,!0),d=Date.now(),m=function t(){var a=Date.now(),i=a-d,l=c(i>s?s:i,f,e,s);Object(r["b"])(u)?u.scrollTo(window.pageXOffset,l):u instanceof HTMLDocument||"HTMLDocument"===u.constructor.name?u.documentElement.scrollTop=l:u.scrollTop=l,i<s?Object(n["a"])(t):"function"===typeof o&&o()};Object(n["a"])(m)}}}]);