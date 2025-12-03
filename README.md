# AthenaPeX - ENTJ Productivity System

[![Version](https://img.shields.io/badge/version-2.0.0-gold.svg)](https://github.com/lukecaelum369-cmyk/Athena-PeX)
[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](LICENSE)

## 🏛️ Overview

**AthenaPeX** is a comprehensive productivity and project management web application built on the Athena Olympian Architecture (ENTJ-style). It enables users to manage prompts, projects, tasks, YouTube references, and productivity analytics with optional local AI agent integration for automation.

Built with aggressive velocity and maximum impact in mind — the ENTJ way. Themed with the Olympian Athena aesthetic featuring golden accents and deep navy backgrounds.

---

## ✨ Athena Theme

| Color | Hex | Usage |
|-------|-----|-------|
| **Olympian Gold** | `#D4AF37` | Primary accent, buttons, highlights |
| **Navy Deep** | `#0a0e1a` | Main background |
| **Navy** | `#1a1f35` | Panels, cards |
| **Silver** | `#C0C0C0` | Secondary text |
| **Platinum** | `#F5F5F5` | Primary text |

### Fonts
- **Cinzel**: Headers, titles (serif, olympian feel)
- **Inter**: Body text, UI elements

---

## ✅ Implemented Features

### Core Modules

| Module | Status | Description |
|--------|--------|-------------|
| **Analytics Dashboard** | ✅ Complete | Weekly heatmaps, focus tracking, productivity insights |
| **Projects Hub** | ✅ Complete | Project management with ENTJ prioritization |
| **Task Manager** | ✅ Complete | ROI-based task execution with drag-and-drop |
| **Prompt Manager** | ✅ Complete | Create, edit, refine prompts with version tracking |
| **Battle Plan Generator** | ✅ Complete | Aggressive sprint planning with objectives |
| **YouTube Reference Manager** | ✅ Complete | Video tracking with insight extraction |
| **Strategic Templates** | ✅ Complete | MVP, landing page, email templates |
| **Neovim Config Generator** | ✅ Complete | LazyVim configuration generator |
| **AI Agent Integration** | ✅ Complete | Fara-7B local agent communication layer |

---

## 🚀 Quick Start

### Installation

```bash
npm install
npm run dev
```

### Routes

| Path | Description |
|------|-------------|
| `/pex-os` | Command Center (Prompt Manager) |
| `/pex-os/prompts` | Prompt Manager |
| `/pex-os/projects` | Projects Hub |
| `/pex-os/tasks` | Task Manager |
| `/pex-os/battle-plan` | Battle Plan Generator |
| `/pex-os/analytics` | Analytics Dashboard |
| `/pex-os/youtube` | YouTube References |
| `/pex-os/templates` | Templates Library |
| `/pex-os/neovim` | Neovim Config |
| `/pex-os/settings` | System Settings |

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `1-8` | Quick module navigation |
| `Ctrl+K` | Global search |
| `Ctrl+F` | Search prompts |
| `Ctrl+L` | Toggle lock mode |
| `Ctrl+N` | New folder |
| `Ctrl+P` | New prompt |
| `Esc` | Close modal |

---

## 📁 Project Structure

```
athenapex/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Redirect to /pex-os
│   ├── globals.css             # Athena theme styles
│   └── pex-os/
│       ├── layout.tsx          # AthenaPeX layout (sidebar + header)
│       ├── page.tsx            # Command Center
│       ├── prompts/page.tsx    # Prompt Manager
│       ├── projects/page.tsx   # Projects Hub
│       ├── tasks/page.tsx      # Task Manager
│       ├── battle-plan/page.tsx # Battle Plan
│       ├── analytics/page.tsx  # Analytics Dashboard
│       ├── youtube/page.tsx    # YouTube Manager
│       ├── templates/page.tsx  # Templates Library
│       ├── neovim/page.tsx     # Neovim Config
│       └── settings/page.tsx   # Settings
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # Athena-themed header
│   │   └── Sidebar.tsx         # Athena-themed sidebar
│   ├── analytics/
│   ├── battle-plan/
│   ├── projects/
│   ├── prompt-manager/
│   ├── tasks/
│   ├── templates/
│   └── youtube/
├── lib/
├── stores/
├── styles/
├── types/
├── tailwind.config.ts          # Athena colors config
└── package.json
```

---

## 🎨 Design System (Athena Theme)

### CSS Variables

```css
:root {
  --athena-gold: #D4AF37;
  --athena-gold-dark: #C19B2F;
  --athena-gold-light: #E5C454;
  --athena-navy: #1a1f35;
  --athena-navy-deep: #0a0e1a;
  --athena-navy-light: #252d4a;
  --athena-silver: #C0C0C0;
  --athena-platinum: #F5F5F5;
}
```

### Tailwind Classes

| Class | Usage |
|-------|-------|
| `bg-athena-gradient` | Main gradient background |
| `text-athena-gold` | Golden text |
| `border-athena-gold/20` | Golden border with opacity |
| `font-cinzel` | Olympian serif font |
| `font-inter` | Body text font |

### Component Classes

```css
.athena-card {
  @apply bg-athena-navy/80 border border-athena-gold/20 rounded-lg backdrop-blur-sm;
}

.athena-button {
  @apply bg-athena-gold hover:bg-athena-gold-dark text-athena-navy-deep px-4 py-2 rounded-lg;
}

.athena-sidebar {
  @apply w-64 bg-athena-navy/90 backdrop-blur-md border-r border-athena-gold/20;
}

.athena-header {
  @apply h-16 bg-athena-navy/80 backdrop-blur-md border-b border-athena-gold/20;
}
```

---

## ⚙️ ENTJ Rules Engine

### Core Principles

1. **Maximum Productivity Over Comfort**
2. **Aggressive Velocity Over Perfection**
3. **Real Impact Over Work Quantity**
4. **Ruthless Elimination of Weak Ideas**
5. **ROI Optimization Always**

### ROI Calculation

```javascript
ROI = Impact Score / Effort Score

// ROI Thresholds
ROI > 2.0  → DO FIRST (Quick Wins)
ROI 1.0-2.0 → SCHEDULE (Big Bets)
ROI 0.5-1.0 → DELEGATE (Low Value)
ROI < 0.5  → ELIMINATE (Time Sinks)
```

---

## 🔧 Technologies

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Cinzel, Inter, JetBrains Mono)

---

## 📝 License

Proprietary - AthenaPeX Team

---

**Developed with the Athena Olympian Architecture (ENTJ)**
*Maximum efficiency, aggressive velocity, real impact.*

---

## 🏛️ Athena Manifesto

> "Like Athena, goddess of wisdom and strategy,
> We approach every challenge with divine precision.
> 
> We don't wait for perfect conditions. We create them.
> We don't hope for results. We engineer them.
> We don't manage time. We dominate it.
> 
> Every task is an opportunity.
> Every blocker is a puzzle to solve.
> Every day is a chance to ship.
> 
> ROI is our religion.
> Impact is our currency.
> Velocity is our lifestyle.
> 
> We are ENTJ. We execute with Olympian excellence."
