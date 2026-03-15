import { useCallback, useEffect } from "react";

import { JOBS_PER_PAGE } from "../utils/jobSelectors";

export function useKeyboardNavigation({
  activePanel,
  currentPage,
  goToPage,
  searchInputRef,
  selectedJob,
  selectJob,
  setActivePanel,
  toggleSavedJob,
  toggleViewMode,
  visibleJobs,
}) {
  const handleKeyDown = useCallback(
    (event) => {
      const target = event.target;
      const isInInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      // '/' always focuses search unless user is already in an input
      if (event.key === "/") {
        if (!isInInput) {
          event.preventDefault();
          searchInputRef.current?.focus();
        }
        return;
      }

      // Esc: blur input, or close details panel
      if (event.key === "Escape") {
        if (isInInput) {
          target.blur();
          return;
        }
        if (activePanel === "details") {
          setActivePanel("results");
        }
        return;
      }

      // All remaining shortcuts are silenced while typing in an input
      if (isInInput) return;

      if (event.key === "j") {
        event.preventDefault();
        const currentIdx = visibleJobs.findIndex(
          (job) => job.id === selectedJob?.id,
        );

        if (currentIdx === -1) {
          if (visibleJobs.length > 0) {
            selectJob(visibleJobs[0].id);
            goToPage(1);
          }
        } else if (currentIdx < visibleJobs.length - 1) {
          const newIdx = currentIdx + 1;
          selectJob(visibleJobs[newIdx].id);
          const newPage = Math.floor(newIdx / JOBS_PER_PAGE) + 1;
          if (newPage !== currentPage) {
            goToPage(newPage);
          }
        }
        return;
      }

      if (event.key === "k") {
        event.preventDefault();
        const currentIdx = visibleJobs.findIndex(
          (job) => job.id === selectedJob?.id,
        );

        if (currentIdx > 0) {
          const newIdx = currentIdx - 1;
          selectJob(visibleJobs[newIdx].id);
          const newPage = Math.floor(newIdx / JOBS_PER_PAGE) + 1;
          if (newPage !== currentPage) {
            goToPage(newPage);
          }
        }
        return;
      }

      if (event.key === "Enter") {
        if (selectedJob) {
          setActivePanel("details");
        }
        return;
      }

      if (event.key === "s" || event.key === "S") {
        if (selectedJob) {
          toggleSavedJob(selectedJob.id);
        }
        return;
      }

      if (event.key === "v" || event.key === "V") {
        toggleViewMode();
      }
    },
    [
      activePanel,
      currentPage,
      goToPage,
      searchInputRef,
      selectedJob,
      selectJob,
      setActivePanel,
      toggleSavedJob,
      toggleViewMode,
      visibleJobs,
    ],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);
}
