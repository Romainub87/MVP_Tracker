// script.js

// Load JSON data from the data directory
d3.json('data/data.json').then(data => {
    // Select the div element
    const container = d3.select('#chart');

    // Append the data as text
    container.append('pre')
        .text(JSON.stringify(data, null, 2));
}).catch(error => {
    console.error('Error loading the JSON data:', error);
});