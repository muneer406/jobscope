import { SORT_OPTIONS } from "../utils/jobSelectors";

const SORT_LABELS = {
  [SORT_OPTIONS.DEFAULT]: "Default order",
  [SORT_OPTIONS.TITLE_ASC]: "Title A-Z",
  [SORT_OPTIONS.COMPANY_ASC]: "Company A-Z",
  [SORT_OPTIONS.LOCATION_ASC]: "Location A-Z",
};

export function SortControls({ onSortChange, sortOption }) {
  return (
    <label className="sort-controls" htmlFor="job-sort">
      <span>Sort results</span>
      <select
        id="job-sort"
        value={sortOption}
        onChange={(event) => onSortChange(event.target.value)}
      >
        {Object.entries(SORT_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );
}
