import { useEffect, useState } from "react";

import { useJobs } from "../hooks/useJobs";
import { VIEW_MODES } from "../utils/jobSelectors";
import { FiltersPanel } from "../components/FiltersPanel";
import { JobDetailsPanel } from "../components/JobDetailsPanel";
import { JobList } from "../components/JobList";
import { Pagination } from "../components/Pagination";
import { SearchBar } from "../components/SearchBar";
import { ViewToggle } from "../components/ViewToggle";

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
    savedJobs,
    selectJob,
    selectedJob,
    showAllJobs,
    showSavedJobs,
    toggleSavedJob,
    toggleTagFilter,
    totalPages,
    updateCompanyFilter,
    updateLocationFilter,
    updateSearchQuery,
    viewMode,
    visibleJobs,
  } = useJobs();

  const [activePanel, setActivePanel] = useState("results");

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
          <p className="eyebrow">Phase 3</p>
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
        </section>

        <section className="dashboard-panel">
          <div className="controls-row">
            <SearchBar
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

          <div className="footer-col footer-col-end">
            <p className="footer-col-label">Project</p>
            <p className="footer-copyright">Phase 3 &middot; Demo project</p>
            <p className="footer-copyright">&copy; 2026 JobScope</p>
          </div>
        </div>
      </footer>
    </>
  );
}
