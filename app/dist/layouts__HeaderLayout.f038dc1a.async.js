(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[6],{"0Owb":function(e,t,n){"use strict";function a(){return a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},a.apply(this,arguments)}n.d(t,"a",(function(){return a}))},BJfS:function(e,t){var n=function(e){return e.replace(/[A-Z]/g,(function(e){return"-"+e.toLowerCase()})).toLowerCase()};e.exports=n},FFqm:function(e,t,n){"use strict";n.r(t);var a=n("tJVT"),r=n("9og8"),c=n("k1fw"),i=n("WmNS"),o=n.n(i),u=n("q1tI"),s=n.n(u),l=n("9kvl"),f=n("uYtH"),p=n("s4NR"),m=n("WpcB"),h=n.n(m),d=n("63rs"),v=n("c+yx"),y=n("dhm0"),b=n("4i/N"),O=n("VTBJ"),j={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M904 160H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0 624H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0-312H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8z"}}]},name:"menu",theme:"outlined"},g=j,w=n("6VBw"),_=function(e,t){return u["createElement"](w["a"],Object(O["a"])(Object(O["a"])({},e),{},{ref:t,icon:g}))};_.displayName="MenuOutlined";var E=u["forwardRef"](_),M=n("QfEt"),C={index:"/page/note",routes:[{path:"/page",component:"@/layouts/HeaderLayout",desc:"\u6709\u5934\u90e8\u7684",routes:[{path:"/note",name:"\u7b14\u8bb0",component:"./note"},{path:"/word",name:"\u82f1\u8bed",component:"./word"},{path:"/article/list",name:"\u82f1\u8bed",component:"./word/articleList"},{path:"/article/:id",name:"\u82f1\u8bed",component:"./word/articleDetail"},{path:"/splicMp3",name:"\u5207\u5272",component:"./splicMp3"},{path:"/wordChinese",name:"\u8bed\u6587\u5929\u5730",component:"./wordChinese/articleList"},{path:"/wordChinese/:id",component:"./wordChinese/articleDetail"},{path:"/game",name:"\u6e38\u620f\u7ba1\u7406",component:"./game/gameList"},{path:"/play/list",name:"\u6e38\u620f",component:"./game/play/list"},{path:"/play/:id",component:"./game/play/levelList"},{path:"/exam",name:"\u4f8b\u5b50",component:"./exam"},{path:"/food",component:"./food",name:"\u98df\u8c31"},{path:"/card",component:"./card",name:"\u5361\u7247"}]},{path:"/all",component:"@/layouts/BlankLayout",desc:"\u6ca1\u6709\u5934\u90e8\u7684",routes:[{path:"/play/cn/:id",component:"./game/play/cnGame"}]}]},q=n("dHXN"),L=n.n(q),x=C.routes.map((function(e){return e.routes.map((function(e){return Object(c["a"])({},e)})).filter((function(t){return t.path=e.path+t.path,t.name}))})),N=[].concat.apply([],x),k=function(){var e=Object(r["a"])(o.a.mark((function e(){var t,n;return o.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Object(d["c"])();case 2:t=Object(v["c"])(),n=t.redirect,"/user/login"===window.location.pathname||n||l["d"].replace({pathname:"/user/login",search:Object(p["stringify"])({redirect:window.location.href})});case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();function S(e){var t=e.children,n=e.location,r=e.isMobile,i=Object(u["useState"])("/"),o=Object(a["a"])(i,2),p=o[0],m=o[1],d=Object(u["useState"])(""),v=Object(a["a"])(d,2),O=v[0],j=v[1],g=Object(l["g"])("@@initialState"),w=g.initialState,_=g.setInitialState,M=Object(u["useState"])([h.a.menu]),C=Object(a["a"])(M,2),q=C[0],x=C[1],S=Object(u["useState"])(!1),R=Object(a["a"])(S,2),B=R[0],H=R[1];Object(u["useEffect"])((function(){m(n.pathname);var e=N.find((function(e){return e.path===n.pathname}));e&&j(e.name)}),[n]);var A=function(){_(Object(c["a"])(Object(c["a"])({},w),{},{currentUser:void 0})),k()},T=function(){B?(x([h.a.menu]),H(!1)):(x([h.a.menu,h.a.full]),H(!0))};return s.a.createElement("div",{className:"".concat(h.a.container," ").concat(r?h.a.isMobile:"")},s.a.createElement(y["b"],null),s.a.createElement("header",{className:h.a.header},s.a.createElement("div",{className:h.a.logo},s.a.createElement("img",{src:L.a}),s.a.createElement("a",{href:"/"},"Seed")),r?s.a.createElement("h1",{className:h.a.title},O):"",r?s.a.createElement("nav",null,s.a.createElement("div",{className:q.join(" "),onClick:T},s.a.createElement("div",{className:h.a.menuBtn},B?s.a.createElement(b["a"],null):s.a.createElement(E,null)),s.a.createElement("ul",null,N.map((function(e){return s.a.createElement("li",{key:e.path},s.a.createElement(f["a"],{to:e.path},e.name))}))))):s.a.createElement("nav",{className:h.a.nav},s.a.createElement("ul",null,N.map((function(e){return s.a.createElement("li",{key:e.path,className:e.path===p?h.a.active:void 0},s.a.createElement(f["a"],{to:e.path},e.name))})),s.a.createElement("li",null,s.a.createElement("a",{href:"#",onClick:A},"\u9000\u51fa"))))),s.a.createElement("div",{className:h.a.main},t))}t["default"]=Object(M["a"])(S)},QfEt:function(e,t,n){"use strict";var a=n("0Owb"),r=n("q1tI"),c=n.n(r),i=n("wx14"),o=n("dI71"),u=n("JX7q"),s=n("rePB"),l=n("17x9"),f=n.n(l),p=n("QLaP"),m=n.n(p),h=n("pIsd"),d=n.n(h),v=function(){function e(e,t,n){var a=this;this.nativeMediaQueryList=e.matchMedia(t),this.active=!0,this.cancellableListener=function(){a.matches=a.nativeMediaQueryList.matches,a.active&&n.apply(void 0,arguments)},this.nativeMediaQueryList.addListener(this.cancellableListener),this.matches=this.nativeMediaQueryList.matches}var t=e.prototype;return t.cancel=function(){this.active=!1,this.nativeMediaQueryList.removeListener(this.cancellableListener)},e}(),y=f.a.oneOfType([f.a.string,f.a.object,f.a.arrayOf(f.a.object.isRequired)]),b=function(e){function t(t){var n,a;return n=e.call(this,t)||this,Object(s["a"])(Object(u["a"])(Object(u["a"])(n)),"queries",[]),Object(s["a"])(Object(u["a"])(Object(u["a"])(n)),"getMatches",(function(){var e=n.queries.reduce((function(e,t){var n,a=t.name,r=t.mqListener;return Object(i["a"])({},e,(n={},n[a]=r.matches,n))}),{});return j(e)})),Object(s["a"])(Object(u["a"])(Object(u["a"])(n)),"updateMatches",(function(){var e=n.getMatches();n.setState((function(){return{matches:e}}),n.onChange)})),t.query||t.queries||t.query&&t.queries||m()(!1),void 0!==t.defaultMatches&&t.query&&"boolean"!==typeof t.defaultMatches&&m()(!1),void 0!==t.defaultMatches&&t.queries&&"object"!==typeof t.defaultMatches&&m()(!1),"object"!==typeof window?(a=void 0!==t.defaultMatches?t.defaultMatches:!!t.query||Object.keys(n.props.queries).reduce((function(e,t){var n;return Object(i["a"])({},e,(n={},n[t]=!0,n))}),{}),n.state={matches:a},Object(u["a"])(n)):(n.initialize(),n.state={matches:void 0!==n.props.defaultMatches?n.props.defaultMatches:n.getMatches()},n.onChange(),n)}Object(o["a"])(t,e);var n=t.prototype;return n.initialize=function(){var e=this,t=this.props.targetWindow||window;"function"!==typeof t.matchMedia&&m()(!1);var n=this.props.queries||O(this.props.query);this.queries=Object.keys(n).map((function(a){var r=n[a],c="string"!==typeof r?d()(r):r,i=new v(t,c,e.updateMatches);return{name:a,mqListener:i}}))},n.componentDidMount=function(){this.initialize(),void 0!==this.props.defaultMatches&&this.updateMatches()},n.onChange=function(){var e=this.props.onChange;e&&e(this.state.matches)},n.componentWillUnmount=function(){this.queries.forEach((function(e){var t=e.mqListener;return t.cancel()}))},n.render=function(){var e=this.props,t=e.children,n=e.render,a=this.state.matches,r="object"===typeof a?Object.keys(a).some((function(e){return a[e]})):a;return n?r?n(a):null:t?"function"===typeof t?t(a):(!Array.isArray(t)||t.length)&&r?c.a.Children.only(t)&&"string"===typeof c.a.Children.only(t).type?c.a.Children.only(t):c.a.cloneElement(c.a.Children.only(t),{matches:a}):null:null},t}(c.a.Component);function O(e){return{__DEFAULT__:e}}function j(e){var t=Object.keys(e);return 1===t.length&&"__DEFAULT__"===t[0]?e.__DEFAULT__:e}Object(s["a"])(b,"propTypes",{defaultMatches:f.a.oneOfType([f.a.bool,f.a.objectOf(f.a.bool)]),query:y,queries:f.a.objectOf(y),render:f.a.func,children:f.a.oneOfType([f.a.node,f.a.func]),targetWindow:f.a.object,onChange:f.a.func});var g=b,w=function(e){return function(t){return c.a.createElement(g,{query:"(max-width:992px)"},(function(n){return c.a.createElement(e,Object(a["a"])({},t,{isMobile:n}))}))}};t["a"]=w},WpcB:function(e,t,n){e.exports={container:"container___iShp2",header:"header___1R0CS",main:"main___2UJO-",logo:"logo___Bbhy9",title:"title___2VwkV",nav:"nav___15NHe",active:"active___27kst",menuBtn:"menuBtn___2cTHt",menu:"menu___1h1-7",full:"full___PCr4a"}},dHXN:function(e,t,n){e.exports=n.p+"static/\u79cd\u5b50.dee58e03.svg"},pIsd:function(e,t,n){var a=n("BJfS"),r=function(e){var t=/[height|width]$/;return t.test(e)},c=function(e){var t="",n=Object.keys(e);return n.forEach((function(c,i){var o=e[c];c=a(c),r(c)&&"number"===typeof o&&(o+="px"),t+=!0===o?c:!1===o?"not "+c:"("+c+": "+o+")",i<n.length-1&&(t+=" and ")})),t},i=function(e){var t="";return"string"===typeof e?e:e instanceof Array?(e.forEach((function(n,a){t+=c(n),a<e.length-1&&(t+=", ")})),t):c(e)};e.exports=i},uYtH:function(e,t,n){"use strict";n.d(t,"a",(function(){return y}));var a=n("WHYC"),r=n("dI71"),c=n("q1tI"),i=n.n(c),o=n("YS25"),u=(n("17x9"),n("wx14")),s=n("zLVn"),l=n("9R94");i.a.Component;i.a.Component;var f=function(e,t){return"function"===typeof e?e(t):e},p=function(e,t){return"string"===typeof e?Object(o["c"])(e,null,null,t):e},m=function(e){return e},h=i.a.forwardRef;function d(e){return!!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)}"undefined"===typeof h&&(h=m);var v=h((function(e,t){var n=e.innerRef,a=e.navigate,r=e.onClick,c=Object(s["a"])(e,["innerRef","navigate","onClick"]),o=c.target,l=Object(u["a"])({},c,{onClick:function(e){try{r&&r(e)}catch(t){throw e.preventDefault(),t}e.defaultPrevented||0!==e.button||o&&"_self"!==o||d(e)||(e.preventDefault(),a())}});return l.ref=m!==h&&t||n,i.a.createElement("a",l)}));var y=h((function(e,t){var n=e.component,r=void 0===n?v:n,c=e.replace,o=e.to,d=e.innerRef,y=Object(s["a"])(e,["component","replace","to","innerRef"]);return i.a.createElement(a["e"].Consumer,null,(function(e){e||Object(l["a"])(!1);var n=e.history,a=p(f(o,e.location),e.location),s=a?n.createHref(a):"",v=Object(u["a"])({},y,{href:s,navigate:function(){var t=f(o,e.location),a=c?n.replace:n.push;a(t)}});return m!==h?v.ref=t||d:v.innerRef=d,i.a.createElement(r,v)}))})),b=function(e){return e},O=i.a.forwardRef;function j(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return t.filter((function(e){return e})).join(" ")}"undefined"===typeof O&&(O=b);O((function(e,t){var n=e["aria-current"],r=void 0===n?"page":n,c=e.activeClassName,o=void 0===c?"active":c,m=e.activeStyle,h=e.className,d=e.exact,v=e.isActive,g=e.location,w=e.sensitive,_=e.strict,E=e.style,M=e.to,C=e.innerRef,q=Object(s["a"])(e,["aria-current","activeClassName","activeStyle","className","exact","isActive","location","sensitive","strict","style","to","innerRef"]);return i.a.createElement(a["e"].Consumer,null,(function(e){e||Object(l["a"])(!1);var n=g||e.location,c=p(f(M,n),n),s=c.pathname,L=s&&s.replace(/([.+*?=^!:${}()[\]|/\\])/g,"\\$1"),x=L?Object(a["f"])(n.pathname,{path:L,exact:d,sensitive:w,strict:_}):null,N=!!(v?v(x,n):x),k=N?j(h,o):h,S=N?Object(u["a"])({},E,{},m):E,R=Object(u["a"])({"aria-current":N&&r||null,className:k,style:S,to:c},q);return b!==O?R.ref=t||C:R.innerRef=C,i.a.createElement(y,R)}))}))}}]);