import { describe, expect, it } from 'vitest';

import { getSelectedJob, getVisibleJobs, isSavedJob, VIEW_MODES } from '../../utils/jobSelectors';

const jobs = [
    { id: 1, title: 'Frontend Engineer', company: 'Acme' },
    { id: 2, title: 'Backend Developer', company: 'Beta' },
    { id: 3, title: 'Product Manager', company: 'Gamma' },
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
});
