// updateCharts.js
import {updateAverageChart} from "./average";
import {createCamembert} from "./camembert";
import {createPlayerSelect} from "./playerSelect";

function updateCharts(startYear, endYear, data, stats) {
    for (const statKey in stats) {
        updateAverageChart(startYear, endYear, statKey, data, stats);
    }
    createCamembert(startYear, endYear, data);
    createPlayerSelect(startYear, endYear, data);
}

export { updateCharts };