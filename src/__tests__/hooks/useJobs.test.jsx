import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { JobsProvider } from "../../context/JobsContext";
import { useJobs } from "../../hooks/useJobs";

// Stub the API so no real network calls are made during tests.
vi.mock("../../api/jobs", () => ({
  fetchJobs: vi.fn(),
}));

import { fetchJobs } from "../../api/jobs";

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

function ReadContext() {
  const ctx = useJobs();
  return (
    <div>
      <span data-testid="loading">{String(ctx.isLoading)}</span>
      <span data-testid="count">{ctx.visibleJobs.length}</span>
      <span data-testid="saved">{ctx.savedJobs.length}</span>
      <span data-testid="viewMode">{ctx.viewMode}</span>
      <span data-testid="error">{ctx.error}</span>
      <button onClick={() => ctx.toggleSavedJob(1)}>save 1</button>
      <button onClick={() => ctx.updateSearchQuery("Backend")}>
        search backend
      </button>
      <button onClick={() => ctx.showSavedJobs()}>saved view</button>
      <button onClick={() => ctx.showAllJobs()}>all view</button>
      <button onClick={() => ctx.clearSearchQuery()}>clear</button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <JobsProvider>
      <ReadContext />
    </JobsProvider>,
  );
}

describe("useJobs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws when used outside a JobsProvider", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    expect(() => render(<ReadContext />)).toThrow(
      "useJobs must be used within a JobsProvider",
    );
    consoleError.mockRestore();
  });

  it("starts in loading state", () => {
    fetchJobs.mockResolvedValue(mockJobs);
    renderWithProvider();
    expect(screen.getByTestId("loading").textContent).toBe("true");
  });

  it("loads jobs from the API and updates state", async () => {
    fetchJobs.mockResolvedValue(mockJobs);
    renderWithProvider();
    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });
    expect(screen.getByTestId("count").textContent).toBe("2");
  });

  it("sets error message when fetchJobs rejects", async () => {
    fetchJobs.mockRejectedValue(new Error("Network failure"));
    renderWithProvider();
    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });
    expect(screen.getByTestId("error").textContent).toBe("Network failure");
  });

  it("toggleSavedJob adds a job to savedJobs", async () => {
    fetchJobs.mockResolvedValue(mockJobs);
    renderWithProvider();
    await waitFor(() =>
      expect(screen.getByTestId("loading").textContent).toBe("false"),
    );
    await userEvent.click(screen.getByRole("button", { name: "save 1" }));
    expect(screen.getByTestId("saved").textContent).toBe("1");
  });

  it("toggleSavedJob removes a job already in savedJobs", async () => {
    fetchJobs.mockResolvedValue(mockJobs);
    renderWithProvider();
    await waitFor(() =>
      expect(screen.getByTestId("loading").textContent).toBe("false"),
    );
    await userEvent.click(screen.getByRole("button", { name: "save 1" }));
    await userEvent.click(screen.getByRole("button", { name: "save 1" }));
    expect(screen.getByTestId("saved").textContent).toBe("0");
  });

  it("updateSearchQuery filters visible jobs", async () => {
    fetchJobs.mockResolvedValue(mockJobs);
    renderWithProvider();
    await waitFor(() =>
      expect(screen.getByTestId("loading").textContent).toBe("false"),
    );
    await userEvent.click(
      screen.getByRole("button", { name: "search backend" }),
    );
    expect(screen.getByTestId("count").textContent).toBe("1");
  });

  it("clearSearchQuery removes the search filter", async () => {
    fetchJobs.mockResolvedValue(mockJobs);
    renderWithProvider();
    await waitFor(() =>
      expect(screen.getByTestId("loading").textContent).toBe("false"),
    );
    await userEvent.click(
      screen.getByRole("button", { name: "search backend" }),
    );
    await userEvent.click(screen.getByRole("button", { name: "clear" }));
    expect(screen.getByTestId("count").textContent).toBe("2");
  });

  it("showSavedJobs switches viewMode to SAVED", async () => {
    fetchJobs.mockResolvedValue(mockJobs);
    renderWithProvider();
    await waitFor(() =>
      expect(screen.getByTestId("loading").textContent).toBe("false"),
    );
    await userEvent.click(screen.getByRole("button", { name: "saved view" }));
    expect(screen.getByTestId("viewMode").textContent).toBe("saved");
  });

  it("showAllJobs switches viewMode back to ALL", async () => {
    fetchJobs.mockResolvedValue(mockJobs);
    renderWithProvider();
    await waitFor(() =>
      expect(screen.getByTestId("loading").textContent).toBe("false"),
    );
    await userEvent.click(screen.getByRole("button", { name: "saved view" }));
    await userEvent.click(screen.getByRole("button", { name: "all view" }));
    expect(screen.getByTestId("viewMode").textContent).toBe("all");
  });
});

// ---------------------------------------------------------------------------
// Phase 2 — advanced filter actions
// ---------------------------------------------------------------------------

