import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ViewToggle } from "../../components/ViewToggle";
import { VIEW_MODES } from "../../utils/jobSelectors";

function renderToggle(props = {}) {
  return render(
    <ViewToggle
      viewMode={VIEW_MODES.ALL}
      onShowAllJobs={vi.fn()}
      onShowSavedJobs={vi.fn()}
      {...props}
    />,
  );
}

describe("ViewToggle", () => {
  it('renders "All Jobs" and "Saved Jobs" buttons', () => {
    renderToggle();
    expect(
      screen.getByRole("button", { name: "All Jobs" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Saved Jobs" }),
    ).toBeInTheDocument();
  });

  it('"All Jobs" button has active class when viewMode is ALL', () => {
    renderToggle({ viewMode: VIEW_MODES.ALL });
    expect(screen.getByRole("button", { name: "All Jobs" })).toHaveClass(
      "active",
    );
    expect(screen.getByRole("button", { name: "Saved Jobs" })).not.toHaveClass(
      "active",
    );
  });

  it('"Saved Jobs" button has active class when viewMode is SAVED', () => {
    renderToggle({ viewMode: VIEW_MODES.SAVED });
    expect(screen.getByRole("button", { name: "Saved Jobs" })).toHaveClass(
      "active",
    );
    expect(screen.getByRole("button", { name: "All Jobs" })).not.toHaveClass(
      "active",
    );
  });

  it('calls onShowAllJobs when clicking "All Jobs"', async () => {
    const onShowAllJobs = vi.fn();
    renderToggle({ viewMode: VIEW_MODES.SAVED, onShowAllJobs });
    await userEvent.click(screen.getByRole("button", { name: "All Jobs" }));
    expect(onShowAllJobs).toHaveBeenCalledTimes(1);
  });

  it('calls onShowSavedJobs when clicking "Saved Jobs"', async () => {
    const onShowSavedJobs = vi.fn();
    renderToggle({ onShowSavedJobs });
    await userEvent.click(screen.getByRole("button", { name: "Saved Jobs" }));
    expect(onShowSavedJobs).toHaveBeenCalledTimes(1);
  });
});
