// js/volume-controller.js
export class VolumeController {
    constructor() {
        this._volume = parseFloat(localStorage.getItem('radio-volume')) || 1;
        this._listeners = new Set();
    }

    setVolume(value) {
        this._volume = Math.max(0, Math.min(1, parseFloat(value)));
        localStorage.setItem('radio-volume', this._volume.toString());
        this._notifyListeners();
        return this._volume;
    }

    getVolume() {
        return this._volume;
    }

    addListener(callback) {
        this._listeners.add(callback);
    }

    removeListener(callback) {
        this._listeners.delete(callback);
    }

    _notifyListeners() {
        this._listeners.forEach(callback => callback(this._volume));
    }
}
