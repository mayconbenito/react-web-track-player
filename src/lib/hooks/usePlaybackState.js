import { useState } from 'react';

import player from '../Player';

const usePlaybackState = () => {
  const initialState = player.getPlaybackState();

  const [state, setState] = useState(initialState);

  const getProgress = () => {
    const playbackState = player.getPlaybackState();

    setState(playbackState);
  };

  setInterval(() => {
    getProgress();
  }, 1000);

  return state;
};

export default usePlaybackState;
