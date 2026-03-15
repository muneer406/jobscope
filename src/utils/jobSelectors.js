export const VIEW_MODES = {
    ALL: 'all',
    SAVED: 'saved',
};

function normalizeQuery(searchQuery) {
    return String(searchQuery ?? '').trim().toLowerCase();
}

export function isSavedJob(savedJobs, jobId) {
    return savedJobs.includes(jobId);
}

export function getSelectedJob(jobs, selectedJobId) {
    return jobs.find(job => job.id === selectedJobId) ?? null;
}

export function getVisibleJobs({ jobs, savedJobs, filters, viewMode }) {
    const searchQuery = normalizeQuery(filters?.searchQuery);

    return jobs.filter(job => {
        const matchesView = viewMode === VIEW_MODES.SAVED
            ? isSavedJob(savedJobs, job.id)
            : true;
        const matchesSearch = searchQuery
            ? job.title.toLowerCase().includes(searchQuery)
            : true;

        return matchesView && matchesSearch;
    });
}