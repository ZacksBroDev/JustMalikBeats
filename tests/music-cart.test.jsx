/* @vitest-environment jsdom */
import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MusicProvider, useMusic } from '../src/context/MusicContext';
import { apiRequest } from '../src/config/api';

vi.mock('../src/config/api', () => ({
  apiRequest: vi.fn(),
}));

const track = {
  id: 'track-1',
  title: 'Denver Nights',
  price: 2.99,
};

const CartProbe = () => {
  const { cart, addToCart, removeFromCart, getTotalPrice } = useMusic();

  return (
    <div>
      <div>items: {cart.length}</div>
      <div>total: {getTotalPrice()}</div>
      <button type="button" onClick={() => addToCart(track)}>Add track</button>
      <button type="button" onClick={() => removeFromCart(track.id)}>Remove track</button>
    </div>
  );
};

describe('MusicProvider cart behavior', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('adds a track once and calculates the cart total', async () => {
    apiRequest.mockResolvedValue({ tracks: [] });

    render(
      <MusicProvider>
        <CartProbe />
      </MusicProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Add track' }));
    fireEvent.click(screen.getByRole('button', { name: 'Add track' }));

    expect(screen.getByText('items: 1')).toBeInTheDocument();
    expect(screen.getByText('total: 2.99')).toBeInTheDocument();
  });

  it('removes a track from the cart', () => {
    apiRequest.mockResolvedValue({ tracks: [] });

    render(
      <MusicProvider>
        <CartProbe />
      </MusicProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Add track' }));
    fireEvent.click(screen.getByRole('button', { name: 'Remove track' }));

    expect(screen.getByText('items: 0')).toBeInTheDocument();
    expect(screen.getByText('total: 0.00')).toBeInTheDocument();
  });
});