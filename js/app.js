// js/app.js
import { stations } from './config.js';
import { AudioEngine } from './audio-engine.js';
import { RadioUI } from './ui.js';

class RadioApp {
    constructor() {
        this.audio = new AudioEngine();
        this.ui = new RadioUI(document.getElementById('radio-app'));
        this.currentStation = null;
        this.init();
    }

    init() {
        this.ui.render(stations, this.currentStation);
        this.bindEvents();
    }

    bindEvents() {
        this.ui.onStationClick(stationId => {
            const station = stations.find(s => s.id === stationId);
            if (station) {
                if (this.currentStation?.id === station.id) {
                    this.audio.stop();
                    this.currentStation = null;
                } else {
                    this.audio.play(station.url)
                        .then(() => {
                            this.currentStation = station;
                            this.ui.render(stations, this.currentStation);
                        })
                        .catch(console.error);
                }
                this.ui.render(stations, this.currentStation);
            }
        });

        this.ui.onVolumeChange(value => {
            this.audio.setVolume(value);
        });
    }
}

new RadioApp();
