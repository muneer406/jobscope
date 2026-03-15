export function SearchBar({ searchQuery, onSearchChange }) {
  return (
    <label className="search-field" htmlFor="job-search">
      <span>Search by title</span>
      <input
        id="job-search"
        type="search"
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Try frontend, manager, or engineer"
      />
    </label>
  );
}
