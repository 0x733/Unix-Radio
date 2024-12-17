// js/audio-engine.js
export class AudioEngine {
    constructor() {
        this.audio = new Audio();
        this.audio.preload = 'none';
    }

    play(url) {
        this.audio.src = url;
        return this.audio.play();
    }

    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
    }

    setVolume(value) {
        this.audio.volume = value;
    }

    isPlaying() {
        return !this.audio.paused;
    }
}