function FilterContext() {
  const ctx = useJobs();
  return (
    <div>
      <span data-testid="count">{ctx.visibleJobs.length}</span>
      <span data-testid="company">{ctx.filters.company}</span>
      <span data-testid="location">{ctx.filters.location}</span>
      <span data-testid="tags">{JSON.stringify(ctx.filters.tags)}</span>
      <span data-testid="hasActive">{String(ctx.hasActiveFilters)}</span>
      <button onClick={() => ctx.updateCompanyFilter("Acme")}>set acme</button>
      <button onClick={() => ctx.updateCompanyFilter("Beta")}>set beta</button>
      <button onClick={() => ctx.updateLocationFilter("Remote")}>
        set remote
      </button>
      <button onClick={() => ctx.updateLocationFilter("Berlin")}>
        set berlin
      </button>
      <button onClick={() => ctx.toggleTagFilter("react")}>toggle react</button>
      <button onClick={() => ctx.toggleTagFilter("node")}>toggle node</button>
      <button onClick={() => ctx.clearAllFilters()}>clear all</button>
    </div>
  );
}

function renderFilterProvider() {
  return render(
    <JobsProvider>
      <FilterContext />
    </JobsProvider>,
  );
}

describe("useJobs — Phase 2 filter actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchJobs.mockResolvedValue(mockJobs);
  });

  async function setup() {
    renderFilterProvider();
    await waitFor(() =>
      expect(screen.getByTestId("count")).toBeInTheDocument(),
    );
  }

  it("hasActiveFilters is false initially", async () => {
    await setup();
    expect(screen.getByTestId("hasActive").textContent).toBe("false");
  });

  it("updateCompanyFilter sets the company filter", async () => {
    await setup();
    await userEvent.click(screen.getByRole("button", { name: "set acme" }));
    expect(screen.getByTestId("company").textContent).toBe("Acme");
  });

  it("updateCompanyFilter called again with same value clears it", async () => {
    await setup();
    await userEvent.click(screen.getByRole("button", { name: "set acme" }));
    await userEvent.click(screen.getByRole("button", { name: "set acme" }));
    expect(screen.getByTestId("company").textContent).toBe("");
  });

  it("updateCompanyFilter filters visible jobs", async () => {
    await setup();
    await userEvent.click(screen.getByRole("button", { name: "set acme" }));
    expect(screen.getByTestId("count").textContent).toBe("1");
  });

  it("updateLocationFilter sets the location filter", async () => {
    await setup();
    await userEvent.click(screen.getByRole("button", { name: "set remote" }));
    expect(screen.getByTestId("location").textContent).toBe("Remote");
  });

  it("updateLocationFilter called again with same value clears it", async () => {
    await setup();
    await userEvent.click(screen.getByRole("button", { name: "set remote" }));
    await userEvent.click(screen.getByRole("button", { name: "set remote" }));
    expect(screen.getByTestId("location").textContent).toBe("");
  });

  it("toggleTagFilter adds tag to the array", async () => {
    await setup();
    await userEvent.click(screen.getByRole("button", { name: "toggle react" }));
    expect(screen.getByTestId("tags").textContent).toBe('["react"]');
  });

  it("toggleTagFilter adds a second tag without removing the first", async () => {
    await setup();
    await userEvent.click(screen.getByRole("button", { name: "toggle react" }));
    await userEvent.click(screen.getByRole("button", { name: "toggle node" }));
    expect(screen.getByTestId("tags").textContent).toBe('["react","node"]');
  });

  it("toggleTagFilter removes the tag when called a second time", async () => {
    await setup();
    await userEvent.click(screen.getByRole("button", { name: "toggle react" }));
    await userEvent.click(screen.getByRole("button", { name: "toggle react" }));
    expect(screen.getByTestId("tags").textContent).toBe("[]");
  });

  it("hasActiveFilters is true after setting any filter", async () => {
    await setup();
    await userEvent.click(screen.getByRole("button", { name: "set acme" }));
    expect(screen.getByTestId("hasActive").textContent).toBe("true");
  });

  it("clearAllFilters resets all filter fields", async () => {
    await setup();
    await userEvent.click(screen.getByRole("button", { name: "set acme" }));
    await userEvent.click(screen.getByRole("button", { name: "set remote" }));
    await userEvent.click(screen.getByRole("button", { name: "toggle react" }));
    await userEvent.click(screen.getByRole("button", { name: "clear all" }));
    expect(screen.getByTestId("company").textContent).toBe("");
    expect(screen.getByTestId("location").textContent).toBe("");
    expect(screen.getByTestId("tags").textContent).toBe("[]");
  });

  it("hasActiveFilters is false after clearAllFilters", async () => {
    await setup();
    await userEvent.click(screen.getByRole("button", { name: "set acme" }));
    await userEvent.click(screen.getByRole("button", { name: "clear all" }));
    expect(screen.getByTestId("hasActive").textContent).toBe("false");
  });
});
