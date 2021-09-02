import React, { Component } from 'react'
import * as d3 from 'd3'
import './donut-chart.css'
import mockData from '../../../data/bar-test'

export default class DonutChartView extends Component {

    render() {
        let covidTestingData = this.props.covidTestingData;
        if (covidTestingData === undefined || (Object.keys(covidTestingData).length === 0)) {
            covidTestingData = mockData;
        }
        let data = {
            'cases': covidTestingData.cases,
            'deaths': covidTestingData.deaths,
            'recovered': covidTestingData.recovered,
            'active': covidTestingData.active
        };
    
        const width = this.props.width,
        height = this.props.height,
        margin = 30
        
        const radius = Math.min(width, height) / 2 - margin
        d3.select('.donut-test-chart > *').remove();

        const svg = d3.select(".donut-test-chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);

      
        const color = d3.scaleOrdinal()
            .domain(Object.keys(data))
            .range(d3.schemeDark2);

      
        const pie = d3.pie()
            .sort(null) 
            .value(d => d[1])
        const dataset = pie(Object.entries(data))


        const arc = d3.arc()
            .innerRadius(radius * 0.5)        
            .outerRadius(radius * 0.8)

        // this arc for labels
        const outerArc = d3.arc()
            .innerRadius(radius * 0.9)
            .outerRadius(radius * 0.9)

        svg
            .selectAll('allSlices')
            .data(dataset)
            .join('path')
            .attr('d', arc)
            .attr('fill', d => color(d.data[1]))
            .attr("stroke", "white")
            .style("stroke-width", "2px")
            .style("opacity", 0.7)

        // Add the lines
        svg
            .selectAll('allPolylines')
            .data(dataset)
            .join('polyline')
            .attr("stroke", "black")
            .style("fill", "none")
            .attr("stroke-width", 1)
            .attr('points', function (d) {
                const posA = arc.centroid(d) 
                const posB = outerArc.centroid(d) 
                const posC = outerArc.centroid(d); 
                const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 
                posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); 
                return [posA, posB, posC]
            })

        svg
            .selectAll('allLabels')
            .data(dataset)
            .join('text')
            .text(d => d.data[0])
            .attr('transform', function (d) {
                const pos = outerArc.centroid(d);
                const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
                return `translate(${pos})`;
            })
            .style('text-anchor', function (d) {
                const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                return (midangle < Math.PI ? 'start' : 'end')
            })

        return (
            <div id='donut-chart-view' className='pane' >
                <div className='header'>Donut Chart  : {covidTestingData.country} </div>
                <div>
                    <div className='donut-test-chart' />
                </div>
            </div>
        )
    }
}