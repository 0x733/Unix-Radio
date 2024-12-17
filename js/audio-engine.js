// js/audio-engine.js
export class AudioEngine {
    constructor(volumeController) {
        this.audio = new Audio();
        this.audio.preload = 'none';
        this.volumeController = volumeController;
        
        this.volumeController.addListener(volume => {
            this.audio.volume = volume;
        });
        
        this.audio.volume = this.volumeController.getVolume();
        this._initMobileAudio();
    }

    _initMobileAudio() {
        const unlockAudio = () => {
            this.audio.play().then(() => {
                this.audio.pause();
                this.audio.currentTime = 0;
                document.removeEventListener('touchstart', unlockAudio);
            }).catch(() => {});
        };
        
        document.addEventListener('touchstart', unlockAudio, { once: true });
    }

    async play(url) {
        try {
            if (this.audio.src !== url) {
                this.audio.src = url;
            }
            await this.audio.play();
        } catch (error) {
            console.error('Playback error:', error);
            throw error;
        }
    }

    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.audio.src = '';
    }

    pause() {
        this.audio.pause();
    }

    resume() {
        if (this.audio.src) {
            return this.audio.play();
        }
        return Promise.reject(new Error('No audio source'));
    }

    isPlaying() {
        return !this.audio.paused;
    }
}