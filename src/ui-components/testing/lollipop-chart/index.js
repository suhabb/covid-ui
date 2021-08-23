import React, { Component } from 'react'
import * as d3 from 'd3'
import './lollipop-chart.css'
import mockData from '../../../data/line-test'

export default class LollipopChartView extends Component {

    render() {

        let covidTimelineData = this.props.timelineData;

        if (covidTimelineData === undefined || (Object.keys(covidTimelineData).length === 0)) {
            covidTimelineData = mockData;
        }
        let covidDeathList = covidTimelineData.timeline.deaths;
        let dataset = covidDeathList.slice(Math.max(covidDeathList.length - 8, 0));

        dataset.forEach(item => {
            item.date = new Date(item.date);
        })
        dataset = dataset.sort((a, b) => a.date - b.date)

        // set the dimensions and margins of the graph
        var margin = { top: 20, right: 30, bottom: 100, left: 60 },
            width = this.props.width - margin.left - margin.right,
            height = this.props.height - margin.top - margin.bottom;

        d3.select(".lollipop-testing-chart > *").remove()

        // append the svg object to the body of the page
        var svg = d3.select(".lollipop-testing-chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // X axis
        const x = d3.scaleBand()
            .range([0, width])
            .domain(dataset.map(function (d) { return d.date; }))
            .padding(1);
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x)
                .ticks(8)
                .tickFormat(d3.timeFormat('%b %d')))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        // Add Y axis
        const y = d3.scaleLinear()
            .domain([0, d3.max(dataset, d => d.value)])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y)
                .ticks(6)
                .tickFormat(d => {
                    return numFormatter(d);
                }))
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 0 - margin.left)
            .attr('x', 0 - (height / 2))
            .attr('dy', '2em')
            .style('text-anchor', 'middle')
            .style('fill', '#141414')
            .text('Deaths');;

        // Lines
        svg.selectAll("myline")
            .data(dataset)
            .enter()
            .append("line")
            .attr("x1", function (d) { return x(d.date); })
            .attr("x2", function (d) { return x(d.date); })
            .attr("y1", function (d) { return y(d.value); })
            .attr("y2", y(0))
            .attr("stroke", "grey")
            .transition()
            .duration(2000)

        // Circles
        svg.selectAll("mycircle")
            .data(dataset)
            .join("circle")
            .attr("cx", function (d) { return x(d.date); })
            .attr("cy", function (d) { return y(d.value); })
            .attr("r", "4")
            .style("fill", "#0CED1")
            .attr("stroke", "blue")


        return (
            <div id='lollipop-chart-view' className='pane'>
                <div className='header'>Country:{covidTimelineData.country}</div>
                <div className='lollipop-testing-chart' ></div>
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
