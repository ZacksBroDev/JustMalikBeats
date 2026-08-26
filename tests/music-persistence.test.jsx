/* @vitest-environment jsdom */
import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MusicProvider, useMusic } from '../src/context/MusicContext';
import { apiRequest } from '../src/config/api';

vi.mock('../src/config/api', () => ({
  apiRequest: vi.fn(),
}));

const purchase = {
  id: 'track-1',
  title: 'Denver Nights',
  price: 2.99,
};

const PurchaseProbe = () => {
  const { purchases, addPurchase } = useMusic();

  return (
    <div>
      <div>purchases: {purchases.length}</div>
      <button type="button" onClick={() => addPurchase([purchase])}>
        Complete purchase
      </button>
    </div>
  );
};

describe('MusicProvider purchase persistence', () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('restores demo purchases when a new provider mounts', async () => {
    apiRequest.mockResolvedValue({ tracks: [] });

    const firstRender = render(
      <MusicProvider>
        <PurchaseProbe />
      </MusicProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Complete purchase' }));
    await waitFor(() => expect(screen.getByText('purchases: 1')).toBeInTheDocument());
    firstRender.unmount();

    render(
      <MusicProvider>
        <PurchaseProbe />
      </MusicProvider>
    );

    expect(screen.getByText('purchases: 1')).toBeInTheDocument();
  });
});