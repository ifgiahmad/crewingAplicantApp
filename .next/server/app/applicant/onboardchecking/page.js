(()=>{var e={};e.id=479,e.ids=[479],e.modules={7849:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external")},2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},5403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},4749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},9491:e=>{"use strict";e.exports=require("assert")},2361:e=>{"use strict";e.exports=require("events")},7147:e=>{"use strict";e.exports=require("fs")},3685:e=>{"use strict";e.exports=require("http")},5687:e=>{"use strict";e.exports=require("https")},2037:e=>{"use strict";e.exports=require("os")},1017:e=>{"use strict";e.exports=require("path")},2781:e=>{"use strict";e.exports=require("stream")},6224:e=>{"use strict";e.exports=require("tty")},7310:e=>{"use strict";e.exports=require("url")},3837:e=>{"use strict";e.exports=require("util")},9796:e=>{"use strict";e.exports=require("zlib")},8957:(e,t,r)=>{"use strict";r.r(t),r.d(t,{GlobalError:()=>i.a,__next_app__:()=>x,originalPathname:()=>u,pages:()=>d,routeModule:()=>p,tree:()=>c}),r(1801),r(1506),r(5866);var a=r(3191),s=r(8716),n=r(7922),i=r.n(n),l=r(5231),o={};for(let e in l)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(o[e]=()=>l[e]);r.d(t,o);let c=["",{children:["applicant",{children:["onboardchecking",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,1801)),"D:\\Source\\NextJS\\crewing-app\\app\\applicant\\onboardchecking\\page.tsx"]}]},{}]},{metadata:{icon:[async e=>(await Promise.resolve().then(r.bind(r,7481))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}]},{layout:[()=>Promise.resolve().then(r.bind(r,1506)),"D:\\Source\\NextJS\\crewing-app\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(r.t.bind(r,5866,23)),"next/dist/client/components/not-found-error"],metadata:{icon:[async e=>(await Promise.resolve().then(r.bind(r,7481))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}],d=["D:\\Source\\NextJS\\crewing-app\\app\\applicant\\onboardchecking\\page.tsx"],u="/applicant/onboardchecking/page",x={require:r,loadChunk:()=>Promise.resolve()},p=new a.AppPageRouteModule({definition:{kind:s.x.APP_PAGE,page:"/applicant/onboardchecking/page",pathname:"/applicant/onboardchecking",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})},9913:(e,t,r)=>{Promise.resolve().then(r.bind(r,3517)),Promise.resolve().then(r.t.bind(r,2481,23))},3517:(e,t,r)=>{"use strict";r.d(t,{default:()=>c});var a=r(326),s=r(8576),n=r(1207),i=r(7577),l=r(5047),o=r(2157);let c=()=>{let e=(0,l.useRouter)(),[t,r]=(0,i.useState)([]),[c,d]=(0,i.useState)(null),[u,x]=(0,i.useState)([]),[p,g]=(0,i.useState)(new o.Z),[m,h]=(0,i.useState)(""),[b,f]=(0,i.useState)("");(0,i.useEffect)(()=>{},[]);let N=async t=>{let a=Object.fromEntries(t.entries());console.log(a);let s=await n.Z.getCrewRekrutmenListNonAuth("ONBOARD",a.IdPelaut,a.Nama,a.Tanggal,a.NIK),i=await n.Z.getCrewRekrutmenListNonAuth("ONBOARD_EXISTING",a.IdPelaut,a.Nama,a.Tanggal,a.NIK),l=await n.Z.getCrewRekrutmenListNonAuth("ONBOARD_RESIGN",a.IdPelaut,a.Nama,a.Tanggal,a.NIK);if((await n.Z.getCrewRekrutmenListNonAuth("BLACKLIST",a.IdPelaut,a.Nama,a.Tanggal,a.NIK)).length>0)throw Error("Anda Sudah Di Blacklist Dari LMI Group");if(s.length>0&&i.length>0&&0==l.length)throw Error("Anda sudah pernah menjadi Crew di LMI Group dan status anda di database kami masih Aktif, Silahkan hubungi Tim Crewing Rekrutmen LMI");if(s&&s.length>0){let t=s.sort((e,t)=>e.id-t.id);r(t),d(t[t.length-1].id);let a=t[t.length-1].id,n=t[t.length-1].silverCode,i=t[t.length-1].nomorKTP;console.log(a,n,i),e.push(`/onboardchecking/onboard/${a}/${n}/${i}`)}else e.push(`/onboardchecking/onboard/0/${a.IdPelaut}/${a.NIK}`)};return a.jsx("div",{className:"flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4",children:(0,a.jsxs)("div",{className:"w-full max-w-lg bg-white p-8 rounded-md shadow-md",children:[a.jsx("div",{className:" bg-green-800 mb-2 p-2 rounded-md shadow-md text-center text-lg text-white uppercase",children:"Onboard Checking"}),(0,a.jsxs)("form",{action:N,children:[(0,a.jsxs)("div",{className:"mb-2",children:[(0,a.jsxs)("label",{htmlFor:"NIK",className:"block text-xs font-small text-gray-900 mb-1",children:[a.jsx("sup",{children:"* "}),"Nomor KTP"]}),a.jsx("input",{type:"number",name:"NIK",id:"NIK",className:"bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5",placeholder:"Contoh: 3211xxxxxxxxxxxx (panjang 16 karakter)",onChange:e=>{e.target.value.length<=16&&h(e.target.value)},value:m,required:!0})]}),(0,a.jsxs)("div",{className:"mb-2",children:[(0,a.jsxs)("label",{htmlFor:"Nama",className:"block text-xs font-small text-gray-900 mb-1",children:[a.jsx("sup",{children:"* "}),"Nama Lengkap"]}),a.jsx("input",{type:"text",name:"Nama",id:"Nama",className:"bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5 uppercase",placeholder:"Nama Lengkap",required:!0})]}),(0,a.jsxs)("div",{className:"mb-2",children:[(0,a.jsxs)("label",{htmlFor:"Tanggal",className:"block text-xs font-medium text-gray-900 mb-1",children:[a.jsx("sup",{children:"* "}),"Tanggal Lahir"]}),a.jsx("input",{type:"date",name:"Tanggal",id:"Tanggal",className:"bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5",placeholder:"Tanggal Lahir",required:!0})]}),(0,a.jsxs)("div",{className:"mb-2",children:[(0,a.jsxs)("label",{htmlFor:"SilverCode",className:"block text-xs font-small text-gray-900 mb-1",children:[a.jsx("sup",{children:"* "}),"Kode Pelaut"]}),a.jsx("input",{type:"number",name:"IdPelaut",id:"IdPelaut",value:b,className:"bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5",placeholder:"Kode pelaut (panjang 10 Karakter) ",required:!0,onChange:e=>{e.target.value.length<=10&&f(e.target.value)}})]}),a.jsx("div",{className:"mb-2",children:a.jsx(s.Z,{elementId:"Posisi",labelName:"Posisi Yang Ingin Dilamar"})}),a.jsx("div",{className:"row-auto",children:a.jsx("button",{type:"submit",className:"text-white bg-green-900 hover:bg-green-800 font-medium rounded text-xs w-full px-5 py-3 text-center",children:"Lanjutkan"})})]})]})})}},8576:(e,t,r)=>{"use strict";r.d(t,{Z:()=>l});var a=r(326),s=r(7577),n=r(6498),i=r(1207);let l=({elementId:e,labelName:t})=>{let[r,l]=(0,s.useState)([]),[o,c]=(0,s.useState)("");return(0,s.useEffect)(()=>{(async()=>{try{let e=(await i.Z.getMasterByTypeNonAuth("CREW_LVL")).map(e=>new n.Z(e.id,e.kodeMaster,e.tipeMaster,e.textMaster,e.urutan,e.createdBy,e.createdTime,e.modifiedBy,e.modifiedTime,e.aktif));l(e),console.log()}catch(e){console.error("Error fetching cities:",e)}})()},[]),(0,a.jsxs)("div",{children:[(0,a.jsxs)("label",{htmlFor:e,className:"block text-xs font-small text-gray-900 mb-1",children:[a.jsx("sup",{children:"* "}),t]}),(0,a.jsxs)("select",{id:e,name:e,value:o||"",onChange:e=>{c(e.target.value)},className:"bg-gray-50 border border-gray-300 text-gray-900 text-xs focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5 rounded",children:[(0,a.jsxs)("option",{value:"",children:[" --Pilih ",t," --"]}),r.map(e=>a.jsx("option",{value:e.textMaster,children:e.textMaster},e.id))]})]})}},1801:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>l});var a=r(9510),s=r(3618),n=r(6333),i=r(1566);let l=()=>(0,a.jsxs)("div",{children:[a.jsx(n.Z,{}),a.jsx("div",{className:"w-50",children:a.jsx(s.ZP,{})}),a.jsx(i.Z,{})]})},3618:(e,t,r)=>{"use strict";r.d(t,{ZP:()=>l});var a=r(8570);let s=(0,a.createProxy)(String.raw`D:\Source\NextJS\crewing-app\components\checking-onboard-form.tsx`),{__esModule:n,$$typeof:i}=s;s.default;let l=(0,a.createProxy)(String.raw`D:\Source\NextJS\crewing-app\components\checking-onboard-form.tsx#default`)},1566:(e,t,r)=>{"use strict";r.d(t,{Z:()=>s});var a=r(9510);let s=()=>a.jsx("footer",{className:"bg-green-950 p-4",children:a.jsx("div",{className:"container mx-auto text-center text-white",children:a.jsx("p",{children:"\xa9 IT Dept LMI Group"})})})},6333:(e,t,r)=>{"use strict";r.d(t,{Z:()=>n});var a=r(9510),s=r(7710);let n=()=>a.jsx("header",{className:"bg-green-950 p-4",children:a.jsx("div",{className:"container mx-auto flex justify-between items-center",children:(0,a.jsxs)("div",{className:"flex flex-col items-center bg-white p-1 rounded-md",children:[a.jsx(s.default,{src:"/LogoLMI.png",alt:"Company Logo",className:"h-10 mr-2",width:100,height:100}),a.jsx("div",{className:"text-green-950 font-bold",children:"PT. Lintas Maritim Indonesia"})]})})})}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[948,992,621,45,710,847],()=>r(8957));module.exports=a})();