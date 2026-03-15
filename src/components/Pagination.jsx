function getPageItems(currentPage, totalPages) {
  const corePages = new Set(
    [1, totalPages, currentPage - 1, currentPage, currentPage + 1].filter(
      (p) => p >= 1 && p <= totalPages,
    ),
  );

  const sorted = [...corePages].sort((a, b) => a - b);
  const items = [];

  for (let i = 0; i < sorted.length; i += 1) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      items.push("...");
    }
    items.push(sorted[i]);
  }

  return items;
}

export function Pagination({
  currentPage,
  totalPages,
  onNextPage,
  onPageChange,
  onPreviousPage,
}) {
  if (totalPages <= 1) {
    return null;
  }

  const items = getPageItems(currentPage, totalPages);

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        className="pagination-button"
        onClick={onPreviousPage}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      <div className="pagination-pages">
        {items.map((item, idx) =>
          item === "..." ? (
            <span key={`ellipsis-${idx}`} className="pagination-ellipsis">
              &hellip;
            </span>
          ) : (
            <button
              key={item}
              type="button"
              className={
                item === currentPage
                  ? "pagination-button active"
                  : "pagination-button"
              }
              onClick={() => onPageChange(item)}
              aria-current={item === currentPage ? "page" : undefined}
            >
              {item}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        className="pagination-button"
        onClick={onNextPage}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </nav>
  );
}
