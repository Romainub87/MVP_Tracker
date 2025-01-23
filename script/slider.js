import { updateCharts } from "./updateCharts";

d3.json('data/data.json').then(data => {
    const stats = {
        'FG%': 'Pourcentage de tirs réussis',
        'PPG': 'Points par match',
        'RPG': 'Rebonds par match',
        'APG': 'Passes décisives par match',
        'BLKPG': 'Contres par match',
    };

    let filteredData = data.filter(d => d.year && d.PPG !== null);
    let startYear = Math.min(...filteredData.map(d => d.year));
    let endYear = Math.max(...filteredData.map(d => d.year));

    updateCharts(startYear, endYear, data, stats);

    $(function() {
        let delayTimeout;
        const $intervalleAnnee = $("#intervalleAnnee");
        $intervalleAnnee.slider({
            range: true,
            min: 1987,
            max: 2024,
            values: [startYear, endYear],
            slide: function(event, ui) {
                clearTimeout(delayTimeout);
                delayTimeout = setTimeout(function() {
                    startYear = ui.values[0];
                    endYear = ui.values[1];
                    d3.select('#subcharts').selectAll('svg').remove();
                    d3.select('#chart').selectAll('svg').remove();
                    updateCharts(startYear, endYear, data, stats);
                    $("#anneeLabel").val(ui.values[0] + " - " + ui.values[1]);
                }, 500);
            }
        }).css({
            'border': '1px solid #999',
            'border-radius': '10px',
            'box-shadow': '0 4px 8px rgba(0, 0, 0, 0.2)'
        });

        $("#anneeLabel").val($intervalleAnnee.slider("values", 0) + " - " + $intervalleAnnee.slider("values", 1));
    });
}).catch(error => {
    console.error('Error loading the JSON data:', error);
});