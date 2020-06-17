# Documentation

## Playing music example

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
