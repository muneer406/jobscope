export function RecommendationsPanel({
  jobs,
  onOpenJob,
  onToggleSavedJob,
  savedJobs,
}) {
  return (
    <section className="intelligence-panel" aria-label="Recommended jobs">
      <p className="filter-group-label">Recommended Next</p>

      {jobs.length === 0 ? (
        <p className="intelligence-empty">
          Save a few jobs first. Recommendations start once JobScope sees a
          pattern.
        </p>
      ) : (
        <div className="recommendation-list">
          {jobs.map((job) => {
            const isSaved = savedJobs.includes(job.id);

            return (
              <article key={job.id} className="recommendation-card">
                <div>
                  <p className="recommendation-company">{job.company}</p>
                  <h3>{job.title}</h3>
                  <p className="recommendation-meta">{job.location}</p>
                </div>

                <div className="recommendation-actions">
                  <button
                    type="button"
                    className="ghost-action"
                    onClick={() => onOpenJob(job.id)}
                  >
                    Open
                  </button>
                  <button
                    type="button"
                    className={isSaved ? "save-button saved" : "save-button"}
                    onClick={() => onToggleSavedJob(job.id)}
                  >
                    {isSaved ? "Saved" : "Save"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
