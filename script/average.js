d3.json('../data/data.json').then(data => {

    const stats = {
        'FG%': 'Pourcentage de tir réussis'
    };

    let startYear = Math.min(...data.filter(player => Object.keys(stats).some(statKey => player[statKey] != null)).map(player => player.year));
    let endYear = Math.max(...data.filter(player => Object.keys(stats).some(statKey => player[statKey] != null)).map(player => player.year));

    const circleRadius = 100;
    const innerRadius = 75;

    update(startYear, endYear);


    function update(startYearSelected, endYearSelected) {

        const validData = data.filter(player => player.year >= startYear && player.year <= endYear && Object.keys(stats).every(statKey => player[statKey] != null));
        const averages = Object.keys(stats).reduce((acc, statKey) => {
            const total = validData.reduce((sum, player) => sum + player[statKey], 0);
            acc[statKey] = (total / validData.length) * (statKey.includes('%') ? 100 : 1);
            return acc;
        }, {});

        // suppriemr le graphique précédent
        let svg = d3.select('svg').remove();

        svg = d3.select('#chart').append('svg')
            .attr('width', 500)
            .attr('height', 500);

        const arcGenerator = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(circleRadius);

        const pie = d3.pie()
            .value(d => 100);

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const arcs = svg.selectAll('.arc')
            .data(pie(Object.entries(averages).map(([key, value]) => ({ key, value }))))
            .enter().append('g')
            .attr('class', 'arc')
            .attr('transform', 'translate(250, 250)');

        // Background arc
        arcs.append('path')
            .attr('d', arcGenerator)
            .attr('fill', '#d3d3d3');

        // Foreground arc
        arcs.append('path')
            .attr('d', arcGenerator)
            .attr('fill', (d, i) => color(i))
            .transition()
            .duration(1000)
            .attrTween('d', function(d) {
                const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, { startAngle: 0, endAngle: (d.data.value / 100) * 2 * Math.PI });
                return function(t) {
                    return arcGenerator(interpolate(t));
                };
            });

        // Statistic name above the circle
        svg.append('text')
            .attr('transform', 'translate(250, 120)') // Position above the center
            .attr('dy', '0.35em')
            .attr('text-anchor', 'middle')
            .attr('font-size', '18px')
            .attr('font-weight', 'bold')
            .text(stats['FG%']);

        // Statistic value in the center
        svg.append('text')
            .attr('transform', 'translate(250, 250)')
            .attr('dy', '0.35em')
            .attr('text-anchor', 'middle')
            .attr('font-size', '24px')
            .attr('font-weight', 'bold')
            .text(`${averages['FG%'].toFixed(2)}%`);

        console.log(startYearSelected, endYearSelected, startYear, endYear);

        $( function() {
            let delayTimeout;
            $( "#intervalleAnnee" ).slider({
                range: true,
                min: 1987,
                max: 2024,
                values: [ startYearSelected, endYearSelected ],
                slide: function( event, ui ) {
                    clearTimeout(delayTimeout);
                    delayTimeout = setTimeout(function() {
                        startYear = ui.values[ 0 ];
                        endYear = ui.values[ 1 ];
                        update(ui.values[ 0 ], ui.values[ 1 ]);
                        $( "#anneeLabel" ).val(ui.values[ 0 ] + " - " + ui.values[ 1 ]);
                    }, 500); // Délai en millisecondes
                }
            });

            $( "#anneeLabel" ).val($( "#intervalleAnnee" ).slider("values", 0) + " - " + $( "#intervalleAnnee" ).slider("values", 1));
        });
    }

});