export const VIEW_MODES = {
    ALL: 'all',
    SAVED: 'saved',
};

export const SORT_OPTIONS = {
    DEFAULT: 'default',
    TITLE_ASC: 'title-asc',
    COMPANY_ASC: 'company-asc',
    LOCATION_ASC: 'location-asc',
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

function compareValues(firstValue, secondValue) {
    return firstValue.localeCompare(secondValue, undefined, { sensitivity: 'base' });
}

export function getSortedJobs(jobs, sortOption = SORT_OPTIONS.DEFAULT) {
    const sortableJobs = [...jobs];

    switch (sortOption) {
        case SORT_OPTIONS.TITLE_ASC:
            return sortableJobs.sort((firstJob, secondJob) => compareValues(firstJob.title, secondJob.title));
        case SORT_OPTIONS.COMPANY_ASC:
            return sortableJobs.sort((firstJob, secondJob) => {
                const companyComparison = compareValues(firstJob.company, secondJob.company);

                return companyComparison !== 0
                    ? companyComparison
                    : compareValues(firstJob.title, secondJob.title);
            });
        case SORT_OPTIONS.LOCATION_ASC:
            return sortableJobs.sort((firstJob, secondJob) => {
                const locationComparison = compareValues(firstJob.location, secondJob.location);

                return locationComparison !== 0
                    ? locationComparison
                    : compareValues(firstJob.title, secondJob.title);
            });
        case SORT_OPTIONS.DEFAULT:
        default:
            return sortableJobs;
    }
}

function buildFrequencyTable(values) {
    return values.reduce((table, value) => {
        table[value] = (table[value] ?? 0) + 1;
        return table;
    }, {});
}

function rankFrequencyTable(table, limit = 3) {
    return Object.entries(table)
        .map(([label, count]) => ({ label, count }))
        .sort((firstEntry, secondEntry) => {
            if (secondEntry.count !== firstEntry.count) {
                return secondEntry.count - firstEntry.count;
            }

            return compareValues(firstEntry.label, secondEntry.label);
        })
        .slice(0, limit);
}

export function getRecommendedJobs(jobs, savedJobs, limit = 3) {
    const savedJobSet = new Set(savedJobs);
    const savedJobList = jobs.filter(job => savedJobSet.has(job.id));

    if (savedJobList.length === 0) {
        return [];
    }

    const tagFrequency = buildFrequencyTable(savedJobList.flatMap(job => job.tags));
    const savedCompanies = new Set(savedJobList.map(job => job.company));
    const savedLocations = new Set(savedJobList.map(job => job.location));

    return jobs
        .filter(job => !savedJobSet.has(job.id))
        .map(job => {
            const tagScore = job.tags.reduce((score, tag) => score + (tagFrequency[tag] ?? 0), 0);
            const companyScore = savedCompanies.has(job.company) ? 2 : 0;
            const locationScore = savedLocations.has(job.location) ? 1 : 0;

            return {
                job,
                score: tagScore + companyScore + locationScore,
            };
        })
        .filter(entry => entry.score > 0)
        .sort((firstEntry, secondEntry) => {
            if (secondEntry.score !== firstEntry.score) {
                return secondEntry.score - firstEntry.score;
            }

            return compareValues(firstEntry.job.title, secondEntry.job.title);
        })
        .slice(0, limit)
        .map(entry => entry.job);
}

export function getSavedJobInsights(jobs, savedJobs) {
    const savedJobSet = new Set(savedJobs);
    const savedJobList = jobs.filter(job => savedJobSet.has(job.id));

    return {
        savedCount: savedJobList.length,
        companyCount: new Set(savedJobList.map(job => job.company)).size,
        locationCount: new Set(savedJobList.map(job => job.location)).size,
        topTags: rankFrequencyTable(buildFrequencyTable(savedJobList.flatMap(job => job.tags))),
        topCompanies: rankFrequencyTable(buildFrequencyTable(savedJobList.map(job => job.company))),
        topLocations: rankFrequencyTable(buildFrequencyTable(savedJobList.map(job => job.location))),
    };
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