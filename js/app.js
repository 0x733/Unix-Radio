// js/app.js
import { stations } from './config.js';
import { AudioEngine } from './audio-engine.js';
import { RadioUI } from './ui.js';
import { VolumeController } from './volume-controller.js';

class RadioApp {
    constructor() {
        this.volumeController = new VolumeController();
        this.audio = new AudioEngine(this.volumeController);
        this.ui = new RadioUI(document.getElementById('radio-app'));
        this.currentStation = null;
        this.isPlaying = false;
        
        this.volumeController.addListener(() => this.updateUI());
        
        this.init();
    }

    init() {
        this.updateUI();
        this.bindEvents();
        
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.updateUI(), 100);
        });
    }

    updateUI() {
        this.ui.render(
            stations, 
            this.currentStation, 
            this.isPlaying,
            this.volumeController.getVolume()
        );
        this.bindEvents();
    }

    bindEvents() {
        this.ui.onStationClick(stationId => {
            const station = stations.find(s => s.id === stationId);
            if (station) {
                if (this.currentStation?.id === station.id) {
                    if (this.isPlaying) {
                        this.audio.pause();
                        this.isPlaying = false;
                    } else {
                        this.audio.resume()
                            .then(() => this.isPlaying = true)
                            .catch(console.error);
                    }
                } else {
                    this.currentStation = station;
                    this.audio.play(station.url)
                        .then(() => this.isPlaying = true)
                        .catch(console.error);
                }
                this.updateUI();
            }
        });

        this.ui.onPlayClick(() => {
            if (this.currentStation) {
                if (this.isPlaying) {
                    this.audio.pause();
                    this.isPlaying = false;
                } else {
                    this.audio.resume()
                        .then(() => this.isPlaying = true)
                        .catch(console.error);
                }
                this.updateUI();
            }
        });

        this.ui.onStopClick(() => {
            if (this.currentStation) {
                this.audio.stop();
                this.isPlaying = false;
                this.updateUI();
            }
        });

        this.ui.onVolumeChange(value => {
            this.volumeController.setVolume(value);
        });
    }
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(console.error);
    });
}

new RadioApp();