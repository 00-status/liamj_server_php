"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[345],{2961:(e,n,t)=>{t.r(n),t.d(n,{default:()=>T});var r=t(5072),a=t.n(r),i=t(7825),l=t.n(i),o=t(7659),s=t.n(o),c=t(5056),d=t.n(c),p=t(540),m=t.n(p),u=t(1113),g=t.n(u),h=t(4740),f={};f.styleTagTransform=g(),f.setAttributes=d(),f.insert=s().bind(null,"head"),f.domAPI=l(),f.insertStyleElement=m(),a()(h.A,f),h.A&&h.A.locals&&h.A.locals;var y=t(6980),k=t(6884),b={};b.styleTagTransform=g(),b.setAttributes=d(),b.insert=s().bind(null,"head"),b.domAPI=l(),b.insertStyleElement=m(),a()(k.A,b),k.A&&k.A.locals&&k.A.locals;var x=t(4848),v=function(e){return e[e.working=0]="working",e[e.expert=1]="expert",e}({}),w=function(e){var n=j(e.type);return(0,x.jsxs)("div",{className:"skill-card",children:[(0,x.jsx)("div",{"data-theme":n,className:"skill-card__gradient",children:(0,x.jsx)("div",{className:"skill-card__title",children:e.name})}),(0,x.jsx)("div",{className:"skill-card__container",children:(0,x.jsx)("div",{children:e.type})})]})},j=function(e){switch(e){case"Front-end":return"red-card";case"Back-end":return"blue-card";case"Database":return"green-card";default:return"default-card"}},A=[{type:"Front-end",name:"React",skillLevel:v.expert},{type:"Front-end",name:"TypeScript",skillLevel:v.expert},{type:"Back-end",name:"PHP",skillLevel:v.working},{type:"Front-end",name:"Webpack",skillLevel:v.working},{type:"Database",name:"PostgreSQL",skillLevel:v.working},{type:"Tool",name:"Jira",skillLevel:v.working},{type:"Process",name:"Test-driven Development",skillLevel:v.working},{type:"Tool",name:"Git",skillLevel:v.working},{type:"Back-end",name:"SlimPHP",skillLevel:v.working},{type:"Process",name:"Command/Handler",skillLevel:v.working},{type:"Process",name:"Onion Architecture",skillLevel:v.working},{type:"Back-end",name:"GraphQL",skillLevel:v.working},{type:"Back-end",name:"ASP.NET Core",skillLevel:v.working},{type:"Front-end",name:"Flow",skillLevel:v.working},{type:"Database",name:"MySQL",skillLevel:v.working},{type:"Back-end",name:"Google Analytics",skillLevel:v.working},{type:"Tool",name:"Slack",skillLevel:v.working},{type:"Front-end",name:"Vue",skillLevel:v.working},{type:"Process",name:"Builder",skillLevel:v.working}],_=t(928);function L(e){return L="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},L(e)}function P(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function S(e,n,t){return(n=function(e){var n=function(e){if("object"!=L(e)||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var t=n.call(e,"string");if("object"!=L(t))return t;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==L(n)?n:n+""}(n))in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}const T=function(){return(0,x.jsx)(y.Y,{title:"Liam Johnson",routes:[],children:(0,x.jsxs)("div",{className:"about-me",children:[(0,x.jsxs)("div",{children:[(0,x.jsx)("h1",{children:"About Me"}),(0,x.jsx)("p",{children:"Hey, I'm Liam Johnson. Welcome! Have a seat. Take a look around."}),(0,x.jsx)("p",{children:"I'm a full-stack developer from Saskatoon, Saskatchewan with a little more than five years of industry experience. On a technical level, I'm familiar with a spread of languages and frameworks ranging from React and TypeScript to PHP and SQL. I've noodled with endpoints, architected data models, applied various programming patterns practically, and wrestled with the serpentine beast that is storing temporal data."}),(0,x.jsxs)("p",{children:["Working in Saskatchewan, I've had the pleasure of learning from a host of talented people over the years, and have gained experience researching, pitching, and leading both product and engineering projects. Feel free to check out the repository for ",(0,x.jsx)(_.M,{link:"https://github.com/00-status/liamjv2",displayText:"this website"})," if you're curious about my technical work."]}),(0,x.jsx)("p",{children:"Outside of software development, I have a great interest both in creating stories and experiencing them; Movies, books, tv-shows, table-top games, writing, and video games all have a special place in my - deeply nerdy - heart."}),(0,x.jsxs)("p",{children:["If you're interested in getting in touch with me, feel free to shoot me a message on ",(0,x.jsx)(_.M,{link:"https://www.linkedin.com/in/liam-johnson-36791915a/",displayText:"LinkedIn"}),"."]})]}),(0,x.jsxs)("div",{className:"about-me__skills",children:[(0,x.jsx)("h2",{children:"Skills"}),(0,x.jsx)("div",{className:"about-me__skill-grid",children:A.map((function(e){return(0,x.jsx)(w,function(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?P(Object(t),!0).forEach((function(n){S(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):P(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}({},e),e.name)}))})]})]})})}},4740:(e,n,t)=>{t.d(n,{A:()=>o});var r=t(1601),a=t.n(r),i=t(6314),l=t.n(i)()(a());l.push([e.id,".about-me {\n    width: 100%;\n    margin-bottom: 20px;\n}\n\n.about-me__skills {\n    width: 100%;\n}\n\n.about-me__skill-grid {\n    display: grid;\n    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));\n    gap: 20px;\n}\n",""]);const o=l},5554:(e,n,t)=>{t.r(n),t.d(n,{default:()=>j});var r=t(4689),a=t(6540),i=t(5072),l=t.n(i),o=t(7825),s=t.n(o),c=t(7659),d=t.n(c),p=t(5056),m=t.n(p),u=t(540),g=t.n(u),h=t(1113),f=t.n(h),y=t(6388),k={};k.styleTagTransform=f(),k.setAttributes=m(),k.insert=d().bind(null,"head"),k.domAPI=s(),k.insertStyleElement=g(),l()(y.A,k),y.A&&y.A.locals&&y.A.locals;var b=t(4861),x=t(5450),v=t(3628),w=t(4848);const j=function(){var e=(0,r.r5)();return(0,a.useEffect)((function(){console.error(e)}),[]),(0,w.jsxs)("div",{className:"route-error-boundary",children:[(0,w.jsxs)("div",{className:"route-error-boundary__title",children:[(0,w.jsx)(x.I,{iconType:v.AT.TAUNT}),(0,w.jsx)("h1",{children:"Something Went Wrong..."})]}),(0,w.jsxs)("div",{className:"route-error-boundary__content",children:[(0,w.jsx)("p",{children:"An unexpected error occured."}),(0,w.jsxs)(b.$,{onClick:function(){window.location.href="/"},children:[(0,w.jsx)(x.I,{iconType:v.AT.HOME}),"To homepage"]})]})]})}},6388:(e,n,t)=>{t.d(n,{A:()=>o});var r=t(1601),a=t.n(r),i=t(6314),l=t.n(i)()(a());l.push([e.id,".route-error-boundary {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    gap: 20px;\n}\n\n.route-error-boundary__title {\n    display: flex;\n    flex-direction: row;\n    align-items: center;\n    gap: 20px;\n}\n\n.route-error-boundary__content {\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n}\n",""]);const o=l},6884:(e,n,t)=>{t.d(n,{A:()=>o});var r=t(1601),a=t.n(r),i=t(6314),l=t.n(i)()(a());l.push([e.id,'[data-theme="default-card"] {\n    --card-gradient-color: radial-gradient(circle at top right, #1f2028, #3b3b40);\n    --card-gradient-image: url("https://liamj.b-cdn.net/assets/images/soft-wallpaper.png");\n}\n\n[data-theme="red-card"] {\n    --card-gradient-color: radial-gradient(circle at top right, #a02e2f, #CC1818);\n    --card-gradient-image: url("https://liamj.b-cdn.net/assets/images/french-stucco.png");\n}\n\n[data-theme="blue-card"] {\n    --card-gradient-color: radial-gradient(circle at top right, #708694, #4a87ac);\n    --card-gradient-image: url("https://liamj.b-cdn.net/assets/images/french-stucco.png");\n}\n\n[data-theme="green-card"] {\n    --card-gradient-color: radial-gradient(circle at top right, #2f3f1c, #475F29);\n    --card-gradient-image: url("https://transparenttextures.com/patterns/black-orchid.png");\n}\n\n.skill-card {\n    display: flex;\n    flex-direction: column;\n    justify-content: space-between;\n    align-items: center;\n    gap: 4px;\n\n    min-width: 150px;\n\n    background-color: #3b3b40;\n    border-radius: 8px;\n    box-shadow: 1px 1px 16px #1f2028;\n}\n\n.skill-card__gradient {\n    display: flex;\n    flex-direction: row;\n    justify-content: center;\n    align-items: center;\n\n    height: 150px;\n    width: 100%;\n\n    border-radius: 8px 8px 0 0;\n\n    background-image: var(--card-gradient-image), var(--card-gradient-color);\n}\n\n.skill-card__title {\n    font-size: 16px;\n    font-weight: 700;\n    text-align: center;\n}\n\n.skill-card__container {\n    display: flex;\n    flex-direction: column;\n    justify-content: space-between;\n}\n\n@media only screen and (max-width: 1280px) {\n    .skill-grid {\n        grid-template-columns: 1fr 1fr 1fr;\n    }\n}\n\n@media only screen and (max-width: 600px) {\n    .skill-grid {\n        grid-template-columns: 1fr;\n    }\n\n    .skill-card {\n        width: 90%;\n    }\n}\n\n\n@media only screen and (max-width: 600px) {\n    .skill-grid {\n        grid-template-columns: 1fr;\n    }\n\n    .skill-card {\n        width: 90%;\n    }\n}\n',""]);const o=l}}]);