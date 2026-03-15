export function JobCard({ isSaved, isSelected, job, onToggleSavedJob }) {
  const cardClassName = isSelected ? "job-card selected" : "job-card";

  return (
    <article className={cardClassName}>
      <div className="job-card-header">
        <div>
          <p className="job-company">{job.company}</p>
          <h2>{job.title}</h2>
        </div>

        <button
          className={isSaved ? "save-button saved" : "save-button"}
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onToggleSavedJob(job.id);
          }}
        >
          {isSaved ? "Saved" : "Save"}
        </button>
      </div>

      <p className="job-description">{job.description}</p>

      <div className="job-footer">
        <span className="job-location">{job.location}</span>

        <ul className="tag-list" aria-label="Job tags">
          {job.tags.map((tag) => (
            <li key={`${job.id}-${tag}`}>{tag}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
