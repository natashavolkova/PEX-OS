"use strict";(()=>{var e={};e.id=593,e.ids=[593],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},5556:(e,t,a)=>{a.r(t),a.d(t,{originalPathname:()=>P,patchFetch:()=>R,requestAsyncStorage:()=>f,routeModule:()=>g,serverHooks:()=>x,staticGenerationAsyncStorage:()=>y});var r={};a.r(r),a.d(r,{DELETE:()=>l,GET:()=>d,POST:()=>m,PUT:()=>p});var n=a(9303),o=a(8716),s=a(670),c=a(7070),i=a(650);let u=[{id:"macro-react-component",name:"Create React Component",description:"Generate a TypeScript React component with props interface and styling",category:"react",keybinding:"<leader>rc",content:`-- React Component Template
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
end`}];async function d(e){let{searchParams:t}=new URL(e.url),a=t.get("category");console.log("[API] GET /api/fara/macros",{category:a});let r=[...u];a&&(r=r.filter(e=>e.category===a));let n=[...new Set(u.map(e=>e.category))];return c.NextResponse.json({success:!0,data:{macros:r,categories:n,total:r.length}})}async function m(e){let t=await e.json();console.log("[API] POST /api/fara/macros - Execute",t);let{macroId:a,params:r={}}=t;if(!a)return c.NextResponse.json({success:!1,error:"macroId is required"},{status:400});let n=u.find(e=>e.id===a);return n?c.NextResponse.json({success:!0,data:{macroId:a,macroName:n.name,executed:!0,params:r,output:`Macro "${n.name}" executed successfully`,generatedFiles:"react"===n.category?["components/NewComponent.tsx"]:[]},message:`Executed macro: ${n.name}`}):c.NextResponse.json({success:!1,error:"Macro not found"},{status:404})}async function p(e){let t=await e.json();console.log("[API] PUT /api/fara/macros - Create",t);let{name:a,description:r,category:n,keybinding:o,content:s}=t;if(!a||!s)return c.NextResponse.json({success:!1,error:"name and content are required"},{status:400});let u={id:(0,i.Ox)(),name:a,description:r||"",category:n||"general",keybinding:o,content:s};return c.NextResponse.json({success:!0,data:u,message:"Custom macro created"})}async function l(e){let{searchParams:t}=new URL(e.url),a=t.get("macroId");return(console.log("[API] DELETE /api/fara/macros",{macroId:a}),a)?c.NextResponse.json({success:!0,message:"Macro deleted"}):c.NextResponse.json({success:!1,error:"macroId is required"},{status:400})}let g=new n.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/fara/macros/route",pathname:"/api/fara/macros",filename:"route",bundlePath:"app/api/fara/macros/route"},resolvedPagePath:"C:\\Users\\Luke\\Documents\\WORKSPACE\\FFWORKSPACEALL\\FFWORKSPACE\\AthenaPeX\\app\\api\\fara\\macros\\route.ts",nextConfigOutput:"standalone",userland:r}),{requestAsyncStorage:f,staticGenerationAsyncStorage:y,serverHooks:x}=g,P="/api/fara/macros/route";function R(){return(0,s.patchFetch)({serverHooks:x,staticGenerationAsyncStorage:y})}},650:(e,t,a)=>{function r(){return`${Date.now()}-${Math.random().toString(36).substr(2,9)}`}function n(e){for(let t of[/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/]){let a=e.match(t);if(a)return a[1]}return null}function o(e){return`https://img.youtube.com/vi/${e}/mqdefault.jpg`}function s(e,t){let a,r;let n=0===t?10*e:Math.round(e/t*10)/10;return n>=2?(a="execute",r="critical"):n>=1.5?(a="execute",r="high"):n>=1?(a="delegate",r="medium"):(a=n>=.5?"defer":"eliminate",r="low"),{roi:n,recommendation:a,priority:r}}a.d(t,{Ox:()=>r,PB:()=>s,TO:()=>o,y1:()=>n})}};var t=require("../../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),r=t.X(0,[948,972],()=>a(5556));module.exports=r})();