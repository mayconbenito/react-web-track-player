import {
  useState,
} from 'react';

import player from '../Player';

const usePlaybackTrackChanged = () => {
  const initialState = player.getCurrentTrack();

  const [state, setState] = useState(initialState);

  const getCurrentTrack = () => {
    const currentTrack = player.getCurrentTrack();

    if (state !== currentTrack) {
      setState(currentTrack);
    }
  };

  setInterval(() => {
    getCurrentTrack();
  }, 1000);

  return state;
};

export default usePlaybackTrackChanged;
