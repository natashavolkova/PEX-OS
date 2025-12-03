(()=>{var e={};e.id=8031,e.ids=[8031],e.modules={7849:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external")},2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},5403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},4749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},5079:(e,t,i)=>{"use strict";i.r(t),i.d(t,{GlobalError:()=>s.a,__next_app__:()=>m,originalPathname:()=>c,pages:()=>p,routeModule:()=>x,tree:()=>d}),i(3232),i(9684),i(9668),i(5866);var a=i(3191),n=i(8716),r=i(7922),s=i.n(r),o=i(5231),l={};for(let e in o)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>o[e]);i.d(t,l);let d=["",{children:["pex-os",{children:["neovim",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(i.bind(i,3232)),"/home/user/webapp/app/pex-os/neovim/page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(i.bind(i,9684)),"/home/user/webapp/app/pex-os/layout.tsx"]}]},{layout:[()=>Promise.resolve().then(i.bind(i,9668)),"/home/user/webapp/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(i.t.bind(i,5866,23)),"next/dist/client/components/not-found-error"]}],p=["/home/user/webapp/app/pex-os/neovim/page.tsx"],c="/pex-os/neovim/page",m={require:i,loadChunk:()=>Promise.resolve()},x=new a.AppPageRouteModule({definition:{kind:n.x.APP_PAGE,page:"/pex-os/neovim/page",pathname:"/pex-os/neovim",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},338:(e,t,i)=>{Promise.resolve().then(i.bind(i,5725))},5725:(e,t,i)=>{"use strict";i.r(t),i.d(t,{default:()=>w});var a=i(326),n=i(7577),r=i(2881);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,r.Z)("Terminal",[["polyline",{points:"4 17 10 11 4 5",key:"akl6gq"}],["line",{x1:"12",x2:"20",y1:"19",y2:"19",key:"q2wloq"}]]);var o=i(2933),l=i(3810),d=i(1540);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let p=(0,r.Z)("Code",[["polyline",{points:"16 18 22 12 16 6",key:"z7tu5w"}],["polyline",{points:"8 6 2 12 8 18",key:"1eg1df"}]]);var c=i(9163);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let m=(0,r.Z)("Plug",[["path",{d:"M12 22v-5",key:"1ega77"}],["path",{d:"M9 8V2",key:"14iosj"}],["path",{d:"M15 8V2",key:"18g5xt"}],["path",{d:"M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z",key:"osxo6l"}]]),x=(0,r.Z)("Keyboard",[["path",{d:"M10 8h.01",key:"1r9ogq"}],["path",{d:"M12 12h.01",key:"1mp3jc"}],["path",{d:"M14 8h.01",key:"1primd"}],["path",{d:"M16 12h.01",key:"1l6xoz"}],["path",{d:"M18 8h.01",key:"emo2bl"}],["path",{d:"M6 8h.01",key:"x9i8wu"}],["path",{d:"M7 16h10",key:"wp8him"}],["path",{d:"M8 12h.01",key:"czm47f"}],["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}]]);var g=i(4893),u=i(1742),h=i(7863);let b=[{language:"TypeScript",server:"typescript-language-server",enabled:!0,description:"TypeScript/JavaScript LSP"},{language:"Python",server:"pyright",enabled:!0,description:"Python type checking and LSP"},{language:"Rust",server:"rust-analyzer",enabled:!1,description:"Rust language server"},{language:"Go",server:"gopls",enabled:!1,description:"Go language server"},{language:"Lua",server:"lua_ls",enabled:!0,description:"Lua language server (for Neovim config)"},{language:"Bash",server:"bashls",enabled:!0,description:"Bash language server"},{language:"JSON",server:"jsonls",enabled:!0,description:"JSON language server"},{language:"CSS",server:"cssls",enabled:!0,description:"CSS/SCSS/Less LSP"},{language:"HTML",server:"html",enabled:!0,description:"HTML language server"},{language:"Tailwind",server:"tailwindcss",enabled:!0,description:"Tailwind CSS IntelliSense"}],y=[{name:"telescope.nvim",repo:"nvim-telescope/telescope.nvim",enabled:!0,description:"Fuzzy finder",category:"Navigation"},{name:"nvim-treesitter",repo:"nvim-treesitter/nvim-treesitter",enabled:!0,description:"Syntax highlighting",category:"Syntax"},{name:"nvim-lspconfig",repo:"neovim/nvim-lspconfig",enabled:!0,description:"LSP configuration",category:"LSP"},{name:"nvim-cmp",repo:"hrsh7th/nvim-cmp",enabled:!0,description:"Autocompletion",category:"Completion"},{name:"copilot.vim",repo:"github/copilot.vim",enabled:!0,description:"GitHub Copilot",category:"AI"},{name:"harpoon",repo:"ThePrimeagen/harpoon",enabled:!0,description:"Quick file navigation",category:"Navigation"},{name:"gitsigns.nvim",repo:"lewis6991/gitsigns.nvim",enabled:!0,description:"Git decorations",category:"Git"},{name:"neo-tree.nvim",repo:"nvim-neo-tree/neo-tree.nvim",enabled:!0,description:"File explorer",category:"Navigation"},{name:"lualine.nvim",repo:"nvim-lualine/lualine.nvim",enabled:!0,description:"Status line",category:"UI"},{name:"which-key.nvim",repo:"folke/which-key.nvim",enabled:!0,description:"Keybinding helper",category:"Utility"},{name:"trouble.nvim",repo:"folke/trouble.nvim",enabled:!0,description:"Diagnostics list",category:"LSP"},{name:"todo-comments.nvim",repo:"folke/todo-comments.nvim",enabled:!0,description:"TODO highlighting",category:"Utility"}],v=[{mode:"n",key:"<leader>w",action:":w<CR>",description:"Quick save"},{mode:"n",key:"<leader>q",action:":q<CR>",description:"Quick quit"},{mode:"n",key:"<leader>x",action:":x<CR>",description:"Save and quit"},{mode:"n",key:"<C-h>",action:"<C-w>h",description:"Navigate left"},{mode:"n",key:"<C-j>",action:"<C-w>j",description:"Navigate down"},{mode:"n",key:"<C-k>",action:"<C-w>k",description:"Navigate up"},{mode:"n",key:"<C-l>",action:"<C-w>l",description:"Navigate right"},{mode:"n",key:"<leader>ff",action:":Telescope find_files<CR>",description:"Find files"},{mode:"n",key:"<leader>fg",action:":Telescope live_grep<CR>",description:"Live grep"},{mode:"n",key:"<leader>fb",action:":Telescope buffers<CR>",description:"Find buffers"},{mode:"n",key:"<leader>e",action:":Neotree toggle<CR>",description:"Toggle file explorer"},{mode:"n",key:"<leader>ca",action:"vim.lsp.buf.code_action",description:"Code actions"},{mode:"n",key:"gd",action:"vim.lsp.buf.definition",description:"Go to definition"},{mode:"n",key:"K",action:"vim.lsp.buf.hover",description:"Hover documentation"}],f=[{id:"macro-react",name:"React Component",description:"Generate React TSX component",keybinding:"<leader>rc",enabled:!0},{id:"macro-api",name:"API Route",description:"Generate Next.js API route",keybinding:"<leader>ar",enabled:!0},{id:"macro-store",name:"Zustand Store",description:"Generate Zustand store template",keybinding:"<leader>zs",enabled:!0},{id:"macro-test",name:"Test File",description:"Generate test file template",keybinding:"<leader>tf",enabled:!0}],j=(e,t,i,a)=>{let n=e.filter(e=>e.enabled),r=t.filter(e=>e.enabled),s=a.filter(e=>e.enabled);return`-- ============================================================================
-- AthenaPeX NEOVIM CONFIGURATION
-- ATHENA Architecture | ENTJ Omega Builder
-- Generated: ${new Date().toISOString()}
-- ============================================================================

-- Set leader key
vim.g.mapleader = ' '
vim.g.maplocalleader = ' '

-- ============================================================================
-- OPTIONS
-- ============================================================================
local opt = vim.opt

opt.number = true
opt.relativenumber = true
opt.tabstop = 2
opt.shiftwidth = 2
opt.expandtab = true
opt.smartindent = true
opt.wrap = false
opt.signcolumn = 'yes'
opt.updatetime = 50
opt.colorcolumn = '100'
opt.scrolloff = 8
opt.termguicolors = true
opt.clipboard = 'unnamedplus'
opt.undofile = true
opt.swapfile = false
opt.backup = false

-- ============================================================================
-- LAZY.NVIM BOOTSTRAP
-- ============================================================================
local lazypath = vim.fn.stdpath('data') .. '/lazy/lazy.nvim'
if not vim.loop.fs_stat(lazypath) then
  vim.fn.system({
    'git',
    'clone',
    '--filter=blob:none',
    'https://github.com/folke/lazy.nvim.git',
    '--branch=stable',
    lazypath,
  })
end
vim.opt.rtp:prepend(lazypath)

-- ============================================================================
-- PLUGINS
-- ============================================================================
require('lazy').setup({
  -- Theme
  {
    'catppuccin/nvim',
    name = 'catppuccin',
    priority = 1000,
    config = function()
      vim.cmd.colorscheme 'catppuccin-mocha'
    end,
  },

${r.map(e=>`  -- ${e.description}
  { '${e.repo}' },`).join("\n\n")}

  -- LSP Support
  {
    'VonHeikemen/lsp-zero.nvim',
    branch = 'v3.x',
    dependencies = {
      'neovim/nvim-lspconfig',
      'williamboman/mason.nvim',
      'williamboman/mason-lspconfig.nvim',
      'hrsh7th/nvim-cmp',
      'hrsh7th/cmp-nvim-lsp',
      'L3MON4D3/LuaSnip',
    },
  },
})

-- ============================================================================
-- LSP CONFIGURATION
-- ============================================================================
local lsp_zero = require('lsp-zero')

lsp_zero.on_attach(function(client, bufnr)
  lsp_zero.default_keymaps({ buffer = bufnr })
end)

require('mason').setup({})
require('mason-lspconfig').setup({
  ensure_installed = {
${n.map(e=>`    '${e.server}',`).join("\n")}
  },
  handlers = {
    lsp_zero.default_setup,
  },
})

-- ============================================================================
-- KEYMAPS
-- ============================================================================
local keymap = vim.keymap.set

${i.map(e=>e.action.startsWith("vim.")?`keymap('${e.mode}', '${e.key}', ${e.action}, { desc = '${e.description}' })`:`keymap('${e.mode}', '${e.key}', '${e.action}', { desc = '${e.description}' })`).join("\n")}

-- ============================================================================
-- ENTJ MACROS
-- ============================================================================
${s.map(e=>`-- ${e.name}: ${e.keybinding}
-- ${e.description}`).join("\n\n")}

-- ============================================================================
-- ENTJ PRODUCTIVITY RULES
-- ============================================================================
-- Maximum Productivity Over Comfort
-- Aggressive Velocity Over Perfection
-- Real Impact Over Work Quantity
-- ROI > 2.0 = EXECUTE | ROI < 0.5 = ELIMINATE
-- ============================================================================

print('AthenaPeX Neovim loaded - ENTJ Mode Active')
`},k=({enabled:e,onChange:t})=>a.jsx("button",{onClick:()=>t(!e),className:(0,h.cn)("w-10 h-5 rounded-full transition-colors relative",e?"bg-pex-primary":"bg-gray-600"),children:a.jsx("div",{className:(0,h.cn)("absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform",e?"translate-x-5":"translate-x-0.5")})}),N=()=>{let[e,t]=(0,n.useState)("lazyvim"),[i,r]=(0,n.useState)(b),[N,w]=(0,n.useState)(y),[S]=(0,n.useState)(v),[C,P]=(0,n.useState)(f),[z,T]=(0,n.useState)(!1),[M,L]=(0,n.useState)("preview"),[_,A]=(0,n.useState)({lsp:!0,plugins:!0,keymaps:!1,macros:!1}),O=(0,n.useMemo)(()=>j(i,N,S,C),[i,N,S,C]),Z=e=>{r(t=>t.map((t,i)=>i===e?{...t,enabled:!t.enabled}:t))},q=e=>{w(t=>t.map((t,i)=>i===e?{...t,enabled:!t.enabled}:t))},R=e=>{P(t=>t.map((t,i)=>i===e?{...t,enabled:!t.enabled}:t))},$=async()=>{await (0,h.vQ)(O),T(!0),setTimeout(()=>T(!1),2e3)},I={lsp:i.filter(e=>e.enabled).length,plugins:N.filter(e=>e.enabled).length,macros:C.filter(e=>e.enabled).length};return(0,a.jsxs)("div",{className:"h-full flex flex-col bg-pex-dark",children:[(0,a.jsxs)("div",{className:"h-14 bg-pex-panel border-b border-white/5 flex items-center justify-between px-6 shrink-0",children:[(0,a.jsxs)("div",{className:"flex items-center gap-3",children:[a.jsx("div",{className:"w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center",children:a.jsx(s,{size:20,className:"text-white"})}),(0,a.jsxs)("div",{children:[a.jsx("h1",{className:"text-white font-bold",children:"Neovim ENTJ Omega"}),a.jsx("p",{className:"text-gray-500 text-xs",children:"Configuration Generator"})]})]}),(0,a.jsxs)("div",{className:"flex items-center gap-3",children:[(0,a.jsxs)("button",{onClick:$,className:(0,h.cn)("flex items-center gap-2 px-4 py-2 rounded-lg transition-all",z?"bg-green-500/20 text-green-400 border border-green-500/30":"bg-pex-tertiary text-gray-300 hover:bg-white/10 border border-white/10"),children:[z?a.jsx(o.Z,{size:16}):a.jsx(l.Z,{size:16}),a.jsx("span",{className:"text-sm font-medium",children:z?"Copied!":"Copy"})]}),(0,a.jsxs)("button",{onClick:()=>{(0,h.Sv)(O,"init.lua","text/x-lua")},className:"flex items-center gap-2 px-4 py-2 bg-pex-primary hover:bg-pex-primary-hover text-white rounded-lg transition-colors",children:[a.jsx(d.Z,{size:16}),a.jsx("span",{className:"text-sm font-medium",children:"Download init.lua"})]})]})]}),a.jsx("div",{className:"h-12 bg-pex-secondary border-b border-white/5 flex items-center px-4 gap-2",children:[{id:"preview",icon:a.jsx(p,{size:14}),label:"Preview"},{id:"lsp",icon:a.jsx(c.Z,{size:14}),label:`LSP (${I.lsp})`},{id:"plugins",icon:a.jsx(m,{size:14}),label:`Plugins (${I.plugins})`},{id:"keymaps",icon:a.jsx(x,{size:14}),label:"Keymaps"},{id:"macros",icon:a.jsx(g.Z,{size:14}),label:`Macros (${I.macros})`}].map(e=>(0,a.jsxs)("button",{onClick:()=>L(e.id),className:(0,h.cn)("flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors",M===e.id?"bg-pex-primary text-white":"text-gray-400 hover:text-white hover:bg-white/5"),children:[e.icon,a.jsx("span",{children:e.label})]},e.id))}),(0,a.jsxs)("div",{className:"flex-1 overflow-hidden",children:["preview"===M&&a.jsx("div",{className:"h-full p-4",children:(0,a.jsxs)("div",{className:"h-full bg-[#1e1e2e] rounded-lg border border-white/5 overflow-auto",children:[(0,a.jsxs)("div",{className:"flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5",children:[a.jsx("span",{className:"text-gray-400 text-sm font-mono",children:"init.lua"}),(0,a.jsxs)("span",{className:"text-gray-500 text-xs",children:[O.split("\n").length," lines"]})]}),a.jsx("pre",{className:"p-4 text-sm font-mono text-gray-300 overflow-auto",children:a.jsx("code",{children:O})})]})}),"lsp"===M&&(0,a.jsxs)("div",{className:"h-full overflow-auto p-4 space-y-2",children:[a.jsx("div",{className:"mb-4 p-4 bg-pex-tertiary/50 rounded-lg border border-white/5",children:a.jsx("p",{className:"text-gray-400 text-sm",children:"Select the Language Servers to include. Disabled servers won't be installed via Mason."})}),i.map((e,t)=>(0,a.jsxs)("div",{className:"flex items-center justify-between p-4 bg-pex-panel rounded-lg border border-white/5",children:[(0,a.jsxs)("div",{className:"flex items-center gap-4",children:[a.jsx("div",{className:(0,h.cn)("w-3 h-3 rounded-full",e.enabled?"bg-green-500":"bg-gray-600")}),(0,a.jsxs)("div",{children:[a.jsx("p",{className:"text-white font-medium",children:e.language}),a.jsx("p",{className:"text-gray-500 text-xs",children:e.server})]})]}),(0,a.jsxs)("div",{className:"flex items-center gap-4",children:[a.jsx("span",{className:"text-gray-500 text-xs hidden md:block",children:e.description}),a.jsx(k,{enabled:e.enabled,onChange:()=>Z(t)})]})]},e.language))]}),"plugins"===M&&(0,a.jsxs)("div",{className:"h-full overflow-auto p-4 space-y-2",children:[a.jsx("div",{className:"mb-4 p-4 bg-pex-tertiary/50 rounded-lg border border-white/5",children:a.jsx("p",{className:"text-gray-400 text-sm",children:"Enable or disable plugins. Core plugins like LSP Zero are always included."})}),N.map((e,t)=>(0,a.jsxs)("div",{className:"flex items-center justify-between p-4 bg-pex-panel rounded-lg border border-white/5",children:[(0,a.jsxs)("div",{className:"flex items-center gap-4",children:[a.jsx("div",{className:(0,h.cn)("w-3 h-3 rounded-full",e.enabled?"bg-green-500":"bg-gray-600")}),(0,a.jsxs)("div",{children:[a.jsx("p",{className:"text-white font-medium",children:e.name}),a.jsx("p",{className:"text-gray-500 text-xs",children:e.repo})]})]}),(0,a.jsxs)("div",{className:"flex items-center gap-4",children:[a.jsx("span",{className:"px-2 py-0.5 bg-pex-primary/20 text-pex-primary text-xs rounded",children:e.category}),a.jsx(k,{enabled:e.enabled,onChange:()=>q(t)})]})]},e.repo))]}),"keymaps"===M&&(0,a.jsxs)("div",{className:"h-full overflow-auto p-4 space-y-2",children:[a.jsx("div",{className:"mb-4 p-4 bg-pex-tertiary/50 rounded-lg border border-white/5",children:a.jsx("p",{className:"text-gray-400 text-sm",children:"ENTJ-optimized keybindings for maximum productivity. Leader key is SPACE."})}),S.map((e,t)=>(0,a.jsxs)("div",{className:"flex items-center justify-between p-4 bg-pex-panel rounded-lg border border-white/5",children:[(0,a.jsxs)("div",{className:"flex items-center gap-4",children:[a.jsx("kbd",{className:"px-2 py-1 bg-pex-dark text-pex-primary font-mono text-sm rounded border border-white/10",children:e.key}),(0,a.jsxs)("div",{children:[a.jsx("p",{className:"text-white text-sm",children:e.description}),a.jsx("p",{className:"text-gray-500 text-xs font-mono",children:e.action})]})]}),a.jsx("span",{className:"px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded font-mono",children:"n"===e.mode?"NORMAL":"i"===e.mode?"INSERT":"VISUAL"})]},t))]}),"macros"===M&&(0,a.jsxs)("div",{className:"h-full overflow-auto p-4 space-y-2",children:[a.jsx("div",{className:"mb-4 p-4 bg-pex-tertiary/50 rounded-lg border border-white/5",children:a.jsx("p",{className:"text-gray-400 text-sm",children:"Code generation macros for rapid development. Connected to AthenaPeX agent system."})}),C.map((e,t)=>(0,a.jsxs)("div",{className:"flex items-center justify-between p-4 bg-pex-panel rounded-lg border border-white/5",children:[(0,a.jsxs)("div",{className:"flex items-center gap-4",children:[a.jsx("div",{className:(0,h.cn)("w-10 h-10 rounded-lg flex items-center justify-center",e.enabled?"bg-pex-primary/20 text-pex-primary":"bg-gray-700 text-gray-500"),children:a.jsx(u.Z,{size:18})}),(0,a.jsxs)("div",{children:[a.jsx("p",{className:"text-white font-medium",children:e.name}),a.jsx("p",{className:"text-gray-500 text-xs",children:e.description})]})]}),(0,a.jsxs)("div",{className:"flex items-center gap-4",children:[a.jsx("kbd",{className:"px-2 py-1 bg-pex-dark text-gray-400 font-mono text-xs rounded border border-white/10",children:e.keybinding}),a.jsx(k,{enabled:e.enabled,onChange:()=>R(t)})]})]},e.id))]})]})]})};function w(){return a.jsx(N,{})}},2933:(e,t,i)=>{"use strict";i.d(t,{Z:()=>a});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,i(2881).Z)("Check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]])},3810:(e,t,i)=>{"use strict";i.d(t,{Z:()=>a});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,i(2881).Z)("Copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]])},1540:(e,t,i)=>{"use strict";i.d(t,{Z:()=>a});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,i(2881).Z)("Download",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]])},9163:(e,t,i)=>{"use strict";i.d(t,{Z:()=>a});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,i(2881).Z)("Layers",[["path",{d:"m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z",key:"8b97xw"}],["path",{d:"m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65",key:"dd6zsq"}],["path",{d:"m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65",key:"ep9fru"}]])},4893:(e,t,i)=>{"use strict";i.d(t,{Z:()=>a});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,i(2881).Z)("Play",[["polygon",{points:"6 3 20 12 6 21 6 3",key:"1oa8hb"}]])},3232:(e,t,i)=>{"use strict";i.r(t),i.d(t,{$$typeof:()=>s,__esModule:()=>r,default:()=>o});var a=i(8570);let n=(0,a.createProxy)(String.raw`/home/user/webapp/app/pex-os/neovim/page.tsx`),{__esModule:r,$$typeof:s}=n;n.default;let o=(0,a.createProxy)(String.raw`/home/user/webapp/app/pex-os/neovim/page.tsx#default`)}};var t=require("../../../webpack-runtime.js");t.C(e);var i=e=>t(t.s=e),a=t.X(0,[8948,2772,5417,3902],()=>i(5079));module.exports=a})();