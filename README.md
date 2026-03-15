# JobScope - Smart Job Discovery Dashboard

![React](https://img.shields.io/badge/React-19-blue)
![Vite](https://img.shields.io/badge/Vite-7-purple)
![Tests](https://img.shields.io/badge/tests-165%20passing-brightgreen)
![Phase](https://img.shields.io/badge/phase-6%20complete-success)
![License](https://img.shields.io/badge/license-MIT-green)

A **modern job discovery dashboard** built with React that focuses on **efficient job exploration, filtering, and organization**.

Unlike traditional job boards centered around endless scrolling, **JobScope prioritizes structured discovery** through powerful filters, clean UI, and efficient navigation.

Project repo: https://github.com/muneer406/jobscope

Created by Muneer Alam.

---

## ✨ Features

### Core Features

- Browse job listings from an external API
- Search jobs by title
- Save jobs for later
- Toggle between **All Jobs** and **Saved Jobs**
- Switch between **Results** and **Details** views
- Job detail inspection panel with clear-selection flow
- Client-side pagination for filtered results
- Loading and empty UI states
- Footer with product, project, and personal links

### Discovery & Filtering

- Multi-filter system
- Multi-select filters for company, location, and tags
- Clear filters instantly

### Productivity Enhancements

- Full keyboard navigation support
- Command-style shortcuts
- Rapid list navigation
- Smooth auto-scroll to keyboard-selected jobs
- Short j/k navigation delay for readable stepping

### Intelligence Layer

- Job recommendations based on saved-job patterns
- Sorting by default order, title, company, or location
- Saved-job insights for top tags, companies, and location coverage

### Persistence

- Saved jobs stored locally
- Filters restored on reload
- View mode restored on reload
- Sort preference restored on reload

---

## Project Goals

This project focuses on demonstrating **strong React fundamentals and product thinking**:

- clean component architecture
- predictable state management
- efficient UI interactions
- maintainable project structure

---

## Design Philosophy

JobScope is designed around **efficient job discovery** rather than passive browsing.

Key principles:

- **Clarity over complexity**
- **Minimal state duplication**
- **Fast navigation**
- **Structured UI**

Keyboard navigation is implemented as a **productivity enhancement**, not the core interaction model.

---

## Architecture

The project follows a modular architecture separating **UI, state logic, and API communication**.

```

src
│
├── api
│   ├── jobs.js          # fetch layer
│   └── jobMapper.js     # API → internal shape
│
├── components
│   ├── FiltersPanel.jsx  # company / location / tag filters
│   ├── InsightsPanel.jsx
│   ├── JobCard.jsx
│   ├── JobDetailsPanel.jsx
│   ├── JobList.jsx
│   ├── Pagination.jsx
│   ├── RecommendationsPanel.jsx
│   ├── SearchBar.jsx
│   ├── SortControls.jsx
│   └── ViewToggle.jsx
│
├── hooks
│   ├── useJobs.js
│   └── useKeyboardNavigation.js
│
├── utils
│   └── jobSelectors.js  # pure filter, sort, analytics, and derivation functions
│
├── context
│   └── JobsContext.jsx
│
├── pages
│   └── Dashboard.jsx
│
└── App.jsx

```

### Architecture Principles

- **Separation of concerns**
- **Reusable UI components**
- **API isolation**
- **Derived state instead of duplicated state**

---

## Data Flow

```

API → State → Derived Data → UI

```

Example:

```

jobs

* filters
* search query
  ↓
  filteredJobs
  ↓
  rendered list

```

This approach prevents inconsistent UI states and simplifies debugging.

---

## Keyboard Shortcuts

| Key     | Action                |
| ------- | --------------------- |
| `/`     | Focus search          |
| `j`     | Move selection down   |
| `k`     | Move selection up     |
| `enter` | Open job details      |
| `s`     | Save job              |
| `v`     | Toggle saved/all view |
| `esc`   | Exit focus            |

Keyboard navigation improves efficiency but **all features remain accessible via mouse**.

---

## 🎨 UI Design

The UI follows a **Neo-Brutalist dashboard style**:

- strong borders
- high contrast layout
- minimal decorative elements
- focus on clarity

Layout structure:

```

| Sidebar | Results / Details panel |

```

This allows users to **filter broadly, browse results cleanly, and inspect a single job without crowding the page**.

---

## Feature Roadmap

### ✅ Phase 1 — Core job discovery

- Fetch and map jobs from JSONPlaceholder API
- Search by title, save jobs, toggle saved / all view
- Neo-Brutalist dashboard layout

### ✅ Phase 2 — Advanced filtering

- Multi-select filters for company, location, and tags (OR logic within each group)
- `FiltersPanel` with chip-based filter groups across all filter types
- Toggle behaviour: clicking an active chip removes it from the current filter set
- "Clear all" button when any filter is active
- `hasActiveFilters` derived state

### ✅ Phase 3 — Job detail panel

- Dedicated detail view for the currently selected job
- Shows full description, company, location, and tags
- Save or unsave directly from the detail view
- Clear selection and return to results cleanly
- Handles loading and empty-selection states cleanly

### ✅ Added UX improvements

- Results/details tab workflow to reduce visual clutter
- Client-side pagination for filtered results
- Responsive single-panel content area across desktop and mobile
- Footer section for product framing and data-source disclosure
- Collapsible filter chips for large option sets

### ✅ Phase 4 — Keyboard navigation system

- `/` focuses search
- `j` and `k` move through the filtered list
- `Enter` opens details for the current selection
- `s` saves or unsaves the current selection
- `v` toggles all-jobs and saved-jobs view
- `Esc` exits focus or leaves the details panel
- Off-screen selections scroll smoothly into view

### ✅ Phase 5 — Intelligence layer

- Sidebar recommendations derived from saved-job tag, company, and location overlap
- Sort controls for default order, title, company, and location
- Saved-job insights with counts and top facets

### ✅ Phase 6 — Persistence

- Saved jobs persist in localStorage
- Filters persist in localStorage
- View mode persists in localStorage
- Sort preference persists in localStorage

---

## Installation

```bash
git clone https://github.com/muneer406/jobscope.git

cd jobscope

npm install

npm run dev
```

---

## Development

The project is implemented in structured phases to ensure:

- stable architecture
- predictable feature growth
- maintainable codebase

### Run tests

```bash
npm test          # run once
npm run test:watch # watch mode
```

165 tests across 11 suites covering the API mapper, selectors, components, hooks, pagination, keyboard navigation, intelligence helpers, and persisted state.

---

## API Strategy

Since most public APIs do not provide free job data, the project maps generic API data into a **job model**.

Example mapping:

| API Field           | Job Field         |
| ------------------- | ----------------- |
| `post.title`        | `job.title`       |
| `post.body`         | `job.description` |
| `user.company.name` | `job.company`     |
| `user.address.city` | `job.location`    |
| derived from title  | `job.tags`        |

This allows development without relying on proprietary job APIs.

---

## Future Improvements

Potential upgrades:

- AI skill match scoring
- resume keyword matching
- advanced job recommendations
- real job API integration
- authentication

---

## License

MIT License
