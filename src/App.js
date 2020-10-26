import React, { useEffect } from 'react';
import Player, {
  usePlaybackState,
  usePlaybackTrackChanged,
  usePlayerQueue,
  useTrackPlayerProgress,
} from './lib';

import './App.css';

function App() {
  const { position, bufferedPosition, duration } = useTrackPlayerProgress();
  const currentTrack = usePlaybackTrackChanged();
  const playbackState = usePlaybackState();
  const playerQueue = usePlayerQueue();

  useEffect(() => {
    const tracks = [
      {
        id: 1,
        url: 'https://stmusic-streamer.herokuapp.com/yt?url=gOsM-DYAEhY',
        title: 'Imagine Dragons - Whatever It Takes',
        artist: 'Imagine Dragons',
        album: 'Evolve',
        artwork: [
          {
            src:
              'https://res.cloudinary.com/hjkgnaiib/image/upload/v1581347748/images/e3bfdb293cd9697374084feccfd75741.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      {
        id: 2,
        url: 'https://stmusic-streamer.herokuapp.com/yt?url=ktvTqknDobU',
        title: 'Imagine Dragons - Radioactive',
        artist: 'Imagine Dragons',
        album: 'Night Visions',
        artwork: [
          {
            src:
              'https://res.cloudinary.com/hjkgnaiib/image/upload/v1581347801/images/c91dcc6778ee2f0b43d7c983ea6a8832.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    ];

    Player.setupPlayer({
      capabilities: [
        [
          'play',
          async () => {
            await Player.play();
          },
        ],
        [
          'pause',
          () => {
            Player.pause();
          },
        ],
        [
          'previoustrack',
          async () => {
            await Player.skipToPrevious();
          },
        ],
        [
          'nexttrack',
          async () => {
            await Player.skipToNext();
          },
        ],
        [
          'stop',
          () => {
            Player.reset();
          },
        ],
      ],
    });

    Player.setVolume(1);
    Player.add(tracks);
  }, []);

  useEffect(() => {
    console.log(currentTrack);
  }, [currentTrack]);

  useEffect(() => {
    console.log(playbackState);
  }, [playbackState]);

  useEffect(() => {
    console.log(playerQueue);
  }, [playerQueue]);

  useEffect(() => {
    console.log(position, bufferedPosition, duration);
  }, [position, bufferedPosition, duration]);

  async function handlePlay() {
    await Player.play(0);
  }

  function handlePause() {
    Player.pause();
  }

  async function handleSkip() {
    await Player.skipToNext();
  }

  async function handlePrev() {
    await Player.skipToPrevious();
  }

  function handleSeek() {
    Player.seekTo(10);
  }

  return (
    <div className="container">
      <div className="player">
        <div className="player-info">
          <h1>{currentTrack && currentTrack.title}</h1>
          <span>
            {position}:{duration}
          </span>
        </div>

        <div className="player-controls">
          <button className="button" type="button" onClick={handlePlay}>
            Play
          </button>
          <button className="button" type="button" onClick={handlePause}>
            Pause
          </button>
          <button className="button" type="button" onClick={handleSkip}>
            Go to Next Track
          </button>
          <button className="button" type="button" onClick={handlePrev}>
            Go to Prev Track
          </button>
          <button className="button" type="button" onClick={handleSeek}>
            Go to 10 Seconds of Track
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
