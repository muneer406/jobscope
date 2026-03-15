import { useState } from "react";
import {
  getUniqueCompanies,
  getUniqueLocations,
  getUniqueTags,
} from "../utils/jobSelectors";

const COLLAPSE_THRESHOLD = 8;

function FilterGroup({ label, items, activeItems, onToggle }) {
  const [expanded, setExpanded] = useState(false);

  if (items.length === 0) return null;

  const hasMore = items.length > COLLAPSE_THRESHOLD;
  const visibleItems =
    hasMore && !expanded ? items.slice(0, COLLAPSE_THRESHOLD) : items;
  const hiddenCount = items.length - COLLAPSE_THRESHOLD;

  return (
    <div className="filter-group">
      <p className="filter-group-label">{label}</p>
      <div className="filter-options">
        {visibleItems.map((item) => (
          <button
            key={item}
            type="button"
            className={
              activeItems.includes(item) ? "filter-chip active" : "filter-chip"
            }
            onClick={() => onToggle(item)}
          >
            {item}
          </button>
        ))}
        {hasMore && (
          <button
            type="button"
            className="filter-chip filter-chip-toggle"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? "Show less" : `+${hiddenCount} more`}
          </button>
        )}
      </div>
    </div>
  );
}

function TagFilterGroup({ tags, activeTags, onToggle }) {
  const [expanded, setExpanded] = useState(false);

  if (tags.length === 0) return null;

  const hasMore = tags.length > COLLAPSE_THRESHOLD;
  const visibleTags =
    hasMore && !expanded ? tags.slice(0, COLLAPSE_THRESHOLD) : tags;
  const hiddenCount = tags.length - COLLAPSE_THRESHOLD;

  return (
    <div className="filter-group">
      <p className="filter-group-label">Tags</p>
      <div className="filter-options">
        {visibleTags.map((tag) => (
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
        {hasMore && (
          <button
            type="button"
            className="filter-chip filter-chip-toggle"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? "Show less" : `+${hiddenCount} more`}
          </button>
        )}
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
        activeItems={filters.company}
        onToggle={onToggleCompany}
      />

      <FilterGroup
        label="Location"
        items={locations}
        activeItems={filters.location}
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
