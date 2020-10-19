import { useState } from 'react';

import player from '../Player';

const usePlayerQueue = () => {
  const [state, setState] = useState([]);

  const getQueue = () => {
    const playerQueue = player.getQueue();

    setState(playerQueue);
  };

  setInterval(() => {
    getQueue();
  }, 1000);

  return state;
};

export default usePlayerQueue;
