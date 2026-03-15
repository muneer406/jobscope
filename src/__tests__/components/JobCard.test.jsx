import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { JobCard } from '../../components/JobCard';

const mockJob = {
    id: 1,
    title: 'Frontend Engineer',
    description: 'Build user interfaces',
    company: 'Acme Corp',
    location: 'Remote',
    tags: ['frontend', 'react'],
};

function renderCard(props = {}) {
    return render(
        <JobCard
            isSaved={false}
            isSelected={false}
            job={mockJob}
            onToggleSavedJob={vi.fn()}
            {...props}
        />,
    );
}

describe('JobCard', () => {
    it('renders job title', () => {
        renderCard();
        expect(screen.getByRole('heading', { name: mockJob.title })).toBeInTheDocument();
    });

    it('renders company name', () => {
        renderCard();
        expect(screen.getByText(mockJob.company)).toBeInTheDocument();
    });

    it('renders description', () => {
        renderCard();
        expect(screen.getByText(mockJob.description)).toBeInTheDocument();
    });

    it('renders location', () => {
        renderCard();
        expect(screen.getByText(mockJob.location)).toBeInTheDocument();
    });

    it('renders all tags', () => {
        renderCard();
        mockJob.tags.forEach((tag) => {
            expect(screen.getByText(tag)).toBeInTheDocument();
        });
    });

    it('shows "Save" when not saved', () => {
        renderCard({ isSaved: false });
        expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    });

    it('shows "Saved" when saved', () => {
        renderCard({ isSaved: true });
        expect(screen.getByRole('button', { name: 'Saved' })).toBeInTheDocument();
    });

    it('save button has "saved" class when isSaved is true', () => {
        renderCard({ isSaved: true });
        expect(screen.getByRole('button', { name: 'Saved' })).toHaveClass('saved');
    });

    it('calls onToggleSavedJob with the job id when save button is clicked', async () => {
        const onToggleSavedJob = vi.fn();
        renderCard({ onToggleSavedJob });
        await userEvent.click(screen.getByRole('button', { name: 'Save' }));
        expect(onToggleSavedJob).toHaveBeenCalledWith(mockJob.id);
    });

    it('has "selected" class on the article when isSelected is true', () => {
        renderCard({ isSelected: true });
        expect(screen.getByRole('article')).toHaveClass('selected');
    });

    it('does not have "selected" class when isSelected is false', () => {
        renderCard({ isSelected: false });
        expect(screen.getByRole('article')).not.toHaveClass('selected');
    });

    it('save button click does not bubble to parent', async () => {
        const parentClick = vi.fn();
        const onToggleSavedJob = vi.fn();
        render(
            <div onClick={parentClick}>
                <JobCard
                    isSaved={false}
                    isSelected={false}
                    job={mockJob}
                    onToggleSavedJob={onToggleSavedJob}
                />
            </div>,
        );
        await userEvent.click(screen.getByRole('button', { name: 'Save' }));
        expect(onToggleSavedJob).toHaveBeenCalledTimes(1);
        expect(parentClick).not.toHaveBeenCalled();
    });
});
