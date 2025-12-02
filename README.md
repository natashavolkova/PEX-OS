# AthenaPeX - ENTJ Productivity System

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/lukecaelum369-cmyk/Athena-PeX)
[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](LICENSE)

## 🎯 Overview

**AthenaPeX** is a comprehensive productivity and project management web application built on the ATHENA Architecture (ENTJ-style). It enables users to manage prompts, projects, tasks, YouTube references, and productivity analytics with optional local AI agent integration for automation.

Built with aggressive velocity and maximum impact in mind — the ENTJ way.

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

### Entry Points

| Path | Description |
|------|-------------|
| `index.html` | Main application entry point |
| `#analytics` | Analytics Dashboard (default view) |
| `#projects` | Projects Hub |
| `#tasks` | Task Manager |
| `#prompts` | Prompt Manager with Miller Columns |
| `#battleplan` | Battle Plan Generator |
| `#youtube` | YouTube Reference Manager |
| `#templates` | Strategic Templates Library |
| `#neovim` | Neovim Configuration Generator |
| `#agent` | AI Agent Interface |
| `#rules` | ENTJ Productivity Rules |

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `1-5` | Quick module navigation |
| `Ctrl+K` | Global search |
| `Esc` | Close modal |

---

## 📁 Project Structure

```
athenaPex/
├── index.html              # Main application
├── css/
│   └── styles.css          # ATHENA theme styles
├── js/
│   ├── api.js              # RESTful API client
│   ├── store.js            # State management & rules engine
│   ├── components.js       # UI component library
│   └── app.js              # Application logic
├── reference/
│   └── tailwind.config.js  # Design system reference
└── README.md               # This documentation
```

---

## 🗄️ Data Models

### Database Schema

| Table | Description | Fields |
|-------|-------------|--------|
| `projects` | Project records | id, name, description, status, priority, impact_score, roi_score, owner, tags, progress |
| `tasks` | Task records | id, project_id, title, description, status, priority, impact_score, effort_score, roi_score, blockers |
| `task_logs` | Activity logs | id, task_id, action, details, timestamp |
| `prompts` | Prompt content | id, folder_id, name, content, category, version, efficiency_score, usage_count, is_template |
| `prompt_versions` | Version history | id, prompt_id, version_number, content, changes, created_at |
| `prompt_folders` | Folder organization | id, name, parent_id, color, icon |
| `youtube_refs` | Video references | id, url, title, channel, thumbnail, duration, notes, insights, tags, watch_status |
| `focus_windows` | Focus sessions | id, start_time, end_time, duration_minutes, productivity_score, task_ids, interruptions |
| `daily_metrics` | Daily analytics | id, date, tasks_completed, focus_hours, productivity_score, peak_hour, dead_zones |
| `battle_plans` | Sprint plans | id, name, start_date, end_date, objectives, high_roi_tasks, status, velocity_target, velocity_actual |
| `templates` | Strategic templates | id, name, category, content, variables, usage_count, success_rate |
| `neovim_configs` | Neovim configs | id, name, base, lsp_configs, plugins, macros, keymaps, config_lua |
| `insights` | AI-generated insights | id, type, title, content, severity, related_entity, is_resolved, created_at |
| `settings` | System settings | id, key, value, category |

---

## 🛣️ API Endpoints

All data operations use the RESTful Table API:

### Generic Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `tables/{table}` | List records with pagination |
| GET | `tables/{table}/{id}` | Get single record |
| POST | `tables/{table}` | Create record |
| PUT | `tables/{table}/{id}` | Full update |
| PATCH | `tables/{table}/{id}` | Partial update |
| DELETE | `tables/{table}/{id}` | Delete record |

### Query Parameters

| Parameter | Description |
|-----------|-------------|
| `page` | Page number (default: 1) |
| `limit` | Records per page (default: 100) |
| `search` | Search query |
| `sort` | Sort field |

---

## 🎨 Design System (ATHENA Theme)

### Colors

| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| Background Primary | `#0f111a` | `pex-dark` | Main background |
| Background Panel | `#1e2330` | `pex-panel` | Cards, panels |
| Background Secondary | `#13161c` | `pex-secondary` | Toolbar, sidebar |
| Background Tertiary | `#252b3b` | `pex-tertiary` | Dropdowns, hover |
| Accent Primary | `#2979ff` | `pex-primary` | Primary actions |
| Accent Hover | `#2264d1` | `pex-primary-hover` | Hover states |
| Accent Purple | `#5b4eff` | `pex-purple` | Secondary accent |
| Success | `#10b981` | `pex-success` | Success states |
| Warning | `#f59e0b` | `pex-warning` | Warnings |
| Error | `#ef4444` | `pex-error` | Errors |

### Typography

- **Primary Font**: Inter (sans-serif)
- **Monospace Font**: JetBrains Mono

### Animations

| Animation | Usage |
|-----------|-------|
| `animate-slide-up` | Card entry animations |
| `animate-modal-bounce` | Modal opening |
| `animate-toast-in/out` | Toast notifications |
| `animate-pulse` | Loading states |
| `animate-spin` | Spinners |

---

## ⚙️ ENTJ Rules Engine

### Core Principles (Always Enforced)

