import { useState } from 'react';

import player from '../Player';
import useInterval from './helpers/useInterval';

const usePlaybackState = () => {
  const initialState = player.getPlaybackState();

  const [state, setState] = useState(initialState);

  const getProgress = () => {
    const playbackState = player.getPlaybackState();

    setState(playbackState);
  };

  useInterval(() => {
    getProgress();
  }, 1000);

  return state;
};

export default usePlaybackState;
