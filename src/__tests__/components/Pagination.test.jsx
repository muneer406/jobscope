import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Pagination } from "../../components/Pagination";

function renderPagination(props = {}) {
  return render(
    <Pagination
      currentPage={2}
      totalPages={5}
      onNextPage={vi.fn()}
      onPageChange={vi.fn()}
      onPreviousPage={vi.fn()}
      {...props}
    />,
  );
}

describe("Pagination", () => {
  it("does not render when there is only one page", () => {
    renderPagination({ totalPages: 1 });
    expect(
      screen.queryByRole("navigation", { name: /pagination/i }),
    ).not.toBeInTheDocument();
  });

  it("renders page buttons around the current page", () => {
    renderPagination();
    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "3" })).toBeInTheDocument();
  });

  it("calls onPreviousPage when previous is clicked", async () => {
    const onPreviousPage = vi.fn();
    renderPagination({ onPreviousPage });
    await userEvent.click(screen.getByRole("button", { name: /previous/i }));
    expect(onPreviousPage).toHaveBeenCalledTimes(1);
  });

  it("calls onNextPage when next is clicked", async () => {
    const onNextPage = vi.fn();
    renderPagination({ onNextPage });
    await userEvent.click(screen.getByRole("button", { name: /next/i }));
    expect(onNextPage).toHaveBeenCalledTimes(1);
  });

  it("calls onPageChange with the selected page number", async () => {
    const onPageChange = vi.fn();
    renderPagination({ onPageChange });
    await userEvent.click(screen.getByRole("button", { name: "4" }));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });
});
