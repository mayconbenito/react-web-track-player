import { useState } from 'react';

import player from '../Player';
import useInterval from './helpers/useInterval';

const usePlayerQueue = () => {
  const [state, setState] = useState([]);

  const getQueue = () => {
    const playerQueue = player.getQueue();

    setState(playerQueue);
  };

  useInterval(() => {
    getQueue();
  }, 1000);

  return state;
};

export default usePlayerQueue;
