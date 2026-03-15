export const VIEW_MODES = {
    ALL: 'all',
    SAVED: 'saved',
};

export const JOBS_PER_PAGE = 10;

function normalizeQuery(value) {
    return String(value ?? '').trim().toLowerCase();
}

export function isSavedJob(savedJobs, jobId) {
    return savedJobs.includes(jobId);
}

export function getSelectedJob(jobs, selectedJobId) {
    return jobs.find(job => job.id === selectedJobId) ?? null;
}

export function getVisibleJobs({ jobs, savedJobs, filters, viewMode }) {
    const searchQuery = normalizeQuery(filters?.searchQuery);
    const companies = (filters?.company ?? []).map(normalizeQuery).filter(Boolean);
    const locations = (filters?.location ?? []).map(normalizeQuery).filter(Boolean);
    const tags = filters?.tags ?? [];

    return jobs.filter(job => {
        const matchesView = viewMode === VIEW_MODES.SAVED
            ? isSavedJob(savedJobs, job.id)
            : true;
        const matchesSearch = searchQuery
            ? job.title.toLowerCase().includes(searchQuery)
            : true;
        const matchesCompany = companies.length > 0
            ? companies.includes(job.company.toLowerCase())
            : true;
        const matchesLocation = locations.length > 0
            ? locations.includes(job.location.toLowerCase())
            : true;
        const matchesTags = tags.length > 0
            ? tags.some(tag => job.tags.includes(tag))
            : true;

        return matchesView && matchesSearch && matchesCompany && matchesLocation && matchesTags;
    });
}

export function getTotalPages(totalJobs, jobsPerPage = JOBS_PER_PAGE) {
    if (totalJobs <= 0) {
        return 1;
    }

    return Math.ceil(totalJobs / jobsPerPage);
}

export function getPaginatedJobs(jobs, currentPage, jobsPerPage = JOBS_PER_PAGE) {
    const safePage = Math.max(1, currentPage);
    const startIndex = (safePage - 1) * jobsPerPage;

    return jobs.slice(startIndex, startIndex + jobsPerPage);
}

export function getUniqueCompanies(jobs) {
    return Array.from(new Set(jobs.map(job => job.company))).sort();
}

export function getUniqueLocations(jobs) {
    return Array.from(new Set(jobs.map(job => job.location))).sort();
}

export function getUniqueTags(jobs) {
    return Array.from(new Set(jobs.flatMap(job => job.tags))).sort();
}