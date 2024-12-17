// js/audio-engine.js
export class AudioEngine {
    constructor() {
        this.audio = new Audio();
        this.audio.preload = 'none';
        this._volume = 1;
        this.audio.volume = this._volume;
    }

    play(url) {
        if (this.audio.src !== url) {
            this.audio.src = url;
        }
        return this.audio.play();
    }

    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
    }

    pause() {
        this.audio.pause();
    }

    resume() {
        if (this.audio.src) {
            return this.audio.play();
        }
    }

    setVolume(value) {
        this._volume = value;
        this.audio.volume = value;
    }

    getVolume() {
        return this._volume;
    }

    isPlaying() {
        return !this.audio.paused;
    }
}