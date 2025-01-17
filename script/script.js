
// Load JSON data from the data directory
d3.json('data/data.json').then(data => {
    const mvpData = data;

    const totalTeams = mvpData.length;
    const championshipWins = mvpData.filter(d => d.teamWonChampionship).length;
    const noChampionshipWins = totalTeams - championshipWins;

    const dataset = [
        { label: "Victoire avec MVP", value: championshipWins },
        { label: "Défaite avec MVP", value: noChampionshipWins },
    ];

    const width = 350;
    const height = 350;
    const radius = Math.min(width, height) / 2;

    const color = d3.scaleOrdinal()
        .domain(dataset.map(d => d.label))
        .range(["#5cb7e9", "#fc0a2c"]);

    const svg = d3.select('#camembert')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const pie = d3.pie()
        .value(d => d.value);

    const data_ready = pie(dataset);

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    svg.selectAll('path')
        .data(data_ready)
        .join('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data.label))

    svg.selectAll('text')
        .data(data_ready)
        .join('text')
        .text(d => `${d.data.label}: ${((d.data.value / totalTeams) * 100).toFixed(1)}%`)
        .attr('transform', d => `translate(${arc.centroid(d)})`)
        .style('text-anchor', 'middle')
        .style('font-size', '14px');
}).catch(error => {
    console.error('Error loading the JSON data:', error);
});
