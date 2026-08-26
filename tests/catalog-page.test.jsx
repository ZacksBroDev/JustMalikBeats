/* @vitest-environment jsdom */
import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import CatalogRedesign from '../src/pages/catalog/CatalogRedesign';
import { useMusic } from '../src/context/MusicContext';
import { useUser } from '../src/context/UserContext';

vi.mock('../src/context/MusicContext', () => ({
  useMusic: vi.fn(),
}));

vi.mock('../src/context/UserContext', () => ({
  useUser: vi.fn(),
}));

vi.mock('../src/components/molecules/TrackCard', () => ({
  default: ({ track, onAddToCart }) => (
    <div>
      <span>{track.title}</span>
      <button type="button" onClick={() => onAddToCart(track)}>
        Add {track.title}
      </button>
    </div>
  ),
}));

const defaultMusicContext = {
  musicCatalog: [],
  cart: [],
  addToCart: vi.fn(),
  catalogLoading: false,
  catalogError: null,
  loadCatalog: vi.fn(),
};

const renderCatalog = (musicOverrides = {}, userOverrides = {}) => {
  useMusic.mockReturnValue({ ...defaultMusicContext, ...musicOverrides });
  useUser.mockReturnValue({
    isLoggedIn: true,
    openLoginModal: vi.fn(),
    ...userOverrides,
  });

  return render(
    <MemoryRouter>
      <CatalogRedesign />
    </MemoryRouter>
  );
};

describe('CatalogRedesign', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('shows a loading state while tracks are being fetched', () => {
    renderCatalog({ catalogLoading: true });

    expect(screen.getByRole('status')).toHaveTextContent('Loading the catalog');
    expect(screen.getByText('Loading beats...')).toBeInTheDocument();
  });

  it('renders tracks returned by the catalog context', () => {
    renderCatalog({
      musicCatalog: [{ id: 'track-1', title: 'Denver Nights', price: 2.99 }],
    });

    expect(screen.getByText('Denver Nights')).toBeInTheDocument();
    expect(screen.getByText('1 beats available')).toBeInTheDocument();
  });

  it('shows the error and retries catalog loading', () => {
    const loadCatalog = vi.fn();
    renderCatalog({ catalogError: 'Catalog unavailable', loadCatalog });

    expect(screen.getByRole('alert')).toHaveTextContent('Catalog unavailable');
    fireEvent.click(screen.getByRole('button', { name: 'Try Again' }));

    expect(loadCatalog).toHaveBeenCalledOnce();
  });

  it('shows an empty state when no tracks are available', () => {
    renderCatalog();

    expect(screen.getByRole('status')).toHaveTextContent('No beats available yet');
  });

  it('opens sign in instead of adding a track for logged-out visitors', () => {
    const openLoginModal = vi.fn();
    const addToCart = vi.fn();
    renderCatalog({
      musicCatalog: [{ id: 'track-1', title: 'Denver Nights', price: 2.99 }],
      addToCart,
    }, { isLoggedIn: false, openLoginModal });

    fireEvent.click(screen.getByRole('button', { name: 'Add Denver Nights' }));

    expect(openLoginModal).toHaveBeenCalledOnce();
    expect(addToCart).not.toHaveBeenCalled();
  });
});