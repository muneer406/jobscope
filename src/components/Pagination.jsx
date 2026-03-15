function getVisiblePages(currentPage, totalPages) {
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);
  const pages = [];

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  return pages;
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

  const pages = getVisiblePages(currentPage, totalPages);

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
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            className={
              page === currentPage
                ? "pagination-button active"
                : "pagination-button"
            }
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        ))}
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
