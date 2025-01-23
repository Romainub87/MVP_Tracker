import { stats } from "./slider";

export function createPlayerSelect(startYearSelected, endYearSelected, players) {
    const select = document.createElement('select');
    select.id = 'playerSelect';
    select.className = 'bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full text-lg p-2.5 outline-none focus:ring-0';

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Choisir un joueur';
    select.appendChild(defaultOption);

    const filteredPlayers = players.filter(player => player.year >= startYearSelected && player.year <= endYearSelected);
    filteredPlayers.forEach(player => {
        const option = document.createElement('option');
        option.value = player.id;
        option.textContent = `${player.player} (${player.year})`;
        select.appendChild(option);
    });

    const container = document.getElementById('playerContainer');
    if (container) {
        container.innerHTML = '';
        const label = document.createElement('label');
        label.htmlFor = 'playerSelect';
        label.className = 'block mb-2 text-sm font-medium text-gray-900 hidden';
        container.appendChild(label);
        container.appendChild(select);
    }

    select.addEventListener('change', () => {
        const selectedPlayerId = select.value;
        if (selectedPlayerId === '') {
            removeTspans();
        } else {
            const selectedPlayer = players.find(player => player.id == selectedPlayerId);
            if (selectedPlayer) {
                displayPlayerStats(selectedPlayer);
            }
        }
    });

    // Add event listener for slider change
    const slider = document.getElementById('slider');
    if (slider) {
        slider.addEventListener('input', () => {
            const selectedPlayerId = select.value;
            const selectedPlayer = players.find(player => player.id == selectedPlayerId);
            if (selectedPlayer) {
                displayPlayerStats(selectedPlayer);
            }
        });
    }
}

function removeTspans() {
    const tspans = document.querySelectorAll('.average tspan');
    tspans.forEach(tspan => tspan.remove());
}

function displayPlayerStats(player) {
    for (const statKey in stats) {
        let textElements = document.getElementsByClassName('average average-' + statKey);
        Array.from(textElements).forEach(textElement => {
            const playerStat = parseFloat(player[statKey]);
            const averageStat = parseFloat(textElement.textContent);

            if (!isNaN(playerStat) && !isNaN(averageStat)) {
                d3.select(textElement).select('tspan').remove();
                d3.select(textElement)
                    .append('tspan')
                    .text(`(${playerStat.toFixed(2)})`)
                    .style('fill', playerStat < averageStat ? 'red' : 'green')
                    .style('font-size', '0.8em')
                    .style('opacity', 0)
                    .transition()
                    .duration(1000)
                    .style('opacity', 1)
                    .tween('text', function() {
                        const interpolate = d3.interpolateNumber(0, playerStat);
                        return function(t) {
                            this.textContent = `(${interpolate(t).toFixed(2)})`;
                        };
                    });
            }
        });
    }
}