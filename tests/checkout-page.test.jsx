/* @vitest-environment jsdom */
import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import CheckoutPage from '../src/pages/checkout/CheckoutPage';
import { useMusic } from '../src/context/MusicContext';

vi.mock('../src/context/MusicContext', () => ({
  useMusic: vi.fn(),
}));

const track = {
  id: 'track-1',
  title: 'Denver Nights',
  artist: 'JustMalikBeats',
  genre: 'Hip-Hop',
  price: 2.99,
};

const renderCheckout = (overrides = {}) => {
  const context = {
    cart: [track],
    removeFromCart: vi.fn(),
    getTotalPrice: vi.fn(() => '2.99'),
    addPurchase: vi.fn(),
    ...overrides,
  };
  useMusic.mockReturnValue(context);

  const LocationProbe = () => <output data-testid="location">{useLocation().pathname}</output>;
  const Wrapper = ({ children }) => (
    <MemoryRouter>
      {children}
      <LocationProbe />
    </MemoryRouter>
  );

  return { ...render(<CheckoutPage />, { wrapper: Wrapper }), context };
};

describe('CheckoutPage', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('shows the order summary and total', () => {
    renderCheckout();

    expect(screen.getByRole('heading', { name: 'Review your order' })).toBeInTheDocument();
    expect(screen.getByText('Denver Nights')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getAllByText('$2.99')).toHaveLength(3);
  });

  it('removes an item from the cart', () => {
    const { context } = renderCheckout();

    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));

    expect(context.removeFromCart).toHaveBeenCalledWith('track-1');
  });

  it('offers a catalog link when the cart is empty', () => {
    renderCheckout({ cart: [] });

    expect(screen.getByRole('heading', { name: 'Your cart is empty' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Browse Catalog' })).toHaveAttribute('href', '/catalog');
  });

  it('completes a simulated purchase and navigates to success', () => {
    const { context } = renderCheckout();

    fireEvent.click(screen.getByRole('button', { name: 'Complete Demo Purchase' }));

    expect(context.addPurchase).toHaveBeenCalledWith([track]);
    expect(screen.getByTestId('location')).toHaveTextContent('/payment-success');
  });
});