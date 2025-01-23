
export function updateAverageChart(startYearSelected, endYearSelected, statKey, data, stats) {
    const validData = data.filter(player => player.year >= startYearSelected && player.year <= endYearSelected && player[statKey] != null);
    const average = statKey.includes('%') ? (validData.reduce((acc, player) => acc + player[statKey], 0) / validData.length) * 100 : validData.reduce((acc, player) => acc + player[statKey], 0) / validData.length;

    const svg = d3.select(statKey.includes('%') ? '#chart' : '#subcharts').append('svg')
        .attr('width', statKey.includes('%') ? 400 : 300)
        .attr('height', statKey.includes('%') ? 400 : 100)
        .attr('viewBox', statKey.includes('%') ? '0 0 400 400' : '0 0 200 200')
        .attr('preserveAspectRatio', 'xMidYMid meet');

    const width = statKey.includes('%') ? 400 : 200;
    const height = width / 2;
    const outerRadius = height / 1.5;
    const innerRadius = outerRadius * 0.75;

    svg.append('defs').append('linearGradient')
        .attr('id', 'gradient')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%')
        .selectAll('stop')
        .data([
            { offset: '0%', color: '#00f' },
            { offset: '100%', color: '#f00' }
        ])
        .enter().append('stop')
        .attr('offset', d => d.offset)
        .attr('stop-color', d => d.color);

    if (!statKey.includes('%')) {
        svg.append('text')
            .attr('transform', 'translate(100, 50)')
            .attr('text-anchor', 'middle')
            .attr('font-size', '50px')
            .style('opacity', 0)
            .text(`${average.toFixed(2)}`)
            .transition()
            .duration(1000)
            .style('opacity', 1);

        svg.append('text')
            .attr('transform', 'translate(100, 50)')
            .attr('dy', '1.5em')
            .attr('text-anchor', 'middle')
            .attr('font-size', '40px')
            .style('opacity', 0)
            .text(stats[statKey])
            .transition()
            .duration(1000)
            .style('opacity', 1);
    } else {
        const arcGenerator = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        const pie = d3.pie()
            .value(100);

        const arcs = svg.selectAll('.arc')
            .data(pie([average, 100 - average]))
            .enter().append('g')
            .attr('class', 'arc')
            .attr('transform', 'translate(200, 200)');

        arcs.append('path')
            .attr('d', arcGenerator)
            .attr('fill', '#d3d3d3')
            .transition()
            .duration(1000)
            .attrTween('d', function () {
                const interpolate = d3.interpolate({startAngle: 0, endAngle: 0}, {
                    startAngle: 0,
                    endAngle: (100 / 100) * 2 * Math.PI
                });
                return function (t) {
                    return arcGenerator(interpolate(t));
                };
            });

        arcs.append('path')
            .attr('d', arcGenerator.cornerRadius(10))
            .attr('fill', 'url(#gradient)')
            .transition()
            .duration(1500)
            .attrTween('d', function () {
                const interpolate = d3.interpolate({startAngle: 0, endAngle: 0}, {
                    startAngle: 0,
                    endAngle: (average / 100) * 2 * Math.PI
                });
                return function (t) {
                    return arcGenerator(interpolate(t));
                };
            });

        svg.append('text')
            .attr('transform', 'translate(200, 30)')
            .attr('dy', '0.35em')
            .attr('text-anchor', 'middle')
            .attr('font-size', '30px')
            .style('opacity', 0)
            .text(stats[statKey])
            .transition()
            .duration(1000)
            .style('opacity', 1);

        svg.append('text')
            .attr('transform', 'translate(200, 200)')
            .attr('dy', '0.35em')
            .attr('text-anchor', 'middle')
            .attr('font-size', '40px')
            .style('opacity', 0)
            .text(`${average.toFixed(2)}%`)
            .transition()
            .duration(1000)
            .style('opacity', 1);
    }
}