1. **Maximum Productivity Over Comfort** - Prioritize output, not convenience
2. **Aggressive Velocity Over Perfection** - Ship fast, iterate faster
3. **Real Impact Over Work Quantity** - Measure outcomes, not hours
4. **Ruthless Elimination of Weak Ideas** - Kill low-ROI ideas fast
5. **Automatic Pivot Recommendations** - Suggest pivots when stalled
6. **Comprehensive Automation** - Automate everything possible
7. **Travamento Monitoring** - Detect and correct procrastination
8. **ROI Optimization** - Always optimize for return on investment
9. **Technical Simplicity** - Prefer simple, working solutions
10. **100% Platform Utilization** - Use all available capabilities

### Auto-Triggered Rules

| Rule | Trigger Condition | Action |
|------|-------------------|--------|
| Low ROI Alert | ROI < 1.5 after 48 hours | Flag task for elimination |
| Velocity Warning | 3+ low-velocity days | System alert |
| Pivot Suggestion | Blocker > 24 hours | Recommend pivot |
| Procrastination Detection | Pattern detected | Suggest corrections |
| High-ROI Switch | High-ROI task available | Recommend switch |
| Dead Zone Alert | Working during low-productivity hours | Warn user |

### ROI Calculation

```javascript
ROI = Impact Score / Effort Score

// Priority Scoring
priorityScore = (roi × 0.4) + (impact × 0.3) + (urgency × 0.2) + (effort × 0.1)

// ROI Thresholds
ROI > 2.0  → DO FIRST (Quick Wins)
ROI 1.0-2.0 → SCHEDULE (Big Bets)
ROI 0.5-1.0 → DELEGATE (Low Value)
ROI < 0.5  → ELIMINATE (Time Sinks)
```

---

## 📋 Strategic Templates

### Pre-built Templates

| Template | Category | Success Rate |
|----------|----------|--------------|
| React Micro-MVP | mvp | 85% |
| HTML/CSS Micro-MVP | mvp | 90% |
| High-Conversion Landing Page | landing-page | 78% |
| Cold Email Sequence | cold-email | 12% |
| Impact vs Effort Matrix | impact-matrix | 95% |
| High-ROI Execution Blueprint | execution-blueprint | 88% |

---

## ⌨️ Neovim Configuration

### Generated Config Includes

- **Base**: LazyVim (recommended)
- **LSP Support**: TypeScript, Python, Rust, Go, Bash
- **Plugins**: Telescope, Harpoon v2, GitHub Copilot, nvim-cmp
- **ENTJ Keymaps**: Quick save, quick quit, component generators
- **Macros**: React component, API route, CRUD operations

---

## 🤖 Local AI Agent Integration

### Connection

```javascript
// Default endpoint
ws://localhost:8765

// Connect via UI or programmatically
AgentAPI.connect('ws://localhost:8765')
```

### Available Macros

| Macro | Description |
|-------|-------------|
| Create React Component | Generate TypeScript component |
| Generate API Route | Create REST endpoint |
| CRUD Operations | Full CRUD boilerplate |
| MVP Boilerplate | Micro-MVP structure |
| Landing Page Skeleton | Landing page structure |
| Database Model | Model and migrations |

### Communication Protocol

```json
// Send command
{
  "type": "command",
  "action": "create_component",
  "params": { "name": "MyComponent" }
}

// Receive response
{
  "success": true,
  "response": "Component created successfully"
}
```

---

## 📊 Productivity Analytics

### Heatmap

- **Days**: Monday - Sunday
- **Hours**: 6 AM - 10 PM
- **Levels**: 0-5 (productivity intensity)

### Peak Hours Detection

- Automatically identifies optimal work windows
- Suggests scheduling high-ROI tasks during peak hours
- Warns about dead zones

### Focus Sessions

- Pomodoro-style focus timer (25 min default)
- Tracks duration, interruptions, productivity score
- Logs to focus_windows table

---

## 🔮 Future Roadmap

### High Priority
- [ ] Real-time collaboration
- [ ] Advanced search with filters
- [ ] Export/import functionality
- [ ] Mobile responsive improvements

### Medium Priority
- [ ] YouTube API integration for auto-metadata
- [ ] AI-powered prompt suggestions
- [ ] Team sharing and permissions
- [ ] PWA support

### Low Priority
- [ ] Light theme option
- [ ] Custom keyboard shortcuts
- [ ] Advanced reporting
- [ ] Integration webhooks
- [ ] Slack/Discord notifications

---

## 🔧 Development

### Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS (CDN)
- **Icons**: Font Awesome 6
- **Fonts**: Google Fonts (Inter, JetBrains Mono)
- **Data**: RESTful Table API
- **State**: Custom store with localStorage persistence

### File Overview

| File | Lines | Purpose |
|------|-------|---------|
| `index.html` | ~1000 | Main HTML structure |
| `css/styles.css` | ~650 | ATHENA theme styles |
| `js/api.js` | ~300 | API client layer |
| `js/store.js` | ~400 | State management & rules |
| `js/components.js` | ~500 | UI components |
| `js/app.js` | ~1200 | Application logic |

---

## 📝 License

Proprietary - AthenaPeX Team

---

**Developed with the ATHENA Architecture (ENTJ)**
*Maximum efficiency, aggressive velocity, real impact.*

---

## 🎯 ENTJ Manifesto

> "We don't wait for perfect conditions. We create them.
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
> We are ENTJ. We execute."
