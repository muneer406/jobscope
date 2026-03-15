function InsightList({ entries, title }) {
  if (entries.length === 0) {
    return (
      <div className="insight-block">
        <p className="intelligence-label">{title}</p>
        <p className="intelligence-empty">No signal yet</p>
      </div>
    );
  }

  return (
    <div className="insight-block">
      <p className="intelligence-label">{title}</p>
      <ul className="insight-list">
        {entries.map((entry) => (
          <li key={`${title}-${entry.label}`}>
            <span>{entry.label}</span>
            <strong>{entry.count}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function InsightsPanel({ insights, title = "Saved Insights" }) {
  return (
    <section className="intelligence-panel" aria-label="Saved job insights">
      <div className="intelligence-header">
        <div>
          <p className="filter-group-label">{title}</p>
          <p className="intelligence-subtitle">
            JobScope is reading the patterns in what you keep.
          </p>
        </div>
      </div>

      <div className="insight-stats-grid">
        <article className="insight-stat-card">
          <span className="intelligence-label">Saved jobs</span>
          <strong>{insights.savedCount}</strong>
        </article>

        <article className="insight-stat-card">
          <span className="intelligence-label">Companies</span>
          <strong>{insights.companyCount}</strong>
        </article>

        <article className="insight-stat-card">
          <span className="intelligence-label">Locations</span>
          <strong>{insights.locationCount}</strong>
        </article>
      </div>

      <InsightList entries={insights.topTags} title="Top tags" />
      <InsightList entries={insights.topCompanies} title="Top companies" />
      <InsightList entries={insights.topLocations} title="Top locations" />
    </section>
  );
}
