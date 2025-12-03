'use client';

// ============================================================================
// AthenaPeX - NEOVIM CONFIGURATION GENERATOR
// ATHENA Architecture | ENTJ Omega Builder Config Generator
// ============================================================================

import React, { useState, useMemo } from 'react';
import {
  Terminal,
  Settings,
  Download,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  Code,
  Plug,
  Keyboard,
  Zap,
  FileCode2,
  Layers,
  Play,
  RefreshCw,
} from 'lucide-react';
import { cn, copyToClipboard, downloadFile } from '@/lib/utils';

// --- TYPES ---

interface LSPConfig {
  language: string;
  server: string;
  enabled: boolean;
  description: string;
}

interface PluginConfig {
  name: string;
  repo: string;
  enabled: boolean;
  description: string;
  category: string;
}

interface KeymapConfig {
  mode: 'n' | 'i' | 'v' | 'x';
  key: string;
  action: string;
  description: string;
}

interface MacroConfig {
  id: string;
  name: string;
  description: string;
  keybinding: string;
  enabled: boolean;
}

// --- DEFAULT CONFIGURATIONS ---

const defaultLSPConfigs: LSPConfig[] = [
  { language: 'TypeScript', server: 'typescript-language-server', enabled: true, description: 'TypeScript/JavaScript LSP' },
  { language: 'Python', server: 'pyright', enabled: true, description: 'Python type checking and LSP' },
  { language: 'Rust', server: 'rust-analyzer', enabled: false, description: 'Rust language server' },
  { language: 'Go', server: 'gopls', enabled: false, description: 'Go language server' },
  { language: 'Lua', server: 'lua_ls', enabled: true, description: 'Lua language server (for Neovim config)' },
  { language: 'Bash', server: 'bashls', enabled: true, description: 'Bash language server' },
  { language: 'JSON', server: 'jsonls', enabled: true, description: 'JSON language server' },
  { language: 'CSS', server: 'cssls', enabled: true, description: 'CSS/SCSS/Less LSP' },
  { language: 'HTML', server: 'html', enabled: true, description: 'HTML language server' },
  { language: 'Tailwind', server: 'tailwindcss', enabled: true, description: 'Tailwind CSS IntelliSense' },
];

const defaultPlugins: PluginConfig[] = [
  { name: 'telescope.nvim', repo: 'nvim-telescope/telescope.nvim', enabled: true, description: 'Fuzzy finder', category: 'Navigation' },
  { name: 'nvim-treesitter', repo: 'nvim-treesitter/nvim-treesitter', enabled: true, description: 'Syntax highlighting', category: 'Syntax' },
  { name: 'nvim-lspconfig', repo: 'neovim/nvim-lspconfig', enabled: true, description: 'LSP configuration', category: 'LSP' },
  { name: 'nvim-cmp', repo: 'hrsh7th/nvim-cmp', enabled: true, description: 'Autocompletion', category: 'Completion' },
  { name: 'copilot.vim', repo: 'github/copilot.vim', enabled: true, description: 'GitHub Copilot', category: 'AI' },
  { name: 'harpoon', repo: 'ThePrimeagen/harpoon', enabled: true, description: 'Quick file navigation', category: 'Navigation' },
  { name: 'gitsigns.nvim', repo: 'lewis6991/gitsigns.nvim', enabled: true, description: 'Git decorations', category: 'Git' },
  { name: 'neo-tree.nvim', repo: 'nvim-neo-tree/neo-tree.nvim', enabled: true, description: 'File explorer', category: 'Navigation' },
  { name: 'lualine.nvim', repo: 'nvim-lualine/lualine.nvim', enabled: true, description: 'Status line', category: 'UI' },
  { name: 'which-key.nvim', repo: 'folke/which-key.nvim', enabled: true, description: 'Keybinding helper', category: 'Utility' },
  { name: 'trouble.nvim', repo: 'folke/trouble.nvim', enabled: true, description: 'Diagnostics list', category: 'LSP' },
  { name: 'todo-comments.nvim', repo: 'folke/todo-comments.nvim', enabled: true, description: 'TODO highlighting', category: 'Utility' },
];

