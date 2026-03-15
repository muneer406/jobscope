import { describe, expect, it } from 'vitest';

import { mapPostToJob, mapPostsToJobs, mapUsersById } from '../../api/jobMapper';

const mockUser = {
    id: 1,
    name: 'Leanne Graham',
    company: { name: 'Romaguera-Crona' },
    address: { city: 'Gwenborough' },
};

const mockPost = {
    id: 1,
    userId: 1,
    title: 'sunt aut facere repellat provident',
    body: 'quia et suscipit\nsuscipit recusandae consequuntur',
};

describe('mapUsersById', () => {
    it('creates a lookup map keyed by user id', () => {
        const users = [
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' },
        ];
        const result = mapUsersById(users);
        expect(result[1].name).toBe('Alice');
        expect(result[2].name).toBe('Bob');
    });

    it('returns an empty object for an empty array', () => {
        expect(mapUsersById([])).toEqual({});
    });
});

describe('mapPostToJob', () => {
    it('maps id and capitalised title', () => {
        const job = mapPostToJob(mockPost, mockUser);
        expect(job.id).toBe(1);
        expect(job.title.charAt(0)).toBe(job.title.charAt(0).toUpperCase());
    });

    it('normalises whitespace in description', () => {
        const post = { ...mockPost, body: 'hello\n\nworld  extra' };
        const job = mapPostToJob(post, mockUser);
        expect(job.description).toBe('hello world extra');
    });

    it('prefers user.company.name for company', () => {
        const job = mapPostToJob(mockPost, mockUser);
        expect(job.company).toBe('Romaguera-Crona');
    });

    it('falls back to user.name when company.name is absent', () => {
        const user = { ...mockUser, company: undefined };
        const job = mapPostToJob(mockPost, user);
        expect(job.company).toBe('Leanne Graham');
    });

    it('falls back to "Unknown Company" when no user info', () => {
        const job = mapPostToJob(mockPost, {});
        expect(job.company).toBe('Unknown Company');
    });

    it('maps city to location', () => {
        const job = mapPostToJob(mockPost, mockUser);
        expect(job.location).toBe('Gwenborough');
    });

    it('falls back to "Remote" when city is absent', () => {
        const user = { ...mockUser, address: undefined };
        const job = mapPostToJob(mockPost, user);
        expect(job.location).toBe('Remote');
    });

    it('derives up to 3 unique tags from the title', () => {
        const job = mapPostToJob(mockPost, mockUser);
        expect(job.tags.length).toBeLessThanOrEqual(3);
        expect(Array.isArray(job.tags)).toBe(true);
    });

    it('tags contain only words longer than 3 characters', () => {
        const job = mapPostToJob(mockPost, mockUser);
        job.tags.forEach((tag) => {
            expect(tag.length).toBeGreaterThan(3);
        });
    });

    it('tags are unique', () => {
        const post = { ...mockPost, title: 'same same same word word' };
        const job = mapPostToJob(post, mockUser);
        const unique = Array.from(new Set(job.tags));
        expect(job.tags).toEqual(unique);
    });

    it('returns all required fields', () => {
        const job = mapPostToJob(mockPost, mockUser);
        expect(job).toHaveProperty('id');
        expect(job).toHaveProperty('title');
        expect(job).toHaveProperty('description');
        expect(job).toHaveProperty('company');
        expect(job).toHaveProperty('location');
        expect(job).toHaveProperty('tags');
    });
});

describe('mapPostsToJobs', () => {
    it('maps every post to a job using the matching user', () => {
        const posts = [mockPost, { ...mockPost, id: 2, userId: 2, title: 'other title' }];
        const users = [mockUser, { ...mockUser, id: 2, name: 'Bob', company: { name: 'AcmeCorp' } }];
        const jobs = mapPostsToJobs(posts, users);
        expect(jobs).toHaveLength(2);
        expect(jobs[0].company).toBe('Romaguera-Crona');
        expect(jobs[1].company).toBe('AcmeCorp');
    });

    it('returns an empty array when given no posts', () => {
        expect(mapPostsToJobs([], [mockUser])).toEqual([]);
    });
});
