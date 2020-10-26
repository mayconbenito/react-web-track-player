import { useState, useEffect } from 'react';

import player from '../Player';

const useTrackPlayerProgress = (intervalTime = 1000) => {
  const initialState = {
    position: 0,
    bufferedPosition: 0,
    duration: 0,
  };

  const [state, setState] = useState(initialState);

  useEffect(() => {
    const getProgress = () => {
      if (player.getCurrentTrack()) {
        const position = player.getPosition();
        const bufferedPosition = player.getBufferedPosition();
        const duration = player.getDuration();

        const updatedProgress = { position, bufferedPosition, duration };

        if (JSON.stringify(state) !== JSON.stringify(updatedProgress)) {
          setState(updatedProgress);
        } else {
          setState(initialState);
        }
      } else {
        setState(initialState);
      }
    };

    const interval = setInterval(() => {
      getProgress();
    }, intervalTime);

    return () => interval.clearInterval();
  }, []);

  return state;
};

export default useTrackPlayerProgress;
