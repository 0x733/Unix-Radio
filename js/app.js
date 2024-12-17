// js/app.js
import { stations } from './config.js';
import { AudioEngine } from './audio-engine.js';
import { RadioUI } from './ui.js';

class RadioApp {
    constructor() {
        this.audio = new AudioEngine();
        this.ui = new RadioUI(document.getElementById('radio-app'));
        this.currentStation = null;
        this.isPlaying = false;
        this.init();
    }

    init() {
        this.updateUI();
        this.bindEvents();
    }

    updateUI() {
        this.ui.render(
            stations, 
            this.currentStation, 
            this.isPlaying,
            this.audio.getVolume()
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
            this.audio.setVolume(value);
            this.updateUI();
        });
    }
}

new RadioApp();