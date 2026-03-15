function EmptyDetailsState() {
  return (
    <section
      className="details-panel empty-details-panel"
      aria-label="Job details"
    >
      <p className="details-eyebrow">Phase 3</p>
      <h2>No job selected</h2>
      <p className="details-copy">
        Select a job from the list to inspect its full description, location,
        and tags.
      </p>
    </section>
  );
}

function LoadingDetailsState() {
  return (
    <section
      className="details-panel empty-details-panel"
      aria-label="Job details"
    >
      <p className="details-eyebrow">Phase 3</p>
      <h2>Loading details</h2>
      <p className="details-copy">
        Waiting for the selected listing so its full description and metadata
        can be shown.
      </p>
    </section>
  );
}

export function JobDetailsPanel({
  isLoading = false,
  isSaved,
  job,
  onBackToResults,
  onClearSelection,
  onToggleSavedJob,
}) {
  if (isLoading) {
    return <LoadingDetailsState />;
  }

  if (!job) {
    return <EmptyDetailsState />;
  }

  return (
    <section className="details-panel" aria-label="Job details">
      <div className="details-header">
        <div>
          <p className="details-eyebrow">Phase 3</p>
          <p className="job-company">{job.company}</p>
          <h2>{job.title}</h2>
        </div>

        <div className="details-actions">
          <button
            className="secondary-action"
            type="button"
            onClick={onBackToResults}
          >
            Back to results
          </button>

          <button
            className="ghost-action"
            type="button"
            onClick={onClearSelection}
          >
            Clear selection
          </button>

          <button
            className={isSaved ? "save-button saved" : "save-button"}
            type="button"
            onClick={() => onToggleSavedJob(job.id)}
          >
            {isSaved ? "Saved" : "Save Job"}
          </button>
        </div>
      </div>

      <div className="details-meta-grid">
        <article className="details-meta-card">
          <p className="details-meta-label">Location</p>
          <strong>{job.location}</strong>
        </article>

        <article className="details-meta-card">
          <p className="details-meta-label">Company</p>
          <strong>{job.company}</strong>
        </article>
      </div>

      <div className="details-section">
        <p className="details-section-label">Description</p>
        <p className="details-copy">{job.description}</p>
      </div>

      <div className="details-section">
        <p className="details-section-label">Tags</p>
        <ul
          className="tag-list details-tag-list"
          aria-label="Selected job tags"
        >
          {job.tags.map((tag) => (
            <li key={`${job.id}-${tag}`}>{tag}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
