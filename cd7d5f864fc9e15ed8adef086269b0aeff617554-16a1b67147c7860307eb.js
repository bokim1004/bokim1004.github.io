/*! For license information please see cd7d5f864fc9e15ed8adef086269b0aeff617554-16a1b67147c7860307eb.js.LICENSE.txt */
(self.webpackChunkchloe=self.webpackChunkchloe||[]).push([[84],{7214:function(e,t,r){var a,o;o=void 0!==r.g?r.g:"undefined"!=typeof window?window:this,a=function(){return function(e){"use strict";var t={ignore:"[data-scroll-ignore]",header:null,topOnEmptyHash:!0,speed:500,speedAsDuration:!1,durationMax:null,durationMin:null,clip:!0,offset:0,easing:"easeInOutCubic",customEasing:null,updateURL:!0,popstate:!0,emitEvents:!0},r=function(){var e={};return Array.prototype.forEach.call(arguments,(function(t){for(var r in t){if(!t.hasOwnProperty(r))return;e[r]=t[r]}})),e},a=function(e){"#"===e.charAt(0)&&(e=e.substr(1));for(var t,r=String(e),a=r.length,o=-1,i="",n=r.charCodeAt(0);++o<a;){if(0===(t=r.charCodeAt(o)))throw new InvalidCharacterError("Invalid character: the input contains U+0000.");i+=1<=t&&t<=31||127==t||0===o&&48<=t&&t<=57||1===o&&48<=t&&t<=57&&45===n?"\\"+t.toString(16)+" ":128<=t||45===t||95===t||48<=t&&t<=57||65<=t&&t<=90||97<=t&&t<=122?r.charAt(o):"\\"+r.charAt(o)}return"#"+i},o=function(){return Math.max(document.body.scrollHeight,document.documentElement.scrollHeight,document.body.offsetHeight,document.documentElement.offsetHeight,document.body.clientHeight,document.documentElement.clientHeight)},i=function(t){return t?(r=t,parseInt(e.getComputedStyle(r).height,10)+t.offsetTop):0;var r},n=function(t,r,a){0===t&&document.body.focus(),a||(t.focus(),document.activeElement!==t&&(t.setAttribute("tabindex","-1"),t.focus(),t.style.outline="none"),e.scrollTo(0,r))},s=function(t,r,a,o){if(r.emitEvents&&"function"==typeof e.CustomEvent){var i=new CustomEvent(t,{bubbles:!0,detail:{anchor:a,toggle:o}});document.dispatchEvent(i)}};return function(l,c){var d,u,f,p,h={cancelScroll:function(e){cancelAnimationFrame(p),p=null,e||s("scrollCancel",d)},animateScroll:function(a,l,c){h.cancelScroll();var u=r(d||t,c||{}),m="[object Number]"===Object.prototype.toString.call(a),g=m||!a.tagName?null:a;if(m||g){var v=e.pageYOffset;u.header&&!f&&(f=document.querySelector(u.header));var y,b,S,E,w,O,L,I,x=i(f),T=m?a:function(t,r,a,i){var n=0;if(t.offsetParent)for(;n+=t.offsetTop,t=t.offsetParent;);return n=Math.max(n-r-a,0),i&&(n=Math.min(n,o()-e.innerHeight)),n}(g,x,parseInt("function"==typeof u.offset?u.offset(a,l):u.offset,10),u.clip),C=T-v,R=o(),M=0,N=(y=C,S=(b=u).speedAsDuration?b.speed:Math.abs(y/1e3*b.speed),b.durationMax&&S>b.durationMax?b.durationMax:b.durationMin&&S<b.durationMin?b.durationMin:parseInt(S,10)),k=function t(r){var o,i,c;E||(E=r),M+=r-E,O=v+C*(i=w=1<(w=0===N?0:M/N)?1:w,"easeInQuad"===(o=u).easing&&(c=i*i),"easeOutQuad"===o.easing&&(c=i*(2-i)),"easeInOutQuad"===o.easing&&(c=i<.5?2*i*i:(4-2*i)*i-1),"easeInCubic"===o.easing&&(c=i*i*i),"easeOutCubic"===o.easing&&(c=--i*i*i+1),"easeInOutCubic"===o.easing&&(c=i<.5?4*i*i*i:(i-1)*(2*i-2)*(2*i-2)+1),"easeInQuart"===o.easing&&(c=i*i*i*i),"easeOutQuart"===o.easing&&(c=1- --i*i*i*i),"easeInOutQuart"===o.easing&&(c=i<.5?8*i*i*i*i:1-8*--i*i*i*i),"easeInQuint"===o.easing&&(c=i*i*i*i*i),"easeOutQuint"===o.easing&&(c=1+--i*i*i*i*i),"easeInOutQuint"===o.easing&&(c=i<.5?16*i*i*i*i*i:1+16*--i*i*i*i*i),o.customEasing&&(c=o.customEasing(i)),c||i),e.scrollTo(0,Math.floor(O)),function(t,r){var o=e.pageYOffset;if(t==r||o==r||(v<r&&e.innerHeight+o)>=R)return h.cancelScroll(!0),n(a,r,m),s("scrollStop",u,a,l),!(p=E=null)}(O,T)||(p=e.requestAnimationFrame(t),E=r)};0===e.pageYOffset&&e.scrollTo(0,0),L=a,I=u,m||history.pushState&&I.updateURL&&history.pushState({smoothScroll:JSON.stringify(I),anchor:L.id},document.title,L===document.documentElement?"#top":"#"+L.id),"matchMedia"in e&&e.matchMedia("(prefers-reduced-motion)").matches?n(a,Math.floor(T),!1):(s("scrollStart",u,a,l),h.cancelScroll(!0),e.requestAnimationFrame(k))}}},m=function(t){if(!t.defaultPrevented&&!(0!==t.button||t.metaKey||t.ctrlKey||t.shiftKey)&&"closest"in t.target&&(u=t.target.closest(l))&&"a"===u.tagName.toLowerCase()&&!t.target.closest(d.ignore)&&u.hostname===e.location.hostname&&u.pathname===e.location.pathname&&/#/.test(u.href)){var r,o;try{r=a(decodeURIComponent(u.hash))}catch(t){r=a(u.hash)}if("#"===r){if(!d.topOnEmptyHash)return;o=document.documentElement}else o=document.querySelector(r);(o=o||"#top"!==r?o:document.documentElement)&&(t.preventDefault(),function(t){if(history.replaceState&&t.updateURL&&!history.state){var r=e.location.hash;r=r||"",history.replaceState({smoothScroll:JSON.stringify(t),anchor:r||e.pageYOffset},document.title,r||e.location.href)}}(d),h.animateScroll(o,u))}},g=function(e){if(null!==history.state&&history.state.smoothScroll&&history.state.smoothScroll===JSON.stringify(d)){var t=history.state.anchor;"string"==typeof t&&t&&!(t=document.querySelector(a(history.state.anchor)))||h.animateScroll(t,null,{updateURL:!1})}};return h.destroy=function(){d&&(document.removeEventListener("click",m,!1),e.removeEventListener("popstate",g,!1),h.cancelScroll(),p=f=u=d=null)},function(){if(!("querySelector"in document&&"addEventListener"in e&&"requestAnimationFrame"in e&&"closest"in e.Element.prototype))throw"Smooth Scroll: This browser does not support the required JavaScript methods and browser APIs.";h.destroy(),d=r(t,c||{}),f=d.header?document.querySelector(d.header):null,document.addEventListener("click",m,!1),d.updateURL&&d.popstate&&e.addEventListener("popstate",g,!1)}(),h}}(o)}.apply(t,[]),void 0===a||(e.exports=a)},9634:function(e){!function(){"use strict";e.exports={polyfill:function(){var e=window,t=document;if(!("scrollBehavior"in t.documentElement.style)||!0===e.__forceSmoothScrollPolyfill__){var r,a=e.HTMLElement||e.Element,o={scroll:e.scroll||e.scrollTo,scrollBy:e.scrollBy,elementScroll:a.prototype.scroll||s,scrollIntoView:a.prototype.scrollIntoView},i=e.performance&&e.performance.now?e.performance.now.bind(e.performance):Date.now,n=(r=e.navigator.userAgent,new RegExp(["MSIE ","Trident/","Edge/"].join("|")).test(r)?1:0);e.scroll=e.scrollTo=function(){void 0!==arguments[0]&&(!0!==l(arguments[0])?h.call(e,t.body,void 0!==arguments[0].left?~~arguments[0].left:e.scrollX||e.pageXOffset,void 0!==arguments[0].top?~~arguments[0].top:e.scrollY||e.pageYOffset):o.scroll.call(e,void 0!==arguments[0].left?arguments[0].left:"object"!=typeof arguments[0]?arguments[0]:e.scrollX||e.pageXOffset,void 0!==arguments[0].top?arguments[0].top:void 0!==arguments[1]?arguments[1]:e.scrollY||e.pageYOffset))},e.scrollBy=function(){void 0!==arguments[0]&&(l(arguments[0])?o.scrollBy.call(e,void 0!==arguments[0].left?arguments[0].left:"object"!=typeof arguments[0]?arguments[0]:0,void 0!==arguments[0].top?arguments[0].top:void 0!==arguments[1]?arguments[1]:0):h.call(e,t.body,~~arguments[0].left+(e.scrollX||e.pageXOffset),~~arguments[0].top+(e.scrollY||e.pageYOffset)))},a.prototype.scroll=a.prototype.scrollTo=function(){if(void 0!==arguments[0])if(!0!==l(arguments[0])){var e=arguments[0].left,t=arguments[0].top;h.call(this,this,void 0===e?this.scrollLeft:~~e,void 0===t?this.scrollTop:~~t)}else{if("number"==typeof arguments[0]&&void 0===arguments[1])throw new SyntaxError("Value could not be converted");o.elementScroll.call(this,void 0!==arguments[0].left?~~arguments[0].left:"object"!=typeof arguments[0]?~~arguments[0]:this.scrollLeft,void 0!==arguments[0].top?~~arguments[0].top:void 0!==arguments[1]?~~arguments[1]:this.scrollTop)}},a.prototype.scrollBy=function(){void 0!==arguments[0]&&(!0!==l(arguments[0])?this.scroll({left:~~arguments[0].left+this.scrollLeft,top:~~arguments[0].top+this.scrollTop,behavior:arguments[0].behavior}):o.elementScroll.call(this,void 0!==arguments[0].left?~~arguments[0].left+this.scrollLeft:~~arguments[0]+this.scrollLeft,void 0!==arguments[0].top?~~arguments[0].top+this.scrollTop:~~arguments[1]+this.scrollTop))},a.prototype.scrollIntoView=function(){if(!0!==l(arguments[0])){var r=f(this),a=r.getBoundingClientRect(),i=this.getBoundingClientRect();r!==t.body?(h.call(this,r,r.scrollLeft+i.left-a.left,r.scrollTop+i.top-a.top),"fixed"!==e.getComputedStyle(r).position&&e.scrollBy({left:a.left,top:a.top,behavior:"smooth"})):e.scrollBy({left:i.left,top:i.top,behavior:"smooth"})}else o.scrollIntoView.call(this,void 0===arguments[0]||arguments[0])}}function s(e,t){this.scrollLeft=e,this.scrollTop=t}function l(e){if(null===e||"object"!=typeof e||void 0===e.behavior||"auto"===e.behavior||"instant"===e.behavior)return!0;if("object"==typeof e&&"smooth"===e.behavior)return!1;throw new TypeError("behavior member of ScrollOptions "+e.behavior+" is not a valid value for enumeration ScrollBehavior.")}function c(e,t){return"Y"===t?e.clientHeight+n<e.scrollHeight:"X"===t?e.clientWidth+n<e.scrollWidth:void 0}function d(t,r){var a=e.getComputedStyle(t,null)["overflow"+r];return"auto"===a||"scroll"===a}function u(e){var t=c(e,"Y")&&d(e,"Y"),r=c(e,"X")&&d(e,"X");return t||r}function f(e){for(;e!==t.body&&!1===u(e);)e=e.parentNode||e.host;return e}function p(t){var r,a,o,n,s=(i()-t.startTime)/468;n=s=s>1?1:s,r=.5*(1-Math.cos(Math.PI*n)),a=t.startX+(t.x-t.startX)*r,o=t.startY+(t.y-t.startY)*r,t.method.call(t.scrollable,a,o),a===t.x&&o===t.y||e.requestAnimationFrame(p.bind(e,t))}function h(r,a,n){var l,c,d,u,f=i();r===t.body?(l=e,c=e.scrollX||e.pageXOffset,d=e.scrollY||e.pageYOffset,u=o.scroll):(l=r,c=r.scrollLeft,d=r.scrollTop,u=s),p({scrollable:l,method:u,startTime:f,startX:c,startY:d,x:a,y:n})}}}}()},6162:function(e,t,r){"use strict";var a=r(4836);t.Z=void 0;var o,i=a(r(6115)),n=a(r(7867)),s=a(r(3212)),l=a(r(434)),c=a(r(7294)),d=a(r(5697)),u=function(e){var t=(0,l.default)({},e),r=t.resolutions,a=t.sizes,o=t.critical;return r&&(t.fixed=r,delete t.resolutions),a&&(t.fluid=a,delete t.sizes),o&&(t.loading="eager"),t.fluid&&(t.fluid=w([].concat(t.fluid))),t.fixed&&(t.fixed=w([].concat(t.fixed))),t},f=function(e){var t=e.media;return!!t&&(y&&!!window.matchMedia(t).matches)},p=function(e){var t=e.fluid,r=e.fixed;return h(t||r).src},h=function(e){if(y&&function(e){return!!e&&Array.isArray(e)&&e.some((function(e){return void 0!==e.media}))}(e)){var t=e.findIndex(f);if(-1!==t)return e[t];var r=e.findIndex((function(e){return void 0===e.media}));if(-1!==r)return e[r]}return e[0]},m=Object.create({}),g=function(e){var t=u(e),r=p(t);return m[r]||!1},v="undefined"!=typeof HTMLImageElement&&"loading"in HTMLImageElement.prototype,y="undefined"!=typeof window,b=y&&window.IntersectionObserver,S=new WeakMap;function E(e){return e.map((function(e){var t=e.src,r=e.srcSet,a=e.srcSetWebp,o=e.media,i=e.sizes;return c.default.createElement(c.default.Fragment,{key:t},a&&c.default.createElement("source",{type:"image/webp",media:o,srcSet:a,sizes:i}),c.default.createElement("source",{media:o,srcSet:r,sizes:i}))}))}function w(e){var t=[],r=[];return e.forEach((function(e){return(e.media?t:r).push(e)})),[].concat(t,r)}function O(e){return e.map((function(e){var t=e.src,r=e.media,a=e.tracedSVG;return c.default.createElement("source",{key:t,media:r,srcSet:a})}))}function L(e){return e.map((function(e){var t=e.src,r=e.media,a=e.base64;return c.default.createElement("source",{key:t,media:r,srcSet:a})}))}function I(e,t){var r=e.srcSet,a=e.srcSetWebp,o=e.media,i=e.sizes;return"<source "+(t?"type='image/webp' ":"")+(o?'media="'+o+'" ':"")+'srcset="'+(t?a:r)+'" '+(i?'sizes="'+i+'" ':"")+"/>"}var x=function(e,t){var r=(void 0===o&&"undefined"!=typeof window&&window.IntersectionObserver&&(o=new window.IntersectionObserver((function(e){e.forEach((function(e){if(S.has(e.target)){var t=S.get(e.target);(e.isIntersecting||e.intersectionRatio>0)&&(o.unobserve(e.target),S.delete(e.target),t())}}))}),{rootMargin:"200px"})),o);return r&&(r.observe(e),S.set(e,t)),function(){r.unobserve(e),S.delete(e)}},T=function(e){var t=e.src?'src="'+e.src+'" ':'src="" ',r=e.sizes?'sizes="'+e.sizes+'" ':"",a=e.srcSet?'srcset="'+e.srcSet+'" ':"",o=e.title?'title="'+e.title+'" ':"",i=e.alt?'alt="'+e.alt+'" ':'alt="" ',n=e.width?'width="'+e.width+'" ':"",s=e.height?'height="'+e.height+'" ':"",l=e.crossOrigin?'crossorigin="'+e.crossOrigin+'" ':"",c=e.loading?'loading="'+e.loading+'" ':"",d=e.draggable?'draggable="'+e.draggable+'" ':"";return"<picture>"+e.imageVariants.map((function(e){return(e.srcSetWebp?I(e,!0):"")+I(e)})).join("")+"<img "+c+n+s+r+a+t+i+o+l+d+'style="position:absolute;top:0;left:0;opacity:1;width:100%;height:100%;object-fit:cover;object-position:center"/></picture>'},C=function(e){var t=e.src,r=e.imageVariants,a=e.generateSources,o=e.spreadProps,i=e.ariaHidden,n=c.default.createElement(R,(0,l.default)({src:t},o,{ariaHidden:i}));return r.length>1?c.default.createElement("picture",null,a(r),n):n},R=c.default.forwardRef((function(e,t){var r=e.sizes,a=e.srcSet,o=e.src,i=e.style,n=e.onLoad,d=e.onError,u=e.loading,f=e.draggable,p=e.ariaHidden,h=(0,s.default)(e,["sizes","srcSet","src","style","onLoad","onError","loading","draggable","ariaHidden"]);return c.default.createElement("img",(0,l.default)({"aria-hidden":p,sizes:r,srcSet:a,src:o},h,{onLoad:n,onError:d,ref:t,loading:u,draggable:f,style:(0,l.default)({position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center"},i)}))}));R.propTypes={style:d.default.object,onError:d.default.func,onLoad:d.default.func};var M=function(e){function t(t){var r;(r=e.call(this,t)||this).seenBefore=y&&g(t),r.isCritical="eager"===t.loading||t.critical,r.addNoScript=!(r.isCritical&&!t.fadeIn),r.useIOSupport=!v&&b&&!r.isCritical&&!r.seenBefore;var a=r.isCritical||y&&(v||!r.useIOSupport);return r.state={isVisible:a,imgLoaded:!1,imgCached:!1,fadeIn:!r.seenBefore&&t.fadeIn},r.imageRef=c.default.createRef(),r.handleImageLoaded=r.handleImageLoaded.bind((0,i.default)(r)),r.handleRef=r.handleRef.bind((0,i.default)(r)),r}(0,n.default)(t,e);var r=t.prototype;return r.componentDidMount=function(){if(this.state.isVisible&&"function"==typeof this.props.onStartLoad&&this.props.onStartLoad({wasCached:g(this.props)}),this.isCritical){var e=this.imageRef.current;e&&e.complete&&this.handleImageLoaded()}},r.componentWillUnmount=function(){this.cleanUpListeners&&this.cleanUpListeners()},r.handleRef=function(e){var t=this;this.useIOSupport&&e&&(this.cleanUpListeners=x(e,(function(){var e=g(t.props);t.state.isVisible||"function"!=typeof t.props.onStartLoad||t.props.onStartLoad({wasCached:e}),t.setState({isVisible:!0},(function(){t.setState({imgLoaded:e,imgCached:!(!t.imageRef.current||!t.imageRef.current.currentSrc)})}))})))},r.handleImageLoaded=function(){var e,t,r;e=this.props,t=u(e),r=p(t),m[r]=!0,this.setState({imgLoaded:!0}),this.props.onLoad&&this.props.onLoad()},r.render=function(){var e=u(this.props),t=e.title,r=e.alt,a=e.className,o=e.style,i=void 0===o?{}:o,n=e.imgStyle,s=void 0===n?{}:n,d=e.placeholderStyle,f=void 0===d?{}:d,p=e.placeholderClassName,m=e.fluid,g=e.fixed,v=e.backgroundColor,y=e.durationFadeIn,b=e.Tag,S=e.itemProp,w=e.loading,I=e.draggable,x=!1===this.state.fadeIn||this.state.imgLoaded,M=!0===this.state.fadeIn&&!this.state.imgCached,N=(0,l.default)({opacity:x?1:0,transition:M?"opacity "+y+"ms":"none"},s),k="boolean"==typeof v?"lightgray":v,V={transitionDelay:y+"ms"},H=(0,l.default)({opacity:this.state.imgLoaded?0:1},M&&V,{},s,{},f),j={title:t,alt:this.state.isVisible?"":r,style:H,className:p,itemProp:S};if(m){var z=m,P=h(m);return c.default.createElement(b,{className:(a||"")+" gatsby-image-wrapper",style:(0,l.default)({position:"relative",overflow:"hidden"},i),ref:this.handleRef,key:"fluid-"+JSON.stringify(P.srcSet)},c.default.createElement(b,{"aria-hidden":!0,style:{width:"100%",paddingBottom:100/P.aspectRatio+"%"}}),k&&c.default.createElement(b,{"aria-hidden":!0,title:t,style:(0,l.default)({backgroundColor:k,position:"absolute",top:0,bottom:0,opacity:this.state.imgLoaded?0:1,right:0,left:0},M&&V)}),P.base64&&c.default.createElement(C,{ariaHidden:!0,src:P.base64,spreadProps:j,imageVariants:z,generateSources:L}),P.tracedSVG&&c.default.createElement(C,{ariaHidden:!0,src:P.tracedSVG,spreadProps:j,imageVariants:z,generateSources:O}),this.state.isVisible&&c.default.createElement("picture",null,E(z),c.default.createElement(R,{alt:r,title:t,sizes:P.sizes,src:P.src,crossOrigin:this.props.crossOrigin,srcSet:P.srcSet,style:N,ref:this.imageRef,onLoad:this.handleImageLoaded,onError:this.props.onError,itemProp:S,loading:w,draggable:I})),this.addNoScript&&c.default.createElement("noscript",{dangerouslySetInnerHTML:{__html:T((0,l.default)({alt:r,title:t,loading:w},P,{imageVariants:z}))}}))}if(g){var q=g,A=h(g),Y=(0,l.default)({position:"relative",overflow:"hidden",display:"inline-block",width:A.width,height:A.height},i);return"inherit"===i.display&&delete Y.display,c.default.createElement(b,{className:(a||"")+" gatsby-image-wrapper",style:Y,ref:this.handleRef,key:"fixed-"+JSON.stringify(A.srcSet)},k&&c.default.createElement(b,{"aria-hidden":!0,title:t,style:(0,l.default)({backgroundColor:k,width:A.width,opacity:this.state.imgLoaded?0:1,height:A.height},M&&V)}),A.base64&&c.default.createElement(C,{ariaHidden:!0,src:A.base64,spreadProps:j,imageVariants:q,generateSources:L}),A.tracedSVG&&c.default.createElement(C,{ariaHidden:!0,src:A.tracedSVG,spreadProps:j,imageVariants:q,generateSources:O}),this.state.isVisible&&c.default.createElement("picture",null,E(q),c.default.createElement(R,{alt:r,title:t,width:A.width,height:A.height,sizes:A.sizes,src:A.src,crossOrigin:this.props.crossOrigin,srcSet:A.srcSet,style:N,ref:this.imageRef,onLoad:this.handleImageLoaded,onError:this.props.onError,itemProp:S,loading:w,draggable:I})),this.addNoScript&&c.default.createElement("noscript",{dangerouslySetInnerHTML:{__html:T((0,l.default)({alt:r,title:t,loading:w},A,{imageVariants:q}))}}))}return null},t}(c.default.Component);M.defaultProps={fadeIn:!0,durationFadeIn:500,alt:"",Tag:"div",loading:"lazy"};var N=d.default.shape({width:d.default.number.isRequired,height:d.default.number.isRequired,src:d.default.string.isRequired,srcSet:d.default.string.isRequired,base64:d.default.string,tracedSVG:d.default.string,srcWebp:d.default.string,srcSetWebp:d.default.string,media:d.default.string}),k=d.default.shape({aspectRatio:d.default.number.isRequired,src:d.default.string.isRequired,srcSet:d.default.string.isRequired,sizes:d.default.string.isRequired,base64:d.default.string,tracedSVG:d.default.string,srcWebp:d.default.string,srcSetWebp:d.default.string,media:d.default.string});M.propTypes={resolutions:N,sizes:k,fixed:d.default.oneOfType([N,d.default.arrayOf(N)]),fluid:d.default.oneOfType([k,d.default.arrayOf(k)]),fadeIn:d.default.bool,durationFadeIn:d.default.number,title:d.default.string,alt:d.default.string,className:d.default.oneOfType([d.default.string,d.default.object]),critical:d.default.bool,crossOrigin:d.default.oneOfType([d.default.string,d.default.bool]),style:d.default.object,imgStyle:d.default.object,placeholderStyle:d.default.object,placeholderClassName:d.default.string,backgroundColor:d.default.oneOfType([d.default.string,d.default.bool]),onLoad:d.default.func,onError:d.default.func,onStartLoad:d.default.func,Tag:d.default.string,itemProp:d.default.string,loading:d.default.oneOf(["auto","lazy","eager"]),draggable:d.default.bool};var V=M;t.Z=V},8195:function(e,t,r){"use strict";r.d(t,{w:function(){return n}});var a=r(7294),o=r(1597),i=r(6162),n=(0,a.forwardRef)((function(e,t){return a.createElement(o.StaticQuery,{query:s,render:function(e){var r=e.site.siteMetadata,n=r.author,s=r.social,l=r.introduction;return a.createElement("div",{ref:t,className:"bio"},a.createElement("div",{className:"author"},a.createElement("div",{className:"author-description"},a.createElement(i.Z,{className:"author-image",fixed:e.avatar.childImageSharp.fixed,alt:n,style:{borderRadius:"100%"}}),a.createElement("div",{className:"author-name"},a.createElement("span",{className:"author-name-prefix"},"Written by"),a.createElement(o.Link,{to:"/about",className:"author-name-content"},a.createElement("span",null,"@",n)),a.createElement("div",{className:"author-introduction"},l),a.createElement("p",{className:"author-socials"},s.instagram&&a.createElement("a",{href:"https://www.instagram.com/"+s.instagram},"Instagram"),s.github&&a.createElement("a",{href:"https://github.com/"+s.github},"GitHub"),s.medium&&a.createElement("a",{href:"https://medium.com/"+s.medium},"Medium"),s.twitter&&a.createElement("a",{href:"https://twitter.com/"+s.twitter},"Twitter"),s.facebook&&a.createElement("a",{href:"https://www.facebook.com/"+s.facebook},"Facebook"),s.linkedin&&a.createElement("a",{href:"https://www.linkedin.com/in/"+s.linkedin+"/"},"LinkedIn"))))))}})})),s="2486386679"},2685:function(e,t,r){"use strict";r.d(t,{S:function(){return l},go:function(){return d},o:function(){return c}});var a,o=r(7214),i=r.n(o),n=r(9634),s=r.n(n);function l(){return s().polyfill(),a=new(i())('a[href*="#"]',{speed:500,speedAsDuration:!0})}function c(){if(!a)throw Error("Not founded SmoothScroll instance");return a.destroy(),a=null}function d(e){if(!a)throw Error("Not founded SmoothScroll instance");return a.animateScroll(e),a}},434:function(e){function t(){return e.exports=t=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(e[a]=r[a])}return e},e.exports.__esModule=!0,e.exports.default=e.exports,t.apply(this,arguments)}e.exports=t,e.exports.__esModule=!0,e.exports.default=e.exports},3212:function(e){e.exports=function(e,t){if(null==e)return{};var r,a,o={},i=Object.keys(e);for(a=0;a<i.length;a++)r=i[a],t.indexOf(r)>=0||(o[r]=e[r]);return o},e.exports.__esModule=!0,e.exports.default=e.exports}}]);
//# sourceMappingURL=cd7d5f864fc9e15ed8adef086269b0aeff617554-16a1b67147c7860307eb.js.map