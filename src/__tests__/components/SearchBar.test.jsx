import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { SearchBar } from '../../components/SearchBar';

describe('SearchBar', () => {
    it('renders an input with the current searchQuery as value', () => {
        render(<SearchBar searchQuery="react" onSearchChange={vi.fn()} />);
        expect(screen.getByRole('searchbox')).toHaveValue('react');
    });

    it('renders the label text', () => {
        render(<SearchBar searchQuery="" onSearchChange={vi.fn()} />);
        expect(screen.getByText(/search by title/i)).toBeInTheDocument();
    });

    it('renders the placeholder text', () => {
        render(<SearchBar searchQuery="" onSearchChange={vi.fn()} />);
        expect(screen.getByPlaceholderText(/frontend|manager|engineer/i)).toBeInTheDocument();
    });

    it('calls onSearchChange with the new value when the user types', async () => {
        const onSearchChange = vi.fn();
        render(<SearchBar searchQuery="" onSearchChange={onSearchChange} />);
        await userEvent.type(screen.getByRole('searchbox'), 'A');
        expect(onSearchChange).toHaveBeenCalledWith('A');
    });

    it('calls onSearchChange each keystroke', async () => {
        const onSearchChange = vi.fn();
        render(<SearchBar searchQuery="" onSearchChange={onSearchChange} />);
        await userEvent.type(screen.getByRole('searchbox'), 'abc');
        expect(onSearchChange).toHaveBeenCalledTimes(3);
    });
});
