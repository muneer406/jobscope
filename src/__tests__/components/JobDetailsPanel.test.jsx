import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { JobDetailsPanel } from "../../components/JobDetailsPanel";

const mockJob = {
  id: 1,
  title: "Frontend Engineer",
  description: "Build polished user interfaces with a strong focus on UX.",
  company: "Acme Corp",
  location: "Remote",
  tags: ["frontend", "react", "design-systems"],
};

function renderPanel(props = {}) {
  return render(
    <JobDetailsPanel
      isSaved={false}
      job={mockJob}
      onToggleSavedJob={vi.fn()}
      {...props}
    />,
  );
}

describe("JobDetailsPanel", () => {
  it("renders the selected job title", () => {
    renderPanel();
    expect(
      screen.getByRole("heading", { name: mockJob.title }),
    ).toBeInTheDocument();
  });

  it("renders the description and metadata", () => {
    renderPanel();
    expect(screen.getByText(mockJob.description)).toBeInTheDocument();
    expect(screen.getAllByText(mockJob.company)).toHaveLength(2);
    expect(screen.getByText(mockJob.location)).toBeInTheDocument();
  });

  it("renders all selected job tags", () => {
    renderPanel();
    mockJob.tags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it('shows "Save Job" when the job is not saved', () => {
    renderPanel({ isSaved: false });
    expect(screen.getByRole("button", { name: "Save Job" })).toBeInTheDocument();
  });

  it('shows "Saved" when the job is already saved', () => {
    renderPanel({ isSaved: true });
    expect(screen.getByRole("button", { name: "Saved" })).toBeInTheDocument();
  });

  it("calls onToggleSavedJob with the selected job id", async () => {
    const onToggleSavedJob = vi.fn();
    renderPanel({ onToggleSavedJob });
    await userEvent.click(screen.getByRole("button", { name: "Save Job" }));
    expect(onToggleSavedJob).toHaveBeenCalledWith(mockJob.id);
  });

  it("renders an empty state when no job is selected", () => {
    renderPanel({ job: null });
    expect(
      screen.getByRole("heading", { name: "No job selected" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/select a job from the list to inspect/i),
    ).toBeInTheDocument();
  });

  it("renders a loading state while details are being fetched", () => {
    renderPanel({ isLoading: true, job: null });
    expect(
      screen.getByRole("heading", { name: "Loading details" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/waiting for the selected listing/i),
    ).toBeInTheDocument();
  });
});