const defaultKeymaps: KeymapConfig[] = [
  { mode: 'n', key: '<leader>w', action: ':w<CR>', description: 'Quick save' },
  { mode: 'n', key: '<leader>q', action: ':q<CR>', description: 'Quick quit' },
  { mode: 'n', key: '<leader>x', action: ':x<CR>', description: 'Save and quit' },
  { mode: 'n', key: '<C-h>', action: '<C-w>h', description: 'Navigate left' },
  { mode: 'n', key: '<C-j>', action: '<C-w>j', description: 'Navigate down' },
  { mode: 'n', key: '<C-k>', action: '<C-w>k', description: 'Navigate up' },
  { mode: 'n', key: '<C-l>', action: '<C-w>l', description: 'Navigate right' },
  { mode: 'n', key: '<leader>ff', action: ':Telescope find_files<CR>', description: 'Find files' },
  { mode: 'n', key: '<leader>fg', action: ':Telescope live_grep<CR>', description: 'Live grep' },
  { mode: 'n', key: '<leader>fb', action: ':Telescope buffers<CR>', description: 'Find buffers' },
  { mode: 'n', key: '<leader>e', action: ':Neotree toggle<CR>', description: 'Toggle file explorer' },
  { mode: 'n', key: '<leader>ca', action: 'vim.lsp.buf.code_action', description: 'Code actions' },
  { mode: 'n', key: 'gd', action: 'vim.lsp.buf.definition', description: 'Go to definition' },
  { mode: 'n', key: 'K', action: 'vim.lsp.buf.hover', description: 'Hover documentation' },
];

const defaultMacros: MacroConfig[] = [
  { id: 'macro-react', name: 'React Component', description: 'Generate React TSX component', keybinding: '<leader>rc', enabled: true },
  { id: 'macro-api', name: 'API Route', description: 'Generate Next.js API route', keybinding: '<leader>ar', enabled: true },
  { id: 'macro-store', name: 'Zustand Store', description: 'Generate Zustand store template', keybinding: '<leader>zs', enabled: true },
  { id: 'macro-test', name: 'Test File', description: 'Generate test file template', keybinding: '<leader>tf', enabled: true },
];

// --- GENERATOR FUNCTIONS ---

const generateInitLua = (
  lspConfigs: LSPConfig[],
  plugins: PluginConfig[],
  keymaps: KeymapConfig[],
  macros: MacroConfig[]
): string => {
  const enabledLSPs = lspConfigs.filter(l => l.enabled);
  const enabledPlugins = plugins.filter(p => p.enabled);
  const enabledMacros = macros.filter(m => m.enabled);

  return `-- ============================================================================
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

${enabledPlugins.map(p => `  -- ${p.description}
  { '${p.repo}' },`).join('\n\n')}

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
${enabledLSPs.map(l => `    '${l.server}',`).join('\n')}
  },
  handlers = {
    lsp_zero.default_setup,
  },
})

-- ============================================================================
-- KEYMAPS
-- ============================================================================
local keymap = vim.keymap.set

${keymaps.map(k => {
  if (k.action.startsWith('vim.')) {
    return `keymap('${k.mode}', '${k.key}', ${k.action}, { desc = '${k.description}' })`;
  }
  return `keymap('${k.mode}', '${k.key}', '${k.action}', { desc = '${k.description}' })`;
}).join('\n')}

-- ============================================================================
-- ENTJ MACROS
-- ============================================================================
${enabledMacros.map(m => `-- ${m.name}: ${m.keybinding}
-- ${m.description}`).join('\n\n')}

-- ============================================================================
-- ENTJ PRODUCTIVITY RULES
-- ============================================================================
-- Maximum Productivity Over Comfort
-- Aggressive Velocity Over Perfection
-- Real Impact Over Work Quantity
-- ROI > 2.0 = EXECUTE | ROI < 0.5 = ELIMINATE
-- ============================================================================

print('AthenaPeX Neovim loaded - ENTJ Mode Active')
`;
};

// --- COMPONENTS ---

