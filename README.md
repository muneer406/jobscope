# JobScope - Smart Job Discovery Dashboard

![React](https://img.shields.io/badge/React-19-blue)
![Vite](https://img.shields.io/badge/Vite-7-purple)
![Tests](https://img.shields.io/badge/tests-138%20passing-brightgreen)
![Phase](https://img.shields.io/badge/phase-3%20complete-success)
![License](https://img.shields.io/badge/license-MIT-green)

A **modern job discovery dashboard** built with React that focuses on **efficient job exploration, filtering, and organization**.

Unlike traditional job boards centered around endless scrolling, **JobScope prioritizes structured discovery** through powerful filters, clean UI, and efficient navigation.

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
- Footer with product and data-source context

### Discovery & Filtering

- Multi-filter system
- Multi-select filters for company, location, and tags
- Clear filters instantly

### Productivity Enhancements

- Full keyboard navigation support
- Command-style shortcuts
- Rapid list navigation

### Intelligence Layer

- Job recommendations based on saved jobs
- Sorting options
- Saved job insights

### Persistence

- Saved jobs stored locally
- Filters restored on reload

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
│   ├── JobCard.jsx
│   ├── JobDetailsPanel.jsx
│   ├── JobList.jsx
│   ├── Pagination.jsx
│   ├── SearchBar.jsx
│   └── ViewToggle.jsx
│
├── hooks
│   └── useJobs.js
│
├── utils
│   └── jobSelectors.js  # pure filter + derivation functions
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

### Added UX improvements

- Results/details tab workflow to reduce visual clutter
- Client-side pagination for filtered results
- Responsive single-panel content area across desktop and mobile
- Footer section for product framing and data-source disclosure

### Phase 4 — Keyboard navigation system

### Phase 5 — Intelligence layer

### Phase 6 — Persistence

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

138 tests across 10 suites covering the API mapper, selectors, components, hooks, pagination, and filter actions.

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
