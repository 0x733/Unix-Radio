// js/ui.js
export class RadioUI {
    constructor(container) {
        this.container = container;
    }

    render(stations, currentStation, isPlaying, volume) {
        this.container.innerHTML = `
            <div class="radio-player">
                <div class="player-header">
                    <h1>Unix Radio</h1>
                </div>
                
                <div class="controls">
                    <div class="playback-controls">
                        <button class="btn" id="playBtn">
                            ${isPlaying ? 'Pause' : 'Play'}
                        </button>
                        <button class="btn" id="stopBtn">
                            Stop
                        </button>
                    </div>
                    
                    <div class="volume-control">
                        <span class="volume-icon">🔊</span>
                        <input type="range" 
                               class="volume" 
                               min="0" 
                               max="1" 
                               step="0.01" 
                               value="${volume}">
                    </div>
                </div>

                <div class="stations">
                    ${stations.map(station => `
                        <div class="station ${currentStation?.id === station.id ? 'playing' : ''}" 
                             data-station-id="${station.id}">
                            <div class="station-info">
                                <div class="station-name">${station.name}</div>
                                <div class="station-status">
                                    ${currentStation?.id === station.id 
                                        ? (isPlaying ? '▶ Playing' : '❚❚ Paused') 
                                        : 'Click to play'}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                ${currentStation ? `
                    <div class="now-playing">
                        Now Playing: ${currentStation.name}
                    </div>
                ` : ''}
            </div>
        `;
    }

    onStationClick(callback) {
        this.container.querySelectorAll('.station').forEach(el => {
            el.addEventListener('click', () => {
                const stationId = el.dataset.stationId;
                callback(stationId);
            });
        });
    }

    onPlayClick(callback) {
        const playBtn = this.container.querySelector('#playBtn');
        playBtn?.addEventListener('click', callback);
    }

    onStopClick(callback) {
        const stopBtn = this.container.querySelector('#stopBtn');
        stopBtn?.addEventListener('click', callback);
    }

    onVolumeChange(callback) {
        const volume = this.container.querySelector('.volume');
        volume?.addEventListener('input', (e) => callback(e.target.value));
    }
}