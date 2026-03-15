import { describe, expect, it } from 'vitest';

import {
    getPaginatedJobs,
    getSelectedJob,
    getTotalPages,
    getUniqueCompanies,
    getUniqueLocations,
    getUniqueTags,
    JOBS_PER_PAGE,
    getVisibleJobs,
    isSavedJob,
    VIEW_MODES,
} from '../../utils/jobSelectors';

const jobs = [
    { id: 1, title: 'Frontend Engineer', company: 'Acme', location: 'Remote', tags: ['react', 'javascript'] },
    { id: 2, title: 'Backend Developer', company: 'Beta', location: 'Berlin', tags: ['node', 'javascript'] },
    { id: 3, title: 'Product Manager', company: 'Gamma', location: 'Remote', tags: ['product'] },
];

describe('isSavedJob', () => {
    it('returns true when the id is in the saved list', () => {
        expect(isSavedJob([1, 2], 1)).toBe(true);
    });

    it('returns false when the id is not in the saved list', () => {
        expect(isSavedJob([1, 2], 3)).toBe(false);
    });

    it('returns false for an empty saved list', () => {
        expect(isSavedJob([], 1)).toBe(false);
    });
});

describe('getSelectedJob', () => {
    it('returns the matching job', () => {
        expect(getSelectedJob(jobs, 2)).toEqual(jobs[1]);
    });

    it('returns null when no match is found', () => {
        expect(getSelectedJob(jobs, 99)).toBeNull();
    });

    it('returns null for an empty list', () => {
        expect(getSelectedJob([], 1)).toBeNull();
    });
});

describe('getVisibleJobs', () => {
    describe('viewMode: ALL', () => {
        it('returns all jobs regardless of saved status', () => {
            const result = getVisibleJobs({ jobs, savedJobs: [1], filters: {}, viewMode: VIEW_MODES.ALL });
            expect(result).toHaveLength(3);
        });

        it('filters by searchQuery (case insensitive)', () => {
            const result = getVisibleJobs({
                jobs,
                savedJobs: [],
                filters: { searchQuery: 'frontend' },
                viewMode: VIEW_MODES.ALL,
            });
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe(1);
        });

        it('returns empty array when no jobs match the search', () => {
            const result = getVisibleJobs({
                jobs,
                savedJobs: [],
                filters: { searchQuery: 'xyzxyz' },
                viewMode: VIEW_MODES.ALL,
            });
            expect(result).toHaveLength(0);
        });

        it('returns all jobs when searchQuery is empty', () => {
            const result = getVisibleJobs({
                jobs,
                savedJobs: [],
                filters: { searchQuery: '' },
                viewMode: VIEW_MODES.ALL,
            });
            expect(result).toHaveLength(3);
        });
    });

    describe('viewMode: SAVED', () => {
        it('returns only saved jobs', () => {
            const result = getVisibleJobs({
                jobs,
                savedJobs: [1, 3],
                filters: {},
                viewMode: VIEW_MODES.SAVED,
            });
            expect(result.map((j) => j.id)).toEqual([1, 3]);
        });

        it('returns empty array when nothing is saved', () => {
            const result = getVisibleJobs({
                jobs,
                savedJobs: [],
                filters: {},
                viewMode: VIEW_MODES.SAVED,
            });
            expect(result).toHaveLength(0);
        });

        it('filters saved jobs by searchQuery', () => {
            const result = getVisibleJobs({
                jobs,
                savedJobs: [1, 3],
                filters: { searchQuery: 'Product' },
                viewMode: VIEW_MODES.SAVED,
            });
            expect(result.map((j) => j.id)).toEqual([3]);
        });
    });

    describe('VIEW_MODES constant', () => {
        it('exposes ALL and SAVED', () => {
            expect(VIEW_MODES.ALL).toBeDefined();
            expect(VIEW_MODES.SAVED).toBeDefined();
            expect(VIEW_MODES.ALL).not.toBe(VIEW_MODES.SAVED);
        });
    });

    describe('company filter', () => {
        it('returns only jobs matching the company (case insensitive)', () => {
            const result = getVisibleJobs({
                jobs,
                savedJobs: [],
                filters: { company: ['acme'] },
                viewMode: VIEW_MODES.ALL,
            });
            expect(result.map((j) => j.id)).toEqual([1]);
        });

        it('returns jobs matching any selected company', () => {
            const result = getVisibleJobs({
                jobs,
                savedJobs: [],
                filters: { company: ['acme', 'beta'] },
                viewMode: VIEW_MODES.ALL,
            });
            expect(result.map((j) => j.id)).toEqual([1, 2]);
        });

        it('returns all jobs when company filter is empty', () => {
            const result = getVisibleJobs({
                jobs,
                savedJobs: [],
                filters: { company: [] },
                viewMode: VIEW_MODES.ALL,
            });
            expect(result).toHaveLength(3);
        });
    });

    describe('location filter', () => {
        it('returns only jobs for the given location', () => {
            const result = getVisibleJobs({
                jobs,
                savedJobs: [],
                filters: { location: ['berlin'] },
                viewMode: VIEW_MODES.ALL,
            });
            expect(result.map((j) => j.id)).toEqual([2]);
        });

        it('matches multiple jobs with the same location', () => {
            const result = getVisibleJobs({
                jobs,
                savedJobs: [],
                filters: { location: ['remote'] },
                viewMode: VIEW_MODES.ALL,
            });
            expect(result.map((j) => j.id)).toEqual([1, 3]);
        });

        it('returns jobs matching any selected location', () => {
            const result = getVisibleJobs({
                jobs,
                savedJobs: [],
                filters: { location: ['remote', 'berlin'] },
                viewMode: VIEW_MODES.ALL,
            });
            expect(result.map((j) => j.id)).toEqual([1, 2, 3]);
        });
    });

    describe('tag filter (OR logic)', () => {
        it('returns jobs that contain any of the selected tags', () => {
            const result = getVisibleJobs({
                jobs,
                savedJobs: [],
                filters: { tags: ['react'] },
                viewMode: VIEW_MODES.ALL,
            });
            expect(result.map((j) => j.id)).toEqual([1]);
        });

        it('returns jobs matching at least one of multiple selected tags', () => {
            const result = getVisibleJobs({
                jobs,
                savedJobs: [],
                filters: { tags: ['react', 'node'] },
                viewMode: VIEW_MODES.ALL,
            });
            expect(result.map((j) => j.id)).toEqual([1, 2]);
        });

        it('returns all jobs when tags filter is empty', () => {
            const result = getVisibleJobs({
                jobs,
                savedJobs: [],
                filters: { tags: [] },
                viewMode: VIEW_MODES.ALL,
            });
            expect(result).toHaveLength(3);
        });
    });

    describe('combined filters', () => {
        it('applies company + location together', () => {
            const result = getVisibleJobs({
                jobs,
                savedJobs: [],
                filters: { company: ['acme'], location: ['remote'] },
                viewMode: VIEW_MODES.ALL,
            });
            expect(result.map((j) => j.id)).toEqual([1]);
        });

        it('returns nothing when filters conflict', () => {
            const result = getVisibleJobs({
                jobs,
                savedJobs: [],
                filters: { company: ['acme'], location: ['berlin'] },
                viewMode: VIEW_MODES.ALL,
            });
            expect(result).toHaveLength(0);
        });
    });
});

