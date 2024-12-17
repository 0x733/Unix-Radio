// js/app.js
import { stations } from './config.js';
import { AudioEngine } from './audio-engine.js';
import { RadioUI } from './ui.js';
import { VolumeController } from './volume-controller.js';
import { Logger } from './logger.js';

class RadioApp {
    constructor() {
        Logger.init();
        Logger.log('Radio initializing...');

        this.volumeController = new VolumeController();
        this.audio = new AudioEngine(this.volumeController);
        this.ui = new RadioUI(document.getElementById('radio-app'));
        this.currentStation = null;
        this.isPlaying = false;
        
        this.volumeController.addListener(() => {
            this.updateUI();
            Logger.log(`Volume: ${Math.round(this.volumeController.getVolume() * 100)}%`);
        });
        
        this.init();
    }

    init() {
        this.updateUI();
        this.bindEvents();
        window.addEventListener('orientationchange', () => setTimeout(() => this.updateUI(), 100));
        window.addEventListener('online', () => this.updateUI());
        window.addEventListener('offline', () => this.updateUI());
    }

    updateUI() {
        this.ui.render(stations, this.currentStation, this.isPlaying, this.volumeController.getVolume());
        this.bindEvents();
    }

    bindEvents() {
        this.ui.onStationClick(stationId => {
            const station = stations.find(s => s.id === stationId);
            if (!station) return;

            if (this.currentStation?.id === station.id) {
                if (this.isPlaying) {
                    this.audio.pause();
                    this.isPlaying = false;
                    Logger.log(`Paused: ${station.name}`);
                } else {
                    this.audio.resume()
                        .then(() => {
                            this.isPlaying = true;
                            Logger.log(`Resumed: ${station.name}`);
                        })
                        .catch(Logger.error);
                }
            } else {
                this.currentStation = station;
                this.audio.play(station.url)
                    .then(() => {
                        this.isPlaying = true;
                        Logger.log(`Playing: ${station.name}`);
                    })
                    .catch(Logger.error);
            }
            this.updateUI();
        });

        this.ui.onPlayClick(() => {
            if (!this.currentStation) return;

            if (this.isPlaying) {
                this.audio.pause();
                this.isPlaying = false;
                Logger.log('Paused');
            } else {
                this.audio.resume()
                    .then(() => {
                        this.isPlaying = true;
                        Logger.log('Resumed');
                    })
                    .catch(Logger.error);
            }
            this.updateUI();
        });

        this.ui.onStopClick(() => {
            if (!this.currentStation) return;
            this.audio.stop();
            this.isPlaying = false;
            Logger.log('Stopped');
            this.updateUI();
        });

        this.ui.onVolumeChange(value => this.volumeController.setVolume(value));
    }
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(() => Logger.log('SW registered'))
            .catch(Logger.error);
    });
}

window.addEventListener('error', event => Logger.error(event.message));
window.addEventListener('unhandledrejection', event => Logger.error(event.reason));

new RadioApp();