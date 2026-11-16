/**
 * Waline on Worker —— 单文件版 (All-in-one Build)
 * ------------------------------------------------------------------
 * 完整、可直接部署的 Waline 评论服务端单文件构建版，运行于 Cloudflare Workers，
 * 使用 D1 (SQLite) 存储，兼容 @waline/client 与 @waline/admin。
 * 内置 D1 数据表自动初始化，首次部署无需手动执行 SQL。
 *
 * 本项目架构（单文件 worker.js + 配套配置）参考自 小象部署 host 项目。
 *
 * 特别致谢 / CREDITS：
 *   本程序源自开源项目 Waline on Worker：
 *     https://github.com/wuyilingwei/Waline_On_Worker
 *   作者博客：https://blog.wuyilingwei.com
 *   感谢开发者 wuyilingwei（Siyu Lei）及所有贡献者，
 *   让 Waline 得以完整运行在 Cloudflare Workers 之上。
 *   Waline 官方：https://waline.js.org  —— 感谢每一位开源贡献者。
 * ------------------------------------------------------------------
 */
var Te=(e,t,n)=>(r,a)=>{let i=-1;return s(0);async function s(l){if(l<=i)throw new Error("next() called multiple times");i=l;let o,d=!1,c;if(e[l]?(c=e[l][0][0],r.req.routeIndex=l):c=l===e.length&&a||void 0,c)try{o=await c(r,()=>s(l+1))}catch(f){if(f instanceof Error&&t)r.error=f,o=await t(f,r),d=!0;else throw f}else r.finalized===!1&&n&&(o=await n(r));return o&&(r.finalized===!1||d)&&(r.res=o),r}};var Xe=Symbol();var ze=async(e,t=Object.create(null))=>{let{all:n=!1,dot:r=!1}=t,i=(e instanceof se?e.raw.headers:e.headers).get("Content-Type");return i?.startsWith("multipart/form-data")||i?.startsWith("application/x-www-form-urlencoded")?Zt(e,{all:n,dot:r}):{}};async function Zt(e,t){let n=await e.formData();return n?en(n,t):{}}function en(e,t){let n=Object.create(null);return e.forEach((r,a)=>{t.all||a.endsWith("[]")?tn(n,a,r):n[a]=r}),t.dot&&Object.entries(n).forEach(([r,a])=>{r.includes(".")&&(nn(n,r,a),delete n[r])}),n}var tn=(e,t,n)=>{e[t]!==void 0?Array.isArray(e[t])?e[t].push(n):e[t]=[e[t],n]:t.endsWith("[]")?e[t]=[n]:e[t]=n},nn=(e,t,n)=>{if(/(?:^|\.)__proto__\./.test(t))return;let r=e,a=t.split(".");a.forEach((i,s)=>{s===a.length-1?r[i]=n:((!r[i]||typeof r[i]!="object"||Array.isArray(r[i])||r[i]instanceof File)&&(r[i]=Object.create(null)),r=r[i])})};var Re=e=>{let t=e.split("/");return t[0]===""&&t.shift(),t},Ge=e=>{let{groups:t,path:n}=rn(e),r=Re(n);return an(r,t)},rn=e=>{let t=[];return e=e.replace(/\{[^}]+\}/g,(n,r)=>{let a=`@${r}`;return t.push([a,n]),a}),{groups:t,path:e}},an=(e,t)=>{for(let n=t.length-1;n>=0;n--){let[r]=t[n];for(let a=e.length-1;a>=0;a--)if(e[a].includes(r)){e[a]=e[a].replace(r,t[n][1]);break}}return e},oe={},Ye=(e,t)=>{if(e==="*")return"*";let n=e.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);if(n){let r=`${e}#${t}`;return oe[r]||(n[2]?oe[r]=t&&t[0]!==":"&&t[0]!=="*"?[r,n[1],new RegExp(`^${n[2]}(?=/${t})`)]:[e,n[1],new RegExp(`^${n[2]}$`)]:oe[r]=[e,n[1],!0]),oe[r]}return null},le=(e,t)=>{try{return t(e)}catch{return e.replace(/(?:%[0-9A-Fa-f]{2})+/g,n=>{try{return t(n)}catch{return n}})}},sn=e=>le(e,decodeURI),Ie=e=>{let t=e.url,n=t.indexOf("/",t.indexOf(":")+4),r=n;for(;r<t.length;r++){let a=t.charCodeAt(r);if(a===37){let i=t.indexOf("?",r),s=t.indexOf("#",r),l=i===-1?s===-1?void 0:s:s===-1?i:Math.min(i,s),o=t.slice(n,l);return sn(o.includes("%25")?o.replace(/%25/g,"%2525"):o)}else if(a===63||a===35)break}return t.slice(n,r)};var Je=e=>{let t=Ie(e);return t.length>1&&t.at(-1)==="/"?t.slice(0,-1):t},C=(e,t,...n)=>(n.length&&(t=C(t,...n)),`${e?.[0]==="/"?"":"/"}${e}${t==="/"?"":`${e?.at(-1)==="/"?"":"/"}${t?.[0]==="/"?t.slice(1):t}`}`),de=e=>{if(e.charCodeAt(e.length-1)!==63||!e.includes(":"))return null;let t=e.split("/"),n=[],r="";return t.forEach(a=>{if(a!==""&&!/\:/.test(a))r+="/"+a;else if(/\:/.test(a))if(/\?/.test(a)){n.length===0&&r===""?n.push("/"):n.push(r);let i=a.replace("?","");r+="/"+i,n.push(r)}else r+="/"+a}),n.filter((a,i,s)=>s.indexOf(a)===i)},_e=e=>/[%+]/.test(e)?(e.indexOf("+")!==-1&&(e=e.replace(/\+/g," ")),e.indexOf("%")!==-1?le(e,ke):e):e,Qe=(e,t,n)=>{let r;if(!n&&t&&!/[%+]/.test(t)){let s=e.indexOf("?",8);if(s===-1)return;for(e.startsWith(t,s+1)||(s=e.indexOf(`&${t}`,s+1));s!==-1;){let l=e.charCodeAt(s+t.length+1);if(l===61){let o=s+t.length+2,d=e.indexOf("&",o);return _e(e.slice(o,d===-1?void 0:d))}else if(l==38||isNaN(l))return"";s=e.indexOf(`&${t}`,s+1)}if(r=/[%+]/.test(e),!r)return}let a={};r??=/[%+]/.test(e);let i=e.indexOf("?",8);for(;i!==-1;){let s=e.indexOf("&",i+1),l=e.indexOf("=",i);l>s&&s!==-1&&(l=-1);let o=e.slice(i+1,l===-1?s===-1?void 0:s:l);if(r&&(o=_e(o)),i=s,o==="")continue;let d;l===-1?d="":(d=e.slice(l+1,s===-1?void 0:s),r&&(d=_e(d))),n?(a[o]&&Array.isArray(a[o])||(a[o]=[]),a[o].push(d)):a[o]??=d}return t?a[t]:a},Ze=Qe,et=(e,t)=>Qe(e,t,!0),ke=decodeURIComponent;var tt=e=>le(e,ke),se=class{raw;#t;#e;routeIndex=0;path;bodyCache={};constructor(e,t="/",n=[[]]){this.raw=e,this.path=t,this.#e=n,this.#t={}}param(e){return e?this.#n(e):this.#i()}#n(e){let t=this.#e[0][this.routeIndex][1][e],n=this.#a(t);return n&&/\%/.test(n)?tt(n):n}#i(){let e={},t=Object.keys(this.#e[0][this.routeIndex][1]);for(let n of t){let r=this.#a(this.#e[0][this.routeIndex][1][n]);r!==void 0&&(e[n]=/\%/.test(r)?tt(r):r)}return e}#a(e){return this.#e[1]?this.#e[1][e]:e}query(e){return Ze(this.url,e)}queries(e){return et(this.url,e)}header(e){if(e)return this.raw.headers.get(e)??void 0;let t={};return this.raw.headers.forEach((n,r)=>{t[r]=n}),t}async parseBody(e){return ze(this,e)}#r=e=>{let{bodyCache:t,raw:n}=this,r=t[e];if(r)return r;let a=Object.keys(t)[0];return a?t[a].then(i=>(a==="json"&&(i=JSON.stringify(i)),new Response(i)[e]())):t[e]=n[e]()};json(){return this.#r("text").then(e=>JSON.parse(e))}text(){return this.#r("text")}arrayBuffer(){return this.#r("arrayBuffer")}blob(){return this.#r("blob")}formData(){return this.#r("formData")}addValidatedData(e,t){this.#t[e]=t}valid(e){return this.#t[e]}get url(){return this.raw.url}get method(){return this.raw.method}get[Xe](){return this.#e}get matchedRoutes(){return this.#e[0].map(([[,e]])=>e)}get routePath(){return this.#e[0].map(([[,e]])=>e)[this.routeIndex].path}};var nt={Stringify:1,BeforeStream:2,Stream:3},on=(e,t)=>{let n=new String(e);return n.isEscaped=!0,n.callbacks=t,n};var Se=async(e,t,n,r,a)=>{typeof e=="object"&&!(e instanceof String)&&(e instanceof Promise||(e=e.toString()),e instanceof Promise&&(e=await e));let i=e.callbacks;if(!i?.length)return Promise.resolve(e);a?a[0]+=e:a=[e];let s=Promise.all(i.map(l=>l({phase:t,buffer:a,context:r}))).then(l=>Promise.all(l.filter(Boolean).map(o=>Se(o,t,!1,r,a))).then(()=>a[0]));return n?on(await s,i):s};var ln="text/plain; charset=UTF-8",Le=(e,t)=>({"Content-Type":e,...t}),z=(e,t)=>new Response(e,t),rt=class{#t;#e;env={};#n;finalized=!1;error;#i;#a;#r;#c;#l;#d;#o;#f;#u;constructor(e,t){this.#t=e,t&&(this.#a=t.executionCtx,this.env=t.env,this.#d=t.notFoundHandler,this.#u=t.path,this.#f=t.matchResult)}get req(){return this.#e??=new se(this.#t,this.#u,this.#f),this.#e}get event(){if(this.#a&&"respondWith"in this.#a)return this.#a;throw Error("This context has no FetchEvent")}get executionCtx(){if(this.#a)return this.#a;throw Error("This context has no ExecutionContext")}get res(){return this.#r||=z(null,{headers:this.#o??=new Headers})}set res(e){if(this.#r&&e){e=z(e.body,e);for(let[t,n]of this.#r.headers.entries())if(t!=="content-type")if(t==="set-cookie"){let r=this.#r.headers.getSetCookie();e.headers.delete("set-cookie");for(let a of r)e.headers.append("set-cookie",a)}else e.headers.set(t,n)}this.#r=e,this.finalized=!0}render=(...e)=>(this.#l??=t=>this.html(t),this.#l(...e));setLayout=e=>this.#c=e;getLayout=()=>this.#c;setRenderer=e=>{this.#l=e};header=(e,t,n)=>{this.finalized&&(this.#r=z(this.#r.body,this.#r));let r=this.#r?this.#r.headers:this.#o??=new Headers;t===void 0?r.delete(e):n?.append?r.append(e,t):r.set(e,t)};status=e=>{this.#i=e};set=(e,t)=>{this.#n??=new Map,this.#n.set(e,t)};get=e=>this.#n?this.#n.get(e):void 0;get var(){return this.#n?Object.fromEntries(this.#n):{}}#s(e,t,n){let r=this.#r?new Headers(this.#r.headers):this.#o??new Headers;if(typeof t=="object"&&"headers"in t){let i=t.headers instanceof Headers?t.headers:new Headers(t.headers);for(let[s,l]of i)s.toLowerCase()==="set-cookie"?r.append(s,l):r.set(s,l)}if(n)for(let[i,s]of Object.entries(n))if(typeof s=="string")r.set(i,s);else{r.delete(i);for(let l of s)r.append(i,l)}let a=typeof t=="number"?t:t?.status??this.#i;return z(e,{status:a,headers:r})}newResponse=(...e)=>this.#s(...e);body=(e,t,n)=>this.#s(e,t,n);text=(e,t,n)=>!this.#o&&!this.#i&&!t&&!n&&!this.finalized?new Response(e):this.#s(e,t,Le(ln,n));json=(e,t,n)=>this.#s(JSON.stringify(e),t,Le("application/json",n));html=(e,t,n)=>{let r=a=>this.#s(a,t,Le("text/html; charset=UTF-8",n));return typeof e=="object"?Se(e,nt.Stringify,!1,{}).then(r):r(e)};redirect=(e,t)=>{let n=String(e);return this.header("Location",/[^\x00-\xFF]/.test(n)?encodeURI(n):n),this.newResponse(null,t??302)};notFound=()=>(this.#d??=()=>z(),this.#d(this))};var b="ALL",at="all",it=["get","post","put","delete","options","patch"],ce="Can not add a route since the matcher is already built.",fe=class extends Error{};var st="__COMPOSED_HANDLER";var dn=e=>e.text("404 Not Found",404),ot=(e,t)=>{if("getResponse"in e){let n=e.getResponse();return t.newResponse(n.body,n)}return console.error(e),t.text("Internal Server Error",500)},lt=class dt{get;post;put;delete;options;patch;all;on;use;router;getPath;_basePath="/";#t="/";routes=[];constructor(t={}){[...it,at].forEach(i=>{this[i]=(s,...l)=>(typeof s=="string"?this.#t=s:this.#i(i,this.#t,s),l.forEach(o=>{this.#i(i,this.#t,o)}),this)}),this.on=(i,s,...l)=>{for(let o of[s].flat()){this.#t=o;for(let d of[i].flat())l.map(c=>{this.#i(d.toUpperCase(),this.#t,c)})}return this},this.use=(i,...s)=>(typeof i=="string"?this.#t=i:(this.#t="*",s.unshift(i)),s.forEach(l=>{this.#i(b,this.#t,l)}),this);let{strict:r,...a}=t;Object.assign(this,a),this.getPath=r??!0?t.getPath??Ie:Je}#e(){let t=new dt({router:this.router,getPath:this.getPath});return t.errorHandler=this.errorHandler,t.#n=this.#n,t.routes=this.routes,t}#n=dn;errorHandler=ot;route(t,n){let r=this.basePath(t);return n.routes.map(a=>{let i;n.errorHandler===ot?i=a.handler:(i=async(s,l)=>(await Te([],n.errorHandler)(s,()=>a.handler(s,l))).res,i[st]=a.handler),r.#i(a.method,a.path,i)}),this}basePath(t){let n=this.#e();return n._basePath=C(this._basePath,t),n}onError=t=>(this.errorHandler=t,this);notFound=t=>(this.#n=t,this);mount(t,n,r){let a,i;r&&(typeof r=="function"?i=r:(i=r.optionHandler,r.replaceRequest===!1?a=o=>o:a=r.replaceRequest));let s=i?o=>{let d=i(o);return Array.isArray(d)?d:[d]}:o=>{let d;try{d=o.executionCtx}catch{}return[o.env,d]};a||=(()=>{let o=C(this._basePath,t),d=o==="/"?0:o.length;return c=>{let f=new URL(c.url);return f.pathname=f.pathname.slice(d)||"/",new Request(f,c)}})();let l=async(o,d)=>{let c=await n(a(o.req.raw),...s(o));if(c)return c;await d()};return this.#i(b,C(t,"*"),l),this}#i(t,n,r){t=t.toUpperCase(),n=C(this._basePath,n);let a={basePath:this._basePath,path:n,method:t,handler:r};this.router.add(t,n,[r,a]),this.routes.push(a)}#a(t,n){if(t instanceof Error)return this.errorHandler(t,n);throw t}#r(t,n,r,a){if(a==="HEAD")return(async()=>new Response(null,await this.#r(t,n,r,"GET")))();let i=this.getPath(t,{env:r}),s=this.router.match(a,i),l=new rt(t,{path:i,matchResult:s,env:r,executionCtx:n,notFoundHandler:this.#n});if(s[0].length===1){let d;try{d=s[0][0][0][0](l,async()=>{l.res=await this.#n(l)})}catch(c){return this.#a(c,l)}return d instanceof Promise?d.then(c=>c||(l.finalized?l.res:this.#n(l))).catch(c=>this.#a(c,l)):d??this.#n(l)}let o=Te(s[0],this.errorHandler,this.#n);return(async()=>{try{let d=await o(l);if(!d.finalized)throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");return d.res}catch(d){return this.#a(d,l)}})()}fetch=(t,...n)=>this.#r(t,n[1],n[0],t.method);request=(t,n,r,a)=>t instanceof Request?this.fetch(n?new Request(t,n):t,r,a):(t=t.toString(),this.fetch(new Request(/^https?:\/\//.test(t)?t:`http://localhost${C("/",t)}`,n),r,a));fire=()=>{addEventListener("fetch",t=>{t.respondWith(this.#r(t.request,t,void 0,t.request.method))})}};var ue=[];function Ce(e,t){let n=this.buildAllMatchers(),r=(a,i)=>{let s=n[a]||n[b],l=s[2][i];if(l)return l;let o=i.match(s[0]);if(!o)return[[],ue];let d=o.indexOf("",1);return[s[1][d],o]};return this.match=r,r(e,t)}var pe="[^/]+",G=".*",Y="(?:|/.*)",D=Symbol(),cn=new Set(".\\+*[^]$()");function fn(e,t){return e.length===1?t.length===1?e<t?-1:1:-1:t.length===1||e===G||e===Y?1:t===G||t===Y?-1:e===pe?1:t===pe?-1:e.length===t.length?e<t?-1:1:t.length-e.length}var ct=class De{#t;#e;#n=Object.create(null);insert(t,n,r,a,i){if(t.length===0){if(this.#t!==void 0)throw D;if(i)return;this.#t=n;return}let[s,...l]=t,o=s==="*"?l.length===0?["","",G]:["","",pe]:s==="/*"?["","",Y]:s.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/),d;if(o){let c=o[1],f=o[2]||pe;if(c&&o[2]&&(f===".*"||(f=f.replace(/^\((?!\?:)(?=[^)]+\)$)/,"(?:"),/\((?!\?:)/.test(f))))throw D;if(d=this.#n[f],!d){if(Object.keys(this.#n).some(u=>u!==G&&u!==Y))throw D;if(i)return;d=this.#n[f]=new De,c!==""&&(d.#e=a.varIndex++)}!i&&c!==""&&r.push([c,d.#e])}else if(d=this.#n[s],!d){if(Object.keys(this.#n).some(c=>c.length>1&&c!==G&&c!==Y))throw D;if(i)return;d=this.#n[s]=new De}d.insert(l,n,r,a,i)}buildRegExpStr(){let n=Object.keys(this.#n).sort(fn).map(r=>{let a=this.#n[r];return(typeof a.#e=="number"?`(${r})@${a.#e}`:cn.has(r)?`\\${r}`:r)+a.buildRegExpStr()});return typeof this.#t=="number"&&n.unshift(`#${this.#t}`),n.length===0?"":n.length===1?n[0]:"(?:"+n.join("|")+")"}};var ft=class{#t={varIndex:0};#e=new ct;insert(e,t,n){let r=[],a=[];for(let s=0;;){let l=!1;if(e=e.replace(/\{[^}]+\}/g,o=>{let d=`@\\${s}`;return a[s]=[d,o],s++,l=!0,d}),!l)break}let i=e.match(/(?::[^\/]+)|(?:\/\*$)|./g)||[];for(let s=a.length-1;s>=0;s--){let[l]=a[s];for(let o=i.length-1;o>=0;o--)if(i[o].indexOf(l)!==-1){i[o]=i[o].replace(l,a[s][1]);break}}return this.#e.insert(i,t,r,this.#t,n),r}buildRegExp(){let e=this.#e.buildRegExpStr();if(e==="")return[/^$/,[],[]];let t=0,n=[],r=[];return e=e.replace(/#(\d+)|@(\d+)|\.\*\$/g,(a,i,s)=>i!==void 0?(n[++t]=Number(i),"$()"):(s!==void 0&&(r[Number(s)]=++t),"")),[new RegExp(`^${e}`),n,r]}};var un=[/^$/,[],Object.create(null)],ut=Object.create(null);function pt(e){return ut[e]??=new RegExp(e==="*"?"":`^${e.replace(/\/\*$|([.\\+*[^\]$()])/g,(t,n)=>n?`\\${n}`:"(?:|/.*)")}$`)}function pn(){ut=Object.create(null)}function mn(e){let t=new ft,n=[];if(e.length===0)return un;let r=e.map(d=>[!/\*|\/:/.test(d[0]),...d]).sort(([d,c],[f,u])=>d?1:f?-1:c.length-u.length),a=Object.create(null);for(let d=0,c=-1,f=r.length;d<f;d++){let[u,p,m]=r[d];u?a[p]=[m.map(([g])=>[g,Object.create(null)]),ue]:c++;let x;try{x=t.insert(p,c,u)}catch(g){throw g===D?new fe(p):g}u||(n[c]=m.map(([g,h])=>{let y=Object.create(null);for(h-=1;h>=0;h--){let[T,v]=x[h];y[T]=v}return[g,y]}))}let[i,s,l]=t.buildRegExp();for(let d=0,c=n.length;d<c;d++)for(let f=0,u=n[d].length;f<u;f++){let p=n[d][f]?.[1];if(!p)continue;let m=Object.keys(p);for(let x=0,g=m.length;x<g;x++)p[m[x]]=l[p[m[x]]]}let o=[];for(let d in s)o[d]=n[s[d]];return[i,o,a]}function $(e,t){if(e){for(let n of Object.keys(e).sort((r,a)=>a.length-r.length))if(pt(n).test(t))return[...e[n]]}}var me=class{name="RegExpRouter";#t;#e;constructor(){this.#t={[b]:Object.create(null)},this.#e={[b]:Object.create(null)}}add(e,t,n){let r=this.#t,a=this.#e;if(!r||!a)throw new Error(ce);r[e]||[r,a].forEach(l=>{l[e]=Object.create(null),Object.keys(l[b]).forEach(o=>{l[e][o]=[...l[b][o]]})}),t==="/*"&&(t="*");let i=(t.match(/\/:/g)||[]).length;if(/\*$/.test(t)){let l=pt(t);e===b?Object.keys(r).forEach(o=>{r[o][t]||=$(r[o],t)||$(r[b],t)||[]}):r[e][t]||=$(r[e],t)||$(r[b],t)||[],Object.keys(r).forEach(o=>{(e===b||e===o)&&Object.keys(r[o]).forEach(d=>{l.test(d)&&r[o][d].push([n,i])})}),Object.keys(a).forEach(o=>{(e===b||e===o)&&Object.keys(a[o]).forEach(d=>l.test(d)&&a[o][d].push([n,i]))});return}let s=de(t)||[t];for(let l=0,o=s.length;l<o;l++){let d=s[l];Object.keys(a).forEach(c=>{(e===b||e===c)&&(a[c][d]||=[...$(r[c],d)||$(r[b],d)||[]],a[c][d].push([n,i-o+l+1]))})}}match=Ce;buildAllMatchers(){let e=Object.create(null);return Object.keys(this.#e).concat(Object.keys(this.#t)).forEach(t=>{e[t]||=this.#n(t)}),this.#t=this.#e=void 0,pn(),e}#n(e){let t=[],n=e===b;return[this.#t,this.#e].forEach(r=>{let a=r[e]?Object.keys(r[e]).map(i=>[i,r[e][i]]):[];a.length!==0?(n||=!0,t.push(...a)):e!==b&&t.push(...Object.keys(r[b]).map(i=>[i,r[b][i]]))}),n?mn(t):null}};var Oe=class{name="SmartRouter";#t=[];#e=[];constructor(e){this.#t=e.routers}add(e,t,n){if(!this.#e)throw new Error(ce);this.#e.push([e,t,n])}match(e,t){if(!this.#e)throw new Error("Fatal error");let n=this.#t,r=this.#e,a=n.length,i=0,s;for(;i<a;i++){let l=n[i];try{for(let o=0,d=r.length;o<d;o++)l.add(...r[o]);s=l.match(e,t)}catch(o){if(o instanceof fe)continue;throw o}this.match=l.match.bind(l),this.#t=[l],this.#e=void 0;break}if(i===a)throw new Error("Fatal error");return this.name=`SmartRouter + ${this.activeRouter.name}`,s}get activeRouter(){if(this.#e||this.#t.length!==1)throw new Error("No active router has been determined yet.");return this.#t[0]}};var J=Object.create(null),xn=e=>{for(let t in e)return!0;return!1},mt=class xt{#t;#e;#n;#i=0;#a=J;constructor(t,n,r){if(this.#e=r||Object.create(null),this.#t=[],t&&n){let a=Object.create(null);a[t]={handler:n,possibleKeys:[],score:0},this.#t=[a]}this.#n=[]}insert(t,n,r){this.#i=++this.#i;let a=this,i=Ge(n),s=[];for(let l=0,o=i.length;l<o;l++){let d=i[l],c=i[l+1],f=Ye(d,c),u=Array.isArray(f)?f[0]:d;if(u in a.#e){a=a.#e[u],f&&s.push(f[1]);continue}a.#e[u]=new xt,f&&(a.#n.push(f),s.push(f[1])),a=a.#e[u]}return a.#t.push({[t]:{handler:r,possibleKeys:s.filter((l,o,d)=>d.indexOf(l)===o),score:this.#i}}),a}#r(t,n,r,a,i){for(let s=0,l=n.#t.length;s<l;s++){let o=n.#t[s],d=o[r]||o[b],c={};if(d!==void 0&&(d.params=Object.create(null),t.push(d),a!==J||i&&i!==J))for(let f=0,u=d.possibleKeys.length;f<u;f++){let p=d.possibleKeys[f],m=c[d.score];d.params[p]=i?.[p]&&!m?i[p]:a[p]??i?.[p],c[d.score]=!0}}}search(t,n){let r=[];this.#a=J;let i=[this],s=Re(n),l=[],o=s.length,d=null;for(let c=0;c<o;c++){let f=s[c],u=c===o-1,p=[];for(let x=0,g=i.length;x<g;x++){let h=i[x],y=h.#e[f];y&&(y.#a=h.#a,u?(y.#e["*"]&&this.#r(r,y.#e["*"],t,h.#a),this.#r(r,y,t,h.#a)):p.push(y));for(let T=0,v=h.#n.length;T<v;T++){let _=h.#n[T],A=h.#a===J?{}:{...h.#a};if(_==="*"){let B=h.#e["*"];B&&(this.#r(r,B,t,h.#a),B.#a=A,p.push(B));continue}let[we,ae,K]=_;if(!f&&!(K instanceof RegExp))continue;let I=h.#e[we];if(K instanceof RegExp){if(d===null){d=new Array(o);let ie=n[0]==="/"?1:0;for(let X=0;X<o;X++)d[X]=ie,ie+=s[X].length+1}let B=n.substring(d[c]),Ae=K.exec(B);if(Ae){if(A[ae]=Ae[0],this.#r(r,I,t,h.#a,A),xn(I.#e)){I.#a=A;let ie=Ae[0].match(/\//)?.length??0;(l[ie]||=[]).push(I)}continue}}(K===!0||K.test(f))&&(A[ae]=f,u?(this.#r(r,I,t,A,h.#a),I.#e["*"]&&this.#r(r,I.#e["*"],t,A,h.#a)):(I.#a=A,p.push(I)))}}let m=l.shift();i=m?p.concat(m):p}return r.length>1&&r.sort((c,f)=>c.score-f.score),[r.map(({handler:c,params:f})=>[c,f])]}};var Ne=class{name="TrieRouter";#t;constructor(){this.#t=new mt}add(e,t,n){let r=de(t);if(r){for(let a=0,i=r.length;a<i;a++)this.#t.insert(e,r[a],n);return}this.#t.insert(e,t,n)}match(e,t){return this.#t.search(e,t)}};var E=class extends lt{constructor(e={}){super(e),this.router=e.router??new Oe({routers:[new me,new Ne]})}};var ht=e=>{let n={...{origin:"*",allowMethods:["GET","HEAD","PUT","POST","DELETE","PATCH"],allowHeaders:[],exposeHeaders:[]},...e},r=(i=>typeof i=="string"?i==="*"?n.credentials?s=>s||null:()=>i:s=>i===s?s:null:typeof i=="function"?i:s=>i.includes(s)?s:null)(n.origin),a=(i=>typeof i=="function"?i:Array.isArray(i)?()=>i:()=>[])(n.allowMethods);return async function(s,l){function o(c,f){s.res.headers.set(c,f)}let d=await r(s.req.header("origin")||"",s);if(d&&o("Access-Control-Allow-Origin",d),n.credentials&&o("Access-Control-Allow-Credentials","true"),n.exposeHeaders?.length&&o("Access-Control-Expose-Headers",n.exposeHeaders.join(",")),s.req.method==="OPTIONS"){(n.origin!=="*"||n.credentials)&&o("Vary","Origin"),n.maxAge!=null&&o("Access-Control-Max-Age",n.maxAge.toString());let c=await a(s.req.header("origin")||"",s);c.length&&o("Access-Control-Allow-Methods",c.join(","));let f=n.allowHeaders;if(!f?.length){let u=s.req.header("Access-Control-Request-Headers");u&&(f=u.split(/\s*,\s*/))}return f?.length&&(o("Access-Control-Allow-Headers",f.join(",")),s.res.headers.append("Vary","Access-Control-Request-Headers")),s.res.headers.delete("Content-Length"),s.res.headers.delete("Content-Type"),new Response(null,{headers:s.res.headers,status:204,statusText:"No Content"})}await l(),(n.origin!=="*"||n.credentials)&&s.header("Vary","Origin",{append:!0})}};var gt=e=>e;var yt=gt(async(e,t)=>{let n=e.req.header("Authorization"),r;if(n?.startsWith("Bearer ")&&(r=n.slice(7)),!r){let a=new URL(e.req.url).searchParams.get("token");a&&(r=a)}if(!r)return t();try{let a=e.env.JWT_SECRET;if(!a)return t();let i=await Ue(r,a);if(!i?.id)return t();let s=await e.env.DB.prepare('SELECT id, display_name, email, type, url, avatar, label, github, twitter, facebook, google, weibo, qq, "2fa" FROM wl_Users WHERE id = ?').bind(i.id).first();s&&s.type!=="banned"&&e.set("userInfo",{objectId:s.id,display_name:s.display_name,email:s.email,type:s.type,url:s.url,avatar:s.avatar,label:s.label,github:s.github,twitter:s.twitter,facebook:s.facebook,google:s.google,weibo:s.weibo,qq:s.qq,"2fa":s["2fa"]})}catch{}return t()});async function Q(e,t,n=86400*30){let r={alg:"HS256",typ:"JWT"},a=Math.floor(Date.now()/1e3),i={...e,iat:a,exp:a+n},s=Me(JSON.stringify(r)),l=Me(JSON.stringify(i)),o=`${s}.${l}`,d=await crypto.subtle.importKey("raw",new TextEncoder().encode(t),{name:"HMAC",hash:"SHA-256"},!1,["sign"]),c=await crypto.subtle.sign("HMAC",d,new TextEncoder().encode(o));return`${o}.${Me(c)}`}async function Ue(e,t){let n=e.split(".");if(n.length!==3)return null;let[r,a,i]=n,s=`${r}.${a}`,l=await crypto.subtle.importKey("raw",new TextEncoder().encode(t),{name:"HMAC",hash:"SHA-256"},!1,["verify"]),o=bt(i);if(!await crypto.subtle.verify("HMAC",l,o,new TextEncoder().encode(s)))return null;let c=JSON.parse(new TextDecoder().decode(bt(a)));return c.exp&&c.exp<Math.floor(Date.now()/1e3)?null:c}function Me(e){let t=typeof e=="string"?new TextEncoder().encode(e):new Uint8Array(e),n="";for(let r of t)n+=String.fromCharCode(r);return btoa(n).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function bt(e){let t=e.replace(/-/g,"+").replace(/_/g,"/"),n=atob(t),r=new Uint8Array(n.length);for(let a=0;a<n.length;a++)r[a]=n.charCodeAt(a);return r.buffer}var xe=new E,Et=new Set(["time","reaction0","reaction1","reaction2","reaction3","reaction4","reaction5","reaction6","reaction7","reaction8"]);xe.get("/",async e=>{let t=e.req.queries("path")||e.req.queries("path[]")||[];if(t.length===0)return e.json({errno:0,errmsg:"",data:0});let r=(e.req.queries("type")||e.req.queries("type[]")||["time"]).filter(o=>Et.has(o));if(r.length===0)return e.json({errno:0,errmsg:"",data:t.map(()=>({}))});let a=t.map(()=>"?").join(","),i=await e.env.DB.prepare(`SELECT * FROM wl_Counter WHERE url IN (${a})`).bind(...t).all(),s={};for(let o of i.results)s[o.url]=o;let l=t.map(o=>{let d={};for(let c of r)d[c]=s[o]?.[c]||0;return d});return e.json({errno:0,errmsg:"",data:l})});xe.post("/",async e=>{let t=await e.req.json(),{path:n,type:r="time",action:a="inc"}=t;if(!n)return e.json({errno:1,errmsg:"path is required"},400);if(!Et.has(r))return e.json({errno:1,errmsg:"invalid type"},400);let i=await e.env.DB.prepare("SELECT * FROM wl_Counter WHERE url = ?").bind(n).first();if(!i)return a==="desc"?e.json({errno:0,errmsg:"",data:[{[r]:0}]}):(await e.env.DB.prepare(`INSERT INTO wl_Counter (url, ${r}) VALUES (?, 1)`).bind(n).run(),e.json({errno:0,errmsg:"",data:[{[r]:1}]}));let s=i[r]||0,l=a==="desc"?Math.max(0,s-1):s+1;return await e.env.DB.prepare(`UPDATE wl_Counter SET ${r} = ?, updatedAt = datetime('now') WHERE url = ?`).bind(l,n).run(),e.json({errno:0,errmsg:"",data:[{[r]:l}]})});async function vt(e,t,n){let r=`https://${e}.rest.akismet.com/1.1/comment-check`,a=new URLSearchParams({blog:t||"http://localhost",user_ip:n.ip,user_agent:n.ua,referrer:n.pageUrl,comment_type:"comment",comment_author:n.author,comment_author_email:n.email,comment_content:n.comment});try{let i=await fetch(r,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded","User-Agent":"Waline-On-Worker | waline@worker"},body:a.toString()});return i.ok?(await i.text()).trim()==="true":!1}catch{return!1}}function P(e){let t=e?.trim().toLowerCase();return!!(t&&t!=="false"&&t!=="0")}function he(e){if(!e||!P(e))return;let t=e.split(",").map(r=>r.trim());if(t.some(r=>!/^\d+$/.test(r)))return;let n=t.map(Number);if(!n.some((r,a)=>!Number.isSafeInteger(r)||a>0&&r<=n[a-1]))return n}function ge(e,t){return Math.max(0,t.findLastIndex(n=>e>=n))}async function Z(e){let t=new TextEncoder().encode(e),n=await crypto.subtle.digest("MD5",t);return Array.from(new Uint8Array(n)).map(r=>r.toString(16).padStart(2,"0")).join("")}async function k(e){return e?`https://cn.cravatar.com/avatar/${await Z(e.trim().toLowerCase())}?d=mp`:""}function S(e,t){if(!e||(e=e.replace(/gravatar\.com\/avatar\//g,"cn.cravatar.com/avatar/"),!t||!P(t)))return e;try{let n=new URL(t.trim());return n.protocol!=="https:"&&n.protocol!=="http:"||e.startsWith(`${n.origin}${n.pathname}?`)&&new URL(e).searchParams.has("url")?e:(n.searchParams.set("url",e),n.toString())}catch{return e}}var be=new E,hn=new Set(["waline_client_version","waline_admin_version","comment_default_status","user_comment_default_status","worker_display","spam_mode","akismet_key","llm_mode","llm_skip_admin","llm_endpoint","llm_api_key","llm_model","llm_prompt"]);be.get("/",async e=>{if(e.get("userInfo")?.type!=="administrator")return e.json({errno:1,errmsg:"Unauthorized"},403);let n=await e.env.DB.prepare("SELECT key, value FROM wl_Settings").all(),r=new Set(["llm_api_key","akismet_key"]),a={};for(let i of n.results){let s=i.key,l=i.value;r.has(s)&&l?a[s]=l.length>8?`${l.slice(0,4)}****${l.slice(-4)}`:`${l.slice(0,1)}****`:a[s]=l}return e.json({errno:0,errmsg:"",data:a,env_overrides:gn(e.env)})});be.put("/",async e=>{if(e.get("userInfo")?.type!=="administrator")return e.json({errno:1,errmsg:"Unauthorized"},403);let n=await e.req.json(),r=[];for(let[a,i]of Object.entries(n))hn.has(a)&&r.push(e.env.DB.prepare(`INSERT INTO wl_Settings (key, value, updatedAt) VALUES (?, ?, datetime('now'))
         ON CONFLICT(key) DO UPDATE SET value = excluded.value, updatedAt = excluded.updatedAt`).bind(a,String(i)));return r.length>0&&await e.env.DB.batch(r),e.json({errno:0,errmsg:""})});async function O(e,t){let n=t.map(()=>"?").join(","),r=await e.prepare(`SELECT key, value FROM wl_Settings WHERE key IN (${n})`).bind(...t).all(),a={};for(let i of r.results)a[i.key]=i.value;return a}function gn(e){let t=[],n=[[e.AKISMET_KEY,"akismet_key"],[e.LLM_ENDPOINT,"llm_endpoint"],[e.LLM_API_KEY,"llm_api_key"],[e.LLM_MODEL,"llm_model"],[e.LLM_PROMPT,"llm_prompt"],[e.SPAM_MODE,"spam_mode"],[e.LLM_SKIP_ADMIN,"llm_skip_admin"]];for(let[r,a]of n)r&&r.length>0&&t.push(a);return t}async function wt(e,t,n,r,a,i){let s=await O(e,["llm_endpoint","llm_api_key","llm_model","llm_prompt"]),l=t.LLM_ENDPOINT||s.llm_endpoint,o=t.LLM_API_KEY||s.llm_api_key,d=t.LLM_MODEL||s.llm_model||"gpt-4o-mini",c=t.LLM_PROMPT||s.llm_prompt||"You are a review bot. Your task is to review the comments according to following rules: 1. Any contact information should not be included, including qq number, email, phone number, etc. 2. Any content with advertising or sensitive information should not be included. 3. Any other content that is not suitable for public display should not be included. 4. Output should be a single word(approved/spam).";if(!l||!o)return i;try{let f=await fetch(l,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${o}`},body:JSON.stringify({model:d,messages:[{role:"system",content:c},{role:"user",content:n}]})});if(!f.ok)return i;let p=(await f.json())?.choices?.[0]?.message?.content?.trim()?.toLowerCase();return p?p==="approved"||p==="spam"?p:"waiting":i}catch{return i}}var At=/^(https?:|mailto:|#|\/)/i;function je(e){if(!e)return"";let t=e;return t=bn(t),t=t.replace(/```(\w*)\n([\s\S]*?)```/g,(n,r,a)=>`<pre><code class="language-${r||""}">${a.trim()}</code></pre>`),t=t.replace(/`([^`]+)`/g,"<code>$1</code>"),t=t.replace(/!\[([^\]]*)\]\(([^)]+)\)/g,(n,r,a)=>At.test(a.trim())?`<img src="${a}" alt="${r}" loading="lazy" />`:""),t=t.replace(/\[([^\]]+)\]\(([^)]+)\)/g,(n,r,a)=>At.test(a.trim())?`<a href="${a}" target="_blank" rel="ugc nofollow noreferrer noopener">${r}</a>`:r),t=t.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>"),t=t.replace(/__(.+?)__/g,"<strong>$1</strong>"),t=t.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g,"<em>$1</em>"),t=t.replace(/(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g,"<em>$1</em>"),t=t.replace(/~~(.+?)~~/g,"<del>$1</del>"),t=t.replace(/^&gt; (.+)$/gm,"<blockquote>$1</blockquote>"),t=t.replace(/<\/blockquote>\n<blockquote>/g,`
`),t=t.replace(/^######\s+(.+)$/gm,"<h6>$1</h6>"),t=t.replace(/^#####\s+(.+)$/gm,"<h5>$1</h5>"),t=t.replace(/^####\s+(.+)$/gm,"<h4>$1</h4>"),t=t.replace(/^###\s+(.+)$/gm,"<h3>$1</h3>"),t=t.replace(/^##\s+(.+)$/gm,"<h2>$1</h2>"),t=t.replace(/^#\s+(.+)$/gm,"<h1>$1</h1>"),t=t.replace(/^(-{3,}|\*{3,}|_{3,})$/gm,"<hr />"),t=t.replace(/^[*\-+]\s+(.+)$/gm,"<li>$1</li>"),t=t.replace(/((?:<li>.*<\/li>\n?)+)/g,"<ul>$1</ul>"),t=t.replace(/(?<!="|'|>)(https?:\/\/[^\s<)"']+)/g,'<a href="$1" target="_blank" rel="ugc nofollow noreferrer noopener">$1</a>'),t=t.split(/\n{2,}/).map(n=>(n=n.trim(),n?/^<(h[1-6]|ul|ol|li|blockquote|pre|hr|p|div|table)/.test(n)?n:`<p>${n}</p>`:"")).join(`
`),t=t.replace(/(?<!\n)\n(?!\n)/g,`<br />
`),t.trim()}function bn(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function ee(e){if(!e||typeof e!="object")return null;let t=e,n=i=>typeof i=="string"?i.trim().slice(0,255):"",r=n(t.country).toUpperCase(),a={country:/^[A-Z]{2}$/.test(r)&&r!=="XX"?r:"",region:n(t.region),city:n(t.city)};return a.country||a.region||a.city?a:null}function Tt(e,t){return[...new Set([e.country,e.region,...t?[e.city]:[]].filter(Boolean))].join(" ")}function ye(e,t){return e.prepare("INSERT INTO wl_CommentRegion (comment_id, country, region, city) VALUES (last_insert_rowid(), ?, ?, ?)").bind(t.country,t.region,t.city)}async function Ee(e,t){let n=new Map;for(let r=0;r<t.length;r+=100){let a=t.slice(r,r+100),i=await e.prepare(`SELECT comment_id, country, region, city FROM wl_CommentRegion WHERE comment_id IN (${a.map(()=>"?").join(",")})`).bind(...a).all();for(let s of i.results)n.set(s.comment_id,s)}return n}function _t(e){return e?{browser:yn(e),os:En(e)}:{browser:"",os:""}}function yn(e){let t=[[/Edg(?:e|A|iOS)?\/(\d+[.\d]*)/,"Edge"],[/OPR\/(\d+[.\d]*)/,"Opera"],[/Vivaldi\/(\d+[.\d]*)/,"Vivaldi"],[/Firefox\/(\d+[.\d]*)/,"Firefox"],[/Chrome\/(\d+[.\d]*)/,"Chrome"],[/Version\/(\d+[.\d]*).*Safari/,"Safari"],[/MSIE (\d+[.\d]*)/,"IE"],[/Trident\/.*rv:(\d+[.\d]*)/,"IE"]];for(let[n,r]of t){let a=e.match(n);if(a)return`${r} ${a[1]}`}return""}function En(e){return/Windows NT 10/.test(e)?"Windows 10":/Windows NT 6\.3/.test(e)?"Windows 8.1":/Windows NT 6\.2/.test(e)?"Windows 8":/Windows NT 6\.1/.test(e)?"Windows 7":/Windows/.test(e)?"Windows":/Mac OS X (\d+[._]\d+)/.test(e)?`macOS ${e.match(/Mac OS X (\d+[._]\d+)/)?.[1]?.replace(/_/g,".")}`:/Macintosh/.test(e)?"macOS":/Android (\d+[.\d]*)/.test(e)?`Android ${e.match(/Android (\d+[.\d]*)/)?.[1]}`:/iPhone OS (\d+[_\d]*)/.test(e)?`iOS ${e.match(/iPhone OS (\d+[_\d]*)/)?.[1]?.replace(/_/g,".")}`:/iPad/.test(e)?"iPadOS":/Linux/.test(e)?"Linux":""}var N=new E;N.get("/",async e=>{switch(e.req.query("type")){case"recent":return wn(e);case"count":return An(e);case"list":return Tn(e);default:return vn(e)}});N.post("/",async e=>{let t=await e.req.json(),{comment:n,nick:r,mail:a,link:i,url:s,ua:l,pid:o,rid:d,at:c}=t;if(!s)return e.json({errno:1,errmsg:"url is required"},400);if(!n)return e.json({errno:1,errmsg:"comment is required"},400);if(typeof n!="string"||n.length>65536)return e.json({errno:1,errmsg:"comment is too long (max 64KB)"},400);if(r&&(typeof r!="string"||r.length>255))return e.json({errno:1,errmsg:"nick is too long (max 255 chars)"},400);if(a&&(typeof a!="string"||a.length>255))return e.json({errno:1,errmsg:"mail is too long (max 255 chars)"},400);if(i&&(typeof i!="string"||i.length>255))return e.json({errno:1,errmsg:"link is too long (max 255 chars)"},400);if(s&&(typeof s!="string"||s.length>1024))return e.json({errno:1,errmsg:"url is too long (max 1024 chars)"},400);if(l&&(typeof l!="string"||l.length>1024))return e.json({errno:1,errmsg:"ua is too long (max 1024 chars)"},400);let f=e.req.header("CF-Connecting-IP")||"",u=e.get("userInfo"),p=await O(e.env.DB,["comment_default_status","user_comment_default_status"]).catch(()=>({})),m;if(u)m=p.user_comment_default_status==="waiting"?"waiting":"approved";else{let _=p.comment_default_status;_==="waiting"||_==="approved"?m=_:e.env.AUDIT?m="waiting":m="approved"}let x=je(n),g=e.env.DB.prepare(`INSERT INTO wl_Comment (user_id, comment, orig, ip, link, mail, nick, pid, rid, sticky, status, "like", ua, url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, 0, ?, ?)`).bind(u?.objectId??null,x,n,f,i||"",u?.email||a||"",u?.display_name||r||"",o||null,d||null,m,l||"",s),h=ee(e.req.raw.cf),y=[g];h&&y.push(ye(e.env.DB,h));let[T]=await e.env.DB.batch(y);if(!T.success)return e.json({errno:1,errmsg:"Failed to create comment"},500);let v=await e.env.DB.prepare("SELECT * FROM wl_Comment WHERE id = ?").bind(T.meta.last_row_id).first();if(v){let _=v.id;e.executionCtx.waitUntil(_n({db:e.env.DB,env:e.env,commentId:_,commentText:n,nick:r||"",mail:u?.email||a||"",ip:f,ua:l||"",pageUrl:s,userInfo:u,currentStatus:m}).catch(A=>console.error("[Spam Review Error]",A?.message||A)))}return e.json({errno:0,errmsg:"",data:(await H([v],e.env))[0]},201)});N.put("/:id",async e=>{let t=e.req.param("id"),n=e.get("userInfo"),r=await e.req.json(),a=n?.type==="administrator";if(r.like!==void 0&&typeof r.like=="boolean"){await e.env.DB.prepare(`UPDATE wl_Comment SET "like" = MAX(0, "like" + 1), updatedAt = datetime('now') WHERE id = ?`).bind(t).run();let o=await e.env.DB.prepare("SELECT * FROM wl_Comment WHERE id = ?").bind(t).first();return e.json({errno:0,errmsg:"",data:(await H([o],e.env))[0]})}if(!a)return e.json({errno:1,errmsg:"Unauthorized"},403);let i=[],s=[];if(r.status!==void 0&&(i.push("status = ?"),s.push(r.status)),r.comment!==void 0&&(i.push("comment = ?"),s.push(je(r.comment)),i.push("orig = ?"),s.push(r.comment)),r.sticky!==void 0&&(i.push("sticky = ?"),s.push(r.sticky?1:0)),r.nick!==void 0&&(i.push("nick = ?"),s.push(r.nick)),r.mail!==void 0&&(i.push("mail = ?"),s.push(r.mail)),r.link!==void 0&&(i.push("link = ?"),s.push(r.link)),r.url!==void 0&&(i.push("url = ?"),s.push(r.url)),r.ua!==void 0&&(i.push("ua = ?"),s.push(r.ua)),r.ip!==void 0&&(i.push("ip = ?"),s.push(r.ip)),r.user_id!==void 0&&(i.push("user_id = ?"),s.push(r.user_id)),r.pid!==void 0&&(i.push("pid = ?"),s.push(r.pid)),r.rid!==void 0&&(i.push("rid = ?"),s.push(r.rid)),typeof r.like=="number"&&(i.push('"like" = ?'),s.push(Math.max(0,r.like))),i.length===0)return e.json({errno:1,errmsg:"No fields to update"},400);i.push("updatedAt = datetime('now')"),s.push(t),await e.env.DB.prepare(`UPDATE wl_Comment SET ${i.join(", ")} WHERE id = ?`).bind(...s).run();let l=await e.env.DB.prepare("SELECT * FROM wl_Comment WHERE id = ?").bind(t).first();return e.json({errno:0,errmsg:"",data:(await H([l],e.env))[0]})});N.delete("/:id",async e=>{let t=e.req.param("id");return e.get("userInfo")?.type!=="administrator"?e.json({errno:1,errmsg:"Unauthorized"},403):(await e.env.DB.batch([e.env.DB.prepare("DELETE FROM wl_Comment WHERE rid = ?").bind(t),e.env.DB.prepare("DELETE FROM wl_Comment WHERE id = ?").bind(t)]),e.json({errno:0,errmsg:""}))});N.get("/rss",async e=>{let t=e.req.query("path"),n=e.req.query("email"),r=e.req.query("user_id"),a=parseInt(e.req.query("count")||"20",10),i=Math.min(Math.max(Number.isFinite(a)?a:20,1),50),s=e.env.SITE_URL||"",l=e.env.SITE_NAME||"Waline",o;if(t)o=(await e.env.DB.prepare(`SELECT id, comment, insertedAt, link, nick, url, user_id FROM wl_Comment
       WHERE url = ? AND status NOT IN ('waiting', 'spam')
       ORDER BY insertedAt DESC LIMIT ?`).bind(t,i).all()).results;else if(n||r){let m,x=[];n&&r?(m="SELECT id FROM wl_Comment WHERE status NOT IN ('waiting', 'spam') AND (mail = ? OR user_id = ?)",x.push(n,r)):n?(m="SELECT id FROM wl_Comment WHERE status NOT IN ('waiting', 'spam') AND mail = ?",x.push(n)):(m="SELECT id FROM wl_Comment WHERE status NOT IN ('waiting', 'spam') AND user_id = ?",x.push(r));let h=(await e.env.DB.prepare(m).bind(...x).all()).results.map(v=>v.id);if(h.length===0)return It(e,Rt({title:`${l} Reply Comments`,link:s,description:"Recent reply comments.",items:[]}));let y=h.map(()=>"?").join(",");o=(await e.env.DB.prepare(`SELECT id, comment, insertedAt, link, nick, url, user_id FROM wl_Comment
       WHERE pid IN (${y}) AND status NOT IN ('waiting', 'spam')
       ORDER BY insertedAt DESC LIMIT ?`).bind(...h,i).all()).results}else o=(await e.env.DB.prepare(`SELECT id, comment, insertedAt, link, nick, url, user_id FROM wl_Comment
       WHERE status NOT IN ('waiting', 'spam')
       ORDER BY insertedAt DESC LIMIT ?`).bind(i).all()).results;let d=[...new Set(o.map(m=>m.user_id).filter(Boolean))],c=[];if(d.length>0){let m=d.map(()=>"?").join(",");c=(await e.env.DB.prepare(`SELECT id, display_name, url FROM wl_Users WHERE id IN (${m})`).bind(...d).all()).results}let f=o.map(m=>{let g=c.find(T=>T.id===m.user_id)?.display_name||m.nick||"Anonymous",h=In(s,m.url),y=h?`${h}#${m.id}`:"";return{title:`${g} commented${m.url?` on ${m.url}`:""}`,link:y||h,guid:String(m.id),pubDate:m.insertedAt?new Date(`${m.insertedAt}Z`).toUTCString():new Date().toUTCString(),description:m.comment||""}}),u=t?`${l} Comments for ${t}`:n||r?`${l} Reply Comments`:`${l} Recent Comments`,p=t?`Recent comments for ${t}.`:n||r?"Recent reply comments.":"Recent comments.";return It(e,Rt({title:u,link:s,description:p,items:f}))});async function vn(e){let t=e.req.query("path");if(!t)return e.json({errno:1,errmsg:"path is required"},400);let n=Math.max(1,parseInt(e.req.query("page")||"1",10)||1),r=Math.min(100,Math.max(1,parseInt(e.req.query("pageSize")||"10",10)||10)),a=e.req.query("sortBy")||"insertedAt_desc",s={insertedAt_desc:"insertedAt DESC",insertedAt_asc:"insertedAt ASC",like_desc:'"like" DESC'}[a]||"insertedAt DESC",l=(n-1)*r,d=(await e.env.DB.prepare("SELECT COUNT(*) as count FROM wl_Comment WHERE url = ? AND rid IS NULL AND pid IS NULL AND status = 'approved'").bind(t).first())?.count||0,c=await e.env.DB.prepare(`SELECT * FROM wl_Comment
     WHERE url = ? AND rid IS NULL AND pid IS NULL AND status = 'approved'
     ORDER BY sticky DESC, ${s}
     LIMIT ? OFFSET ?`).bind(t,r,l).all(),f=c.results.map(g=>g.id),u=[];if(f.length>0){let g=f.map(()=>"?").join(",");u=(await e.env.DB.prepare(`SELECT * FROM wl_Comment
       WHERE rid IN (${g}) AND status = 'approved'
       ORDER BY insertedAt ASC`).bind(...f).all()).results}let p=await H([...c.results,...u],e.env),m=new Map(p.filter(g=>g!==null).map(g=>[g.objectId,g])),x=c.results.map(g=>({...m.get(g.id),children:u.filter(h=>h.rid===g.id).map(h=>m.get(h.id))}));return e.json({errno:0,errmsg:"",data:{page:n,pageSize:r,count:d,totalPages:Math.ceil(d/r),data:x}})}async function wn(e){let t=Math.min(50,Math.max(1,parseInt(e.req.query("count")||"10",10)||10)),n=await e.env.DB.prepare(`SELECT * FROM wl_Comment WHERE status = 'approved'
     ORDER BY insertedAt DESC LIMIT ?`).bind(t).all();return e.json({errno:0,errmsg:"",data:await H(n.results,e.env)})}async function An(e){let t=e.req.queries("path")||e.req.queries("path[]")||[];if(t.length===0)return e.json({errno:0,errmsg:"",data:0});if(t.length===1){let i=await e.env.DB.prepare("SELECT COUNT(*) as count FROM wl_Comment WHERE url = ? AND status = 'approved'").bind(t[0]).first();return e.json({errno:0,errmsg:"",data:[i?.count||0]})}let n=t.map(()=>"?").join(","),r=await e.env.DB.prepare(`SELECT url, COUNT(*) as count FROM wl_Comment
     WHERE url IN (${n}) AND status = 'approved'
     GROUP BY url`).bind(...t).all(),a=Object.fromEntries(r.results.map(i=>[i.url,i.count]));return e.json({errno:0,errmsg:"",data:t.map(i=>a[i]||0)})}async function Tn(e){let t=e.get("userInfo");if(t?.type!=="administrator")return e.json({errno:1,errmsg:"Unauthorized"},403);let n=Math.max(1,parseInt(e.req.query("page")||"1",10)||1),r=Math.min(100,Math.max(1,parseInt(e.req.query("pageSize")||"10",10)||10)),a=e.req.query("status")||"",i=e.req.query("keyword")||"",s=e.req.query("owner")||"",l=(n-1)*r,o="1=1",d=[];if(s==="mine"&&(o+=" AND mail = ?",d.push(t.email)),a&&(o+=" AND status = ?",d.push(a)),i){let u=i.replace(/[%_\\]/g,"\\$&");o+=" AND comment LIKE ? ESCAPE '\\'",d.push(`%${u}%`)}let c=await e.env.DB.prepare(`SELECT COUNT(*) as count FROM wl_Comment WHERE ${o}`).bind(...d).first(),f=await e.env.DB.prepare(`SELECT * FROM wl_Comment WHERE ${o}
     ORDER BY insertedAt DESC LIMIT ? OFFSET ?`).bind(...d,r,l).all();return e.json({errno:0,errmsg:"",data:{page:n,pageSize:r,spamCount:0,waitingCount:0,totalPages:Math.ceil((c?.count||0)/r),data:await H(f.results,e.env,!0)}})}async function _n(e){let{db:t,env:n,commentId:r,commentText:a,nick:i,mail:s,ip:l,ua:o,pageUrl:d,userInfo:c,currentStatus:f}=e,u=await O(t,["spam_mode","llm_mode","llm_skip_admin","akismet_key","llm_endpoint","llm_api_key","llm_model","llm_prompt"]).catch(()=>({})),p=n.SPAM_MODE||u.spam_mode||"";if(p||(p=(u.llm_mode||"off")==="off"?"off":"llm"),p==="off")return;let m=n.AKISMET_KEY||u.akismet_key||"",x=c?.type==="administrator"&&(n.LLM_SKIP_ADMIN||u.llm_skip_admin)!=="0",g=!1;(p==="akismet"||p==="mix")&&m&&await vt(m,n.SITE_URL||"",{ip:l,ua:o,comment:a,author:i,email:s,pageUrl:d})&&(g=!0),!g&&(p==="llm"||p==="mix")&&!x&&await wt(t,n,a,i,d,f)==="spam"&&(g=!0),g&&await t.prepare("UPDATE wl_Comment SET status = 'spam', updatedAt = datetime('now') WHERE id = ? AND status = ?").bind(r,f).run()}async function H(e,t,n=!1){let r=e.filter(Boolean),a=[...new Set(r.map(c=>c.user_id).filter(Boolean))],i=new Map;for(let c=0;c<a.length;c+=100){let f=a.slice(c,c+100),u=await t.DB.prepare(`SELECT id, display_name, email, type, url, avatar, label FROM wl_Users WHERE id IN (${f.map(()=>"?").join(",")})`).bind(...f).all();for(let p of u.results)i.set(p.id,p)}let s=he(t.LEVELS),l=new Map,o=new Map;if(s){let c=[...new Set(r.filter(f=>!f.user_id).map(f=>f.mail).filter(Boolean))];for(let[f,u]of[["user_id",a],["mail",c]])for(let p=0;p<u.length;p+=100){let m=u.slice(p,p+100),x=await t.DB.prepare(`SELECT ${f} AS identity, COUNT(*) AS count FROM wl_Comment WHERE status = 'approved' AND ${f} IN (${m.map(()=>"?").join(",")}) GROUP BY ${f}`).bind(...m).all();for(let g of x.results)f==="user_id"?l.set(g.identity,g.count):o.set(g.identity,g.count)}}let d=n||!P(t.DISABLE_REGION)?await Ee(t.DB,r.map(c=>c.id)):new Map;return Promise.all(e.map(async c=>{let f=await Rn(c,t,n,i,d);if(f&&s){let u=c.user_id?l.get(c.user_id):o.get(c.mail);f.level=ge(u||0,s)}return f}))}async function Rn(e,t,n=!1,r,a){if(!e)return null;let i=e.user_id?r.get(e.user_id):null,s=i?.display_name||e.nick||"Anonymous",l=i?.email||e.mail||"",o=i?.url||e.link||"",d=S(i?.avatar||await k(l),t.AVATAR_PROXY),c=e.insertedAt||e.createdAt,f=0,u="";if(c)if(typeof c=="number")f=c,u=new Date(f).toISOString();else{let x=String(c).replace(" ","T"),g=new Date(x.endsWith("Z")||x.includes("T")?x:`${x}Z`);f=g.getTime(),u=Number.isNaN(f)?"":g.toISOString()}let p={objectId:e.id,comment:e.comment||"",orig:e.orig||e.comment||"",nick:s,link:o,avatar:d,time:Number.isNaN(f)?0:f,insertedAt:u,createdAt:u,status:e.status,like:e.like??0,url:e.url,pid:e.pid,rid:e.rid,sticky:!!e.sticky,user_id:e.user_id,type:i?.type||(e.user_id?"guest":""),label:i?.label||""};P(t.DISABLE_USERAGENT??t.DISABLE_AGENT)||Object.assign(p,_t(e.ua||""));let m=a.get(e.id);if(m){let x=Tt(m,n);x&&(p.addr=x)}return n&&(p.mail=l,p.ip=e.ip||"",p.ua=e.ua||""),p}function F(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;")}function In(e,t){if(!t)return e||"";if(/^(https?:)?\/\//i.test(t)||!e)return t;let n=e.endsWith("/")?e.slice(0,-1):e,r=t.startsWith("/")?t:`/${t}`;return`${n}${r}`}function Rt({title:e,link:t,description:n,items:r}){let a=new Date().toUTCString(),i=r.map(s=>`    <item>
      <title>${F(s.title)}</title>
      <link>${F(s.link)}</link>
      <guid>${F(s.guid)}</guid>
      <pubDate>${s.pubDate}</pubDate>
      <description><![CDATA[${s.description}]]></description>
    </item>`).join(`
`);return`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${F(e)}</title>
    <link>${F(t)}</link>
    <description>${F(n)}</description>
    <pubDate>${a}</pubDate>
${i}
  </channel>
</rss>`}function It(e,t){return e.body(t,200,{"Content-Type":"application/rss+xml; charset=utf-8"})}var U=new E,M={Comment:"wl_Comment",Counter:"wl_Counter",Users:"wl_Users"},kt={Comment:new Set(["user_id","comment","orig","insertedAt","ip","link","mail","nick","pid","rid","sticky","status","like","ua","url","createdAt","updatedAt"]),Counter:new Set(["time","reaction0","reaction1","reaction2","reaction3","reaction4","reaction5","reaction6","reaction7","reaction8","url","createdAt","updatedAt"]),Users:new Set(["display_name","email","password","type","label","url","avatar","github","twitter","facebook","google","weibo","qq","2fa","createdAt","updatedAt"])};U.use("*",async(e,t)=>{let n=e.get("userInfo");if(!n)return e.json({errno:401,errmsg:"Unauthorized"},401);if(n.type!=="administrator")return e.json({errno:403,errmsg:"Forbidden"},403);await t()});U.get("/",async e=>{let t={type:"waline",version:1,time:Date.now(),tables:["Comment","Counter","Users"],data:{Comment:[],Counter:[],Users:[]}};for(let n of t.tables){let r=M[n],{results:a}=await e.env.DB.prepare(`SELECT * FROM "${r}"`).all(),i=n==="Comment"?await Ee(e.env.DB,a.map(s=>s.id)):void 0;t.data[n]=a.map(s=>{let l=i?.get(s.id);return{...s,objectId:String(s.id),...l?{cfRegion:{country:l.country,region:l.region,city:l.city}}:{}}})}return e.json({errno:0,data:t})});U.post("/",async e=>{let t=e.req.query("table");if(!t||!M[t])return e.json({errno:1,errmsg:"Invalid table"},400);let n=M[t],r=kt[t],a=await e.req.json();delete a.objectId,delete a.id;let i=Object.keys(a).filter(u=>r.has(u)&&a[u]!==null&&a[u]!==void 0);if(i.length===0)return e.json({errno:1,errmsg:"Empty data"},400);let s=i.map(u=>`"${u}"`).join(", "),l=i.map(()=>"?").join(", "),o=i.map(u=>a[u]),c=[e.env.DB.prepare(`INSERT INTO "${n}" (${s}) VALUES (${l})`).bind(...o)];if(t==="Comment"&&a.cfRegion!==void 0&&a.cfRegion!==null){let u=ee(a.cfRegion);if(!u)return e.json({errno:1,errmsg:"Invalid cfRegion"},400);c.push(ye(e.env.DB,u))}let[f]=await e.env.DB.batch(c);return f.success?e.json({errno:0,data:{objectId:String(f.meta.last_row_id)}}):e.json({errno:1,errmsg:"Insert failed"},500)});U.put("/",async e=>{let t=e.req.query("table"),n=e.req.query("objectId");if(!t||!M[t]||!n)return e.json({errno:1,errmsg:"Invalid table or objectId"},400);let r=M[t],a=kt[t],i=await e.req.json();delete i.objectId,delete i.id,delete i.createdAt;let s=Object.keys(i).filter(o=>a.has(o)&&i[o]!==null&&i[o]!==void 0),l=[];if(s.length>0){let o=s.map(c=>`"${c}" = ?`).join(", "),d=s.map(c=>i[c]);l.push(e.env.DB.prepare(`UPDATE "${r}" SET ${o}, "updatedAt" = datetime('now') WHERE id = ?`).bind(...d,Number(n)))}if(t==="Comment"&&Object.hasOwn(i,"cfRegion"))if(i.cfRegion===null)l.push(e.env.DB.prepare("DELETE FROM wl_CommentRegion WHERE comment_id = ?").bind(Number(n)));else{let o=ee(i.cfRegion);if(!o)return e.json({errno:1,errmsg:"Invalid cfRegion"},400);l.push(e.env.DB.prepare(`INSERT INTO wl_CommentRegion (comment_id, country, region, city) VALUES (?, ?, ?, ?)
				ON CONFLICT(comment_id) DO UPDATE SET country = excluded.country, region = excluded.region, city = excluded.city`).bind(Number(n),o.country,o.region,o.city))}return l.length&&await e.env.DB.batch(l),e.json({errno:0})});U.delete("/",async e=>{let t=e.req.query("table");if(!t||!M[t])return e.json({errno:1,errmsg:"Invalid table"},400);let n=M[t];return await e.env.DB.prepare(`DELETE FROM "${n}"`).run(),e.json({errno:0})});var Be=new E,kn="https://oauth.lithub.cc";Be.get("/",async e=>{let t=e.req.query("type"),n=e.req.query("code"),r=e.req.query("state")||"",a=Sn(e.req.query("redirect")),i=e.env.OAUTH_URL||kn;if(!t)return e.json({errno:1,errmsg:"type is required"},400);if(!n){let l=`${new URL(e.req.url).origin}/api/oauth?redirect=${encodeURIComponent(a)}&type=${encodeURIComponent(t)}`,o=`${i}/${t}?redirect=${encodeURIComponent(l)}&state=${encodeURIComponent(r)}`;return e.redirect(o)}try{let s=new URLSearchParams({code:n});r&&s.set("state",r);let l=`${i}/${t}?${s.toString()}`,o=await fetch(l,{headers:{"User-Agent":"@waline"}});if(!o.ok)return e.redirect(`${a}?error=oauth_failed`);let d=await o.json(),c=String(d.id||d.login||d.name||""),f=String(d.name||d.login||d.display_name||""),u=String(d.email||""),p=String(d.avatar_url||d.avatar||""),m=String(d.html_url||d.url||d.blog||"");if(!c)return e.redirect(`${a}?error=oauth_no_id`);let x=Ln(t),g=e.env.JWT_SECRET;if(r&&g&&x)try{let v=await Ue(r,g);if(v?.id&&await e.env.DB.prepare("SELECT * FROM wl_Users WHERE id = ?").bind(v.id).first()){if(await e.env.DB.prepare(`SELECT id FROM wl_Users WHERE ${x} = ? AND id != ?`).bind(c,v.id).first())return e.redirect(`${a}?error=oauth_already_bound`);await e.env.DB.prepare(`UPDATE wl_Users SET ${x} = ?, updatedAt = datetime('now') WHERE id = ?`).bind(c,v.id).run();let we=await Q({id:v.id},g),ae=a.includes("?")?"&":"?";return e.redirect(`${a}${ae}token=${encodeURIComponent(we)}`)}}catch{}let h=null;if(x&&(h=await e.env.DB.prepare(`SELECT * FROM wl_Users WHERE ${x} = ?`).bind(c).first()),!h&&u&&(h=await e.env.DB.prepare("SELECT * FROM wl_Users WHERE email = ?").bind(u).first(),h&&x&&await e.env.DB.prepare(`UPDATE wl_Users SET ${x} = ?, updatedAt = datetime('now') WHERE id = ?`).bind(c,h.id).run()),!h){let _=((await e.env.DB.prepare("SELECT COUNT(*) as count FROM wl_Users").first())?.count||0)===0,A=u||`${t}_${c}@oauth.local`;await e.env.DB.prepare(`INSERT INTO wl_Users (display_name, email, password, type, url, avatar, ${x||"github"})
         VALUES (?, ?, '', ?, ?, ?, ?)`).bind(f||c,A,_?"administrator":"guest",m,p,c).run(),h=await e.env.DB.prepare("SELECT * FROM wl_Users WHERE email = ?").bind(A).first()}if(!h)return e.redirect(`${a}?error=oauth_create_failed`);if(h.type==="banned")return e.redirect(`${a}?error=account_banned`);if(!g)return e.redirect(`${a}?error=server_error`);let y=await Q({id:h.id},g),T=a.includes("?")?"&":"?";return e.redirect(`${a}${T}token=${encodeURIComponent(y)}`)}catch{return e.redirect(`${a}?error=oauth_error`)}});function Sn(e){return!e?.startsWith("/")||e.startsWith("//")?"/ui":e}function Ln(e){return{github:"github",twitter:"twitter",facebook:"facebook",google:"google",weibo:"weibo",qq:"qq"}[e]||null}var Cn=e=>{let t=new Uint8Array(e);return crypto.getRandomValues(t),{length:e,toString(n){if(n==="hex")return Array.from(t).map(a=>a.toString(16).padStart(2,"0")).join("");let r="";for(let a of t)r+=String.fromCharCode(a);return btoa(r)}}},St={randomBytes:Cn};var $e=null;function Dn(e){try{return crypto.getRandomValues(new Uint8Array(e))}catch{}try{return St.randomBytes(e)}catch{}if(!$e)throw Error("Neither WebCryptoAPI nor a crypto module is available. Use bcrypt.setRandomFallback to set an alternative");return $e(e)}function On(e){$e=e}function Fe(e,t){if(e=e||He,typeof e!="number")throw Error("Illegal arguments: "+typeof e+", "+typeof t);e<4?e=4:e>31&&(e=31);var n=[];return n.push("$2b$"),e<10&&n.push("0"),n.push(e.toString()),n.push("$"),n.push(ve(Dn(te),te)),n.join("")}function Nt(e,t,n){if(typeof t=="function"&&(n=t,t=void 0),typeof e=="function"&&(n=e,e=void 0),typeof e>"u")e=He;else if(typeof e!="number")throw Error("illegal arguments: "+typeof e);function r(a){R(function(){try{a(null,Fe(e))}catch(i){a(i)}})}if(n){if(typeof n!="function")throw Error("Illegal callback: "+typeof n);r(n)}else return new Promise(function(a,i){r(function(s,l){if(s){i(s);return}a(l)})})}function Mt(e,t){if(typeof t>"u"&&(t=He),typeof t=="number"&&(t=Fe(t)),typeof e!="string"||typeof t!="string")throw Error("Illegal arguments: "+typeof e+", "+typeof t);return Pe(e,t)}function Ut(e,t,n,r){function a(i){typeof e=="string"&&typeof t=="number"?Nt(t,function(s,l){Pe(e,l,i,r)}):typeof e=="string"&&typeof t=="string"?Pe(e,t,i,r):R(i.bind(this,Error("Illegal arguments: "+typeof e+", "+typeof t)))}if(n){if(typeof n!="function")throw Error("Illegal callback: "+typeof n);a(n)}else return new Promise(function(i,s){a(function(l,o){if(l){s(l);return}i(o)})})}function jt(e,t){for(var n=e.length^t.length,r=0;r<e.length;++r)n|=e.charCodeAt(r)^t.charCodeAt(r);return n===0}function Nn(e,t){if(typeof e!="string"||typeof t!="string")throw Error("Illegal arguments: "+typeof e+", "+typeof t);return t.length!==60?!1:jt(Mt(e,t.substring(0,t.length-31)),t)}function Mn(e,t,n,r){function a(i){if(typeof e!="string"||typeof t!="string"){R(i.bind(this,Error("Illegal arguments: "+typeof e+", "+typeof t)));return}if(t.length!==60){R(i.bind(this,null,!1));return}Ut(e,t.substring(0,29),function(s,l){s?i(s):i(null,jt(l,t))},r)}if(n){if(typeof n!="function")throw Error("Illegal callback: "+typeof n);a(n)}else return new Promise(function(i,s){a(function(l,o){if(l){s(l);return}i(o)})})}function Un(e){if(typeof e!="string")throw Error("Illegal arguments: "+typeof e);return parseInt(e.split("$")[2],10)}function jn(e){if(typeof e!="string")throw Error("Illegal arguments: "+typeof e);if(e.length!==60)throw Error("Illegal hash length: "+e.length+" != 60");return e.substring(0,29)}function Bn(e){if(typeof e!="string")throw Error("Illegal arguments: "+typeof e);return Bt(e)>72}var R=typeof setImmediate=="function"?setImmediate:typeof scheduler=="object"&&typeof scheduler.postTask=="function"?scheduler.postTask.bind(scheduler):setTimeout;function Bt(e){for(var t=0,n=0,r=0;r<e.length;++r)n=e.charCodeAt(r),n<128?t+=1:n<2048?t+=2:(n&64512)===55296&&(e.charCodeAt(r+1)&64512)===56320?(++r,t+=4):t+=3;return t}function $n(e){for(var t=0,n,r,a=new Array(Bt(e)),i=0,s=e.length;i<s;++i)n=e.charCodeAt(i),n<128?a[t++]=n:n<2048?(a[t++]=n>>6|192,a[t++]=n&63|128):(n&64512)===55296&&((r=e.charCodeAt(i+1))&64512)===56320?(n=65536+((n&1023)<<10)+(r&1023),++i,a[t++]=n>>18|240,a[t++]=n>>12&63|128,a[t++]=n>>6&63|128,a[t++]=n&63|128):(a[t++]=n>>12|224,a[t++]=n>>6&63|128,a[t++]=n&63|128);return a}var q="./ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(""),L=[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,54,55,56,57,58,59,60,61,62,63,-1,-1,-1,-1,-1,-1,-1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,-1,-1,-1,-1,-1,-1,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,-1,-1,-1,-1,-1];function ve(e,t){var n=0,r=[],a,i;if(t<=0||t>e.length)throw Error("Illegal len: "+t);for(;n<t;){if(a=e[n++]&255,r.push(q[a>>2&63]),a=(a&3)<<4,n>=t){r.push(q[a&63]);break}if(i=e[n++]&255,a|=i>>4&15,r.push(q[a&63]),a=(i&15)<<2,n>=t){r.push(q[a&63]);break}i=e[n++]&255,a|=i>>6&3,r.push(q[a&63]),r.push(q[i&63])}return r.join("")}function $t(e,t){var n=0,r=e.length,a=0,i=[],s,l,o,d,c,f;if(t<=0)throw Error("Illegal len: "+t);for(;n<r-1&&a<t&&(f=e.charCodeAt(n++),s=f<L.length?L[f]:-1,f=e.charCodeAt(n++),l=f<L.length?L[f]:-1,!(s==-1||l==-1||(c=s<<2>>>0,c|=(l&48)>>4,i.push(String.fromCharCode(c)),++a>=t||n>=r)||(f=e.charCodeAt(n++),o=f<L.length?L[f]:-1,o==-1)||(c=(l&15)<<4>>>0,c|=(o&60)>>2,i.push(String.fromCharCode(c)),++a>=t||n>=r)));)f=e.charCodeAt(n++),d=f<L.length?L[f]:-1,c=(o&3)<<6>>>0,c|=d,i.push(String.fromCharCode(c)),++a;var u=[];for(n=0;n<a;n++)u.push(i[n].charCodeAt(0));return u}var te=16,He=10,Pn=16,Fn=100,Lt=[608135816,2242054355,320440878,57701188,2752067618,698298832,137296536,3964562569,1160258022,953160567,3193202383,887688300,3232508343,3380367581,1065670069,3041331479,2450970073,2306472731],Ct=[3509652390,2564797868,805139163,3491422135,3101798381,1780907670,3128725573,4046225305,614570311,3012652279,134345442,2240740374,1667834072,1901547113,2757295779,4103290238,227898511,1921955416,1904987480,2182433518,2069144605,3260701109,2620446009,720527379,3318853667,677414384,3393288472,3101374703,2390351024,1614419982,1822297739,2954791486,3608508353,3174124327,2024746970,1432378464,3864339955,2857741204,1464375394,1676153920,1439316330,715854006,3033291828,289532110,2706671279,2087905683,3018724369,1668267050,732546397,1947742710,3462151702,2609353502,2950085171,1814351708,2050118529,680887927,999245976,1800124847,3300911131,1713906067,1641548236,4213287313,1216130144,1575780402,4018429277,3917837745,3693486850,3949271944,596196993,3549867205,258830323,2213823033,772490370,2760122372,1774776394,2652871518,566650946,4142492826,1728879713,2882767088,1783734482,3629395816,2517608232,2874225571,1861159788,326777828,3124490320,2130389656,2716951837,967770486,1724537150,2185432712,2364442137,1164943284,2105845187,998989502,3765401048,2244026483,1075463327,1455516326,1322494562,910128902,469688178,1117454909,936433444,3490320968,3675253459,1240580251,122909385,2157517691,634681816,4142456567,3825094682,3061402683,2540495037,79693498,3249098678,1084186820,1583128258,426386531,1761308591,1047286709,322548459,995290223,1845252383,2603652396,3431023940,2942221577,3202600964,3727903485,1712269319,422464435,3234572375,1170764815,3523960633,3117677531,1434042557,442511882,3600875718,1076654713,1738483198,4213154764,2393238008,3677496056,1014306527,4251020053,793779912,2902807211,842905082,4246964064,1395751752,1040244610,2656851899,3396308128,445077038,3742853595,3577915638,679411651,2892444358,2354009459,1767581616,3150600392,3791627101,3102740896,284835224,4246832056,1258075500,768725851,2589189241,3069724005,3532540348,1274779536,3789419226,2764799539,1660621633,3471099624,4011903706,913787905,3497959166,737222580,2514213453,2928710040,3937242737,1804850592,3499020752,2949064160,2386320175,2390070455,2415321851,4061277028,2290661394,2416832540,1336762016,1754252060,3520065937,3014181293,791618072,3188594551,3933548030,2332172193,3852520463,3043980520,413987798,3465142937,3030929376,4245938359,2093235073,3534596313,375366246,2157278981,2479649556,555357303,3870105701,2008414854,3344188149,4221384143,3956125452,2067696032,3594591187,2921233993,2428461,544322398,577241275,1471733935,610547355,4027169054,1432588573,1507829418,2025931657,3646575487,545086370,48609733,2200306550,1653985193,298326376,1316178497,3007786442,2064951626,458293330,2589141269,3591329599,3164325604,727753846,2179363840,146436021,1461446943,4069977195,705550613,3059967265,3887724982,4281599278,3313849956,1404054877,2845806497,146425753,1854211946,1266315497,3048417604,3681880366,3289982499,290971e4,1235738493,2632868024,2414719590,3970600049,1771706367,1449415276,3266420449,422970021,1963543593,2690192192,3826793022,1062508698,1531092325,1804592342,2583117782,2714934279,4024971509,1294809318,4028980673,1289560198,2221992742,1669523910,35572830,157838143,1052438473,1016535060,1802137761,1753167236,1386275462,3080475397,2857371447,1040679964,2145300060,2390574316,1461121720,2956646967,4031777805,4028374788,33600511,2920084762,1018524850,629373528,3691585981,3515945977,2091462646,2486323059,586499841,988145025,935516892,3367335476,2599673255,2839830854,265290510,3972581182,2759138881,3795373465,1005194799,847297441,406762289,1314163512,1332590856,1866599683,4127851711,750260880,613907577,1450815602,3165620655,3734664991,3650291728,3012275730,3704569646,1427272223,778793252,1343938022,2676280711,2052605720,1946737175,3164576444,3914038668,3967478842,3682934266,1661551462,3294938066,4011595847,840292616,3712170807,616741398,312560963,711312465,1351876610,322626781,1910503582,271666773,2175563734,1594956187,70604529,3617834859,1007753275,1495573769,4069517037,2549218298,2663038764,504708206,2263041392,3941167025,2249088522,1514023603,1998579484,1312622330,694541497,2582060303,2151582166,1382467621,776784248,2618340202,3323268794,2497899128,2784771155,503983604,4076293799,907881277,423175695,432175456,1378068232,4145222326,3954048622,3938656102,3820766613,2793130115,2977904593,26017576,3274890735,3194772133,1700274565,1756076034,4006520079,3677328699,720338349,1533947780,354530856,688349552,3973924725,1637815568,332179504,3949051286,53804574,2852348879,3044236432,1282449977,3583942155,3416972820,4006381244,1617046695,2628476075,3002303598,1686838959,431878346,2686675385,1700445008,1080580658,1009431731,832498133,3223435511,2605976345,2271191193,2516031870,1648197032,4164389018,2548247927,300782431,375919233,238389289,3353747414,2531188641,2019080857,1475708069,455242339,2609103871,448939670,3451063019,1395535956,2413381860,1841049896,1491858159,885456874,4264095073,4001119347,1565136089,3898914787,1108368660,540939232,1173283510,2745871338,3681308437,4207628240,3343053890,4016749493,1699691293,1103962373,3625875870,2256883143,3830138730,1031889488,3479347698,1535977030,4236805024,3251091107,2132092099,1774941330,1199868427,1452454533,157007616,2904115357,342012276,595725824,1480756522,206960106,497939518,591360097,863170706,2375253569,3596610801,1814182875,2094937945,3421402208,1082520231,3463918190,2785509508,435703966,3908032597,1641649973,2842273706,3305899714,1510255612,2148256476,2655287854,3276092548,4258621189,236887753,3681803219,274041037,1734335097,3815195456,3317970021,1899903192,1026095262,4050517792,356393447,2410691914,3873677099,3682840055,3913112168,2491498743,4132185628,2489919796,1091903735,1979897079,3170134830,3567386728,3557303409,857797738,1136121015,1342202287,507115054,2535736646,337727348,3213592640,1301675037,2528481711,1895095763,1721773893,3216771564,62756741,2142006736,835421444,2531993523,1442658625,3659876326,2882144922,676362277,1392781812,170690266,3921047035,1759253602,3611846912,1745797284,664899054,1329594018,3901205900,3045908486,2062866102,2865634940,3543621612,3464012697,1080764994,553557557,3656615353,3996768171,991055499,499776247,1265440854,648242737,3940784050,980351604,3713745714,1749149687,3396870395,4211799374,3640570775,1161844396,3125318951,1431517754,545492359,4268468663,3499529547,1437099964,2702547544,3433638243,2581715763,2787789398,1060185593,1593081372,2418618748,4260947970,69676912,2159744348,86519011,2512459080,3838209314,1220612927,3339683548,133810670,1090789135,1078426020,1569222167,845107691,3583754449,4072456591,1091646820,628848692,1613405280,3757631651,526609435,236106946,48312990,2942717905,3402727701,1797494240,859738849,992217954,4005476642,2243076622,3870952857,3732016268,765654824,3490871365,2511836413,1685915746,3888969200,1414112111,2273134842,3281911079,4080962846,172450625,2569994100,980381355,4109958455,2819808352,2716589560,2568741196,3681446669,3329971472,1835478071,660984891,3704678404,4045999559,3422617507,3040415634,1762651403,1719377915,3470491036,2693910283,3642056355,3138596744,1364962596,2073328063,1983633131,926494387,3423689081,2150032023,4096667949,1749200295,3328846651,309677260,2016342300,1779581495,3079819751,111262694,1274766160,443224088,298511866,1025883608,3806446537,1145181785,168956806,3641502830,3584813610,1689216846,3666258015,3200248200,1692713982,2646376535,4042768518,1618508792,1610833997,3523052358,4130873264,2001055236,3610705100,2202168115,4028541809,2961195399,1006657119,2006996926,3186142756,1430667929,3210227297,1314452623,4074634658,4101304120,2273951170,1399257539,3367210612,3027628629,1190975929,2062231137,2333990788,2221543033,2438960610,1181637006,548689776,2362791313,3372408396,3104550113,3145860560,296247880,1970579870,3078560182,3769228297,1714227617,3291629107,3898220290,166772364,1251581989,493813264,448347421,195405023,2709975567,677966185,3703036547,1463355134,2715995803,1338867538,1343315457,2802222074,2684532164,233230375,2599980071,2000651841,3277868038,1638401717,4028070440,3237316320,6314154,819756386,300326615,590932579,1405279636,3267499572,3150704214,2428286686,3959192993,3461946742,1862657033,1266418056,963775037,2089974820,2263052895,1917689273,448879540,3550394620,3981727096,150775221,3627908307,1303187396,508620638,2975983352,2726630617,1817252668,1876281319,1457606340,908771278,3720792119,3617206836,2455994898,1729034894,1080033504,976866871,3556439503,2881648439,1522871579,1555064734,1336096578,3548522304,2579274686,3574697629,3205460757,3593280638,3338716283,3079412587,564236357,2993598910,1781952180,1464380207,3163844217,3332601554,1699332808,1393555694,1183702653,3581086237,1288719814,691649499,2847557200,2895455976,3193889540,2717570544,1781354906,1676643554,2592534050,3230253752,1126444790,2770207658,2633158820,2210423226,2615765581,2414155088,3127139286,673620729,2805611233,1269405062,4015350505,3341807571,4149409754,1057255273,2012875353,2162469141,2276492801,2601117357,993977747,3918593370,2654263191,753973209,36408145,2530585658,25011837,3520020182,2088578344,530523599,2918365339,1524020338,1518925132,3760827505,3759777254,1202760957,3985898139,3906192525,674977740,4174734889,2031300136,2019492241,3983892565,4153806404,3822280332,352677332,2297720250,60907813,90501309,3286998549,1016092578,2535922412,2839152426,457141659,509813237,4120667899,652014361,1966332200,2975202805,55981186,2327461051,676427537,3255491064,2882294119,3433927263,1307055953,942726286,933058658,2468411793,3933900994,4215176142,1361170020,2001714738,2830558078,3274259782,1222529897,1679025792,2729314320,3714953764,1770335741,151462246,3013232138,1682292957,1483529935,471910574,1539241949,458788160,3436315007,1807016891,3718408830,978976581,1043663428,3165965781,1927990952,4200891579,2372276910,3208408903,3533431907,1412390302,2931980059,4132332400,1947078029,3881505623,4168226417,2941484381,1077988104,1320477388,886195818,18198404,3786409e3,2509781533,112762804,3463356488,1866414978,891333506,18488651,661792760,1628790961,3885187036,3141171499,876946877,2693282273,1372485963,791857591,2686433993,3759982718,3167212022,3472953795,2716379847,445679433,3561995674,3504004811,3574258232,54117162,3331405415,2381918588,3769707343,4154350007,1140177722,4074052095,668550556,3214352940,367459370,261225585,2610173221,4209349473,3468074219,3265815641,314222801,3066103646,3808782860,282218597,3406013506,3773591054,379116347,1285071038,846784868,2669647154,3771962079,3550491691,2305946142,453669953,1268987020,3317592352,3279303384,3744833421,2610507566,3859509063,266596637,3847019092,517658769,3462560207,3443424879,370717030,4247526661,2224018117,4143653529,4112773975,2788324899,2477274417,1456262402,2901442914,1517677493,1846949527,2295493580,3734397586,2176403920,1280348187,1908823572,3871786941,846861322,1172426758,3287448474,3383383037,1655181056,3139813346,901632758,1897031941,2986607138,3066810236,3447102507,1393639104,373351379,950779232,625454576,3124240540,4148612726,2007998917,544563296,2244738638,2330496472,2058025392,1291430526,424198748,50039436,29584100,3605783033,2429876329,2791104160,1057563949,3255363231,3075367218,3463963227,1469046755,985887462],Pt=[1332899944,1700884034,1701343084,1684370003,1668446532,1869963892];function ne(e,t,n,r){var a,i=e[t],s=e[t+1];return i^=n[0],a=r[i>>>24],a+=r[256|i>>16&255],a^=r[512|i>>8&255],a+=r[768|i&255],s^=a^n[1],a=r[s>>>24],a+=r[256|s>>16&255],a^=r[512|s>>8&255],a+=r[768|s&255],i^=a^n[2],a=r[i>>>24],a+=r[256|i>>16&255],a^=r[512|i>>8&255],a+=r[768|i&255],s^=a^n[3],a=r[s>>>24],a+=r[256|s>>16&255],a^=r[512|s>>8&255],a+=r[768|s&255],i^=a^n[4],a=r[i>>>24],a+=r[256|i>>16&255],a^=r[512|i>>8&255],a+=r[768|i&255],s^=a^n[5],a=r[s>>>24],a+=r[256|s>>16&255],a^=r[512|s>>8&255],a+=r[768|s&255],i^=a^n[6],a=r[i>>>24],a+=r[256|i>>16&255],a^=r[512|i>>8&255],a+=r[768|i&255],s^=a^n[7],a=r[s>>>24],a+=r[256|s>>16&255],a^=r[512|s>>8&255],a+=r[768|s&255],i^=a^n[8],a=r[i>>>24],a+=r[256|i>>16&255],a^=r[512|i>>8&255],a+=r[768|i&255],s^=a^n[9],a=r[s>>>24],a+=r[256|s>>16&255],a^=r[512|s>>8&255],a+=r[768|s&255],i^=a^n[10],a=r[i>>>24],a+=r[256|i>>16&255],a^=r[512|i>>8&255],a+=r[768|i&255],s^=a^n[11],a=r[s>>>24],a+=r[256|s>>16&255],a^=r[512|s>>8&255],a+=r[768|s&255],i^=a^n[12],a=r[i>>>24],a+=r[256|i>>16&255],a^=r[512|i>>8&255],a+=r[768|i&255],s^=a^n[13],a=r[s>>>24],a+=r[256|s>>16&255],a^=r[512|s>>8&255],a+=r[768|s&255],i^=a^n[14],a=r[i>>>24],a+=r[256|i>>16&255],a^=r[512|i>>8&255],a+=r[768|i&255],s^=a^n[15],a=r[s>>>24],a+=r[256|s>>16&255],a^=r[512|s>>8&255],a+=r[768|s&255],i^=a^n[16],e[t]=s^n[Pn+1],e[t+1]=i,e}function W(e,t){for(var n=0,r=0;n<4;++n)r=r<<8|e[t]&255,t=(t+1)%e.length;return{key:r,offp:t}}function Dt(e,t,n){for(var r=0,a=[0,0],i=t.length,s=n.length,l,o=0;o<i;o++)l=W(e,r),r=l.offp,t[o]=t[o]^l.key;for(o=0;o<i;o+=2)a=ne(a,0,t,n),t[o]=a[0],t[o+1]=a[1];for(o=0;o<s;o+=2)a=ne(a,0,t,n),n[o]=a[0],n[o+1]=a[1]}function Hn(e,t,n,r){for(var a=0,i=[0,0],s=n.length,l=r.length,o,d=0;d<s;d++)o=W(t,a),a=o.offp,n[d]=n[d]^o.key;for(a=0,d=0;d<s;d+=2)o=W(e,a),a=o.offp,i[0]^=o.key,o=W(e,a),a=o.offp,i[1]^=o.key,i=ne(i,0,n,r),n[d]=i[0],n[d+1]=i[1];for(d=0;d<l;d+=2)o=W(e,a),a=o.offp,i[0]^=o.key,o=W(e,a),a=o.offp,i[1]^=o.key,i=ne(i,0,n,r),r[d]=i[0],r[d+1]=i[1]}function Ot(e,t,n,r,a){var i=Pt.slice(),s=i.length,l;if(n<4||n>31)if(l=Error("Illegal number of rounds (4-31): "+n),r){R(r.bind(this,l));return}else throw l;if(t.length!==te)if(l=Error("Illegal salt length: "+t.length+" != "+te),r){R(r.bind(this,l));return}else throw l;n=1<<n>>>0;var o,d,c=0,f;typeof Int32Array=="function"?(o=new Int32Array(Lt),d=new Int32Array(Ct)):(o=Lt.slice(),d=Ct.slice()),Hn(t,e,o,d);function u(){if(a&&a(c/n),c<n)for(var m=Date.now();c<n&&(c=c+1,Dt(e,o,d),Dt(t,o,d),!(Date.now()-m>Fn)););else{for(c=0;c<64;c++)for(f=0;f<s>>1;f++)ne(i,f<<1,o,d);var x=[];for(c=0;c<s;c++)x.push((i[c]>>24&255)>>>0),x.push((i[c]>>16&255)>>>0),x.push((i[c]>>8&255)>>>0),x.push((i[c]&255)>>>0);if(r){r(null,x);return}else return x}r&&R(u)}if(typeof r<"u")u();else for(var p;;)if(typeof(p=u())<"u")return p||[]}function Pe(e,t,n,r){var a;if(typeof e!="string"||typeof t!="string")if(a=Error("Invalid string / salt: Not a string"),n){R(n.bind(this,a));return}else throw a;var i,s;if(t.charAt(0)!=="$"||t.charAt(1)!=="2")if(a=Error("Invalid salt version: "+t.substring(0,2)),n){R(n.bind(this,a));return}else throw a;if(t.charAt(2)==="$")i="\0",s=3;else{if(i=t.charAt(2),i!=="a"&&i!=="b"&&i!=="y"||t.charAt(3)!=="$")if(a=Error("Invalid salt revision: "+t.substring(2,4)),n){R(n.bind(this,a));return}else throw a;s=4}if(t.charAt(s+2)>"$")if(a=Error("Missing salt rounds"),n){R(n.bind(this,a));return}else throw a;var l=parseInt(t.substring(s,s+1),10)*10,o=parseInt(t.substring(s+1,s+2),10),d=l+o,c=t.substring(s+3,s+25);e+=i>="a"?"\0":"";var f=$n(e),u=$t(c,te);function p(m){var x=[];return x.push("$2"),i>="a"&&x.push(i),x.push("$"),d<10&&x.push("0"),x.push(d.toString()),x.push("$"),x.push(ve(u,u.length)),x.push(ve(m,Pt.length*4-1)),x.join("")}if(typeof n>"u")return p(Ot(f,u,d));Ot(f,u,d,function(m,x){m?n(m,null):n(null,p(x))},r)}function qn(e,t){return ve(e,t)}function Wn(e,t){return $t(e,t)}var Ft={setRandomFallback:On,genSaltSync:Fe,genSalt:Nt,hashSync:Mt,hash:Ut,compareSync:Nn,compare:Mn,getRounds:Un,getSalt:jn,truncates:Bn,encodeBase64:qn,decodeBase64:Wn};var Wt=1e5,Vn=16,Kn=32;async function qe(e){let t=crypto.getRandomValues(new Uint8Array(Vn)),n=await Kt(e,t),r=await crypto.subtle.exportKey("raw",n),a=new Uint8Array(r);return`$pbkdf2$${Wt}$${Ht(t)}$${Ht(a)}`}async function Vt(e,t){if(t.startsWith("$2a$")||t.startsWith("$2b$")||t.startsWith("$2y$"))return Ft.compareSync(e,t);if(t.startsWith("$P$")||t.startsWith("$H$")||!t.startsWith("$pbkdf2$"))return!1;let n=t.split("$");if(n.length!==5)return!1;let r=parseInt(n[2],10),a=qt(n[3]),i=qt(n[4]),s=await Kt(e,a,r),l=new Uint8Array(await crypto.subtle.exportKey("raw",s));if(l.length!==i.length)return!1;let o=0;for(let d=0;d<l.length;d++)o|=l[d]^i[d];return o===0}async function Kt(e,t,n=Wt){let r=await crypto.subtle.importKey("raw",new TextEncoder().encode(e),"PBKDF2",!1,["deriveBits","deriveKey"]);return crypto.subtle.deriveKey({name:"PBKDF2",salt:t,iterations:n,hash:"SHA-256"},r,{name:"HMAC",hash:"SHA-256",length:Kn*8},!0,["sign"])}function Ht(e){let t="";for(let n of e)t+=String.fromCharCode(n);return btoa(t)}function qt(e){let t=atob(e),n=new Uint8Array(t.length);for(let r=0;r<t.length;r++)n[r]=t.charCodeAt(r);return n}var Xt="ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";function Xn(e){let t="";for(let r of e)t+=r.toString(2).padStart(8,"0");let n="";for(let r=0;r<t.length;r+=5){let a=t.slice(r,r+5).padEnd(5,"0");n+=Xt[parseInt(a,2)]}return n}function zn(e){let t=e.replace(/=+$/,"").toUpperCase(),n="";for(let a of t){let i=Xt.indexOf(a);i!==-1&&(n+=i.toString(2).padStart(5,"0"))}let r=new Uint8Array(Math.floor(n.length/8));for(let a=0;a<r.length;a++)r[a]=parseInt(n.slice(a*8,a*8+8),2);return r}function zt(e=20){let t=new Uint8Array(e);return crypto.getRandomValues(t),Xn(t)}async function Gn(e,t){let n=await crypto.subtle.importKey("raw",e,{name:"HMAC",hash:"SHA-1"},!1,["sign"]),r=await crypto.subtle.sign("HMAC",n,t);return new Uint8Array(r)}async function Yn(e,t){let n=new ArrayBuffer(8),r=new DataView(n);r.setUint32(0,Math.floor(t/4294967296)),r.setUint32(4,t>>>0);let a=await Gn(e,new Uint8Array(n)),i=a[a.length-1]&15;return(((a[i]&127)<<24|(a[i+1]&255)<<16|(a[i+2]&255)<<8|a[i+3]&255)%1e6).toString().padStart(6,"0")}async function We(e,t,n=2){let r=zn(e),i=Math.floor(Date.now()/1e3/30);for(let s=-n;s<=n;s++)if(await Yn(r,i+s)===t)return!0;return!1}var j=new E;j.get("/",async e=>{let t=e.get("userInfo");return t?e.json({errno:0,errmsg:"",data:{objectId:t.objectId,display_name:t.display_name,email:t.email,type:t.type,url:t.url,avatar:S(t.avatar||await k(t.email),e.env.AVATAR_PROXY),label:t.label||"",github:t.github,twitter:t.twitter,facebook:t.facebook,google:t.google,weibo:t.weibo,qq:t.qq,"2fa":t["2fa"]?!0:void 0,mailMd5:await Z(t.email.toLowerCase())}}):e.json({errno:1,errmsg:"Unauthorized"},401)});j.post("/",async e=>{let t=await e.req.json(),{email:n,password:r}=t;if(!n||!r)return e.json({errno:1,errmsg:"email and password are required"},400);let a=await e.env.DB.prepare("SELECT * FROM wl_Users WHERE email = ?").bind(n).first();if(!a)return e.json({errno:1,errmsg:"Invalid credentials"},401);if(a.type==="banned")return e.json({errno:1,errmsg:"Invalid credentials"},401);if(!await Vt(r,a.password))return e.json({errno:1,errmsg:"Invalid credentials"},401);if(a["2fa"]){if(!t.code)return e.json({errno:1,errmsg:"2FA required",data:{"2fa":!0}},401);if(!await We(a["2fa"],t.code))return e.json({errno:1,errmsg:"Two factor auth verify failed, please try again"},401)}let s=e.env.JWT_SECRET;if(!s)return e.json({errno:1,errmsg:"JWT_SECRET not configured"},500);let l=await Q({id:a.id},s);return e.json({errno:0,errmsg:"",data:{token:l,objectId:a.id,display_name:a.display_name,email:a.email,type:a.type,url:a.url||"",avatar:S(a.avatar||await k(a.email),e.env.AVATAR_PROXY),label:a.label||"",mailMd5:await Z(a.email.toLowerCase())}})});j.delete("/",async e=>e.json({errno:0,errmsg:""}));j.get("/2fa",async e=>{let t=e.get("userInfo"),n=e.req.query("email");if(!t&&n){let i=await e.env.DB.prepare('SELECT "2fa" FROM wl_Users WHERE email = ?').bind(n).first();return e.json({errno:0,data:{enable:!!i&&!!i["2fa"]}})}if(!t)return e.json({errno:0,data:{enable:!1}});let r=`waline_${t.objectId}`;if(t["2fa"]&&t["2fa"].length===32)return e.json({errno:0,data:{otpauth_url:`otpauth://totp/${r}?secret=${t["2fa"]}`,secret:t["2fa"]}});let a=zt(20);return e.json({errno:0,data:{otpauth_url:`otpauth://totp/${r}?secret=${a}`,secret:a}})});j.post("/2fa",async e=>{let t=e.get("userInfo");if(!t)return e.json({errno:1,errmsg:"Unauthorized"},401);let{secret:n,code:r}=await e.req.json();return!n||!r||!/^\d{6}$/.test(r)?e.json({errno:1,errmsg:"Invalid 2FA code"},400):await We(n,r)?(await e.env.DB.prepare('UPDATE wl_Users SET "2fa" = ? WHERE id = ?').bind(n,t.objectId).run(),e.json({errno:0,errmsg:""})):e.json({errno:1,errmsg:"Two factor auth verify failed, please try again"},401)});var V=new E;V.get("/",async e=>{let n=e.get("userInfo")?.type==="administrator",r=e.req.query("email");if(n&&r){let l=await e.env.DB.prepare("SELECT id, display_name, email, type FROM wl_Users WHERE email = ?").bind(r).first();return l?e.json({errno:0,objectId:String(l.id),...l}):e.json({errno:0})}if(n){let l=Math.max(1,parseInt(e.req.query("page")||"1",10)||1),o=Math.min(100,Math.max(1,parseInt(e.req.query("pageSize")||"10",10)||10)),d=(l-1)*o,f=(await e.env.DB.prepare("SELECT COUNT(*) as count FROM wl_Users").first())?.count||0,u=await e.env.DB.prepare("SELECT id, display_name, email, type, url, avatar, label, createdAt FROM wl_Users ORDER BY createdAt DESC LIMIT ? OFFSET ?").bind(o,d).all();return e.json({errno:0,errmsg:"",data:{page:l,pageSize:o,totalPages:Math.ceil(f/o),data:await Promise.all(u.results.map(p=>Ve(p,e.env)))}})}let a=Math.min(50,Math.max(1,parseInt(e.req.query("count")||"10",10)||10)),i=await e.env.DB.prepare(`SELECT u.id, u.display_name, u.email, u.url, u.avatar, u.label,
            COUNT(c.id) as comment_count
     FROM wl_Users u
     LEFT JOIN wl_Comment c ON c.user_id = u.id AND c.status = 'approved'
     GROUP BY u.id
     ORDER BY comment_count DESC
     LIMIT ?`).bind(a).all(),s=he(e.env.LEVELS);return e.json({errno:0,errmsg:"",data:await Promise.all(i.results.map(async l=>({objectId:l.id,display_name:l.display_name,url:l.url||"",avatar:S(l.avatar||await k(l.email||""),e.env.AVATAR_PROXY),label:l.label||"",count:l.comment_count,...s?{level:ge(l.comment_count,s)}:{}})))})});V.post("/",async e=>{let t=await e.req.json(),{display_name:n,email:r,password:a,url:i}=t;if(!r||!a)return e.json({errno:1,errmsg:"email and password are required"},400);if(await e.env.DB.prepare("SELECT id FROM wl_Users WHERE email = ?").bind(r).first())return e.json({errno:1,errmsg:"Registration failed"},409);let o=((await e.env.DB.prepare("SELECT COUNT(*) as count FROM wl_Users").first())?.count||0)===0,d=await qe(a);await e.env.DB.prepare(`INSERT INTO wl_Users (display_name, email, password, type, url)
     VALUES (?, ?, ?, ?, ?)`).bind(n||r.split("@")[0],r,d,o?"administrator":"guest",i||"").run();let c=await e.env.DB.prepare("SELECT id, display_name, email, type, url, avatar FROM wl_Users WHERE email = ?").bind(r).first();return e.json({errno:0,errmsg:"",data:await Ve(c,e.env)},201)});V.put("/:id",async e=>{let t=e.req.param("id"),n=e.get("userInfo");if(!n)return e.json({errno:1,errmsg:"Unauthorized"},401);let r=n.type==="administrator",a=n.objectId===parseInt(t,10);if(!r&&!a)return e.json({errno:1,errmsg:"Forbidden"},403);let i=await e.req.json(),s=[],l=[],o=["display_name","url","avatar","label"];for(let c of o)i[c]!==void 0&&(s.push(`${c} = ?`),l.push(i[c]));if(i.password&&(s.push("password = ?"),l.push(await qe(i.password))),r&&i.type!==void 0&&(s.push("type = ?"),l.push(i.type)),s.length===0)return e.json({errno:1,errmsg:"No fields to update"},400);s.push("updatedAt = datetime('now')"),l.push(t),await e.env.DB.prepare(`UPDATE wl_Users SET ${s.join(", ")} WHERE id = ?`).bind(...l).run();let d=await e.env.DB.prepare("SELECT id, display_name, email, type, url, avatar, label FROM wl_Users WHERE id = ?").bind(t).first();return e.json({errno:0,errmsg:"",data:await Ve(d,e.env)})});V.delete("/:id",async e=>{let t=e.req.param("id");if(e.get("userInfo")?.type!=="administrator")return e.json({errno:1,errmsg:"Unauthorized"},403);let r=await e.env.DB.prepare("SELECT type FROM wl_Users WHERE id = ?").bind(t).first();return r?(r.type.startsWith("verify:")||r.type==="guest"?await e.env.DB.prepare("DELETE FROM wl_Users WHERE id = ?").bind(t).run():await e.env.DB.prepare("UPDATE wl_Users SET type = 'banned', updatedAt = datetime('now') WHERE id = ?").bind(t).run(),e.json({errno:0,errmsg:""})):e.json({errno:1,errmsg:"User not found"},404)});async function Ve(e,t){return e?{objectId:e.id,display_name:e.display_name||"",email:e.email||"",type:e.type||"guest",url:e.url||"",avatar:S(e.avatar||await k(e.email||""),t.AVATAR_PROXY),label:e.label||""}:null}async function Ke(e,t){let n=await O(e.DB,["worker_display","waline_admin_version"]).catch(()=>({})),r=n.worker_display||"admin",a=(n.waline_admin_version||"latest").trim(),i=new URL(t),s=`${i.origin}/api/`,l=e.SITE_NAME||"",o=e.SITE_URL||"",d=e.RECAPTCHA_V3_KEY||"",c=e.TURNSTILE_KEY||"",f=i.origin,u=r!=="disabled",p=r==="always",m=a.replace(/^npm:@waline\/admin@?/,"").replace(/^@/,"").trim(),x=m&&m!=="latest"?`//unpkg.com/@waline/admin@${m}`:"//unpkg.com/@waline/admin";return`<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Waline Management System</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
${u?"  <style>.wk-badge{display:inline-block;margin-right:8px;padding:1px 8px;background:#f97316;color:#fff;font-size:11px;border-radius:10px;vertical-align:middle;font-weight:normal;letter-spacing:.5px;line-height:18px}</style>":""}
  <!-- Avatar fallback: data APIs already return cn.cravatar.com, but @waline/admin
       is loaded from CDN and may rebuild gravatar URLs from mailMd5. Rewrite any
       gravatar.com/avatar/ image to the accessible mirror so the panel never shows
       broken images. This is served by the Worker, not by the blog frontend. -->
  <script>
  (function(){
    var FROM = 'gravatar.com/avatar/', TO = 'cn.cravatar.com/avatar/';
    function fixImg(n){
      if(!n || n.nodeType !== 1 || n.tagName !== 'IMG') return;
      var s = n.getAttribute('src') || '';
      if(s.indexOf(FROM) !== -1) n.src = s.replace(FROM, TO);
    }
    function sweep(){
      var imgs = document.querySelectorAll('img[src*="' + FROM + '"]');
      for(var i=0;i<imgs.length;i++) fixImg(imgs[i]);
    }
    try {
      new MutationObserver(function(muts){
        for(var i=0;i<muts.length;i++){
          var m = muts[i];
          if(m.type === 'attributes') fixImg(m.target);
          else if(m.addedNodes) for(var j=0;j<m.addedNodes.length;j++) fixImg(m.addedNodes[j]);
        }
      }).observe(document.documentElement, {childList:true, subtree:true, attributes:true, attributeFilter:['src']});
    } catch(e) {}
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', sweep);
    setInterval(sweep, 2000);
  })();
  </script>
</head>
<body>
  <script>
    window.serverURL = ${JSON.stringify(s)};
    window.SITE_NAME = ${JSON.stringify(l||void 0)};
    window.SITE_URL = ${JSON.stringify(o||void 0)};
    window.recaptchaV3Key = ${JSON.stringify(d||void 0)};
    window.turnstileKey = ${JSON.stringify(c||void 0)};
  </script>
  <!-- Block @waline/vercel upgrade notification: irrelevant for Workers deployment.
       The admin header fetches registry.npmjs.org to compare x-waline-version against
       the latest @waline/vercel release. Intercepting that request prevents the popup. -->
  <script>
  (function(){
    var _fetch = window.fetch;
    window.fetch = function(input, init) {
      var url = typeof input === 'string' ? input : (input instanceof Request ? input.url : '');
      if (url.indexOf('registry.npmjs.org/@waline/vercel') !== -1) {
        return Promise.resolve(new Response('{}', {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }));
      }
      return _fetch.call(this, input, init);
    };
  })();
  </script>
  <script src="${x}"></script>
${u?`  <script>
  (function(){
    var ORIGIN = ${JSON.stringify(f)};
    var ALWAYS = ${JSON.stringify(p)};
    var menuDone = false, badgeDone = false;

    function addBadge() {
      if (badgeDone) return;
      var op = document.querySelector('.typecho-head-nav .operate');
      if (!op) return;
      badgeDone = true;
      var s = document.createElement('span');
      s.className = 'wk-badge';
      s.textContent = 'Worker v1.1.0';
      op.insertBefore(s, op.firstChild);
    }

    function addMenu() {
      if (menuDone) return;
      menuDone = true;
      var fab = document.createElement('a');
      fab.href = '/ui/worker-setting';
      fab.title = 'Worker 设置';
      fab.setAttribute('aria-label', 'Worker 设置');
      fab.onclick = function(e) {
        e.preventDefault();
        window.location.href = this.href;
      };
      fab.style.cssText = [
        'position:fixed',
        'bottom:24px',
        'right:24px',
        'width:44px',
        'height:44px',
        'border-radius:50%',
        'background:#f97316',
        'display:flex',
        'align-items:center',
        'justify-content:center',
        'text-decoration:none',
        'box-shadow:0 2px 8px rgba(0,0,0,.28)',
        'z-index:9999',
        'transition:transform .15s,box-shadow .15s',
        'user-select:none',
      ].join(';');
      var img = document.createElement('img');
      img.src = 'https://waline.js.org/logo.png';
      img.alt = '';
      img.style.cssText = 'width:28px;height:28px;filter:brightness(0) invert(1)';
      fab.appendChild(img);
      fab.addEventListener('mouseenter', function(){ fab.style.transform='scale(1.12)'; fab.style.boxShadow='0 4px 16px rgba(0,0,0,.35)'; });
      fab.addEventListener('mouseleave', function(){ fab.style.transform=''; fab.style.boxShadow='0 2px 8px rgba(0,0,0,.28)'; });
      document.body.appendChild(fab);
    }

    function tryInject() {
      if (ALWAYS && !badgeDone) addBadge();
      if (menuDone && badgeDone) return;
      var tk = window.TOKEN || localStorage.getItem('TOKEN') || sessionStorage.getItem('TOKEN');
      if (!tk && !ALWAYS) return;
      if (tk && !menuDone) {
        fetch(ORIGIN + '/api/token', {
          headers: { Authorization: 'Bearer ' + tk }
        }).then(function(r){ return r.json(); }).then(function(d){
          if (d.errno === 0 && d.data && d.data.type === 'administrator') {
            addMenu();
            addBadge();
          }
        }).catch(function(){});
      }
    }

    var ob = new MutationObserver(function(){ tryInject(); });
    ob.observe(document.body, { childList: true, subtree: true });
    var iv = setInterval(function(){ tryInject(); if (menuDone) clearInterval(iv); }, 2000);
    setTimeout(tryInject, 500);
  })();
  </script>`:""}
</body>
</html>`}function Gt(e){let n=new URL(e).origin;return`<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Worker Settings</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
*{box-sizing:border-box}
body{margin:0;font:87.5%/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#f5f5f5;color:#333}
a{color:#f97316;text-decoration:none}a:hover{color:#ea580c}

/* Header — matching @waline/admin 0.34.0 */
.typecho-head-nav{background:#1e293b;padding:0 16px;height:52px;display:flex;align-items:center}
.typecho-head-nav .waline-header{display:flex;align-items:center;justify-content:space-between;width:100%;max-width:1024px;margin:0 auto}
.typecho-head-nav .brand{display:flex;align-items:center;gap:10px;color:#fff;font-size:15px;font-weight:600}
.typecho-head-nav .brand-mark{display:inline-block;width:44px;height:44px;background:url('https://waline.js.org/logo.png') no-repeat center/cover;filter:brightness(0) saturate(100%) invert(55%) sepia(98%) saturate(2021%) hue-rotate(346deg) brightness(98%) contrast(97%)}
.typecho-head-nav .nav-links{display:flex;align-items:center;gap:12px}
.typecho-head-nav .nav-links a{color:#94a3b8;font-size:13px;padding:6px 14px;border-radius:6px;transition:background .15s}
.typecho-head-nav .nav-links a:hover{color:#e2e8f0;background:rgba(255,255,255,.08)}

/* Language toggle buttons */
.lang-toggle{display:flex;border-radius:6px;overflow:hidden;border:1px solid #475569}
.lang-toggle button{padding:4px 10px;font-size:12px;line-height:18px;border:none;background:#334155;color:#94a3b8;cursor:pointer;transition:all .15s}
.lang-toggle button.active{background:#f97316;color:#fff}
.lang-toggle button:hover:not(.active){color:#e2e8f0;background:rgba(255,255,255,.06)}

/* Content */
.container{max-width:1024px;margin:24px auto;padding:0 16px}

/* Tab bar */
.tabs{display:flex;gap:0;margin-bottom:-1px}
.tab-btn{padding:10px 20px;font-size:13px;border:none;background:#e2e8f0;color:#64748b;cursor:pointer;border-radius:8px 8px 0 0;transition:all .15s}
.tab-btn.active{background:#fff;color:#1e293b;font-weight:600;box-shadow:0 -2px 6px rgba(0,0,0,.04)}
.tab-btn:hover:not(.active){color:#334155;background:#cbd5e1}

/* Tab panels */
.tab-panel{background:#fff;border-radius:0 8px 8px 8px;padding:28px;display:none;box-shadow:0 1px 3px rgba(0,0,0,.06)}
.tab-panel.active{display:block}

/* Section heading */
.section-heading{font-size:13px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;margin:0 0 16px;padding-bottom:8px;border-bottom:1px solid #f1f5f9}

/* Form field */
.field{margin-bottom:22px}
.field-label{display:block;font-size:13px;font-weight:600;color:#334155;margin-bottom:6px}
.field-hint{font-size:12px;color:#94a3b8;margin-top:4px;line-height:1.5}
.field-hint code{background:#f1f5f9;padding:1px 6px;border-radius:4px;font-size:12px;color:#ea580c}

input[type="text"],input[type="url"],textarea,select{
  width:100%;max-width:480px;background:#fff;border:1px solid #e2e8f0;padding:8px 12px;
  border-radius:6px;font-size:13px;font-family:inherit;outline:none;transition:border-color .15s
}
input[type="text"]:focus,input[type="url"]:focus,textarea:focus,select:focus{border-color:#f97316}
input:disabled,select:disabled,textarea:disabled{background:#f8fafc;color:#94a3b8;cursor:not-allowed}
textarea{resize:vertical;min-height:80px;line-height:1.5}
select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%2712%27%3E%3Cpath d=%27M2 4l4 4 4-4%27 fill=%27none%27 stroke=%27%2394a3b8%27 stroke-width=%271.5%27/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 10px center;padding-right:32px}

/* Version picker */
.version-row{display:flex;align-items:center;gap:8px}
.version-row input{flex:1;max-width:260px}
.version-row select{flex:0 0 auto;max-width:180px}
.version-row .btn{flex:0 0 auto}

/* Toggle */
.toggle-row{display:flex;align-items:center;gap:10px}
.toggle{position:relative;display:inline-block;width:38px;height:22px;cursor:pointer}
.toggle input{opacity:0;width:0;height:0}
.toggle-slider{position:absolute;inset:0;background:#cbd5e1;border-radius:22px;transition:.2s}
.toggle-slider:before{content:"";position:absolute;height:16px;width:16px;left:3px;bottom:3px;background:#fff;border-radius:50%;transition:.2s}
.toggle input:checked+.toggle-slider{background:#f97316}
.toggle input:checked+.toggle-slider:before{transform:translateX(16px)}
.toggle-label{font-size:13px;color:#475569}

/* Buttons */
.btn{padding:8px 16px;border:none;border-radius:6px;font-size:13px;font-family:inherit;cursor:pointer;transition:all .15s}
.btn-primary{background:#f97316;color:#fff}
.btn-primary:hover{background:#ea580c}
.btn-secondary{background:#f1f5f9;color:#475569}
.btn-secondary:hover{background:#e2e8f0}
.btn-xs{padding:4px 10px;font-size:12px}
.actions{margin-top:24px;display:flex;gap:10px}

/* Toast */
.toast{position:fixed;top:20px;right:20px;padding:10px 18px;border-radius:8px;font-size:13px;z-index:9999;animation:slideIn .25s ease;box-shadow:0 4px 12px rgba(0,0,0,.12)}
.toast-ok{background:#ecfdf5;color:#065f46;border:1px solid #a7f3d0}
.toast-err{background:#fef2f2;color:#991b1b;border:1px solid #fecaca}
@keyframes slideIn{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}

/* Spinner */
.spinner{display:inline-block;width:14px;height:14px;border:2px solid #e2e8f0;border-top-color:#f97316;border-radius:50%;animation:spin .6s linear infinite;vertical-align:middle;margin-left:6px}
@keyframes spin{to{transform:rotate(360deg)}}

/* Auth */
#auth-loading{display:flex;align-items:center;justify-content:center;height:200px;color:#94a3b8;font-size:14px;gap:8px}
/* Hide main content by class so inline style can override it */
#main-content.hidden{display:none}
</style>
</head>
<body>
<script>
window.__I18N = {
  'zh-CN': {
    title: 'Worker 设置',
    loading: '正在验证权限…',
    back: '← 返回管理面板',
    tabFrontend: '前端版本',
    tabComment: '评论策略',
    clientVersionLabel: '@waline/client CDN 版本',
    clientVersionHint: '输入版本号（如 <code>v3</code>），留空默认使用 <code>latest</code>。',
    adminVersionLabel: '@waline/admin CDN 版本',
    adminVersionHint: '输入版本号（如 <code>0.34.1</code>），留空默认使用 <code>latest</code>。',
    workerDisplayLabel: 'Worker 信息显示',
    workerDisplayAlways: '始终显示',
    workerDisplayAdmin: '仅管理员登录',
    workerDisplayDisabled: '禁用',
    workerDisplayHint: '控制 Waline on Worker 标识的可见性。「始终」对所有人可见，「仅管理员」仅管理员登录后可见，「禁用」完全隐藏。',
    defaultStatus: '默认状态',
    anonymousStatusLabel: '匿名评论默认状态',
    anonymousStatusHint: '未登录用户发表评论的默认状态。此设置优先于环境变量 AUDIT。',
    userStatusLabel: '已登录用户评论默认状态',
    userStatusHint: '已登录用户发表评论的默认状态。',
    approved: '直接通过 (approved)',
    waiting: '等待审核 (waiting)',
    spamReview: '反垃圾评论',
    spamModeLabel: '反垃圾模式',
    spamModeHint: '「关」不检测；「Akismet」使用 Akismet 服务；「LLM」使用大模型；「Mix」两者并用，任一判定为垃圾则标记。',
    spamOff: '关',
    akismetKeyLabel: 'Akismet API Key',
    akismetKeyHint: '在此输入密钥，或通过 <strong>AKISMET_KEY</strong> 环境变量（<code>wrangler secret put AKISMET_KEY</code>）设置。环境变量优先级高于此处填写的值。',
    llmSkipAdminLabel: '管理员跳过 LLM 审查',
    llmSkipAdminToggle: '管理员发表的评论跳过 LLM 审查（默认开启）',
    llmEndpointLabel: 'API Endpoint',
    llmEndpointHint: 'OpenAI 兼容的 Chat Completions 端点',
    llmKeyLabel: 'API Key',
    llmModelLabel: 'Model',
    llmPromptLabel: 'System Prompt',
    llmFallbackHint: 'LLM 调用失败时，将遵循对应的评论默认状态设置。',
    testBtn: '测试 LLM 连接',
    saveBtn: '保存设置',
    refreshBtn: '↻ 刷新',
    chooseVersion: '选择版本…',
    versionsRefreshed: '版本列表已刷新',
    adminVersionsRefreshed: 'Admin 版本列表已刷新',
    fetchFailed: '获取版本失败: {msg}',
    loadFailed: '加载设置失败',
    saveOk: '设置已保存！',
    saveFailed: '保存失败',
    unauthorized: '权限不足，正在跳转登录页…',
    authFailed: '验证失败，请刷新重试。',
    llmOk: 'LLM 连接正常！',
    llmFail: '失败: {code}',
    llmError: '错误: {msg}',
    envOverride: '此设置被环境变量 / wrangler secret 覆盖',
    akismetLink: '申请地址：',
  },
  en: {
    title: 'Worker Settings',
    loading: 'Verifying permissions…',
    back: '← Back to Dashboard',
    tabFrontend: 'Frontend Versions',
    tabComment: 'Comment Policy',
    clientVersionLabel: '@waline/client CDN Version',
    clientVersionHint: 'Enter a version (e.g. <code>v3</code>). Leave blank to use <code>latest</code>.',
    adminVersionLabel: '@waline/admin CDN Version',
    adminVersionHint: 'Enter a version (e.g. <code>0.34.1</code>). Leave blank to use <code>latest</code>.',
    workerDisplayLabel: 'Worker Branding',
    workerDisplayAlways: 'Always Visible',
    workerDisplayAdmin: 'Admin Only',
    workerDisplayDisabled: 'Disabled',
    workerDisplayHint: 'Controls visibility of the Waline on Worker badge.',
    defaultStatus: 'Default Status',
    anonymousStatusLabel: 'Anonymous Comment Default',
    anonymousStatusHint: 'Default status for comments from unauthenticated users. Takes precedence over the AUDIT env var.',
    userStatusLabel: 'Authenticated User Comment Default',
    userStatusHint: 'Default status for comments from logged-in users.',
    approved: 'Approved',
    waiting: 'Pending Review (waiting)',
    spamReview: 'Spam Review',
    spamModeLabel: 'Spam Detection Mode',
    spamModeHint: '"Off" — no detection; "Akismet" — Akismet only; "LLM" — LLM only; "Mix" — both, mark as spam if either flags it.',
    spamOff: 'Off',
    akismetKeyLabel: 'Akismet API Key',
    akismetKeyHint: 'Enter the key here, or set <strong>AKISMET_KEY</strong> env var (<code>wrangler secret put AKISMET_KEY</code>). Env var takes precedence.',
    llmSkipAdminLabel: 'Skip Admin LLM Review',
    llmSkipAdminToggle: 'Skip LLM review for admin comments (enabled by default)',
    llmEndpointLabel: 'API Endpoint',
    llmEndpointHint: 'OpenAI-compatible Chat Completions endpoint',
    llmKeyLabel: 'API Key',
    llmModelLabel: 'Model',
    llmPromptLabel: 'System Prompt',
    llmFallbackHint: 'If the LLM call fails, the corresponding default comment status is used.',
    testBtn: 'Test LLM Connection',
    saveBtn: 'Save Settings',
    refreshBtn: '↻ Refresh',
    chooseVersion: 'Choose version…',
    versionsRefreshed: 'Version list refreshed',
    adminVersionsRefreshed: 'Admin version list refreshed',
    fetchFailed: 'Failed to fetch versions: {msg}',
    loadFailed: 'Failed to load settings',
    saveOk: 'Settings saved!',
    saveFailed: 'Failed to save',
    unauthorized: 'Access denied. Redirecting to login…',
    authFailed: 'Verification failed. Please refresh.',
    llmOk: 'LLM connection OK!',
    llmFail: 'Failed: {code}',
    llmError: 'Error: {msg}',
    envOverride: 'Overridden by environment variable / wrangler secret',
    akismetLink: 'Get a key at ',
  }
};
</script>

<!-- Header -->
<header class="typecho-head-nav">
  <div class="waline-header">
    <div class="brand">
      <span class="brand-mark"></span>
      <span data-i18n="title">Worker Settings</span>
    </div>
    <div class="nav-links">
      <div class="lang-toggle">
        <button data-lang="zh-CN" class="active">中</button>
        <button data-lang="en">EN</button>
      </div>
      <a href="/ui" data-i18n="back">← Back to Dashboard</a>
    </div>
  </div>
</header>

<div id="auth-loading">
  <span class="spinner"></span>
  <span data-i18n="loading">Verifying permissions…</span>
</div>

<div id="main-content" class="hidden">
<div class="container">
  <div class="tabs" id="tabs">
    <button class="tab-btn active" data-tab="frontend" data-i18n="tabFrontend">Frontend Versions</button>
    <button class="tab-btn" data-tab="comment" data-i18n="tabComment">Comment Policy</button>
  </div>

  <div class="tab-panel active" id="tab-frontend">
    <div class="field">
      <label class="field-label" data-i18n="clientVersionLabel">@waline/client CDN Version</label>
      <div class="version-row">
        <input type="text" id="set-version" placeholder="v3" />
        <select id="version-select">
          <option value="">Choose version…</option>
          <option value="latest">latest</option>
        </select>
        <button class="btn btn-secondary btn-xs" id="refresh-versions" data-i18n-title="refreshBtn">↻ Refresh</button>
      </div>
      <p class="field-hint" data-i18n-html="clientVersionHint">Enter a version (e.g. <code>v3</code>). Leave blank to use <code>latest</code>.</p>
    </div>
    <div class="field">
      <label class="field-label" data-i18n="adminVersionLabel">@waline/admin CDN Version</label>
      <div class="version-row">
        <input type="text" id="set-admin-version" placeholder="latest" />
        <select id="admin-version-select">
          <option value="">Choose version…</option>
          <option value="latest">latest</option>
        </select>
        <button class="btn btn-secondary btn-xs" id="refresh-admin-versions" data-i18n-title="refreshBtn">↻ Refresh</button>
      </div>
      <p class="field-hint" data-i18n-html="adminVersionHint">Enter a version (e.g. <code>0.34.1</code>). Leave blank to use <code>latest</code>.</p>
    </div>
    <div class="field">
      <label class="field-label" data-i18n="workerDisplayLabel">Worker Branding</label>
      <select id="set-worker-display">
        <option value="always" data-i18n="workerDisplayAlways">Always Visible</option>
        <option value="admin" selected data-i18n="workerDisplayAdmin">Admin Only</option>
        <option value="disabled" data-i18n="workerDisplayDisabled">Disabled</option>
      </select>
      <p class="field-hint" data-i18n="workerDisplayHint">Controls visibility of the Waline on Worker badge.</p>
    </div>
  </div>

  <div class="tab-panel" id="tab-comment">
    <h4 class="section-heading" data-i18n="defaultStatus">Default Status</h4>
    <div class="field">
      <label class="field-label" data-i18n="anonymousStatusLabel">Anonymous Comment Default</label>
      <select id="set-comment-status">
        <option value="approved" data-i18n="approved">Approved</option>
        <option value="waiting" data-i18n="waiting">Pending Review (waiting)</option>
      </select>
      <p class="field-hint" data-i18n="anonymousStatusHint">Default status for comments from unauthenticated users.</p>
    </div>
    <div class="field">
      <label class="field-label" data-i18n="userStatusLabel">Authenticated User Comment Default</label>
      <select id="set-user-comment-status">
        <option value="approved" data-i18n="approved">Approved</option>
        <option value="waiting" data-i18n="waiting">Pending Review (waiting)</option>
      </select>
      <p class="field-hint" data-i18n="userStatusHint">Default status for comments from logged-in users.</p>
    </div>

    <h4 class="section-heading" data-i18n="spamReview">Spam Review</h4>
    <div class="field">
      <label class="field-label" data-i18n="spamModeLabel">Spam Detection Mode</label>
      <select id="set-spam-mode">
        <option value="off" data-i18n="spamOff">Off</option>
        <option value="akismet">Akismet</option>
        <option value="llm">LLM</option>
        <option value="mix">Mix (Akismet + LLM)</option>
      </select>
      <p class="field-hint" data-i18n="spamModeHint">Select the spam detection method.</p>
    </div>

    <div id="section-akismet" style="display:none">
      <div class="field">
        <label class="field-label" data-i18n="akismetKeyLabel">Akismet API Key</label>
        <input type="text" id="set-akismet-key" placeholder="xxxxxxxxxxxx" />
        <p class="field-hint"><span data-i18n="akismetKeyHint">Enter the key here.</span> <span data-i18n="akismetLink">Get a key at </span><a href="https://akismet.com" target="_blank" rel="noopener">akismet.com</a></p>
      </div>
    </div>

    <div id="section-llm" style="display:none">
      <div class="field">
        <label class="field-label" data-i18n="llmSkipAdminLabel">Skip Admin LLM Review</label>
        <div class="toggle-row">
          <label class="toggle"><input type="checkbox" id="set-llm-skip-admin" checked /><span class="toggle-slider"></span></label>
          <span class="toggle-label" data-i18n="llmSkipAdminToggle">Skip LLM review for admin comments</span>
        </div>
      </div>
      <div class="field">
        <label class="field-label" data-i18n="llmEndpointLabel">API Endpoint</label>
        <input type="url" id="set-llm-ep" placeholder="https://api.openai.com/v1/chat/completions" />
        <p class="field-hint" data-i18n="llmEndpointHint">OpenAI-compatible Chat Completions endpoint</p>
      </div>
      <div class="field">
        <label class="field-label" data-i18n="llmKeyLabel">API Key</label>
        <input type="text" id="set-llm-key" placeholder="sk-..." />
      </div>
      <div class="field">
        <label class="field-label" data-i18n="llmModelLabel">Model</label>
        <input type="text" id="set-llm-model" placeholder="gpt-4o-mini" />
      </div>
      <div class="field">
        <label class="field-label" data-i18n="llmPromptLabel">System Prompt</label>
        <textarea id="set-llm-prompt" rows="5" placeholder="You are a review bot. Output a single word: approved or spam."></textarea>
      </div>
      <p class="field-hint" style="margin-top:16px" data-i18n="llmFallbackHint">If the LLM call fails, the corresponding default comment status is used.</p>
      <div style="margin-top:12px">
        <button class="btn btn-secondary btn-xs" id="test-btn" data-i18n="testBtn">Test LLM Connection</button>
      </div>
    </div>
  </div>

  <div class="actions">
    <button class="btn btn-primary" id="save-btn" data-i18n="saveBtn">Save Settings</button>
  </div>
</div>
</div>

<script>
(function(){
  var API = ${JSON.stringify(n)};

  var currentLang = 'zh-CN';
  var SETTINGS_DATA = null;

  function t(key) { return window.__I18N[currentLang][key] || key; }

  var langBtns = document.querySelectorAll('.lang-toggle button');
  function applyLang(lang) {
    currentLang = lang;
    langBtns.forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-lang') === lang); });
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var k = el.getAttribute('data-i18n');
      if (k && !el.hasAttribute('data-i18n-html')) el.textContent = t(k);
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function(el){
      var k = el.getAttribute('data-i18n-html');
      if (k) el.innerHTML = t(k);
    });
    document.querySelectorAll('[data-i18n-title]').forEach(function(el){
      var k = el.getAttribute('data-i18n-title');
      if (k) el.title = t(k);
    });
    document.querySelectorAll('#version-select option:first-child').forEach(function(o){ o.textContent = t('chooseVersion'); });
    document.querySelectorAll('#admin-version-select option:first-child').forEach(function(o){ o.textContent = t('chooseVersion'); });
    // Re-populate form with settings data
    if (SETTINGS_DATA) populateForm(SETTINGS_DATA);
  }
  langBtns.forEach(function(b){ b.addEventListener('click', function(){ applyLang(b.getAttribute('data-lang')); }); });

  var navLang = (navigator.language || 'en').toLowerCase();
  applyLang(navLang.startsWith('zh') ? 'zh-CN' : 'en');

  function esc(s) { if (!s) return ''; var d = document.createElement('div'); d.textContent = String(s); return d.innerHTML; }

  function toast(msg, ok) {
    var el = document.createElement('div');
    el.className = 'toast ' + (ok ? 'toast-ok' : 'toast-err');
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(function(){ el.remove(); }, 3000);
  }

  // --- Auth gate ---
  var urlToken = new URLSearchParams(location.search).get('token');
  var token = urlToken || localStorage.getItem('TOKEN') || sessionStorage.getItem('TOKEN');

  function showUnauthorized() {
    document.getElementById('auth-loading').innerHTML = '<span style="color:#ef4444">' + t('unauthorized') + '</span>';
    setTimeout(function(){
      location.href = '/ui/login?redirect=' + encodeURIComponent('/ui/worker-setting');
    }, 1200);
  }

  if (!token) { showUnauthorized(); return; }

  fetch(API + '/api/token', { headers: { Authorization: 'Bearer ' + token } })
    .then(function(r){ return r.json(); })
    .then(function(d){
      if (d.errno !== 0 || !d.data || d.data.type !== 'administrator') {
        showUnauthorized(); return;
      }
      document.getElementById('auth-loading').style.display = 'none';
      document.getElementById('main-content').classList.remove('hidden');
      initPage();
    })
    .catch(function(){
      document.getElementById('auth-loading').innerHTML = '<span style="color:#ef4444">' + t('authFailed') + '</span>';
    });

  function api(path, opts) {
    opts = opts || {};
    var headers = Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {});
    if (token) headers['Authorization'] = 'Bearer ' + token;
    return fetch(API + '/api' + path, Object.assign({}, opts, { headers: headers })).then(function(r){ return r.json(); });
  }

  function updateSpamSections(mode) {
    var showAkismet = mode === 'akismet' || mode === 'mix';
    var showLlm = mode === 'llm' || mode === 'mix';
    document.getElementById('section-akismet').style.display = showAkismet ? '' : 'none';
    document.getElementById('section-llm').style.display = showLlm ? '' : 'none';
  }

  // Select dropdown to match a saved version string (by text or by rebuilding options)
  function selectVersionInDropdown(sel, version) {
    for (var i = 0; i < sel.options.length; i++) {
      if (sel.options[i].value === version) { sel.selectedIndex = i; return; }
    }
    // If not in dropdown (custom version), add it as an option
    if (version && version !== 'latest') {
      var opt = document.createElement('option');
      opt.value = version;
      opt.textContent = version;
      sel.appendChild(opt);
      sel.value = version;
    }
  }

  // Populate form fields from settings object (does NOT touch version dropdowns)
  function populateForm(s) {
    document.getElementById('set-version').value = s.waline_client_version || 'v3';
    document.getElementById('set-admin-version').value = s.waline_admin_version || '';
    document.getElementById('set-comment-status').value = s.comment_default_status || 'approved';
    document.getElementById('set-user-comment-status').value = s.user_comment_default_status || 'approved';
    document.getElementById('set-worker-display').value = s.worker_display || 'admin';
    var spamMode = s.spam_mode || ((s.llm_mode && s.llm_mode !== 'off') ? 'llm' : 'off');
    document.getElementById('set-spam-mode').value = spamMode;
    updateSpamSections(spamMode);
    document.getElementById('set-akismet-key').value = s.akismet_key || '';
    document.getElementById('set-llm-skip-admin').checked = s.llm_skip_admin !== '0';
    document.getElementById('set-llm-ep').value = s.llm_endpoint || '';
    document.getElementById('set-llm-key').value = s.llm_api_key || '';
    document.getElementById('set-llm-model').value = s.llm_model || 'gpt-4o-mini';
    document.getElementById('set-llm-prompt').value = s.llm_prompt || 'You are a review bot. Output a single word: approved or spam.';
  }

  // Reselect dropdowns after versions are loaded (called from fetchVersions success callback)
  function reselectVersions() {
    if (!SETTINGS_DATA) return;
    selectVersionInDropdown(document.getElementById('version-select'), SETTINGS_DATA.waline_client_version || 'v3');
    selectVersionInDropdown(document.getElementById('admin-version-select'), SETTINGS_DATA.waline_admin_version || '');
  }

  function initPage() {
    // Tab switching
    var tabs = document.querySelectorAll('.tab-btn');
    var panels = document.querySelectorAll('.tab-panel');
    tabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        var target = this.getAttribute('data-tab');
        tabs.forEach(function(t){ t.classList.remove('active'); });
        this.classList.add('active');
        panels.forEach(function(p){ p.classList.remove('active'); });
        document.getElementById('tab-' + target).classList.add('active');
      });
    });

    function fetchVersions(packageName, btnId, selId, okMsg) {
      var btn = document.getElementById(btnId);
      var sel = document.getElementById(selId);
      if (!btn || !sel) return;
      btn.disabled = true;
      btn.innerHTML = '↻<span class="spinner"></span>';
      fetch('https://data.jsdelivr.com/v1/packages/npm/' + packageName)
        .then(function(r){ return r.json(); })
        .then(function(data) {
          sel.innerHTML = '<option value="">' + t('chooseVersion') + '</option><option value="latest">latest' +
            (data.tags && data.tags.latest ? ' (' + esc(data.tags.latest) + ')' : '') + '</option>';
          if (data.versions) {
            data.versions.slice(0, 30).forEach(function(v) {
              var opt = document.createElement('option');
              opt.value = v.version;
              opt.textContent = v.version;
              sel.appendChild(opt);
            });
          }
          reselectVersions();
          toast(okMsg, true);
        })
        .catch(function(e){ toast(t('fetchFailed').replace('{msg}', e.message), false); })
        .finally(function(){ btn.disabled = false; btn.textContent = t('refreshBtn'); });
    }

    document.getElementById('refresh-versions').addEventListener('click', function(){
      fetchVersions('@waline/client', 'refresh-versions', 'version-select', t('versionsRefreshed'));
    });
    document.getElementById('version-select').addEventListener('change', function() {
      if (this.value) document.getElementById('set-version').value = this.value;
    });
    document.getElementById('refresh-admin-versions').addEventListener('click', function(){
      fetchVersions('@waline/admin', 'refresh-admin-versions', 'admin-version-select', t('adminVersionsRefreshed'));
    });
    document.getElementById('admin-version-select').addEventListener('change', function() {
      if (this.value) document.getElementById('set-admin-version').value = this.value;
    });

    document.getElementById('set-spam-mode').addEventListener('change', function() {
      updateSpamSections(this.value);
    });

    // Load settings first, then fetch versions (which reselect after fetch completes)
    api('/settings').then(function(sr) {
      var s = sr.data || {};
      SETTINGS_DATA = s;
      populateForm(s);

      var overrides = sr.env_overrides || [];
      var overrideDisabledFields = ['akismet_key','spam_mode','llm_skip_admin','llm_endpoint','llm_api_key','llm_model','llm_prompt'];
      overrideDisabledFields.forEach(function(k) {
        if (overrides.indexOf(k) !== -1) {
          var el = document.getElementById('set-' + k) ||
                   document.getElementById('set-' + k.replace(/_/g, '-'));
          if (el) { el.disabled = true; el.title = t('envOverride'); }
        }
      });

      // Now that SETTINGS_DATA is populated, fetch versions (will reselect on complete)
      fetchVersions('@waline/client', 'refresh-versions', 'version-select', t('versionsRefreshed'));
      fetchVersions('@waline/admin', 'refresh-admin-versions', 'admin-version-select', t('adminVersionsRefreshed'));
    }).catch(function(){ toast(t('loadFailed'), false); });

    document.getElementById('save-btn').addEventListener('click', function() {
      var settings = {
        waline_client_version: document.getElementById('set-version').value.trim() || 'v3',
        waline_admin_version: document.getElementById('set-admin-version').value.trim() || '',
        comment_default_status: document.getElementById('set-comment-status').value,
        user_comment_default_status: document.getElementById('set-user-comment-status').value,
        worker_display: document.getElementById('set-worker-display').value,
        spam_mode: document.getElementById('set-spam-mode').value,
        akismet_key: document.getElementById('set-akismet-key').value.trim(),
        llm_skip_admin: document.getElementById('set-llm-skip-admin').checked ? '1' : '0',
        llm_endpoint: document.getElementById('set-llm-ep').value.trim(),
        llm_api_key: document.getElementById('set-llm-key').value.trim(),
        llm_model: document.getElementById('set-llm-model').value.trim(),
        llm_prompt: document.getElementById('set-llm-prompt').value.trim(),
      };
      api('/settings', { method: 'PUT', body: JSON.stringify(settings) }).then(function(r) {
        toast(r.errno ? (r.errmsg || t('saveFailed')) : t('saveOk'), !r.errno);
      }).catch(function(){ toast(t('saveFailed'), false); });
    });

    document.getElementById('test-btn').addEventListener('click', function() {
      var ep = document.getElementById('set-llm-ep').value.trim();
      var key = document.getElementById('set-llm-key').value.trim();
      var model = document.getElementById('set-llm-model').value.trim();
      if (!ep || !key) { toast(t('fetchFailed').replace('{msg}','Endpoint and Key required'), false); return; }
      fetch(ep, { method:'POST', headers:{ 'Content-Type':'application/json', 'Authorization':'Bearer '+key },
        body: JSON.stringify({ model: model || 'gpt-4o-mini', messages: [{ role:'user', content:'Hello, respond with OK' }], max_tokens:10 }) })
      .then(function(r) { toast(r.ok ? t('llmOk') : t('llmFail').replace('{code}',r.status), r.ok); })
      .catch(function(e) { toast(t('llmError').replace('{msg}',e.message), false); });
    });
  }
})();
</script>
</body>
</html>`}function Yt(){return`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Waline Example</title>
</head>
<body>
  <div id="waline" style="max-width: 800px;margin: 0 auto;"></div>
  <link href='//unpkg.com/@waline/client@v3/dist/waline.css' rel='stylesheet' />
  <script type="module">
    import { init } from 'https://unpkg.com/@waline/client@v3/dist/waline.js';

    console.log(
      '%c @waline/server %c v1.32.3 ',
      'color: white; background: #0078E7; padding:5px 0;',
      'padding:4px;border:1px solid #0078E7;'
    );
    const params = new URLSearchParams(location.search.slice(1));
    const waline = init({
      el: '#waline',
      path: params.get('path') || '/',
      lang: params.get('lng') || undefined,
      serverURL: location.protocol + '//' + location.host + location.pathname.replace(/\\/+$/, ''),
      recaptchaV3Key: '',
      turnstileKey: '',
    });
  </script>
</body>
</html>`}var w=new E;w.use("*",ht({origin:(e,t)=>{let n=t.env.SECURE_DOMAINS;return!n||n.split(",").map(a=>a.trim()).some(a=>e===a||e.endsWith(`.${a}`))?e:""},allowMethods:["GET","POST","PUT","DELETE","OPTIONS"],allowHeaders:["Content-Type","Authorization"],exposeHeaders:["Content-Length","x-waline-version"],credentials:!0}));w.use("*",async(e,t)=>{await t(),e.header("x-waline-version","1.1.0")});w.use("*",yt);w.onError((e,t)=>e instanceof SyntaxError?t.json({errno:1,errmsg:"Invalid JSON body"},400):(console.error("[Unhandled Error]",e?.message||e),t.json({errno:1,errmsg:"Internal Server Error"},500)));w.route("/api/comment",N);w.route("/api/article",xe);w.route("/api/user",V);w.route("/api/token",j);w.route("/api/settings",be);w.route("/api/oauth",Be);w.route("/api/db",U);w.get("/ui/worker-setting",async e=>e.html(Gt(e.req.url)));w.get("/ui",async e=>e.html(await Ke(e.env,e.req.url)));w.get("/ui/*",async e=>e.html(await Ke(e.env,e.req.url)));w.get("/",e=>e.html(Yt()));var Jt=w;var Qt=`-- Waline on Worker D1 Schema\r
-- Compatible with Waline SQLite schema\r
\r
CREATE TABLE IF NOT EXISTS "wl_Comment" (\r
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,\r
  "user_id" INTEGER,\r
  "comment" TEXT,\r
  "orig" TEXT,\r
  "insertedAt" TEXT DEFAULT (datetime('now')),\r
  "ip" TEXT,\r
  "link" TEXT,\r
  "mail" TEXT,\r
  "nick" TEXT,\r
  "pid" INTEGER,\r
  "rid" INTEGER,\r
  "sticky" INTEGER DEFAULT 0,\r
  "status" TEXT NOT NULL DEFAULT 'approved',\r
  "like" INTEGER DEFAULT 0,\r
  "ua" TEXT,\r
  "url" TEXT,\r
  "createdAt" TEXT DEFAULT (datetime('now')),\r
  "updatedAt" TEXT DEFAULT (datetime('now'))\r
);\r
\r
CREATE INDEX IF NOT EXISTS "idx_comment_url" ON "wl_Comment" ("url");\r
CREATE INDEX IF NOT EXISTS "idx_comment_status" ON "wl_Comment" ("status");\r
CREATE INDEX IF NOT EXISTS "idx_comment_mail_status" ON "wl_Comment" ("mail", "status");\r
CREATE INDEX IF NOT EXISTS "idx_comment_rid" ON "wl_Comment" ("rid");\r
CREATE INDEX IF NOT EXISTS "idx_comment_pid" ON "wl_Comment" ("pid");\r
CREATE INDEX IF NOT EXISTS "idx_comment_user_id" ON "wl_Comment" ("user_id");\r
CREATE INDEX IF NOT EXISTS "idx_comment_insertedAt" ON "wl_Comment" ("insertedAt");\r
\r
CREATE TABLE IF NOT EXISTS "wl_CommentRegion" (\r
  "comment_id" INTEGER PRIMARY KEY REFERENCES "wl_Comment" ("id") ON DELETE CASCADE,\r
  "country" TEXT NOT NULL DEFAULT '',\r
  "region" TEXT NOT NULL DEFAULT '',\r
  "city" TEXT NOT NULL DEFAULT ''\r
);\r
\r
CREATE TABLE IF NOT EXISTS "wl_Counter" (\r
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,\r
  "time" INTEGER DEFAULT 0,\r
  "reaction0" INTEGER DEFAULT 0,\r
  "reaction1" INTEGER DEFAULT 0,\r
  "reaction2" INTEGER DEFAULT 0,\r
  "reaction3" INTEGER DEFAULT 0,\r
  "reaction4" INTEGER DEFAULT 0,\r
  "reaction5" INTEGER DEFAULT 0,\r
  "reaction6" INTEGER DEFAULT 0,\r
  "reaction7" INTEGER DEFAULT 0,\r
  "reaction8" INTEGER DEFAULT 0,\r
  "url" TEXT NOT NULL,\r
  "createdAt" TEXT DEFAULT (datetime('now')),\r
  "updatedAt" TEXT DEFAULT (datetime('now'))\r
);\r
\r
CREATE UNIQUE INDEX IF NOT EXISTS "idx_counter_url" ON "wl_Counter" ("url");\r
\r
CREATE TABLE IF NOT EXISTS "wl_Users" (\r
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,\r
  "display_name" TEXT NOT NULL DEFAULT '',\r
  "email" TEXT NOT NULL DEFAULT '',\r
  "password" TEXT NOT NULL DEFAULT '',\r
  "type" TEXT NOT NULL DEFAULT 'guest',\r
  "label" TEXT DEFAULT '',\r
  "url" TEXT DEFAULT '',\r
  "avatar" TEXT DEFAULT '',\r
  "github" TEXT DEFAULT '',\r
  "twitter" TEXT DEFAULT '',\r
  "facebook" TEXT DEFAULT '',\r
  "google" TEXT DEFAULT '',\r
  "weibo" TEXT DEFAULT '',\r
  "qq" TEXT DEFAULT '',\r
  "2fa" TEXT DEFAULT '',\r
  "createdAt" TEXT DEFAULT (datetime('now')),\r
  "updatedAt" TEXT DEFAULT (datetime('now'))\r
);\r
\r
CREATE UNIQUE INDEX IF NOT EXISTS "idx_users_email" ON "wl_Users" ("email");\r
\r
CREATE TABLE IF NOT EXISTS "wl_Settings" (\r
  "key" TEXT PRIMARY KEY,\r
  "value" TEXT NOT NULL DEFAULT '',\r
  "updatedAt" TEXT DEFAULT (datetime('now'))\r
);\r
`;var re=null;function Qn(e){let t=Qt.replace(/--[^\n]*/g,"").split(";").map(n=>n.trim()).filter(n=>n.length>0).map(n=>e.DB.prepare(n));return e.DB.batch(t)}async function Zn(e){if(!re){let t=Qn(e);re=t,t.catch(()=>{re===t&&(re=null)})}return re}var $i={async fetch(e,t,n){return await Zn(t),Jt.fetch(e,t,n)}};export{$i as default};
