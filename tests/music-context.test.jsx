/* @vitest-environment jsdom */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it, vi } from 'vitest';
import { MusicProvider, useMusic } from '../src/context/MusicContext';
import { apiRequest } from '../src/config/api';

vi.mock('../src/config/api', () => ({
  apiRequest: vi.fn(),
}));

const ContextProbe = () => {
  const { musicCatalog, catalogLoading, catalogError } = useMusic();

  if (catalogLoading) {
    return <div>loading</div>;
  }

  if (catalogError) {
    return <div>error: {catalogError}</div>;
  }

  return <div>{musicCatalog.map(track => <span key={track.id}>{track.title}</span>)}</div>;
};

describe('MusicProvider catalog loading', () => {
  it('starts in a loading state', () => {
    apiRequest.mockReturnValue(new Promise(() => {}));

    render(
      <MusicProvider>
        <ContextProbe />
      </MusicProvider>
    );

    expect(screen.getByText('loading')).toBeInTheDocument();
  });

  it('normalizes tracks returned by the API', async () => {
    apiRequest.mockResolvedValue({
      tracks: [{
        _id: 'track-1',
        title: 'Denver Nights',
        coverImageUrl: '/cover.jpg',
        audioPreviewUrl: '/preview.mp3',
        duration: '3:24',
      }],
    });

    render(
      <MusicProvider>
        <ContextProbe />
      </MusicProvider>
    );

    await waitFor(() => expect(screen.getByText('Denver Nights')).toBeInTheDocument());
    expect(apiRequest).toHaveBeenCalledWith('/api/tracks');
  });

  it('exposes API failures as catalog errors', async () => {
    apiRequest.mockRejectedValue(new Error('Catalog unavailable'));

    render(
      <MusicProvider>
        <ContextProbe />
      </MusicProvider>
    );

    await waitFor(() => expect(
      screen.getByText((content) => content.includes('Catalog unavailable'))
    ).toBeInTheDocument());
  });
});