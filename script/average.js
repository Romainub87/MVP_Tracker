export function updateAverageChart(startYearSelected, endYearSelected, statKey, data, stats) {
    const validData = data.filter(player => player.year >= startYearSelected && player.year <= endYearSelected && player[statKey] != null);
    const average = statKey.includes('%') ? (validData.reduce((acc, player) => acc + player[statKey], 0) / validData.length) * 100 : validData.reduce((acc, player) => acc + player[statKey], 0) / validData.length;

    let svg = d3.select(statKey.includes('%') ? '#chart' : '#subcharts').selectAll('svg').filter(function() { return this.classList.contains(statKey); });
    if (svg.empty()) {
        svg = d3.select(statKey.includes('%') ? '#chart' : '#subcharts').append('svg')
            .attr('class', statKey)
            .attr('width', statKey.includes('%') ? 400 : 300)
            .attr('height', statKey.includes('%') ? 400 : 100)
            .attr('viewBox', statKey.includes('%') ? '0 0 400 400' : '0 0 200 200')
            .attr('preserveAspectRatio', 'xMidYMid meet');
    }

    const width = statKey.includes('%') ? 400 : 200;
    const height = width / 2;
    const outerRadius = height / 1.5;
    const innerRadius = outerRadius * 0.75;

    const gradient = svg.select('defs linearGradient');
    if (gradient.empty()) {
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
    }

    if (!statKey.includes('%')) {
        let text = svg.select('text.average-' + statKey);
        if (text.empty()) {
            text = svg.append('text')
                .attr('class', 'average average-' + statKey)
                .attr('transform', 'translate(100, 60)')
                .attr('text-anchor', 'middle')
                .attr('font-size', '4.5em')
                .style('opacity', 0);
        } else {
            text.selectAll('tspan').remove();
        }
        text.transition()
            .duration(1000)
            .style('opacity', 1)
            .tween('text', function() {
                const interpolate = d3.interpolateNumber(+this.textContent, average.toFixed(2));
                return function(t) {
                    this.textContent = interpolate(t).toFixed(2);
                };
            });

        let subtext = svg.select('text.subtext');
        if (subtext.empty()) {
            subtext = svg.append('text')
                .attr('class', 'subtext')
                .attr('transform', 'translate(100, 50)')
                .attr('dy', '1.5em')
                .attr('text-anchor', 'middle')
                .attr('font-size', '2.5em')
                .style('opacity', 0);
        }
        subtext.transition()
            .duration(1000)
            .style('opacity', 1)
            .tween('text', function() {
                const interpolate = d3.interpolateString(this.textContent, stats[statKey]);
                return function(t) {
                    this.textContent = interpolate(t);
                };
            });
    } else {
        const arcGenerator = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        const pie = d3.pie()
            .value(100);

        const arcs = svg.selectAll('.arc')
            .data(pie([average, 100 - average]));

        arcs.exit().remove();

        svg.selectAll('.arcBackground').remove();

        const arcBackground = arcs.enter().append('g')
            .attr('class', 'arcBackground')
            .attr('transform', 'translate(200, 200)')
            .append('path')
            .attr('d', arcGenerator)
            .attr('fill', '#d3d3d3');

        arcBackground
            .attr('d', arcGenerator({ startAngle: 0, endAngle: 0 }))
            .transition()
            .duration(1000)
            .attrTween('d', function () {
                const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, {
                    startAngle: 0,
                    endAngle: (100 / 100) * 2 * Math.PI
                });
                return function (t) {
                    return arcGenerator(interpolate(t));
                };
            });

        svg.selectAll('.arcForeground').remove();

        const arcForeground = arcs.enter().append('g')
            .attr('class', 'arcForeground')
            .attr('transform', 'translate(200, 200)')
            .append('path')
            .attr('d', arcGenerator.cornerRadius(20))
            .attr('fill', 'url(#gradient)')
            .merge(arcs.select('.arcForeground path'));

        arcForeground
            .attr('d', arcGenerator({ startAngle: 0, endAngle: 0 }))
            .transition()
            .duration(1250)
            .attrTween('d', function () {
                const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, {
                    startAngle: 0,
                    endAngle: (average / 100) * 2 * Math.PI
                });
                return function (t) {
                    return arcGenerator(interpolate(t));
                };
            });

        arcs.exit().remove();

        let text = svg.select('text.average');
        if (text.empty()) {
            text = svg.append('text')
                .attr('class', 'average')
                .attr('transform', 'translate(200, 200)')
                .attr('dy', '0.35em')
                .attr('text-anchor', 'middle')
                .attr('font-size', '40px')
                .style('opacity', 0);
        }
        text.text(`${average.toFixed(2)}%`)
            .transition()
            .duration(1000)
            .style('opacity', 1);

        let subtext = svg.select('text.subtext');
        if (subtext.empty()) {
            subtext = svg.append('text')
                .attr('class', 'subtext')
                .attr('transform', 'translate(200, 30)')
                .attr('dy', '0.35em')
                .attr('text-anchor', 'middle')
                .attr('font-size', '30px')
                .style('opacity', 0);
        }
        subtext.text(stats[statKey])
            .transition()
            .duration(1000)
            .style('opacity', 1);
    }
}