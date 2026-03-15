import { VIEW_MODES } from "../utils/jobSelectors";
import { JobCard } from "./JobCard";

function LoadingState() {
  return (
    <div className="feedback-panel loading-panel">
      <p className="feedback-title">Loading jobs</p>
      <p className="feedback-copy">
        Fetching listings and mapping them into dashboard data.
      </p>
    </div>
  );
}

function EmptyState({ viewMode }) {
  const isSavedView = viewMode === VIEW_MODES.SAVED;

  return (
    <div className="feedback-panel empty-panel">
      <p className="feedback-title">
        {isSavedView ? "No saved jobs yet" : "No jobs match that search"}
      </p>
      <p className="feedback-copy">
        {isSavedView
          ? "Save a listing to switch back here later."
          : "Try a broader title search or clear the current query."}
      </p>
    </div>
  );
}

export function JobList({
  isLoading,
  jobs,
  onSelectJob,
  onToggleSavedJob,
  savedJobs,
  selectedJobId,
  viewMode,
}) {
  if (isLoading) {
    return <LoadingState />;
  }

  if (jobs.length === 0) {
    return <EmptyState viewMode={viewMode} />;
  }

  return (
    <section className="job-list" aria-label="Job listings">
      {jobs.map((job) => (
        <div
          key={job.id}
          className="job-list-item"
          role="button"
          tabIndex={0}
          onClick={() => onSelectJob(job.id)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onSelectJob(job.id);
            }
          }}
        >
          <JobCard
            isSaved={savedJobs.includes(job.id)}
            isSelected={selectedJobId === job.id}
            job={job}
            onToggleSavedJob={onToggleSavedJob}
          />
        </div>
      ))}
    </section>
  );
}
