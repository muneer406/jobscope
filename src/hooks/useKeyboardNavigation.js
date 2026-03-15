import { useCallback, useEffect, useRef } from "react";

import { JOBS_PER_PAGE } from "../utils/jobSelectors";

const NAVIGATION_COOLDOWN_MS = 140;

function isElementInViewport(element) {
  const rect = element.getBoundingClientRect();

  return rect.top >= 0 && rect.bottom <= window.innerHeight;
}

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
  const navigationLockedRef = useRef(false);
  const navigationTimerRef = useRef(null);

  const beginNavigationCooldown = useCallback(() => {
    navigationLockedRef.current = true;

    if (navigationTimerRef.current) {
      window.clearTimeout(navigationTimerRef.current);
    }

    navigationTimerRef.current = window.setTimeout(() => {
      navigationLockedRef.current = false;
      navigationTimerRef.current = null;
    }, NAVIGATION_COOLDOWN_MS);
  }, []);

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

        if (navigationLockedRef.current) {
          return;
        }

        const currentIdx = visibleJobs.findIndex(
          (job) => job.id === selectedJob?.id,
        );

        if (currentIdx === -1) {
          if (visibleJobs.length > 0) {
            selectJob(visibleJobs[0].id);
            goToPage(1);
            beginNavigationCooldown();
          }
        } else if (currentIdx < visibleJobs.length - 1) {
          const newIdx = currentIdx + 1;
          selectJob(visibleJobs[newIdx].id);
          const newPage = Math.floor(newIdx / JOBS_PER_PAGE) + 1;
          if (newPage !== currentPage) {
            goToPage(newPage);
          }
          beginNavigationCooldown();
        }
        return;
      }

      if (event.key === "k") {
        event.preventDefault();

        if (navigationLockedRef.current) {
          return;
        }

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
          beginNavigationCooldown();
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
      beginNavigationCooldown,
    ],
  );

  useEffect(() => {
    if (!selectedJob || activePanel !== "results") {
      return;
    }

    const selectedElement = document.querySelector(
      `[data-job-id="${selectedJob.id}"]`,
    );

    if (!selectedElement || isElementInViewport(selectedElement)) {
      return;
    }

    selectedElement.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  }, [activePanel, currentPage, selectedJob]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    return () => {
      if (navigationTimerRef.current) {
        window.clearTimeout(navigationTimerRef.current);
      }
    };
  }, []);
}
