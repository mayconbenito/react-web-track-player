const playerId = 'react-web-track-player-id';
let playerContext = document.getElementsByClassName(playerId);

let tracksQueue = [];
let activeTrack = null;
let isContextSet = false;
let actionHandlers = [];
let globalVolume = 0;

function listener() {
  const customSetInterval = function(callback, timeout) {
    const blob = new Blob([ `self.addEventListener('message', function(e) { \
      let old_date = Date.now(); \
      while (Date.now() - old_date <= ${  timeout  }) {}; \
      self.postMessage(true); \
    }, false);` ], { type: "text/javascript" });

    const worker = new Worker(window.URL.createObjectURL(blob));
    worker.addEventListener("message", function(e) {
        if (callback() === false) {
            return;
        }
        customSetInterval(callback, timeout);
    }, false);
    worker.postMessage(true);
  };


  customSetInterval(async () => {
    const playbackState = getPlaybackState();
    if (playbackState === 'STATE_STOPPED' && isContextSet) {
      await skipToNext();
    }
  }, 1000);
}

function setupPlayer(options) {
  actionHandlers = options.capabilities;

  listener()

  for (const [action, handler] of actionHandlers) {
    try {
      navigator.mediaSession.setActionHandler(action, handler);
    } catch (error) {
      if (!process.env.NODE_ENV === 'development') {
        console.log(`The media session action "${action}" is not supported yet.`);
      }
    }
  }
}

function add(tracks) {
  tracksQueue = [...tracksQueue, ...tracks];
}

async function play(position = 0) {
  if (isContextSet) {
    await playerContext.play();
    return;
  }

  activeTrack = tracksQueue[position];
  playerContext = activeTrack && activeTrack.url && new Audio(activeTrack.url);
  playerContext.className = playerId;

  isContextSet = true;

  await playerContext.play();

  navigator.mediaSession.metadata = new window.MediaMetadata({
    title: activeTrack.title,
    artist: activeTrack.artist,
    album: activeTrack.album,
    artwork: activeTrack.artwork,
  });

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
    (track) => track.id === activeTrack.id,
  );

  if (currentTrackPosition < tracksQueue.length - 1) {
    activeTrack = tracksQueue[currentTrackPosition + 1];
    playerContext.currentTime = 0;
    playerContext.volume = globalVolume
    playerContext.src = null;
    await playerContext.pause();

    playerContext = new Audio(activeTrack.url);
    await playerContext.play();

    navigator.mediaSession.metadata = new window.MediaMetadata({
      title: activeTrack.title,
      artist: activeTrack.artist,
      album: activeTrack.album,
      artwork: activeTrack.artwork,
    });
  }
}

async function skipToPrevious() {
  if (!activeTrack) {
    return;
  }

  const currentTrackPosition = tracksQueue.findIndex(
    (track) => track.id === activeTrack.id,
  );

  if (currentTrackPosition > 0) {
    activeTrack = tracksQueue[currentTrackPosition - 1];
    playerContext.currentTime = 0;
    playerContext.volume = globalVolume
    playerContext.src = null;
    await playerContext.pause();

    playerContext = new Audio(activeTrack.url);
    await playerContext.play();


    navigator.mediaSession.metadata = new window.MediaMetadata({
      title: activeTrack.title,
      artist: activeTrack.artist,
      album: activeTrack.album,
      artwork: activeTrack.artwork,
    });
  }
}

async function skipToIndex(index) {
  if (!activeTrack) {
    return;
  }

  if (index < tracksQueue.length) {
    activeTrack = tracksQueue[index];
    playerContext.currentTime = 0;
    playerContext.volume = globalVolume
    playerContext.src = null;
    await playerContext.pause();

    playerContext = new Audio(activeTrack.url);
    await playerContext.play();

    navigator.mediaSession.metadata = new window.MediaMetadata({
      title: activeTrack.title,
      artist: activeTrack.artist,
      album: activeTrack.album,
      artwork: activeTrack.artwork,
    });
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

  if (playerContext.paused && playerContext.currentTime !== playerContext.duration) {
    return 'STATE_PAUSED';
  }

  if (playerContext.paused && playerContext.currentTime === playerContext.duration) {
    return 'STATE_STOPPED';
  }

  return 'STATE_NONE';
}

function getVolume() {
  return playerContext.volume;
}

function setVolume(volume) {
  playerContext.volume = volume;
  globalVolume = volume
}

function seekTo(seconds) {
  playerContext.currentTime = seconds;
}

function reset() {
  playerContext.src = null;
  isContextSet = false;
  tracksQueue = [];
  activeTrack = null;
}

function destroy() {
  playerContext = document.getElementsByClassName(playerId);

  tracksQueue = [];
  activeTrack = null;
  isContextSet = false;
  actionHandlers = [];
}

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
