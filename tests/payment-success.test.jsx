/* @vitest-environment jsdom */
import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import PaymentSuccess from '../src/components/music/PaymentSuccess';
import { useMusic } from '../src/context/MusicContext';

vi.mock('../src/context/MusicContext', () => ({
  useMusic: vi.fn(),
}));

describe('PaymentSuccess', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('shows the demo purchase and offers a receipt without fake audio links', () => {
    const purchase = {
      id: 'track-1',
      title: 'Denver Nights',
      artist: 'JustMalikBeats',
      genre: 'Hip-Hop',
      price: 2.99,
      purchaseDate: '2026-08-26T12:00:00.000Z',
    };
    useMusic.mockReturnValue({ purchases: [purchase] });
    const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:receipt');
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

    render(
      <MemoryRouter>
        <PaymentSuccess onContinueShopping={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Demo purchase complete' })).toBeInTheDocument();
    expect(screen.getByText('Audio not configured')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Download MP3' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Download Receipt' }));

    expect(createObjectURL).toHaveBeenCalledOnce();
  });
});