const SectionHeader: React.FC<{
  icon: React.ReactNode;
  title: string;
  count?: number;
  expanded: boolean;
  onToggle: () => void;
}> = ({ icon, title, count, expanded, onToggle }) => (
  <button
    onClick={onToggle}
    className="w-full flex items-center gap-3 px-4 py-3 bg-pex-tertiary hover:bg-white/5 rounded-lg transition-colors"
  >
    <div className="text-pex-primary">{icon}</div>
    <span className="flex-1 text-left font-medium text-white">{title}</span>
    {count !== undefined && (
      <span className="px-2 py-0.5 bg-pex-primary/20 text-pex-primary text-xs rounded-full">
        {count}
      </span>
    )}
    {expanded ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
  </button>
);

const Toggle: React.FC<{
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}> = ({ enabled, onChange }) => (
  <button
    onClick={() => onChange(!enabled)}
    className={cn(
      'w-10 h-5 rounded-full transition-colors relative',
      enabled ? 'bg-pex-primary' : 'bg-gray-600'
    )}
  >
    <div
      className={cn(
        'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform',
        enabled ? 'translate-x-5' : 'translate-x-0.5'
      )}
    />
  </button>
);

// --- MAIN COMPONENT ---

export const NeovimConfig: React.FC = () => {
  // State
  const [baseConfig, setBaseConfig] = useState<'lazyvim' | 'custom'>('lazyvim');
  const [lspConfigs, setLspConfigs] = useState<LSPConfig[]>(defaultLSPConfigs);
  const [plugins, setPlugins] = useState<PluginConfig[]>(defaultPlugins);
  const [keymaps] = useState<KeymapConfig[]>(defaultKeymaps);
  const [macros, setMacros] = useState<MacroConfig[]>(defaultMacros);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'lsp' | 'plugins' | 'keymaps' | 'macros'>('preview');

  // Expanded sections
  const [expandedSections, setExpandedSections] = useState({
    lsp: true,
    plugins: true,
    keymaps: false,
    macros: false,
  });

  // Generated config
  const generatedConfig = useMemo(
    () => generateInitLua(lspConfigs, plugins, keymaps, macros),
    [lspConfigs, plugins, keymaps, macros]
  );

  // Handlers
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleLSP = (index: number) => {
    setLspConfigs(prev => prev.map((l, i) => 
      i === index ? { ...l, enabled: !l.enabled } : l
    ));
  };

  const togglePlugin = (index: number) => {
    setPlugins(prev => prev.map((p, i) => 
      i === index ? { ...p, enabled: !p.enabled } : p
    ));
  };

  const toggleMacro = (index: number) => {
    setMacros(prev => prev.map((m, i) => 
      i === index ? { ...m, enabled: !m.enabled } : m
    ));
  };

  const handleCopy = async () => {
    await copyToClipboard(generatedConfig);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadFile(generatedConfig, 'init.lua', 'text/x-lua');
  };

  const enabledCount = {
    lsp: lspConfigs.filter(l => l.enabled).length,
    plugins: plugins.filter(p => p.enabled).length,
    macros: macros.filter(m => m.enabled).length,
  };

  return (
    <div className="h-full flex flex-col bg-pex-dark">
      {/* Header */}
      <div className="h-14 bg-pex-panel border-b border-white/5 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <Terminal size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold">Neovim ENTJ Omega</h1>
            <p className="text-gray-500 text-xs">Configuration Generator</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg transition-all',
              copied
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-pex-tertiary text-gray-300 hover:bg-white/10 border border-white/10'
            )}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span className="text-sm font-medium">{copied ? 'Copied!' : 'Copy'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-pex-primary hover:bg-pex-primary-hover text-white rounded-lg transition-colors"
          >
            <Download size={16} />
            <span className="text-sm font-medium">Download init.lua</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="h-12 bg-pex-secondary border-b border-white/5 flex items-center px-4 gap-2">
        {[
          { id: 'preview', icon: <Code size={14} />, label: 'Preview' },
          { id: 'lsp', icon: <Layers size={14} />, label: `LSP (${enabledCount.lsp})` },
          { id: 'plugins', icon: <Plug size={14} />, label: `Plugins (${enabledCount.plugins})` },
          { id: 'keymaps', icon: <Keyboard size={14} />, label: 'Keymaps' },
          { id: 'macros', icon: <Play size={14} />, label: `Macros (${enabledCount.macros})` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors',
              activeTab === tab.id
                ? 'bg-pex-primary text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'preview' && (
          <div className="h-full p-4">
            <div className="h-full bg-[#1e1e2e] rounded-lg border border-white/5 overflow-auto">
              <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
                <span className="text-gray-400 text-sm font-mono">init.lua</span>
                <span className="text-gray-500 text-xs">{generatedConfig.split('\n').length} lines</span>
              </div>
              <pre className="p-4 text-sm font-mono text-gray-300 overflow-auto">
                <code>{generatedConfig}</code>
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'lsp' && (
          <div className="h-full overflow-auto p-4 space-y-2">
            <div className="mb-4 p-4 bg-pex-tertiary/50 rounded-lg border border-white/5">
              <p className="text-gray-400 text-sm">
                Select the Language Servers to include. Disabled servers won't be installed via Mason.
              </p>
            </div>
            {lspConfigs.map((lsp, index) => (
              <div
                key={lsp.language}
                className="flex items-center justify-between p-4 bg-pex-panel rounded-lg border border-white/5"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    'w-3 h-3 rounded-full',
                    lsp.enabled ? 'bg-green-500' : 'bg-gray-600'
                  )} />
                  <div>
                    <p className="text-white font-medium">{lsp.language}</p>
                    <p className="text-gray-500 text-xs">{lsp.server}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-500 text-xs hidden md:block">{lsp.description}</span>
                  <Toggle enabled={lsp.enabled} onChange={() => toggleLSP(index)} />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'plugins' && (
          <div className="h-full overflow-auto p-4 space-y-2">
            <div className="mb-4 p-4 bg-pex-tertiary/50 rounded-lg border border-white/5">
              <p className="text-gray-400 text-sm">
                Enable or disable plugins. Core plugins like LSP Zero are always included.
              </p>
            </div>
            {plugins.map((plugin, index) => (
              <div
                key={plugin.repo}
                className="flex items-center justify-between p-4 bg-pex-panel rounded-lg border border-white/5"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    'w-3 h-3 rounded-full',
                    plugin.enabled ? 'bg-green-500' : 'bg-gray-600'
                  )} />
                  <div>
                    <p className="text-white font-medium">{plugin.name}</p>
                    <p className="text-gray-500 text-xs">{plugin.repo}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-2 py-0.5 bg-pex-primary/20 text-pex-primary text-xs rounded">
                    {plugin.category}
                  </span>
                  <Toggle enabled={plugin.enabled} onChange={() => togglePlugin(index)} />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'keymaps' && (
          <div className="h-full overflow-auto p-4 space-y-2">
            <div className="mb-4 p-4 bg-pex-tertiary/50 rounded-lg border border-white/5">
              <p className="text-gray-400 text-sm">
                ENTJ-optimized keybindings for maximum productivity. Leader key is SPACE.
              </p>
            </div>
            {keymaps.map((keymap, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-pex-panel rounded-lg border border-white/5"
              >
                <div className="flex items-center gap-4">
                  <kbd className="px-2 py-1 bg-pex-dark text-pex-primary font-mono text-sm rounded border border-white/10">
                    {keymap.key}
                  </kbd>
                  <div>
                    <p className="text-white text-sm">{keymap.description}</p>
                    <p className="text-gray-500 text-xs font-mono">{keymap.action}</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded font-mono">
                  {keymap.mode === 'n' ? 'NORMAL' : keymap.mode === 'i' ? 'INSERT' : 'VISUAL'}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'macros' && (
          <div className="h-full overflow-auto p-4 space-y-2">
            <div className="mb-4 p-4 bg-pex-tertiary/50 rounded-lg border border-white/5">
              <p className="text-gray-400 text-sm">
                Code generation macros for rapid development. Connected to AthenaPeX agent system.
              </p>
            </div>
            {macros.map((macro, index) => (
              <div
                key={macro.id}
                className="flex items-center justify-between p-4 bg-pex-panel rounded-lg border border-white/5"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    macro.enabled ? 'bg-pex-primary/20 text-pex-primary' : 'bg-gray-700 text-gray-500'
                  )}>
                    <FileCode2 size={18} />
                  </div>
                  <div>
                    <p className="text-white font-medium">{macro.name}</p>
                    <p className="text-gray-500 text-xs">{macro.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <kbd className="px-2 py-1 bg-pex-dark text-gray-400 font-mono text-xs rounded border border-white/10">
                    {macro.keybinding}
                  </kbd>
                  <Toggle enabled={macro.enabled} onChange={() => toggleMacro(index)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NeovimConfig;
