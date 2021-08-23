import React, { Component } from 'react'
import * as d3 from 'd3'
import './pie-report.css'
import mockData from './report-pie-data'

export default class PieReportChart extends Component {

    render() {

        let data = this.props.reportData;
        if (data !== undefined) {
            delete data.total_patients;
            delete data.symptoms;
            data = mockData

        }

        // set the dimensions and margins of the graph
        const margin = { top: 40, right:40, bottom: 20, left: 100 };
        const width = this.props.width - margin.left - margin.right;
        const height = this.props.height - margin.top - margin.bottom;

        // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
        let radius = Math.min(width, height) / 2;
        d3.selectAll('.report-pie-chart > *').remove();


        var svg = d3.select(".report-pie-chart")
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + (width / 2 + margin.left) + ',' + (height / 2 + margin.top) + ')');

        // set the color scale
        const color = d3.scaleOrdinal()
            .range(d3.schemeSet2);

        // Compute the position of each group on the pie:
        const pie = d3.pie()
            .value(function (d) { return d[1] })
        const data_ready = pie(Object.entries(data))
        // Now I know that group A goes from 0 degrees to x degrees and so on.

        // shape helper to build arcs:
        const arcGenerator = d3.arc()
            .innerRadius(0)
            .outerRadius(radius)

        // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
        svg
            .selectAll('mySlices')
            .data(data_ready)
            .join('path')
            .attr('d', arcGenerator)
            .attr('fill', function (d) { return (color(d.data[0])) })
            .attr("stroke", "black")
            .style("stroke-width", "2px")
            .style("opacity", 0.7)

        // Now add the annotation. Use the centroid method to get the best coordinates
        svg
            .selectAll('mySlices')
            .data(data_ready)
            .join('text')
            .text(function (d) { return d.data[0] })
            .attr("transform", function (d) { return `translate(${arcGenerator.centroid(d)})` })
            .style("text-anchor", "middle")
            .style("font-size", 17)

        return (
            <div id='report-pie-view' className='pane'>
                <div className='header'> Symptoms Pie Chart</div>
                <div>
                    <div className='report-pie-chart' />
                </div>
            </div>
        )
    }
}