import * as d3 from 'd3';
import './style.css';

const AreaView = (props) => {

    const countryData = props.data;
    console.log('areaview data:', props)
    let dataset = [];
    countryData.area_data = [];
    if (countryData.data.length > 10) {
        countryData.area_data = countryData.data.slice(Math.max(countryData.data.length - 10, 0))
    }

    countryData.area_data.forEach(item => {
        let vaccineData = {
            'daily_vaccinations': item.daily_vaccinations,
            'vaccine_date': item.date
        }
        dataset.push(vaccineData);
    });
    dataset.forEach(function (d) {
        d.date = d3.timeParse('%Y-%m-%d')(d.vaccine_date);
    });

    d3.select('.vaccine-areachart  > *').remove();

    const margin = { top: 20, right: 20, bottom: 130, left: 70 }
    const graphWidth = props.width - margin.left - margin.right;;
    const graphHeight = props.height - margin.top - margin.bottom;

    let svg = d3.select('.vaccine-areachart')
        .append('svg')
        .attr('width', graphWidth + margin.left + margin.right)
        .attr('height', graphHeight + margin.top + margin.bottom)
        .append('g')
        .attr('transform',
            'translate(' + margin.left + ',' + margin.top + ')');

    dataset.forEach(function (d) {
        d.vaccine_date = d3.timeParse('%Y-%m-%d')(d.vaccine_date);
    });


    // Add X axis --> it is a date format


    let x = d3.scaleTime()
        .domain(d3.extent(dataset, d => d.vaccine_date))
        .range([0, graphWidth]);

    const xAxis = d3.axisBottom(x)
        .ticks(6)
        .tickFormat(d3.timeFormat('%b %d'));

    svg.append('g')
        .attr('transform', `translate(0,${graphHeight})`)
        .call(xAxis);

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, d3.max(dataset, d => d.daily_vaccinations)])
        .range([graphHeight, 0]);
    const yAxis = d3.axisLeft(y)
        .tickFormat(d => {
            return numFormatter(d);
        });
    svg.append('g')
        .call(yAxis)
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - (graphHeight / 2))
        .attr('dy', '2em')
        .style('text-anchor', 'middle')
        .style('fill', '#141414')
        .text('Daily Vaccinations');

    // Add the line
    let curve = d3.curveLinear;

    svg.append('path')
        .datum(dataset)
        .attr('fill', '#cce5df')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1.5)
        .attr('d', d3.area()
            .curve(curve)
            .x(d => x(d.vaccine_date))
            .y0(y(0))
            .y1(d => y(d.daily_vaccinations))
        );
}


const numFormatter = (num) => {
    if (num > 999 && num < 1000000) {
        return (num / 1000).toFixed(0) + 'K'; // convert to K for number from > 1000 < 1 million 
    } else if (num > 1000000) {
        return (num / 1000000).toFixed(0) + 'M'; // convert to M for number from > 1 million 
    } else if (num < 900) {
        return num; // if value < 1000, nothing to do
    }
}

export default AreaView;