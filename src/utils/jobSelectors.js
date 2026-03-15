export const VIEW_MODES = {
    ALL: 'all',
    SAVED: 'saved',
};

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
    const company = normalizeQuery(filters?.company);
    const location = normalizeQuery(filters?.location);
    const tags = filters?.tags ?? [];

    return jobs.filter(job => {
        const matchesView = viewMode === VIEW_MODES.SAVED
            ? isSavedJob(savedJobs, job.id)
            : true;
        const matchesSearch = searchQuery
            ? job.title.toLowerCase().includes(searchQuery)
            : true;
        const matchesCompany = company
            ? job.company.toLowerCase() === company
            : true;
        const matchesLocation = location
            ? job.location.toLowerCase() === location
            : true;
        const matchesTags = tags.length > 0
            ? tags.some(tag => job.tags.includes(tag))
            : true;

        return matchesView && matchesSearch && matchesCompany && matchesLocation && matchesTags;
    });
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