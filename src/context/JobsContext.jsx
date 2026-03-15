import { createContext, useEffect, useState } from "react";

import { fetchJobs } from "../api/jobs";
import {
  getSelectedJob,
  getVisibleJobs,
  VIEW_MODES,
} from "../utils/jobSelectors";

const INITIAL_FILTERS = {
  searchQuery: "",
  company: "",
  location: "",
  tags: [],
};

export const JobsContext = createContext(null);

export function JobsProvider({ children }) {
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [viewMode, setViewMode] = useState(VIEW_MODES.ALL);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const visibleJobs = getVisibleJobs({
    jobs,
    savedJobs,
    filters,
    viewMode,
  });

  const selectedJob =
    visibleJobs.length > 0
      ? (getSelectedJob(visibleJobs, selectedJobId) ?? visibleJobs[0])
      : null;

  useEffect(() => {
    let isActive = true;

    async function loadJobs() {
      setIsLoading(true);
      setError("");

      try {
        const nextJobs = await fetchJobs();

        if (!isActive) {
          return;
        }

        setJobs(nextJobs);
        setSelectedJobId(
          (currentSelectedJobId) =>
            currentSelectedJobId ?? nextJobs[0]?.id ?? null,
        );
      } catch (loadError) {
        if (!isActive) {
          return;
        }

        setError(loadError.message || "Unable to load job listings.");
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadJobs();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (visibleJobs.length === 0) {
      return;
    }

    const hasSelectedVisibleJob = visibleJobs.some(
      (job) => job.id === selectedJobId,
    );

    if (!hasSelectedVisibleJob) {
      setSelectedJobId(visibleJobs[0].id);
    }
  }, [selectedJobId, visibleJobs]);

  function updateSearchQuery(searchQuery) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      searchQuery,
    }));
  }

  function clearSearchQuery() {
    setFilters((currentFilters) => ({
      ...currentFilters,
      searchQuery: "",
    }));
  }

  function updateCompanyFilter(company) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      company: currentFilters.company === company ? "" : company,
    }));
  }

  function updateLocationFilter(location) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      location: currentFilters.location === location ? "" : location,
    }));
  }

  function toggleTagFilter(tag) {
    setFilters((currentFilters) => {
      const hasTags = currentFilters.tags.includes(tag);
      return {
        ...currentFilters,
        tags: hasTags
          ? currentFilters.tags.filter((t) => t !== tag)
          : [...currentFilters.tags, tag],
      };
    });
  }

  function clearAllFilters() {
    setFilters(INITIAL_FILTERS);
  }

  const hasActiveFilters =
    filters.searchQuery !== "" ||
    filters.company !== "" ||
    filters.location !== "" ||
    filters.tags.length > 0;

  function toggleSavedJob(jobId) {
    setSavedJobs((currentSavedJobs) => {
      if (currentSavedJobs.includes(jobId)) {
        return currentSavedJobs.filter((savedJobId) => savedJobId !== jobId);
      }

      return [...currentSavedJobs, jobId];
    });
  }

  function selectJob(jobId) {
    setSelectedJobId(jobId);
  }

  function showAllJobs() {
    setViewMode(VIEW_MODES.ALL);
  }

  function showSavedJobs() {
    setViewMode(VIEW_MODES.SAVED);
  }

  function toggleViewMode() {
    setViewMode((currentViewMode) =>
      currentViewMode === VIEW_MODES.ALL ? VIEW_MODES.SAVED : VIEW_MODES.ALL,
    );
  }

  async function refreshJobs() {
    setIsLoading(true);
    setError("");

    try {
      const nextJobs = await fetchJobs();
      setJobs(nextJobs);
      setSelectedJobId(
        (currentSelectedJobId) =>
          currentSelectedJobId ?? nextJobs[0]?.id ?? null,
      );
    } catch (loadError) {
      setError(loadError.message || "Unable to load job listings.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <JobsContext.Provider
      value={{
        jobs,
        savedJobs,
        filters,
        viewMode,
        selectedJob,
        visibleJobs,
        isLoading,
        error,
        updateSearchQuery,
        clearSearchQuery,
        updateCompanyFilter,
        updateLocationFilter,
        toggleTagFilter,
        clearAllFilters,
        hasActiveFilters,
        toggleSavedJob,
        selectJob,
        showAllJobs,
        showSavedJobs,
        toggleViewMode,
        refreshJobs,
      }}
    >
      {children}
    </JobsContext.Provider>
  );
}
