(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{170:function(e,t,n){"use strict";n.r(t);var r=n(0),a=n.n(r),u=n(178),o=n(188);t.default=function(){if(Object(u.d)()){if("undefined"!=typeof window){var e="/app/board";"911"===Object(u.b)().type&&(e="/app/911"),Object(o.navigate)(e)}}else"undefined"!=typeof window&&Object(o.navigate)("/app/login");return a.a.createElement("div",null)}},178:function(e,t,n){"use strict";n.d(t,"b",function(){return p}),n.d(t,"c",function(){return d}),n.d(t,"d",function(){return h}),n.d(t,"e",function(){return w}),n.d(t,"f",function(){return v}),n.d(t,"a",function(){return y});n(21),n(34),n(33);var r=n(176),a=n.n(r);n(54),n(13),n(177);function u(e,t,n,r,a,u,o){try{var i=e[u](o),s=i.value}catch(c){return void n(c)}i.done?t(s):Promise.resolve(s).then(r,a)}function o(e){return function(){var t=this,n=arguments;return new Promise(function(r,a){var o=e.apply(t,n);function i(e){u(o,r,a,i,s,"next",e)}function s(e){u(o,r,a,i,s,"throw",e)}i(void 0)})}}var i=n(185),s=n(188).navigate,c=function(){return"undefined"!=typeof window},p=function(){return c()&&window.localStorage.getItem("user")?JSON.parse(window.localStorage.getItem("user")):{}},f=function(e){window.localStorage.setItem("user",JSON.stringify(e)),s("/")},d=function(){var e=o(a.a.mark(function e(t){var r,u,o,s,c,p;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return r=t.username,u=t.password,e.prev=1,o={email:r,password:u,isClient:!1},s=n(219),c=s.AES.encrypt(JSON.stringify(o),"xXgk5DVQ0hrXV640erOkvr4hnCokhoKG").toString(),e.next=7,i.post("https://api.it-zam.com/api/v1/login",{data:c});case 7:if(null==(p=e.sent).data.token||!0!==p.data.auth){e.next=11;break}return l(p.data.token),e.abrupt("return",!0);case 11:return e.abrupt("return",!1);case 14:return e.prev=14,e.t0=e.catch(1),console.log(e.t0),e.abrupt("return",!1);case 18:case"end":return e.stop()}},e,null,[[1,14]])}));return function(t){return e.apply(this,arguments)}}(),l=function(){var e=o(a.a.mark(function e(t){var n;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,i.post("https://api.it-zam.com/api/v1/me",{},{headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","x-access-token":t}});case 3:n=e.sent,b(t),n.data.token=t,n.data.expiresIn=18e3,f(n.data),e.next=14;break;case 10:return e.prev=10,e.t0=e.catch(0),console.log(e.t0),e.abrupt("return",e.t0);case 14:case"end":return e.stop()}},e,null,[[0,10]])}));return function(t){return e.apply(this,arguments)}}(),h=function(){return!!p().name},w=function(){var e=o(a.a.mark(function e(t){return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,i.post("https://api.it-zam.com/api/v1/logout",{},{headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","x-access-token":p().token}});case 2:f({});case 3:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),v=function(){var e=o(a.a.mark(function e(t){return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:f({});case 1:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}();function m(e){return g.apply(this,arguments)}function g(){return(g=o(a.a.mark(function e(t){var n,r,u,o;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,i({method:"post",url:"https://websockets.it-zam.com/api/v1/refresh-token",headers:{jwt:t.token}});case 3:return n=e.sent,r=n.data,u=r.token,o=r.expiresIn,t.token=u,t.expiresIn=o,e.next=9,f(Object.assign({},t,{updatedAt:new Date}));case 9:return e.abrupt("return",u);case 12:if(e.prev=12,e.t0=e.catch(0),!e.t0.response||!e.t0.response.status){e.next=16;break}return e.abrupt("return",e.t0.response.status);case 16:throw new Error(e.t0.message);case 17:case"end":return e.stop()}},e,null,[[0,12]])}))).apply(this,arguments)}function y(){return x.apply(this,arguments)}function x(){return(x=o(a.a.mark(function e(){var t,n,r,u,o,i,s,c;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,p();case 2:if(t=e.sent,n=t.token,r=t.expiresIn,u=t.updatedAt,o=new Date,i=new Date(u),s=(o.getTime()-i.getTime())/1e3,!(r-s>=60)){e.next=9;break}return e.abrupt("return",n);case 9:return e.next=11,m(t);case 11:return c=e.sent,console.log("new token",c),e.abrupt("return",c);case 14:case"end":return e.stop()}},e)}))).apply(this,arguments)}function b(e){return k.apply(this,arguments)}function k(){return(k=o(a.a.mark(function e(t){var n,r;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,i({method:"post",url:"https://websockets.it-zam.com/api/v1/new-refresh-token",headers:{"Content-Type":"application/json",jwt:t}});case 2:return n=e.sent,e.next=5,p();case 5:return(r=e.sent).token=t,e.next=9,f(Object.assign({},r,{updatedAt:new Date}));case 9:return e.abrupt("return",n);case 10:case"end":return e.stop()}},e)}))).apply(this,arguments)}},188:function(e,t,n){"use strict";n.r(t),n.d(t,"graphql",function(){return h}),n.d(t,"StaticQueryContext",function(){return p}),n.d(t,"StaticQuery",function(){return d}),n.d(t,"useStaticQuery",function(){return l}),n.d(t,"prefetchPathname",function(){return c});var r=n(0),a=n.n(r),u=n(55),o=n.n(u);n.d(t,"Link",function(){return o.a}),n.d(t,"withAssetPrefix",function(){return u.withAssetPrefix}),n.d(t,"withPrefix",function(){return u.withPrefix}),n.d(t,"parsePath",function(){return u.parsePath}),n.d(t,"navigate",function(){return u.navigate}),n.d(t,"push",function(){return u.push}),n.d(t,"replace",function(){return u.replace}),n.d(t,"navigateTo",function(){return u.navigateTo});var i=n(218),s=n.n(i);n.d(t,"PageRenderer",function(){return s.a});var c=n(6).default.enqueue,p=a.a.createContext({});function f(e){var t=e.staticQueryData,n=e.data,r=e.query,u=e.render,o=n?n.data:t[r]&&t[r].data;return a.a.createElement(a.a.Fragment,null,o&&u(o),!o&&a.a.createElement("div",null,"Loading (StaticQuery)"))}var d=function(e){var t=e.data,n=e.query,r=e.render,u=e.children;return a.a.createElement(p.Consumer,null,function(e){return a.a.createElement(f,{data:t,query:n,render:r||u,staticQueryData:e})})},l=function(e){a.a.useContext;var t=a.a.useContext(p);if(t[e]&&t[e].data)return t[e].data;throw new Error("The result of this StaticQuery could not be fetched.\n\nThis is likely a bug in Gatsby and if refreshing the page does not fix it, please open an issue in https://github.com/gatsbyjs/gatsby/issues")};function h(){throw new Error("It appears like Gatsby is misconfigured. Gatsby related `graphql` calls are supposed to only be evaluated at compile time, and then compiled away. Unfortunately, something went wrong and the query was left in the compiled code.\n\nUnless your site has a complex or custom babel/Gatsby configuration this is likely a bug in Gatsby.")}},218:function(e,t,n){var r;e.exports=(r=n(243))&&r.default||r},243:function(e,t,n){"use strict";n.r(t);n(21);var r=n(0),a=n.n(r),u=n(84);t.default=function(e){var t=e.location,n=e.pageResources;return n?a.a.createElement(u.a,Object.assign({location:t,pageResources:n},n.json)):null}}}]);
//# sourceMappingURL=component---src-pages-index-js-6a19d223ab2734821c85.js.map