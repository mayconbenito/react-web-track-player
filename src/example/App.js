import React, { useEffect } from 'react';

import player, { useTrackPlayerProgress, usePlaybackTrackChanged, usePlaybackState } from '../index';

function App() {
  const { position, bufferedPosition, duration } = useTrackPlayerProgress();
  const currentTrack = usePlaybackTrackChanged();
  const playbackState = usePlaybackState();

  useEffect(() => {
    const tracks = [
      {
        id: 1,
        url:
          '',
        title: 'l',
        artist: '',
        album: '',
        artwork: [
          { src: '', sizes: '512x512', type: 'image/png' },
        ],
      },
      {
        id: 2,
        url:
          '',
        title: '',
        artist: '',
        album: '',
        artwork: [
          { src: '', sizes: '512x512', type: 'image/png' },
        ],
      },
    ];

    player.setupPlayer({
      capabilities: [
        [
          'play',
          async () => {
            await player.play();
          },
        ],
        [
          'pause',
          () => {
            player.pause();
          },
        ],
        [
          'previoustrack',
          async () => {
            await player.skipToPrevious();
          },
        ],
        [
          'nexttrack',
          async () => {
            await player.skipToNext();
          },
        ],
        [
          'stop',
          () => {
            player.reset();
          },
        ],
      ],
    });

    player.add(tracks);
  }, []);

  useEffect(() => {
    console.log(currentTrack);
  }, [currentTrack]);

  useEffect(() => {
    console.log(playbackState);
  }, [playbackState]);

  useEffect(() => {
    console.log(position, bufferedPosition, duration);
  }, [position, bufferedPosition, duration]);


  async function handlePlay() {
    await player.play(0);
  }

  function handlePause() {
    player.pause();
  }

  async function handleSkip() {
    await player.skipToNext();
  }

  async function handlePrev() {
    await player.skipToPrevious();
  }

  function handleSeek() {
    player.seekTo(10);
  }

  return (
    <div>

      <div>
        <h1>{currentTrack && currentTrack.title}</h1>
        <div>
          {position}
          |
          {duration}
        </div>
      </div>

      <button type="button" onClick={handlePlay}>Play</button>
      <button type="button" onClick={handlePause}>Pause</button>
      <button type="button" onClick={handleSkip}>Skip to Next</button>
      <button type="button" onClick={handlePrev}>Skip to Prev</button>
      <button type="button" onClick={handleSeek}>Seek To</button>
    </div>
  );
}

export default App;
