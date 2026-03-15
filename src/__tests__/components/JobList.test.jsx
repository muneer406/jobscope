import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { JobList } from "../../components/JobList";
import { VIEW_MODES } from "../../utils/jobSelectors";

const mockJobs = [
  {
    id: 1,
    title: "Frontend Engineer",
    description: "Build UIs",
    company: "Acme",
    location: "Remote",
    tags: ["react"],
  },
  {
    id: 2,
    title: "Backend Developer",
    description: "Build APIs",
    company: "Beta",
    location: "Berlin",
    tags: ["node"],
  },
];

function renderList(props = {}) {
  return render(
    <JobList
      isLoading={false}
      jobs={mockJobs}
      onSelectJob={vi.fn()}
      savedJobs={[]}
      selectedJobId={null}
      viewMode={VIEW_MODES.ALL}
      onToggleSavedJob={vi.fn()}
      {...props}
    />,
  );
}

describe("JobList", () => {
  describe("loading state", () => {
    it("shows the loading panel when isLoading is true", () => {
      renderList({ isLoading: true, jobs: [] });
      expect(screen.getByText(/loading jobs/i)).toBeInTheDocument();
    });

    it("does not show the job list while loading", () => {
      renderList({ isLoading: true, jobs: [] });
      expect(
        screen.queryByRole("region", { name: /job listings/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe("empty state", () => {
    it('shows "No saved jobs" message in SAVED view with no results', () => {
      renderList({ jobs: [], viewMode: VIEW_MODES.SAVED });
      expect(screen.getByText(/no saved jobs yet/i)).toBeInTheDocument();
    });

    it('shows "No jobs match" message in ALL view with no results', () => {
      renderList({ jobs: [], viewMode: VIEW_MODES.ALL });
      expect(screen.getByText(/no jobs match/i)).toBeInTheDocument();
    });
  });

  describe("job cards", () => {
    it("renders a card for every job", () => {
      renderList();
      expect(screen.getAllByRole("article")).toHaveLength(mockJobs.length);
    });

    it("renders the correct job titles", () => {
      renderList();
      expect(
        screen.getByRole("heading", { name: mockJobs[0].title }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: mockJobs[1].title }),
      ).toBeInTheDocument();
    });
  });

  describe("job selection", () => {
    it("calls selectJob when a card row is clicked", async () => {
      const onSelectJob = vi.fn();
      renderList({ onSelectJob });
      const [cardRow] = document.querySelectorAll(".job-list-item");
      await userEvent.click(cardRow);
      expect(onSelectJob).toHaveBeenCalledWith(mockJobs[0].id);
    });

    it("calls selectJob with the correct job id on keyboard Enter", async () => {
      const onSelectJob = vi.fn();
      renderList({ onSelectJob });
      const cardRows = document.querySelectorAll(".job-list-item");
      cardRows[0].focus();
      await userEvent.keyboard("{Enter}");
      expect(onSelectJob).toHaveBeenCalledWith(mockJobs[0].id);
    });

    it("calls selectJob with the correct job id on keyboard Space", async () => {
      const onSelectJob = vi.fn();
      renderList({ onSelectJob });
      const cardRows = document.querySelectorAll(".job-list-item");
      cardRows[0].focus();
      await userEvent.keyboard(" ");
      expect(onSelectJob).toHaveBeenCalledWith(mockJobs[0].id);
    });
  });
});
