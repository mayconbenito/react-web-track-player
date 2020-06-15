import {
  useState,
} from 'react';

import player from '../Player';

const useTrackPlayerProgress = (
  interval = 1000,
) => {
  const initialState = {
    position: 0,
    bufferedPosition: 0,
    duration: 0,
  };

  const [state, setState] = useState(initialState);

  const getProgress = () => {
    if (player.getCurrentTrack()) {
      const position = player.getPosition();
      const bufferedPosition = player.getBufferedPostion();
      const duration = player.getDuration();

      setState({ position, bufferedPosition, duration });
    } else {
      setState(initialState);
    }
  };

  setInterval(() => {
    getProgress();
  }, interval);

  return state;
};

export default useTrackPlayerProgress;
