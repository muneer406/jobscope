import { createContext, useEffect, useState } from "react";

import { fetchJobs } from "../api/jobs";
import {
  getPaginatedJobs,
  getSelectedJob,
  getTotalPages,
  getVisibleJobs,
  JOBS_PER_PAGE,
  VIEW_MODES,
} from "../utils/jobSelectors";

const INITIAL_FILTERS = {
  searchQuery: "",
  company: [],
  location: [],
  tags: [],
};

export const JobsContext = createContext(null);

export function JobsProvider({ children }) {
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [viewMode, setViewMode] = useState(VIEW_MODES.ALL);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const visibleJobs = getVisibleJobs({
    jobs,
    savedJobs,
    filters,
    viewMode,
  });

  const totalPages = getTotalPages(visibleJobs.length, JOBS_PER_PAGE);
  const paginatedJobs = getPaginatedJobs(
    visibleJobs,
    currentPage,
    JOBS_PER_PAGE,
  );

  const selectedJob = getSelectedJob(visibleJobs, selectedJobId);

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
    if (selectedJobId === null) {
      return;
    }

    const hasSelectedVisibleJob = visibleJobs.some(
      (job) => job.id === selectedJobId,
    );

    if (!hasSelectedVisibleJob) {
      setSelectedJobId(null);
    }
  }, [selectedJobId, visibleJobs]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, viewMode]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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
    setFilters((currentFilters) => {
      const isSelected = currentFilters.company.includes(company);

      return {
        ...currentFilters,
        company: isSelected
          ? currentFilters.company.filter((value) => value !== company)
          : [...currentFilters.company, company],
      };
    });
  }

  function updateLocationFilter(location) {
    setFilters((currentFilters) => {
      const isSelected = currentFilters.location.includes(location);

      return {
        ...currentFilters,
        location: isSelected
          ? currentFilters.location.filter((value) => value !== location)
          : [...currentFilters.location, location],
      };
    });
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
    filters.company.length > 0 ||
    filters.location.length > 0 ||
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

  function clearSelectedJob() {
    setSelectedJobId(null);
  }

  function showAllJobs() {
    setViewMode(VIEW_MODES.ALL);
  }

  function showSavedJobs() {
    setViewMode(VIEW_MODES.SAVED);
  }

  function goToPage(pageNumber) {
    const safePage = Math.min(Math.max(1, pageNumber), totalPages);
    setCurrentPage(safePage);
  }

  function goToNextPage() {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  }

  function goToPreviousPage() {
    setCurrentPage((page) => Math.max(page - 1, 1));
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
        paginatedJobs,
        currentPage,
        totalPages,
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
        clearSelectedJob,
        showAllJobs,
        showSavedJobs,
        goToPage,
        goToNextPage,
        goToPreviousPage,
        toggleViewMode,
        refreshJobs,
      }}
    >
      {children}
    </JobsContext.Provider>
  );
}
