import { forwardRef } from "react";

export const SearchBar = forwardRef(function SearchBar(
  { searchQuery, onSearchChange },
  ref,
) {
  return (
    <label className="search-field" htmlFor="job-search">
      <span>Search by title</span>
      <input
        ref={ref}
        id="job-search"
        type="search"
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Try frontend, manager, or engineer"
      />
    </label>
  );
});