describe('getUniqueCompanies', () => {
    it('returns a sorted list of unique company names', () => {
        expect(getUniqueCompanies(jobs)).toEqual(['Acme', 'Beta', 'Gamma']);
    });

    it('returns an empty array for empty input', () => {
        expect(getUniqueCompanies([])).toEqual([]);
    });

    it('deduplicates companies', () => {
        const dupeJobs = [...jobs, { ...jobs[0], id: 99 }];
        const result = getUniqueCompanies(dupeJobs);
        expect(result.filter((c) => c === 'Acme')).toHaveLength(1);
    });
});

describe('getUniqueLocations', () => {
    it('returns a sorted list of unique locations', () => {
        expect(getUniqueLocations(jobs)).toEqual(['Berlin', 'Remote']);
    });

    it('deduplicates locations', () => {
        const result = getUniqueLocations(jobs);
        expect(result.filter((l) => l === 'Remote')).toHaveLength(1);
    });

    it('returns an empty array for empty input', () => {
        expect(getUniqueLocations([])).toEqual([]);
    });
});

describe('getUniqueTags', () => {
    it('returns a sorted, flat, unique list of all tags', () => {
        expect(getUniqueTags(jobs)).toEqual(['javascript', 'node', 'product', 'react']);
    });

    it('deduplicates tags across jobs', () => {
        const result = getUniqueTags(jobs);
        expect(result.filter((t) => t === 'javascript')).toHaveLength(1);
    });

    it('returns an empty array for empty input', () => {
        expect(getUniqueTags([])).toEqual([]);
    });
});

describe('pagination helpers', () => {
    it('exposes a jobs per page constant', () => {
        expect(JOBS_PER_PAGE).toBe(10);
    });

    it('computes total pages for a filtered result set', () => {
        expect(getTotalPages(13, 6)).toBe(3);
    });

    it('returns 1 page when there are no jobs', () => {
        expect(getTotalPages(0, 6)).toBe(1);
    });

    it('returns only the jobs for the requested page', () => {
        const result = getPaginatedJobs([
            ...jobs,
            { ...jobs[0], id: 4 },
            { ...jobs[0], id: 5 },
            { ...jobs[0], id: 6 },
            { ...jobs[0], id: 7 },
        ], 2, 3);
        expect(result.map((job) => job.id)).toEqual([4, 5, 6]);
    });
});
