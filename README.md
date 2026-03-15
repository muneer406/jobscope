# JobScope - Smart Job Discovery Dashboard

![React](https://img.shields.io/badge/React-18-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![Status](https://img.shields.io/badge/status-in%20development-orange)
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
- Job detail inspection panel
- Loading and empty UI states

### Discovery & Filtering

- Multi-filter system
- Filter by:
  - company
  - location
  - tags
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
│   └── jobsApi.js
│
├── components
│   ├── JobCard.jsx
│   ├── JobList.jsx
│   ├── FiltersPanel.jsx
│   └── SavedJobsPanel.jsx
│
├── hooks
│   └── useJobs.js
│
├── utils
│   └── jobMapper.js
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

| Key | Action |
|----|----|
| `/` | Focus search |
| `j` | Move selection down |
| `k` | Move selection up |
| `enter` | Open job details |
| `s` | Save job |
| `v` | Toggle saved/all view |
| `esc` | Exit focus |

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

| Job List | Job Details |

```

This allows users to **quickly scan and inspect jobs without losing context**.

---

## Feature Roadmap

### Phase 1
Core job discovery system.

### Phase 2
Advanced filtering.

### Phase 3
Job detail panel.

### Phase 4
Keyboard navigation system.

### Phase 5
Intelligence layer.

### Phase 6
Persistence.

---

## Installation

``` bash
git clone https://github.com/muneer406/jobscope.git

cd jobscope

npm install

npm run dev
```

---

## Development

The project is implemented in structured phases to ensure:

* stable architecture
* predictable feature growth
* maintainable codebase


---

## API Strategy

Since most public APIs do not provide free job data, the project maps generic API data into a **job model**.

Example mapping:

| API Field  | Job Field       |
| ---------- | --------------- |
| post.title | job.title       |
| post.body  | job.description |
| user.name  | company         |

This allows development without relying on proprietary job APIs.

---

## Future Improvements

Potential upgrades:

* AI skill match scoring
* resume keyword matching
* advanced job recommendations
* real job API integration
* authentication

---

## License

MIT License