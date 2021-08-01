import React, { Component } from 'react';
import mockLineData from '../../../data/line-test'
import * as d3 from 'd3'
import './line-graph.css'

class LineTestView extends Component {

    render() {

        let covidTimelineData = this.props.timelineData;
        console.log("Covid Line View", covidTimelineData)
        let dataset = [];
        if (covidTimelineData === undefined || (Object.keys(covidTimelineData).length === 0)) {
            covidTimelineData = mockLineData;
            console.log("Mock Line Data", covidTimelineData)
        }
        let cases = covidTimelineData.timeline.cases;
        let recovered = covidTimelineData.timeline.recovered;
        let deaths = covidTimelineData.timeline.deaths;
        console.log("Cases", cases);
        cases.forEach(item => {
            item.date = new Date(item.date);
        })
        recovered.forEach(item => {
            item.date = new Date(item.date);
        })
        deaths.forEach(item => {
            item.date = new Date(item.date);
        })
        //  dataset.push(cases)
        // dataset.push(recovered)
        //dataset.push(deaths)
        console.log("Line Chart Dataset", cases)

        dataset.forEach(function (d) {
            d.forEach(item => {
                //  item.date = d3.timeParse('%Y-%m-%d')(item.date);
                // console.log("Line Data",item.date)
            })
        });

        d3.select('.testing-linechart  > *').remove();

        const margin = { top: 20, right: 20, bottom: 130, left: 70 }
        const graphWidth = this.props.width - margin.left - margin.right;;
        const graphHeight = this.props.height - margin.top - margin.bottom;

        let svg = d3.select('.testing-linechart')
            .append('svg')
            .attr('width', graphWidth + margin.left + margin.right)
            .attr('height', graphHeight + margin.top + margin.bottom)
            .append('g')
            .attr('transform',
                'translate(' + margin.left + ',' + margin.top + ')');


        let x = d3.scaleTime()
            .domain(d3.extent(cases, d => d.date))
            .range([0, graphWidth]);

        const xAxis = d3.axisBottom(x)
           // .ticks(6)
            .tickFormat(d3.timeFormat('%b %d'));

        svg.append('g')
            .attr('transform', `translate(0,${graphHeight})`)
            .call(xAxis);

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, d3.max(cases, d => d.value)])
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
            .text('People');


        svg.append('path')
            .datum(cases)
            .attr('fill', '#cce5df')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 1.5)
            .attr('d', d3.line()
                .x(d => x(d.date))
                .y(d => y(d.value))
            );
        
        svg.append('path')
            .datum(recovered)
            .attr('fill','red')
            .attr('stroke', 'red')
            .attr('stroke-width', 1.5)
            .attr('d', d3.line()
                .x(d => x(d.date))
                .y(d => y(d.value))
            );

        svg.append('path')
            .datum(deaths)
            .attr('fill', 'blue')
            .attr('stroke', 'blue')
            .attr('stroke-width', 1.5)
            .attr('d', d3.line()
                .x(d => x(d.date))
                .y(d => y(d.value))
            );

        return (
            <div id='line-view' className='pane'>
                <div className='header'>Line Chart : {covidTimelineData.country}</div>
                <div>
                    <div className='testing-linechart' />
                </div>
            </div>
        );
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

export default LineTestView;