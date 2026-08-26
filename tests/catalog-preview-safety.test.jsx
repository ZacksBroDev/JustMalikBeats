/* @vitest-environment jsdom */
import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CatalogRedesign from '../src/pages/catalog/CatalogRedesign';
import { useMusic } from '../src/context/MusicContext';
import { useUser } from '../src/context/UserContext';

vi.mock('../src/context/MusicContext', () => ({
  useMusic: vi.fn(),
}));

vi.mock('../src/context/UserContext', () => ({
  useUser: vi.fn(),
}));

const defaultMusicContext = {
  musicCatalog: [],
  cart: [],
  addToCart: vi.fn(),
  catalogLoading: false,
  catalogError: null,
  loadCatalog: vi.fn(),
};

const renderCatalog = (musicOverrides = {}) => {
  useMusic.mockReturnValue({ ...defaultMusicContext, ...musicOverrides });
  useUser.mockReturnValue({
    isLoggedIn: true,
    openLoginModal: vi.fn(),
  });

  return render(
    <MemoryRouter>
      <CatalogRedesign />
    </MemoryRouter>
  );
};

describe('Catalog preview safety', () => {
  const originalAudio = globalThis.Audio;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    globalThis.Audio = originalAudio;
  });

  it('disables preview controls when a track has no preview source', () => {
    const audioMock = vi.fn();
    globalThis.Audio = audioMock;

    renderCatalog({
      musicCatalog: [
        {
          id: 'track-1',
          title: 'Denver Nights',
          bpm: 140,
          key: 'A Minor',
          price: 2.99,
          coverImage: '/cover.jpg',
        },
      ],
    });

    const unavailableButton = screen.getByRole('button', {
      name: 'Denver Nights preview unavailable',
    });

    expect(unavailableButton).toBeDisabled();
    expect(screen.getByText('Preview unavailable')).toBeInTheDocument();
    expect(audioMock).not.toHaveBeenCalled();
  });

  it('shows a fallback message when preview playback fails', async () => {
    const instances = [];
    const audioCtor = vi.fn(function AudioMock(src) {
      this.src = src;
      this.onended = null;
      this.onerror = null;
      this.pause = vi.fn();
      this.play = vi.fn().mockImplementation(() => {
        if (typeof this.onerror === 'function') {
          this.onerror(new Event('error'));
        }
        return Promise.resolve();
      });
      instances.push(this);
    });

    globalThis.Audio = audioCtor;

    renderCatalog({
      musicCatalog: [
        {
          id: 'track-1',
          title: 'Denver Nights',
          bpm: 140,
          key: 'A Minor',
          price: 2.99,
          coverImage: '/cover.jpg',
          audioPreview: '/preview.mp3',
        },
      ],
    });

    fireEvent.click(screen.getByRole('button', { name: 'Preview Denver Nights' }));

    await waitFor(() => {
      expect(screen.getByText('Preview unavailable')).toBeInTheDocument();
    });

    expect(audioCtor).toHaveBeenCalledWith('/preview.mp3');
    expect(instances[0].play).toHaveBeenCalledOnce();
    expect(instances[0].pause).toHaveBeenCalled();
  });
});
