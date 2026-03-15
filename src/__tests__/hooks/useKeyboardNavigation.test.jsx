import { render, screen, fireEvent } from "@testing-library/react";
import { useRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useKeyboardNavigation } from "../../hooks/useKeyboardNavigation";

const mockJobs = [
  { id: 1, title: "Job 1" },
  { id: 2, title: "Job 2" },
  { id: 3, title: "Job 3" },
];

function HookWrapper(props) {
  const searchInputRef = useRef(null);
  useKeyboardNavigation({ ...props, searchInputRef });
  return (
    <>
      <input data-testid="search" ref={searchInputRef} />
      <div data-job-id="1">Job 1</div>
      <div data-job-id="2">Job 2</div>
      <div data-job-id="3">Job 3</div>
    </>
  );
}

function defaultProps(overrides = {}) {
  return {
    visibleJobs: mockJobs,
    selectedJob: null,
    selectJob: vi.fn(),
    toggleSavedJob: vi.fn(),
    toggleViewMode: vi.fn(),
    activePanel: "results",
    setActivePanel: vi.fn(),
    goToPage: vi.fn(),
    currentPage: 1,
    ...overrides,
  };
}

describe("useKeyboardNavigation", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("j selects the first job when nothing is selected", () => {
    const selectJob = vi.fn();
    render(<HookWrapper {...defaultProps({ selectJob })} />);
    fireEvent.keyDown(document.body, { key: "j" });
    expect(selectJob).toHaveBeenCalledWith(1);
  });

  it("j moves to the next job", () => {
    const selectJob = vi.fn();
    render(
      <HookWrapper
        {...defaultProps({ selectedJob: mockJobs[0], selectJob })}
      />,
    );
    fireEvent.keyDown(document.body, { key: "j" });
    expect(selectJob).toHaveBeenCalledWith(2);
  });

  it("j navigation is rate-limited for a short moment", () => {
    const selectJob = vi.fn();
    render(
      <HookWrapper
        {...defaultProps({ selectedJob: mockJobs[0], selectJob })}
      />,
    );

    fireEvent.keyDown(document.body, { key: "j" });
    fireEvent.keyDown(document.body, { key: "j" });

    expect(selectJob).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(141);
    fireEvent.keyDown(document.body, { key: "j" });

    expect(selectJob).toHaveBeenCalledTimes(2);
  });

  it("j does not go past the last job", () => {
    const selectJob = vi.fn();
    render(
      <HookWrapper
        {...defaultProps({ selectedJob: mockJobs[2], selectJob })}
      />,
    );
    fireEvent.keyDown(document.body, { key: "j" });
    expect(selectJob).not.toHaveBeenCalled();
  });

  it("k moves to the previous job", () => {
    const selectJob = vi.fn();
    render(
      <HookWrapper
        {...defaultProps({ selectedJob: mockJobs[1], selectJob })}
      />,
    );
    fireEvent.keyDown(document.body, { key: "k" });
    expect(selectJob).toHaveBeenCalledWith(1);
  });

  it("k does not go before the first job", () => {
    const selectJob = vi.fn();
    render(
      <HookWrapper
        {...defaultProps({ selectedJob: mockJobs[0], selectJob })}
      />,
    );
    fireEvent.keyDown(document.body, { key: "k" });
    expect(selectJob).not.toHaveBeenCalled();
  });

  it("Enter opens the details panel when a job is selected", () => {
    const setActivePanel = vi.fn();
    render(
      <HookWrapper
        {...defaultProps({ selectedJob: mockJobs[0], setActivePanel })}
      />,
    );
    fireEvent.keyDown(document.body, { key: "Enter" });
    expect(setActivePanel).toHaveBeenCalledWith("details");
  });

  it("Enter does nothing when no job is selected", () => {
    const setActivePanel = vi.fn();
    render(<HookWrapper {...defaultProps({ setActivePanel })} />);
    fireEvent.keyDown(document.body, { key: "Enter" });
    expect(setActivePanel).not.toHaveBeenCalled();
  });

  it("s saves the selected job", () => {
    const toggleSavedJob = vi.fn();
    render(
      <HookWrapper
        {...defaultProps({ selectedJob: mockJobs[0], toggleSavedJob })}
      />,
    );
    fireEvent.keyDown(document.body, { key: "s" });
    expect(toggleSavedJob).toHaveBeenCalledWith(1);
  });

  it("s does nothing when no job is selected", () => {
    const toggleSavedJob = vi.fn();
    render(<HookWrapper {...defaultProps({ toggleSavedJob })} />);
    fireEvent.keyDown(document.body, { key: "s" });
    expect(toggleSavedJob).not.toHaveBeenCalled();
  });

  it("v toggles view mode", () => {
    const toggleViewMode = vi.fn();
    render(<HookWrapper {...defaultProps({ toggleViewMode })} />);
    fireEvent.keyDown(document.body, { key: "v" });
    expect(toggleViewMode).toHaveBeenCalledTimes(1);
  });

  it("/ focuses the search input", () => {
    render(<HookWrapper {...defaultProps()} />);
    const input = screen.getByTestId("search");
    fireEvent.keyDown(document.body, { key: "/" });
    expect(document.activeElement).toBe(input);
  });

  it("Escape closes the details panel when in details", () => {
    const setActivePanel = vi.fn();
    render(
      <HookWrapper
        {...defaultProps({ activePanel: "details", setActivePanel })}
      />,
    );
    fireEvent.keyDown(document.body, { key: "Escape" });
    expect(setActivePanel).toHaveBeenCalledWith("results");
  });

  it("shortcuts are ignored when typing in an input", () => {
    const toggleViewMode = vi.fn();
    render(<HookWrapper {...defaultProps({ toggleViewMode })} />);
    const input = screen.getByTestId("search");
    fireEvent.keyDown(input, { key: "v" });
    expect(toggleViewMode).not.toHaveBeenCalled();
  });

  it("smoothly scrolls the selected job into view when it is off-screen", () => {
    const scrollIntoView = vi.fn();

    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 800,
    });

    render(<HookWrapper {...defaultProps({ selectedJob: mockJobs[1] })} />);

    const selectedElement = document.querySelector('[data-job-id="2"]');

    Object.defineProperty(selectedElement, "getBoundingClientRect", {
      configurable: true,
      value: () => ({ top: 900, bottom: 980 }),
    });
    selectedElement.scrollIntoView = scrollIntoView;

    render(<HookWrapper {...defaultProps({ selectedJob: mockJobs[1] })} />);

    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  });

  it("does not scroll when the selected job is already visible", () => {
    const scrollIntoView = vi.fn();

    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 800,
    });

    render(<HookWrapper {...defaultProps({ selectedJob: mockJobs[1] })} />);

    const selectedElement = document.querySelector('[data-job-id="2"]');

    Object.defineProperty(selectedElement, "getBoundingClientRect", {
      configurable: true,
      value: () => ({ top: 120, bottom: 240 }),
    });
    selectedElement.scrollIntoView = scrollIntoView;

    render(<HookWrapper {...defaultProps({ selectedJob: mockJobs[1] })} />);

    expect(scrollIntoView).not.toHaveBeenCalled();
  });
});
