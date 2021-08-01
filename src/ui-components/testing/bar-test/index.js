import React, { Component } from 'react'
import * as d3 from 'd3'
import data from '../../../data/bar-test'

export default class BarTestView extends Component {

    render() {
        let covidTestingData = this.props.covidTestingData;
        if (covidTestingData === undefined || (Object.keys(covidTestingData).length === 0)) {
            covidTestingData = data;
        }
        let covidBarChartData = {
            'cases': covidTestingData.cases,
            'deaths': covidTestingData.deaths,
            'active': covidTestingData.active,
            'recovered': covidTestingData.recovered,
            'critical': covidTestingData.critical
        };

        let dataset = [];
        if (covidBarChartData !== undefined) {
            Object.keys(covidBarChartData).forEach(function (key) {
                let covidStats = {
                    'stats': key,
                    'value': covidBarChartData[key]
                }
                dataset.push(covidStats)
            });
        }

        dataset.push(covidTestingData)
        d3.select('.testing-barchart > *').remove();

        const margin = { top: 20, right: 20, bottom: 30, left: 60 };
        const graphWidth = this.props.width - margin.left - margin.right;
        const graphHeight = this.props.height - margin.top - margin.bottom;


        let svg = d3.select('.testing-barchart')
            .append('svg')
            .attr('width', graphWidth + margin.left + margin.right)
            .attr('height', graphHeight + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        let x = d3.scaleBand()
            .domain(dataset.map(item => item.stats))
            .range([0, graphWidth])
            .paddingInner(0.5)
            .paddingOuter(0.5);

        let y = d3.scaleLinear()
            .domain([d3.min(dataset, d => d.value), d3.max(dataset, d => d.value)])
            .range([graphHeight, 0]);

        svg.selectAll('.bar')
            .data(dataset)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.stats))
            .attr('width', x.bandwidth())
            .attr('y', d => y(d.value))
            .attr('height', d => graphHeight - y(d.value));

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
            .style('fill', '#141414')
            .text('People');

        return (

            <div id='bar-view' className='pane'>
                <div className='header'>Bar Chart : {covidTestingData.country}</div>
                <div>
                    <div className='testing-barchart' />
                </div>
            </div>
        )
    }
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