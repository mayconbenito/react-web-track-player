# React Web Track Player

### Inspired by [react-native-track-player](https://github.com/react-native-kit/react-native-track-player)

## Summary

* [Examples](#examples)
  * [Playing Music Example](#playing-music-example)
  * [Set MediaSession API Actions](#set-mediasessionapi-actions)
* [Functions](#functions)
  * [Player](#player-functions)
  * [Queue](#queue-functions)

## Examples
### Playing Music Example
```
import React, { useEffect } from 'react';

import player, { useTrackPlayerProgress, usePlaybackTrackChanged, usePlaybackState } from '../index';

function App() {
    const { position, bufferedPosition, duration } = useTrackPlayerProgress();

    const currentTrack = usePlaybackTrackChanged();

    const playbackState = usePlaybackState();

    useEffect(() => {
        <!-- The track id has to be unique -->
        const tracks = [
            {
                id: 1,
                url: '',
                title: 'l',
                artist: '',
                album: '',
                artwork: [
                    { 
                        src: '',
                        sizes: '512x512',
                        type: 'image/png'
                    },
                ],
            },
            {
                id: 2,
                url:'',
                title: '',
                artist: '',
                album: '',
                artwork: [
                    { 
                        src: '',
                        sizes: '512x512',
                        type: 'image/png'
                    },
                ],
            }
        ];

        <!-- Start player and set MediaSessionAPI Capabilities -->
        player.setupPlayer({
            capabilities: [
                [
                    'play',
                    async () => {
                    await player.play();
                    },
                ],
                [
                    'pause',
                    () => {
                    player.pause();
                    },
                ],
                [
                    'previoustrack',
                    async () => {
                    await player.skipToPrevious();
                    },
                ],
                [
                    'nexttrack',
                    async () => {
                    await player.skipToNext();
                    },
                ],
                [
                    'stop',
                    () => {
                    player.reset();
                    },
                ],
            ],
        });
        
        <!-- Add tracks to the queue -->
        player.add(tracks);
    }, []);

    useEffect(() => {
        <!-- Will be updated every time a track change -->
        console.log(currentTrack);
    }, [currentTrack]);

    useEffect(() => {
        <!-- Will be updated every time a playback state change -->
        console.log(playbackState);
    }, [playbackState]);

    useEffect(() => {
        <!-- Will be updated every time track position state change -->
        console.log(position, bufferedPosition, duration);
    }, [position, bufferedPosition, duration]);

    async function handlePlay() {
        <!-- After adding the tracks to the queue call this function with the track position -->
        await player.play(0);
    }

    function handlePause() {
        player.pause();
    }

    async function handleSkip() {
        await player.skipToNext();
    }

    async function handlePrev() {
        await player.skipToPrevious();
    }

    function handleSeek() {
        <!-- Seek to 10 seconds -->
        player.seekTo(10); 
    }

    return (
        <div>
            <div>
                <h1>{currentTrack && currentTrack.title}</h1>
                <div>
                    {position}

                    |

                    {duration}
                </div>
            </div>

            <button type="button" onClick={handlePlay}>Play</button>

            <button type="button" onClick={handlePause}>Pause</button>

            <button type="button" onClick={handleSkip}>Skip to Next</button>

            <button type="button" onClick={handlePrev}>Skip to Prev</button>

            <button type="button" onClick={handleSeek}>Seek To</button>

        </div>
    );
}

export default App;
```

### Set MediaSessionAPI Actions
```
  <!-- Start player and set MediaSessionAPI Capabilities -->
  player.setupPlayer({
      capabilities: [
          [
              'play',
              async () => {
              await player.play();
              },
          ],
          [
              'pause',
              () => {
              player.pause();
              },
          ],
          [
              'previoustrack',
              async () => {
              await player.skipToPrevious();
              },
          ],
          [
              'nexttrack',
              async () => {
              await player.skipToNext();
              },
          ],
          [
              'stop',
              () => {
              player.reset();
              },
          ],
      ],
  });
```

## Functions
### Player Functions
#### `setupPlayer(options)`
Initializes the player with the specified options.

You should always call this function (even without any options set) before using the player to make sure everything is initialized.

| Param                | Type     | Description   |
| -------------------- | -------- | ------------- |
| options              | `object` | The options   | 
| options.capabilities    | `array` | The [MediaSessionAPI](https://developer.mozilla.org/en-US/docs/Web/API/MediaSessionActionDetails) Actions

#### `destroy()`
Destroys the player, cleaning up its resources. After executing this function, you won't be able to use the player anymore, unless you call `setupPlayer()` again.

### Queue Functions
#### `add(tracks)`
Adds one or more tracks to the queue.

| Param          | Type     | Description   |
| -------------- | -------- | ------------- |
| tracks         | `array` of | The tracks that will be added |

#### `remove(tracks)`
Removes one or more tracks from the queue.

| Param  | Type     | Description   |
| ------ | -------- | ------------- |
| tracks | `array` of track ids | The tracks that will be removed |

#### `skipToIndex(index)`
Skips to a track in the queue based on the index.

**Returns:** `Promise`

| Param  | Type     | Description   |
| ------ | -------- | ------------- |
| index  | `number` | The track index  |

#### `skipToNext()`
Skips to the next track in the queue.

**Returns:** `Promise`

#### `skipToPrevious()`
Skips to the previous track in the queue.

**Returns:** `Promise`

#### `reset()`
Resets the player stopping the current track and clearing the queue.

#### `getTrack(id)`
Gets a track object from the queue.

**Returns:** `object`

#### `getCurrentTrack()`
Gets the current track object from the queue.

**Returns:** `object`

#### `getQueue()`
Gets the whole queue

**Returns:** `Array`

#### `play()`
Plays or resumes the current track.

**Returns:** `Promise`

#### `pause()`
Pauses the current track.

#### `stop()`
Stops the current track.

#### `seekTo(seconds)`
Seeks to a specified time position in the current track.

| Param   | Type     | Description             |
| ------- | -------- | ----------------------- |
| seconds | `number` | The position in seconds |

#### `setVolume(volume)`
Sets the volume of the player.

| Param  | Type     | Description                       |
| ------ | -------- | --------------------------------- |
| volume | `number` | The volume in a range from 0 to 1 |

#### `getVolume()`
Gets the volume of the player (a number between 0 and 1).

**Returns:** `number`

#### `getDuration()`
Gets the duration of the current track in seconds.

Note: Is recommended to add the track duration on the track object

**Returns:** `number`

#### `getPosition()`
Gets the position of the player in seconds.

**Returns:** `number`

#### `getBufferedPosition()`
Gets the buffered position of the player in seconds.

**Returns:** `number`

#### `getPlaybackState()`
Gets the state of the player. "STATE_PLAYING | STATE_PAUSED | STATE_STOPPED | STATE_NONE"

**Returns:** `string`

