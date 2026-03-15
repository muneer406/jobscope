import { mapPostsToJobs } from './jobMapper';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

async function fetchJson(path) {
    const response = await fetch(`${API_BASE_URL}${path}`);

    if (!response.ok) {
        throw new Error(`Request failed for ${path} with status ${response.status}`);
    }

    return response.json();
}

/**
 * Fetches jobs from the demo API and maps them to the app's internal job shape.
 * @returns {Promise<Array>} Array of mapped job objects
 */
export async function fetchJobs() {
    try {
        const [posts, users] = await Promise.all([
            fetchJson('/posts'),
            fetchJson('/users'),
        ]);

        return mapPostsToJobs(posts, users);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        throw new Error('Unable to load job listings.');
    }
}