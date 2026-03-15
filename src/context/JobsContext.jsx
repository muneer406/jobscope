import { createContext, useEffect, useState } from "react";

import { fetchJobs } from "../api/jobs";
import {
  getPaginatedJobs,
  getRecommendedJobs,
  getSavedJobInsights,
  getSelectedJob,
  getSortedJobs,
  getTotalPages,
  getVisibleJobs,
  JOBS_PER_PAGE,
  SORT_OPTIONS,
  VIEW_MODES,
} from "../utils/jobSelectors";

const INITIAL_FILTERS = {
  searchQuery: "",
  company: [],
  location: [],
  tags: [],
};

const STORAGE_KEYS = {
  filters: "jobscope.filters",
  savedJobs: "jobscope.savedJobs",
  sortOption: "jobscope.sortOption",
  viewMode: "jobscope.viewMode",
};

function readStoredValue(storageKey, fallbackValue, validator) {
  if (typeof window === "undefined") {
    return fallbackValue;
  }

  try {
    const storedValue = window.localStorage.getItem(storageKey);

    if (storedValue === null) {
      return fallbackValue;
    }

    const parsedValue = JSON.parse(storedValue);
    return validator(parsedValue) ? parsedValue : fallbackValue;
  } catch {
    return fallbackValue;
  }
}

function isValidFilterState(value) {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof value.searchQuery === "string" &&
    Array.isArray(value.company) &&
    Array.isArray(value.location) &&
    Array.isArray(value.tags)
  );
}

function isValidSavedJobs(value) {
  return (
    Array.isArray(value) && value.every((jobId) => Number.isInteger(jobId))
  );
}

export const JobsContext = createContext(null);

export function JobsProvider({ children }) {
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState(() =>
    readStoredValue(STORAGE_KEYS.savedJobs, [], isValidSavedJobs),
  );
  const [filters, setFilters] = useState(() =>
    readStoredValue(STORAGE_KEYS.filters, INITIAL_FILTERS, isValidFilterState),
  );
  const [viewMode, setViewMode] = useState(() =>
    readStoredValue(STORAGE_KEYS.viewMode, VIEW_MODES.ALL, (value) =>
      Object.values(VIEW_MODES).includes(value),
    ),
  );
  const [sortOption, setSortOption] = useState(() =>
    readStoredValue(STORAGE_KEYS.sortOption, SORT_OPTIONS.DEFAULT, (value) =>
      Object.values(SORT_OPTIONS).includes(value),
    ),
  );
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

  const sortedVisibleJobs = getSortedJobs(visibleJobs, sortOption);
  const recommendedJobs = getRecommendedJobs(jobs, savedJobs);
  const savedInsights = getSavedJobInsights(jobs, savedJobs);

  const totalPages = getTotalPages(sortedVisibleJobs.length, JOBS_PER_PAGE);
  const paginatedJobs = getPaginatedJobs(
    sortedVisibleJobs,
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
  }, [filters, sortOption, viewMode]);

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

  function updateSortOption(nextSortOption) {
    if (!Object.values(SORT_OPTIONS).includes(nextSortOption)) {
      return;
    }

    setSortOption(nextSortOption);
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

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEYS.savedJobs,
      JSON.stringify(savedJobs),
    );
  }, [savedJobs]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEYS.filters, JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEYS.viewMode,
      JSON.stringify(viewMode),
    );
  }, [viewMode]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEYS.sortOption,
      JSON.stringify(sortOption),
    );
  }, [sortOption]);

  return (
    <JobsContext.Provider
      value={{
        jobs,
        savedJobs,
        filters,
        sortOption,
        viewMode,
        selectedJob,
        recommendedJobs,
        savedInsights,
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
        updateSortOption,
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
