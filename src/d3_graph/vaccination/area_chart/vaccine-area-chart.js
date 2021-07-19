import * as d3 from 'd3';
import './style.css';

const AreaView = (props) => {

    const countryData = props.data;
    console.log('areaview data:', props)
    let dataset = [];
    if(countryData.data.length > 10){
     countryData.data =  countryData.data.slice(Math.max(countryData.data.length - 10, 0))
    }
    countryData.data.forEach(item => {
        let vaccineData = {
            'daily_vaccinations': item.daily_vaccinations,
            'date': item.date
        }
        dataset.push(vaccineData)
    });
    console.log('Dataset', dataset);

    d3.select('.vaccine-areachart  > *').remove();
    const margin = { top: 20, right: 20, bottom: 130, left: 70 }
    const graphWidth = props.width - margin.left - margin.right;;
    const graphHeight = props.height - margin.top - margin.bottom;

    const svg = d3.select('.vaccine-areachart ')
        .append('svg')
        .attr('width', graphWidth + margin.left + margin.right)
        .attr('height', graphHeight + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

  // Add X axis --> it is a date format
    let x = d3.scaleTime()
        .domain(d3.extent(dataset,  (d) => new Date(d.date)))
        .range([0, graphWidth]);
    svg.append("g")
        .attr("transform", `translate(0,${graphHeight})`)
        .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, d3.max(dataset, d => d.daily_vaccinations)])
        .range([graphHeight, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

      svg.append('g')
          .call(d3.axisLeft(y)
              .tickFormat(d => {
                  return numFormatter(d.daily_vaccinations);
              }))
          .append('text')
          .attr('transform', 'rotate(-90)')
          .attr('y', 5 - margin.left)
          .attr('x', 0 - (graphHeight / 2))
          .attr('dy', '1em')
          .style('text-anchor', 'middle')
          .style('fill', '#141414')
          .text('Daily Vaccination');
  
  
      // Add the line
      svg.append('path')
          .datum(dataset)
          .attr('fill', '#cce5df')
          .attr('stroke', 'steelblue')
          .attr('stroke-width', 1.5)
          .attr('d', d3.area()
              .x(function (d) { return x(new Date(d.date)) })
              .y0(y(0))
              .y1(function (d) { return y(d.daily_vaccinations) })
          )
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