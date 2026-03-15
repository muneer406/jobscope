import { useEffect, useRef, useState } from "react";

import { useJobs } from "../hooks/useJobs";
import { VIEW_MODES } from "../utils/jobSelectors";
import { FiltersPanel } from "../components/FiltersPanel";
import { InsightsPanel } from "../components/InsightsPanel";
import { JobDetailsPanel } from "../components/JobDetailsPanel";
import { JobList } from "../components/JobList";
import { Pagination } from "../components/Pagination";
import { RecommendationsPanel } from "../components/RecommendationsPanel";
import { SearchBar } from "../components/SearchBar";
import { SortControls } from "../components/SortControls";
import { ViewToggle } from "../components/ViewToggle";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";

export function Dashboard() {
  const {
    clearAllFilters,
    clearSelectedJob,
    currentPage,
    error,
    filters,
    goToNextPage,
    goToPage,
    goToPreviousPage,
    hasActiveFilters,
    isLoading,
    jobs,
    paginatedJobs,
    recommendedJobs,
    savedJobs,
    savedInsights,
    selectJob,
    selectedJob,
    showAllJobs,
    showSavedJobs,
    sortOption,
    toggleSavedJob,
    toggleTagFilter,
    toggleViewMode,
    totalPages,
    updateCompanyFilter,
    updateLocationFilter,
    updateSearchQuery,
    updateSortOption,
    viewMode,
    visibleJobs,
  } = useJobs();

  const [activePanel, setActivePanel] = useState("results");
  const searchInputRef = useRef(null);

  useKeyboardNavigation({
    activePanel,
    currentPage,
    goToPage,
    searchInputRef,
    selectedJob,
    selectJob,
    setActivePanel,
    toggleSavedJob,
    toggleViewMode,
    visibleJobs,
  });

  useEffect(() => {
    if (!selectedJob && activePanel === "details") {
      setActivePanel("results");
    }
  }, [activePanel, selectedJob]);

  function handleSelectJob(jobId) {
    selectJob(jobId);
    setActivePanel("details");
  }

  function handleClearSelection() {
    clearSelectedJob();
    setActivePanel("results");
  }

  return (
    <>
      <main className="app-shell">
        <section className="hero-panel">
          <p className="eyebrow">Smart Job Discovery</p>
          <h1>JobScope</h1>
          <p className="hero-copy">
            A direct, searchable dashboard for exploring mapped job listings.
          </p>

          <div className="hero-stats">
            <article className="stat-card">
              <span className="stat-label">Visible</span>
              <strong>{visibleJobs.length}</strong>
            </article>

            <article className="stat-card accent-card">
              <span className="stat-label">Saved</span>
              <strong>{savedJobs.length}</strong>
            </article>

            <article className="stat-card muted-card">
              <span className="stat-label">View</span>
              <strong>
                {viewMode === VIEW_MODES.ALL ? "All Jobs" : "Saved Jobs"}
              </strong>
            </article>
          </div>

          <FiltersPanel
            jobs={jobs}
            filters={filters}
            hasActiveFilters={hasActiveFilters}
            onClearAll={clearAllFilters}
            onToggleCompany={updateCompanyFilter}
            onToggleLocation={updateLocationFilter}
            onToggleTag={toggleTagFilter}
          />

          <RecommendationsPanel
            jobs={recommendedJobs}
            onOpenJob={handleSelectJob}
            onToggleSavedJob={toggleSavedJob}
            savedJobs={savedJobs}
          />

          <div className="shortcuts-panel">
            <p className="filter-group-label">Keyboard Shortcuts</p>
            <ul className="shortcuts-list">
              <li>
                <kbd>/</kbd> Focus search
              </li>
              <li>
                <kbd>j</kbd> / <kbd>k</kbd> Navigate jobs
              </li>
              <li>
                <kbd>Enter</kbd> Open details
              </li>
              <li>
                <kbd>s</kbd> Save / unsave
              </li>
              <li>
                <kbd>v</kbd> Toggle view
              </li>
              <li>
                <kbd>Esc</kbd> Exit focus
              </li>
            </ul>
          </div>
        </section>

        <section className="dashboard-panel">
          <div className="controls-row">
            <SearchBar
              ref={searchInputRef}
              searchQuery={filters.searchQuery}
              onSearchChange={updateSearchQuery}
            />

            <ViewToggle
              viewMode={viewMode}
              onShowAllJobs={showAllJobs}
              onShowSavedJobs={showSavedJobs}
            />
          </div>

          {error ? (
            <p className="message-banner error-banner">{error}</p>
          ) : null}

          <div
            className="panel-tabs"
            role="tablist"
            aria-label="Content panels"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activePanel === "results"}
              className={
                activePanel === "results" ? "panel-tab active" : "panel-tab"
              }
              onClick={() => setActivePanel("results")}
            >
              Results
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activePanel === "details"}
              className={
                activePanel === "details" ? "panel-tab active" : "panel-tab"
              }
              onClick={() => setActivePanel("details")}
            >
              Details
            </button>
          </div>

          <div className="dashboard-content single-panel-layout">
            {activePanel === "results" ? (
              <section
                className="content-surface results-panel"
                aria-label="Results view"
              >
                <div className="results-toolbar">
                  <div>
                    <p className="results-label">Matching jobs</p>
                    <strong>{visibleJobs.length}</strong>
                  </div>

                  <div className="results-meta-stack">
                    <SortControls
                      sortOption={sortOption}
                      onSortChange={updateSortOption}
                    />

                    <div className="results-meta">
                      <span>
                        Page {currentPage} of {totalPages}
                      </span>
                      {selectedJob ? (
                        <button
                          type="button"
                          className="ghost-action"
                          onClick={() => setActivePanel("details")}
                        >
                          Open selected job
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>

                {savedInsights.savedCount > 0 ? (
                  <InsightsPanel
                    insights={savedInsights}
                    title="Your Save Pattern"
                  />
                ) : null}

                <JobList
                  isLoading={isLoading}
                  jobs={paginatedJobs}
                  onSelectJob={handleSelectJob}
                  savedJobs={savedJobs}
                  selectedJobId={selectedJob?.id ?? null}
                  viewMode={viewMode}
                  onToggleSavedJob={toggleSavedJob}
                />

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onNextPage={goToNextPage}
                  onPageChange={goToPage}
                  onPreviousPage={goToPreviousPage}
                />
              </section>
            ) : (
              <section
                className="content-surface details-view"
                aria-label="Details view"
              >
                <JobDetailsPanel
                  isLoading={isLoading}
                  isSaved={
                    selectedJob ? savedJobs.includes(selectedJob.id) : false
                  }
                  job={selectedJob}
                  onBackToResults={() => setActivePanel("results")}
                  onClearSelection={handleClearSelection}
                  onToggleSavedJob={toggleSavedJob}
                />
              </section>
            )}
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <div className="app-footer-inner">
          <div className="footer-brand">
            <p className="footer-logo">JobScope</p>
            <p className="footer-tagline">
              Filter broadly. Inspect clearly.
              <br />
              Save only what matters.
            </p>
            <p className="footer-copyright">&copy; 2026 Muneer Alam</p>
          </div>

          <div className="footer-col">
            <p className="footer-col-label">Built With</p>
            <ul className="footer-list">
              <li>React 19 + Vite 7</li>
              <li>Vitest + Testing Library</li>
              <li>Neo-Brutalist CSS</li>
            </ul>
          </div>

          <div className="footer-col">
            <p className="footer-col-label">Data Source</p>
            <ul className="footer-list">
              <li>JSONPlaceholder API</li>
              <li>100 posts mapped to jobs</li>
              <li>10 users as companies</li>
            </ul>
          </div>

          <div className="footer-col">
            <p className="footer-col-label">Connect</p>
            <ul className="footer-list">
              <li>
                <a
                  href="https://github.com/muneer320"
                  target="_blank"
                  rel="noreferrer"
                  className="footer-link"
                >
                  GitHub @muneer320
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/in/muneer320"
                  target="_blank"
                  rel="noreferrer"
                  className="footer-link"
                >
                  LinkedIn @muneer320
                </a>
              </li>
              <li>
                <a
                  href="https://muneer320.tech"
                  target="_blank"
                  rel="noreferrer"
                  className="footer-link"
                >
                  muneer320.tech
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/muneer406/jobscope"
                  target="_blank"
                  rel="noreferrer"
                  className="footer-link"
                >
                  Project Repo
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}
