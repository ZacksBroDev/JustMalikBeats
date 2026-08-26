/* @vitest-environment jsdom */
import React, { useEffect, useRef } from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import CheckoutPage from '../src/pages/checkout/CheckoutPage';
import { MusicProvider, useMusic } from '../src/context/MusicContext';
import { apiRequest } from '../src/config/api';

vi.mock('../src/config/api', () => ({
  apiRequest: vi.fn(),
}));

const track = {
  id: 'track-1',
  title: 'Denver Nights',
  artist: 'JustMalikBeats',
  genre: 'Hip-Hop',
  price: 2.99,
};

const SeedCart = () => {
  const { cart, addToCart } = useMusic();
  const hasSeeded = useRef(false);

  useEffect(() => {
    if (hasSeeded.current) {
      return;
    }
    hasSeeded.current = true;
    addToCart(track);
  }, [addToCart]);

  return null;
};

const CartProbe = () => {
  const { cart } = useMusic();
  return <output data-testid="cart-count">{cart.length}</output>;
};

describe('checkout state transition', () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('persists the purchase, clears the cart, and navigates to success', async () => {
    apiRequest.mockResolvedValue({ tracks: [] });

    const LocationProbe = () => <output data-testid="location">{useLocation().pathname}</output>;
    const Wrapper = ({ children }) => (
      <MemoryRouter>
        <MusicProvider>
          <SeedCart />
          {children}
          <CartProbe />
        </MusicProvider>
        <LocationProbe />
      </MemoryRouter>
    );

    render(<CheckoutPage />, { wrapper: Wrapper });

    expect(screen.getByRole('heading', { name: 'Review your order' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Complete Demo Purchase' }));

    expect(screen.getByTestId('location')).toHaveTextContent('/payment-success');
    await waitFor(() => expect(screen.getByTestId('cart-count')).toHaveTextContent('0'));

    const savedPurchases = JSON.parse(localStorage.getItem('justmalik_demo_purchases'));
    expect(savedPurchases).toHaveLength(1);
    expect(savedPurchases[0]).toMatchObject({
      title: 'Denver Nights',
      isDemoPurchase: true,
    });
  });
});