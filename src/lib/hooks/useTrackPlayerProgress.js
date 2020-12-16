import { useState } from 'react';

import player from '../Player';
import useInterval from './helpers/useInterval';

const useTrackPlayerProgress = (intervalTime = 1000) => {
  const initialState = {
    position: 0,
    bufferedPosition: 0,
    duration: 0,
  };

  const [state, setState] = useState(initialState);

  const getProgress = () => {
    if (player.getCurrentTrack()) {
      const position = player.getPosition();
      const bufferedPosition = player.getBufferedPosition();
      const duration = player.getDuration();

      const updatedProgress = { position, bufferedPosition, duration };

      setState(updatedProgress);
    } else {
      setState(initialState);
    }
  };

  useInterval(() => {
    getProgress();
  }, intervalTime);

  return state;
};

export default useTrackPlayerProgress;
