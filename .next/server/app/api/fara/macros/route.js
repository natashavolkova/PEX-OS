(()=>{var a={};a.id=502,a.ids=[502],a.modules={261:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/app-paths")},3295:a=>{"use strict";a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},19121:a=>{"use strict";a.exports=require("next/dist/server/app-render/action-async-storage.external.js")},29294:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},44870:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},63033:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},66027:(a,b,c)=>{"use strict";c.r(b),c.d(b,{handler:()=>G,patchFetch:()=>F,routeModule:()=>B,serverHooks:()=>E,workAsyncStorage:()=>C,workUnitAsyncStorage:()=>D});var d={};c.r(d),c.d(d,{DELETE:()=>A,GET:()=>x,POST:()=>y,PUT:()=>z});var e=c(95736),f=c(9117),g=c(4044),h=c(39326),i=c(32324),j=c(261),k=c(54290),l=c(85328),m=c(38928),n=c(46595),o=c(3421),p=c(17679),q=c(41681),r=c(63446),s=c(86439),t=c(51356),u=c(10641),v=c(95012);let w=[{id:"macro-react-component",name:"Create React Component",description:"Generate a TypeScript React component with props interface and styling",category:"react",keybinding:"<leader>rc",content:`-- React Component Template
local function create_component(name)
  local template = [[
import React from 'react';

interface \${name}Props {
  // Add props here
}

export const \${name}: React.FC<\${name}Props> = (props) => {
  return (
    <div className="">
      {/* Component content */}
    </div>
  );
};

export default \${name};
]]
  return template:gsub('\${name}', name)
end`},{id:"macro-api-route",name:"Generate API Route",description:"Create a Next.js API route with GET/POST handlers",category:"api",keybinding:"<leader>ar",content:`-- API Route Template
local function create_api_route(name)
  local template = [[
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // TODO: Implement GET handler
  return NextResponse.json({ success: true });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  // TODO: Implement POST handler
  return NextResponse.json({ success: true, data: body });
}
]]
  return template
end`},{id:"macro-crud",name:"CRUD Operations",description:"Generate full CRUD API endpoints for a resource",category:"crud",keybinding:"<leader>cr",content:`-- CRUD Template
-- Generates: GET (list), GET (single), POST, PATCH, DELETE`},{id:"macro-mvp-scaffold",name:"MVP Boilerplate",description:"Scaffold a complete Micro-MVP structure",category:"mvp",keybinding:"<leader>mvp",content:`-- MVP Scaffold
-- Creates: pages, components, stores, api routes`},{id:"macro-landing",name:"Landing Page Skeleton",description:"Generate landing page structure with hero, features, CTA sections",category:"landing",keybinding:"<leader>lp",content:`-- Landing Page Template
-- Sections: Hero, Features, Social Proof, Pricing, CTA, Footer`},{id:"macro-zustand-store",name:"Zustand Store",description:"Create a typed Zustand store with persist middleware",category:"general",keybinding:"<leader>zs",content:`-- Zustand Store Template
local function create_store(name)
  local template = [[
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface \${name}State {
  // State properties
  data: any[];
  
  // Actions
  actions: {
    add: (item: any) => void;
    remove: (id: string) => void;
    update: (id: string, updates: Partial<any>) => void;
  };
}

export const use\${name}Store = create<\${name}State>()(
  devtools(
    persist(
      (set, get) => ({
        data: [],
        
        actions: {
          add: (item) => set((state) => ({ data: [...state.data, item] })),
          remove: (id) => set((state) => ({ data: state.data.filter(i => i.id !== id) })),
          update: (id, updates) => set((state) => ({
            data: state.data.map(i => i.id === id ? { ...i, ...updates } : i)
          })),
        },
      }),
      { name: '\${name}-storage' }
    ),
    { name: '\${name}Store' }
  )
);
]]
  return template:gsub('\${name}', name)
end`}];async function x(a){let{searchParams:b}=new URL(a.url),c=b.get("category");console.log("[API] GET /api/fara/macros",{category:c});let d=[...w];c&&(d=d.filter(a=>a.category===c));let e=[...new Set(w.map(a=>a.category))];return u.NextResponse.json({success:!0,data:{macros:d,categories:e,total:d.length}})}async function y(a){let b=await a.json();console.log("[API] POST /api/fara/macros - Execute",b);let{macroId:c,params:d={}}=b;if(!c)return u.NextResponse.json({success:!1,error:"macroId is required"},{status:400});let e=w.find(a=>a.id===c);return e?u.NextResponse.json({success:!0,data:{macroId:c,macroName:e.name,executed:!0,params:d,output:`Macro "${e.name}" executed successfully`,generatedFiles:"react"===e.category?["components/NewComponent.tsx"]:[]},message:`Executed macro: ${e.name}`}):u.NextResponse.json({success:!1,error:"Macro not found"},{status:404})}async function z(a){let b=await a.json();console.log("[API] PUT /api/fara/macros - Create",b);let{name:c,description:d,category:e,keybinding:f,content:g}=b;if(!c||!g)return u.NextResponse.json({success:!1,error:"name and content are required"},{status:400});let h={id:(0,v.$C)(),name:c,description:d||"",category:e||"general",keybinding:f,content:g};return u.NextResponse.json({success:!0,data:h,message:"Custom macro created"})}async function A(a){let{searchParams:b}=new URL(a.url),c=b.get("macroId");return(console.log("[API] DELETE /api/fara/macros",{macroId:c}),c)?u.NextResponse.json({success:!0,message:"Macro deleted"}):u.NextResponse.json({success:!1,error:"macroId is required"},{status:400})}let B=new e.AppRouteRouteModule({definition:{kind:f.RouteKind.APP_ROUTE,page:"/api/fara/macros/route",pathname:"/api/fara/macros",filename:"route",bundlePath:"app/api/fara/macros/route"},distDir:".next",relativeProjectDir:"",resolvedPagePath:"C:\\Users\\Luke\\Documents\\WORKSPACE\\FFWORKSPACEALL\\FFWORKSPACE\\AthenaPeX\\app\\api\\fara\\macros\\route.ts",nextConfigOutput:"",userland:d}),{workAsyncStorage:C,workUnitAsyncStorage:D,serverHooks:E}=B;function F(){return(0,g.patchFetch)({workAsyncStorage:C,workUnitAsyncStorage:D})}async function G(a,b,c){var d;let e="/api/fara/macros/route";"/index"===e&&(e="/");let g=await B.prepare(a,b,{srcPage:e,multiZoneDraftMode:!1});if(!g)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:u,params:v,nextConfig:w,isDraftMode:x,prerenderManifest:y,routerServerContext:z,isOnDemandRevalidate:A,revalidateOnlyGenerated:C,resolvedPathname:D}=g,E=(0,j.normalizeAppPath)(e),F=!!(y.dynamicRoutes[E]||y.routes[D]);if(F&&!x){let a=!!y.routes[D],b=y.dynamicRoutes[E];if(b&&!1===b.fallback&&!a)throw new s.NoFallbackError}let G=null;!F||B.isDev||x||(G="/index"===(G=D)?"/":G);let H=!0===B.isDev||!F,I=F&&!H,J=a.method||"GET",K=(0,i.getTracer)(),L=K.getActiveScopeSpan(),M={params:v,prerenderManifest:y,renderOpts:{experimental:{cacheComponents:!!w.experimental.cacheComponents,authInterrupts:!!w.experimental.authInterrupts},supportsDynamicResponse:H,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:null==(d=w.experimental)?void 0:d.cacheLife,isRevalidate:I,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d)=>B.onRequestError(a,b,d,z)},sharedContext:{buildId:u}},N=new k.NodeNextRequest(a),O=new k.NodeNextResponse(b),P=l.NextRequestAdapter.fromNodeNextRequest(N,(0,l.signalFromNodeResponse)(b));try{let d=async c=>B.handle(P,M).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=K.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${J} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${J} ${a.url}`)}),g=async g=>{var i,j;let k=async({previousCacheEntry:f})=>{try{if(!(0,h.getRequestMeta)(a,"minimalMode")&&A&&C&&!f)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let e=await d(g);a.fetchMetrics=M.renderOpts.fetchMetrics;let i=M.renderOpts.pendingWaitUntil;i&&c.waitUntil&&(c.waitUntil(i),i=void 0);let j=M.renderOpts.collectedTags;if(!F)return await (0,o.I)(N,O,e,M.renderOpts.pendingWaitUntil),null;{let a=await e.blob(),b=(0,p.toNodeOutgoingHttpHeaders)(e.headers);j&&(b[r.NEXT_CACHE_TAGS_HEADER]=j),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==M.renderOpts.collectedRevalidate&&!(M.renderOpts.collectedRevalidate>=r.INFINITE_CACHE)&&M.renderOpts.collectedRevalidate,d=void 0===M.renderOpts.collectedExpire||M.renderOpts.collectedExpire>=r.INFINITE_CACHE?void 0:M.renderOpts.collectedExpire;return{value:{kind:t.CachedRouteKind.APP_ROUTE,status:e.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:d}}}}catch(b){throw(null==f?void 0:f.isStale)&&await B.onRequestError(a,b,{routerKind:"App Router",routePath:e,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:A})},z),b}},l=await B.handleResponse({req:a,nextConfig:w,cacheKey:G,routeKind:f.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:y,isRoutePPREnabled:!1,isOnDemandRevalidate:A,revalidateOnlyGenerated:C,responseGenerator:k,waitUntil:c.waitUntil});if(!F)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==t.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(j=l.value)?void 0:j.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,h.getRequestMeta)(a,"minimalMode")||b.setHeader("x-nextjs-cache",A?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),x&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return(0,h.getRequestMeta)(a,"minimalMode")&&F||m.delete(r.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||b.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,q.getCacheControlHeader)(l.cacheControl)),await (0,o.I)(N,O,new Response(l.value.body,{headers:m,status:l.value.status||200})),null};L?await g(L):await K.withPropagatedContext(a.headers,()=>K.trace(m.BaseServerSpan.handleRequest,{spanName:`${J} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":J,"http.target":a.url}},g))}catch(b){if(b instanceof s.NoFallbackError||await B.onRequestError(a,b,{routerKind:"App Router",routePath:E,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:A})}),F)throw b;return await (0,o.I)(N,O,new Response(null,{status:500})),null}}},78335:()=>{},86439:a=>{"use strict";a.exports=require("next/dist/shared/lib/no-fallback-error.external")},95012:(a,b,c)=>{"use strict";function d(){return`${Date.now()}-${Math.random().toString(36).substr(2,9)}`}function e(a){for(let b of[/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/]){let c=a.match(b);if(c)return c[1]}return null}function f(a){return`https://img.youtube.com/vi/${a}/mqdefault.jpg`}function g(a,b){let c,d,e=0===b?10*a:Math.round(a/b*10)/10;return e>=2?(c="execute",d="critical"):e>=1.5?(c="execute",d="high"):e>=1?(c="delegate",d="medium"):(c=e>=.5?"defer":"eliminate",d="low"),{roi:e,recommendation:c,priority:d}}c.d(b,{$C:()=>d,EZ:()=>f,JJ:()=>g,gE:()=>e})},96487:()=>{}};var b=require("../../../../webpack-runtime.js");b.C(a);var c=b.X(0,[586,692],()=>b(b.s=66027));module.exports=c})();