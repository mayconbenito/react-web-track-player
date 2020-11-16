import { useState } from 'react';

import player from '../Player';
import useInterval from './helpers/useInterval';

const usePlaybackTrackChanged = () => {
  const initialState = player.getCurrentTrack();

  const [state, setState] = useState(initialState);

  const getCurrentTrack = () => {
    const currentTrack = player.getCurrentTrack();

    if (state !== currentTrack) {
      setState(currentTrack);
    }
  };

  useInterval(() => {
    getCurrentTrack();
  }, 1000);

  return state;
};

export default usePlaybackTrackChanged;
