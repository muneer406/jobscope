import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { JobsProvider } from '../../context/JobsContext';
import { useJobs } from '../../hooks/useJobs';

// Stub the API so no real network calls are made during tests.
vi.mock('../../api/jobs', () => ({
    fetchJobs: vi.fn(),
}));

import { fetchJobs } from '../../api/jobs';

const mockJobs = [
    { id: 1, title: 'Frontend Engineer', description: 'Build UIs', company: 'Acme', location: 'Remote', tags: ['react'] },
    { id: 2, title: 'Backend Developer', description: 'Build APIs', company: 'Beta', location: 'Berlin', tags: ['node'] },
];

function ReadContext() {
    const ctx = useJobs();
    return (
        <div>
            <span data-testid="loading">{String(ctx.isLoading)}</span>
            <span data-testid="count">{ctx.visibleJobs.length}</span>
            <span data-testid="saved">{ctx.savedJobs.length}</span>
            <span data-testid="viewMode">{ctx.viewMode}</span>
            <span data-testid="error">{ctx.error}</span>
            <button onClick={() => ctx.toggleSavedJob(1)}>save 1</button>
            <button onClick={() => ctx.updateSearchQuery('Backend')}>search backend</button>
            <button onClick={() => ctx.showSavedJobs()}>saved view</button>
            <button onClick={() => ctx.showAllJobs()}>all view</button>
            <button onClick={() => ctx.clearSearchQuery()}>clear</button>
        </div>
    );
}

function renderWithProvider() {
    return render(
        <JobsProvider>
            <ReadContext />
        </JobsProvider>,
    );
}

describe('useJobs', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('throws when used outside a JobsProvider', () => {
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => render(<ReadContext />)).toThrow('useJobs must be used within a JobsProvider');
        consoleError.mockRestore();
    });

    it('starts in loading state', () => {
        fetchJobs.mockResolvedValue(mockJobs);
        renderWithProvider();
        expect(screen.getByTestId('loading').textContent).toBe('true');
    });

    it('loads jobs from the API and updates state', async () => {
        fetchJobs.mockResolvedValue(mockJobs);
        renderWithProvider();
        await waitFor(() => {
            expect(screen.getByTestId('loading').textContent).toBe('false');
        });
        expect(screen.getByTestId('count').textContent).toBe('2');
    });

    it('sets error message when fetchJobs rejects', async () => {
        fetchJobs.mockRejectedValue(new Error('Network failure'));
        renderWithProvider();
        await waitFor(() => {
            expect(screen.getByTestId('loading').textContent).toBe('false');
        });
        expect(screen.getByTestId('error').textContent).toBe('Network failure');
    });

    it('toggleSavedJob adds a job to savedJobs', async () => {
        fetchJobs.mockResolvedValue(mockJobs);
        renderWithProvider();
        await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));
        await userEvent.click(screen.getByRole('button', { name: 'save 1' }));
        expect(screen.getByTestId('saved').textContent).toBe('1');
    });

    it('toggleSavedJob removes a job already in savedJobs', async () => {
        fetchJobs.mockResolvedValue(mockJobs);
        renderWithProvider();
        await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));
        await userEvent.click(screen.getByRole('button', { name: 'save 1' }));
        await userEvent.click(screen.getByRole('button', { name: 'save 1' }));
        expect(screen.getByTestId('saved').textContent).toBe('0');
    });

    it('updateSearchQuery filters visible jobs', async () => {
        fetchJobs.mockResolvedValue(mockJobs);
        renderWithProvider();
        await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));
        await userEvent.click(screen.getByRole('button', { name: 'search backend' }));
        expect(screen.getByTestId('count').textContent).toBe('1');
    });

    it('clearSearchQuery removes the search filter', async () => {
        fetchJobs.mockResolvedValue(mockJobs);
        renderWithProvider();
        await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));
        await userEvent.click(screen.getByRole('button', { name: 'search backend' }));
        await userEvent.click(screen.getByRole('button', { name: 'clear' }));
        expect(screen.getByTestId('count').textContent).toBe('2');
    });

    it('showSavedJobs switches viewMode to SAVED', async () => {
        fetchJobs.mockResolvedValue(mockJobs);
        renderWithProvider();
        await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));
        await userEvent.click(screen.getByRole('button', { name: 'saved view' }));
        expect(screen.getByTestId('viewMode').textContent).toBe('saved');
    });

    it('showAllJobs switches viewMode back to ALL', async () => {
        fetchJobs.mockResolvedValue(mockJobs);
        renderWithProvider();
        await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));
        await userEvent.click(screen.getByRole('button', { name: 'saved view' }));
        await userEvent.click(screen.getByRole('button', { name: 'all view' }));
        expect(screen.getByTestId('viewMode').textContent).toBe('all');
    });
});
