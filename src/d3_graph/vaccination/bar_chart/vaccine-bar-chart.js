import * as d3 from 'd3';
import './style.css';

const BarView = (props) => {

    const data = props.data;
    let dataset = [];
    data.vaccineCompanies.forEach(item => {
        let vaccineCompany = {
            'vaccine': item.vaccine,
            'totalVaccinations': item.totalVaccinations
        }
        dataset.push(vaccineCompany)
    });

    d3.select('.vaccine-barchart > *').remove();

var tooltip = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

    const margin = { top: 20, right: 20, bottom: 30, left: 60 };
    const graphWidth = props.width - margin.left - margin.right;
    const graphHeight = props.height - margin.top - margin.bottom;

    let svg = d3.select('.vaccine-barchart')
        .append('svg')
        .attr('width', graphWidth + margin.left + margin.right)
        .attr('height', graphHeight + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    let x = d3.scaleBand()
        .domain(dataset.map(item => item.vaccine))
        .range([0, graphWidth])
        .paddingInner(0.5)
        .paddingOuter(0.5);

    let y = d3.scaleLinear()
        .domain([0, d3.max(dataset, d => d.totalVaccinations)])
        .range([graphHeight, 0]);

    svg.selectAll('.bar')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('class', 'bar')
      //  .transition()
       // .duration(2000)
        .attr('x', d => x(d.vaccine))
        .attr('width', x.bandwidth())
        .attr('y', d => y(d.totalVaccinations))
        .attr('height', d => graphHeight - y(d.totalVaccinations))
        .on('mouseover', function(event,d) {		
            tooltip.transition()	
             //   .duration(500)			
                .style("opacity", .9);		
            tooltip.html("Total Vaccination:" + d.totalVaccinations + "<br/>")	
                .style("left", (event.pageX) + "px")		
                .style("top", (event.pageY - 28) + "px");	
            })					
        .on('mouseout', function(d) {		
            tooltip.transition()
              //  .duration(400)				
                .style("opacity", 0);	
        });;

    svg.append('g')
        .attr('transform', `translate(0, ${graphHeight})`)
        .call(d3.axisBottom(x));

    svg.append('g')
        .call(d3.axisLeft(y)
            .tickFormat(d => {
                return numFormatter(d);
            }))
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 0 - margin.left)
            .attr('x', 0 - (graphHeight / 2))
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .style('fill', '#141414' )
            .text('People');
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

export default BarView;