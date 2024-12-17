// js/ui.js
export class RadioUI {
    constructor(container) {
        this.container = container;
    }

    render(stations, currentStation) {
        this.container.innerHTML = `
            <div class="radio-player">
                <div class="controls">
                    <input type="range" class="volume" min="0" max="1" step="0.1" value="1">
                </div>
                <div class="stations">
                    ${stations.map(station => `
                        <div class="station ${currentStation?.id === station.id ? 'playing' : ''}" 
                             data-station-id="${station.id}">
                            ${station.name}
                        </div>
                    `).join('')}
                </div>
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

    onVolumeChange(callback) {
        const volume = this.container.querySelector('.volume');
        volume.addEventListener('input', (e) => callback(e.target.value));
    }
}
