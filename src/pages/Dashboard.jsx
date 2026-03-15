import { useJobs } from "../hooks/useJobs";
import { VIEW_MODES } from "../utils/jobSelectors";
import { JobList } from "../components/JobList";
import { SearchBar } from "../components/SearchBar";
import { ViewToggle } from "../components/ViewToggle";

export function Dashboard() {
  const {
    error,
    filters,
    isLoading,
    savedJobs,
    selectedJob,
    showAllJobs,
    showSavedJobs,
    toggleSavedJob,
    updateSearchQuery,
    viewMode,
    visibleJobs,
  } = useJobs();

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <p className="eyebrow">Phase 1</p>
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

        {error ? <p className="message-banner error-banner">{error}</p> : null}

        <JobList
          isLoading={isLoading}
          jobs={visibleJobs}
          savedJobs={savedJobs}
          selectedJobId={selectedJob?.id ?? null}
          viewMode={viewMode}
          onToggleSavedJob={toggleSavedJob}
        />
      </section>
    </main>
  );
}
