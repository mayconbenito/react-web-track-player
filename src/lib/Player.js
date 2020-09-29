let tracksQueue = [];
let activeTrack = null;
let isQueueSet = false;
let loadingState = null;
let actionHandlers = [];
let globalVolume = 0;

const playerContext = new Audio();

function setupPlayer(options) {
  actionHandlers = options.capabilities;

  for (const [action, handler] of actionHandlers) {
    try {
      navigator.mediaSession.setActionHandler(action, handler);
    } catch (error) {
      if (!process.env.NODE_ENV === 'development') {
        console.log(
          `The media session action "${action}" is not supported yet.`
        );
      }
    }
  }
}

function add(tracks) {
  tracksQueue = [...tracksQueue, ...tracks];
}

async function play(position = 0) {
  if (isQueueSet) {
    await playerContext.play();
    return;
  }

  activeTrack = tracksQueue[position];
  playerContext.src = activeTrack && activeTrack.url;

  isQueueSet = true;

  playerContext.volume = globalVolume;

  navigator.mediaSession.metadata = new window.MediaMetadata({
    title: activeTrack.title,
    artist: activeTrack.artist,
    album: activeTrack.album,
    artwork: activeTrack.artwork,
  });

  await playerContext.play();

  navigator.mediaSession.playbackState = 'playing';
}

function pause() {
  if (!activeTrack) {
    return;
  }

  playerContext.pause();

  navigator.mediaSession.playbackState = 'paused';
}

async function skipToNext() {
  if (!activeTrack) {
    return;
  }

  const currentTrackPosition = tracksQueue.findIndex(
    (track) => track.id === activeTrack.id
  );

  if (currentTrackPosition < tracksQueue.length - 1) {
    activeTrack = tracksQueue[currentTrackPosition + 1];
    playerContext.src = null;
    playerContext.currentTime = 0;

    await playerContext.pause();

    playerContext.src = activeTrack && activeTrack.url;
    playerContext.volume = globalVolume;

    navigator.mediaSession.metadata = new window.MediaMetadata({
      title: activeTrack.title,
      artist: activeTrack.artist,
      album: activeTrack.album,
      artwork: activeTrack.artwork,
    });

    await playerContext.play();
  }
}

async function skipToPrevious() {
  if (!activeTrack) {
    return;
  }

  const currentTrackPosition = tracksQueue.findIndex(
    (track) => track.id === activeTrack.id
  );

  if (currentTrackPosition > 0) {
    activeTrack = tracksQueue[currentTrackPosition - 1];
    playerContext.src = null;
    playerContext.currentTime = 0;

    await playerContext.pause();

    playerContext.src = activeTrack && activeTrack.url;
    playerContext.volume = globalVolume;

    navigator.mediaSession.metadata = new window.MediaMetadata({
      title: activeTrack.title,
      artist: activeTrack.artist,
      album: activeTrack.album,
      artwork: activeTrack.artwork,
    });

    await playerContext.play();
  }
}

async function skipToIndex(index) {
  if (!activeTrack) {
    return;
  }

  if (index < tracksQueue.length) {
    activeTrack = tracksQueue[index];
    playerContext.src = null;
    playerContext.currentTime = 0;

    await playerContext.pause();

    playerContext.src = activeTrack && activeTrack.url;
    playerContext.volume = globalVolume;

    navigator.mediaSession.metadata = new window.MediaMetadata({
      title: activeTrack.title,
      artist: activeTrack.artist,
      album: activeTrack.album,
      artwork: activeTrack.artwork,
    });

    await playerContext.play();
  }
}

function getQueue() {
  return tracksQueue;
}

function getCurrentTrack() {
  return activeTrack;
}

function getTrack(trackId) {
  return tracksQueue.find((track) => track.id === trackId);
}

function remove(tracksId) {
  tracksId.forEach((trackId) => {
    const trackIndex = tracksQueue.findIndex((track) => track.id === trackId);
    tracksQueue.splice(trackIndex, 1);

    if (activeTrack.id === trackId) {
      playerContext.src = null;
      skipToNext();
    }
  });
}

function getDuration() {
  return playerContext.duration || 0;
}

function getPosition() {
  return playerContext.currentTime;
}

function getBufferedPosition() {
  if (playerContext.buffered.length) {
    return playerContext.buffered.end(playerContext.buffered);
  }

  return 0;
}

function getPlaybackState() {
  if (!playerContext.paused && playerContext.duration >= 0) {
    return 'STATE_PLAYING';
  }

  if (
    playerContext.paused &&
    playerContext.currentTime !== playerContext.duration
  ) {
    return 'STATE_PAUSED';
  }

  if (
    playerContext.paused &&
    playerContext.currentTime === playerContext.duration
  ) {
    return 'STATE_STOPPED';
  }

  if (loadingState === 'waiting' || loadingState === 'loadstart') {
    return 'STATE_BUFFERING';
  }

  return 'STATE_NONE';
}

function getVolume() {
  return playerContext.volume;
}

function setVolume(volume) {
  playerContext.volume = volume;
  globalVolume = volume;
}

function seekTo(seconds) {
  playerContext.currentTime = seconds;
}

function reset() {
  playerContext.src = null;
  isQueueSet = false;
  tracksQueue = [];
  activeTrack = null;
}

function destroy() {
  tracksQueue = [];
  activeTrack = null;
  isQueueSet = false;
  actionHandlers = [];
}

playerContext.addEventListener('ended', async function () {
  await skipToNext();
});

playerContext.addEventListener('waiting', async function () {
  loadingState = 'waiting';
});

playerContext.addEventListener('loadstart', async function () {
  loadingState = 'loadstart';
});

export default {
  setupPlayer,
  add,
  play,
  pause,
  skipToNext,
  skipToPrevious,
  skipToIndex,
  getQueue,
  getCurrentTrack,
  getTrack,
  remove,
  getDuration,
  getPosition,
  getBufferedPosition,
  getPlaybackState,
  getVolume,
  setVolume,
  seekTo,
  reset,
  destroy,
};
