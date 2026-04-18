import { Track } from './types';

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Dreams',
    artist: 'AI Gen Synth',
    url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_73523f2f2e.mp3', // Synthwave track
    duration: 145,
    genre: 'Synthwave',
  },
  {
    id: '2',
    title: 'Cyber Runner',
    artist: 'AI Gen Beats',
    url: 'https://cdn.pixabay.com/audio/2022/11/22/audio_feb6655c65.mp3', // Electronic
    duration: 180,
    genre: 'Cyberpunk',
  },
  {
    id: '3',
    title: 'Deep Space',
    artist: 'AI Gen Ambient',
    url: 'https://cdn.pixabay.com/audio/2022/01/21/audio_31b5853fde.mp3', // Dark ambient
    duration: 210,
    genre: 'Ambient',
  },
];

export const GAME_SPEED = 100;
export const GRID_SIZE = 20;
export const CANVAS_SIZE = 400;
