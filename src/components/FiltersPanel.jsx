import {
  getUniqueCompanies,
  getUniqueLocations,
  getUniqueTags,
} from "../utils/jobSelectors";

function FilterGroup({ label, items, activeItem, onToggle }) {
  if (items.length === 0) return null;

  return (
    <div className="filter-group">
      <p className="filter-group-label">{label}</p>
      <div className="filter-options">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            className={
              activeItem === item ? "filter-chip active" : "filter-chip"
            }
            onClick={() => onToggle(item)}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

function TagFilterGroup({ tags, activeTags, onToggle }) {
  if (tags.length === 0) return null;

  return (
    <div className="filter-group">
      <p className="filter-group-label">Tags</p>
      <div className="filter-options">
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            className={
              activeTags.includes(tag) ? "filter-chip active" : "filter-chip"
            }
            onClick={() => onToggle(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}

export function FiltersPanel({
  filters,
  hasActiveFilters,
  jobs,
  onClearAll,
  onToggleCompany,
  onToggleLocation,
  onToggleTag,
}) {
  const companies = getUniqueCompanies(jobs);
  const locations = getUniqueLocations(jobs);
  const tags = getUniqueTags(jobs);

  return (
    <div className="filters-panel">
      <div className="filters-header">
        <p className="filter-group-label">Filters</p>
        {hasActiveFilters && (
          <button
            type="button"
            className="clear-filters-button"
            onClick={onClearAll}
          >
            Clear all
          </button>
        )}
      </div>

      <FilterGroup
        label="Company"
        items={companies}
        activeItem={filters.company}
        onToggle={onToggleCompany}
      />

      <FilterGroup
        label="Location"
        items={locations}
        activeItem={filters.location}
        onToggle={onToggleLocation}
      />

      <TagFilterGroup
        tags={tags}
        activeTags={filters.tags}
        onToggle={onToggleTag}
      />
    </div>
  );
}
