
export function createCamembert(startYearSelected, endYearSelected, data) {
    const mvpData = data.filter(d => d.year >= startYearSelected && d.year <= endYearSelected && d.player !== null);
    const totalTeams = mvpData.length;
    const championshipWins = mvpData.filter(d => d.teamWonChampionship).length;
    const noChampionshipWins = totalTeams - championshipWins;

    console.log('startYearSelected', startYearSelected);
    console.log('endYearSelected', endYearSelected);
    console.log('totalTeams', totalTeams);
    console.log('championshipWins', championshipWins);
    console.log('noChampionshipWins', noChampionshipWins);

    const dataset = [
        { label: "Victoire avec MVP", value: championshipWins },
        { label: "Défaite avec MVP", value: noChampionshipWins },
    ];

    const width = 600;
    const height = 600;
    const radius = Math.min(width, height) / 2;
    const innerRadius = radius * 0.02;

    const color = d3.scaleOrdinal()
        .domain(dataset.map(d => d.label))
        .range(["#5cb7e9", "#fc0a2c"]);

    let svg = d3.select('#camembert').select('svg');

    if (svg.empty()) {
        svg = d3.select('#camembert')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', `0 0 ${width} ${height}`)
            .append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2}) scale(0.8)`);
    } else {
        svg.select('g')
            .attr('transform', `translate(${width / 2}, ${height / 2}) scale(0.8)`);
    }

    const pie = d3.pie()
        .value(d => d.value)
        .padAngle(0.05);

    const data_ready = pie(dataset);

    const arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(radius)
        .cornerRadius(5);

    const paths = svg.selectAll('path')
        .data(data_ready);

    paths.enter().append('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data.label))
        .attr('stroke', '#fff')
        .attr('stroke-width', '2px')
        .style('filter', 'url(#drop-shadow)')
        .merge(paths)
        .transition()
        .duration(1000)
        .attrTween('d', function (d) {
            const interpolate = d3.interpolate(this._current || {startAngle: 0, endAngle: 0}, d);
            this._current = interpolate(1);
            return function (t) {
                return arc(interpolate(t));
            };
        });

    paths.exit().remove();

    const texts = svg.selectAll('text.label')
        .data(data_ready);

    texts.enter().append('text')
        .attr('class', 'label')
        .text(d => `${d.data.label}`)
        .attr('transform', d => `translate(${arc.centroid(d)[0]}, ${arc.centroid(d)[1] - 20})`)
        .style('text-anchor', 'middle')
        .style('font-size', '30px')
        .style('opacity', 0)
        .merge(texts)
        .transition()
        .duration(1000)
        .style('opacity', 1)
        .attr('transform', d => `translate(${arc.centroid(d)[0]}, ${arc.centroid(d)[1] - 20})`)
        .text(d => `${d.data.label}`);

    texts.exit().remove();

    const percentageTexts = svg.selectAll('text.percentage-text')
        .data(data_ready);

    percentageTexts.enter().append('text')
        .attr('class', 'percentage-text')
        .text(d => `${((d.data.value / totalTeams) * 100).toFixed(1)}%`)
        .attr('transform', d => `translate(${arc.centroid(d)[0]}, ${arc.centroid(d)[1] + 30})`)
        .style('text-anchor', 'middle')
        .style('font-size', '40px')
        .style('opacity', 0)
        .merge(percentageTexts)
        .transition()
        .duration(1000)
        .style('opacity', 1)
        .attr('transform', d => `translate(${arc.centroid(d)[0]}, ${arc.centroid(d)[1] + 30})`)
        .text(d => `${((d.data.value / totalTeams) * 100).toFixed(1)}%`);

    percentageTexts.exit().remove();

    const defs = svg.append('defs');
    const filter = defs.append('filter')
        .attr('id', 'drop-shadow')
        .attr('height', '130%');

    filter.append('feGaussianBlur')
        .attr('in', 'SourceAlpha')
        .attr('stdDeviation', 3)
        .attr('result', 'blur');

    filter.append('feOffset')
        .attr('in', 'blur')
        .attr('dx', 3)
        .attr('dy', 3)
        .attr('result', 'offsetBlur');

    const feMerge = filter.append('feMerge');

    feMerge.append('feMergeNode')
        .attr('in', 'offsetBlur');
    feMerge.append('feMergeNode')
        .attr('in', 'SourceGraphic');

    svg.append('text')
        .attr('x', 0)
        .attr('y', -height / 2 - 30)
        .attr('text-anchor', 'middle')
        .style('font-size', '40px')
        .text('Répartition des victoires et défaites avec MVP');
}