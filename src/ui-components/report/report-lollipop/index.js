import React, { Component } from 'react'
import * as d3 from 'd3'
import './report-lollipop.css'

export default class ReportLollipopChart extends Component {



    render() {
        let reportData = this.props.reportData;
        console.log("Report Chart View", reportData)
        const symptomsData = this.props.reportData;
        console.log("Symptoms Data",symptomsData)
        const dataset = [];
        if (symptomsData !== undefined) {
            delete symptomsData.total_patients;
            delete symptomsData.symptoms;
            const keys = Object.keys(symptomsData);
            console.log("Keys",keys);
            keys.forEach((key) => {
                let data = {
                    'symptom': key,
                    'count': symptomsData[key]
                }
                dataset.push(data);
            });
            console.log("Report Lollipop Set",dataset);
        }

        // set the dimensions and margins of the graph
        var margin = { top: 20, right: 30, bottom: 100, left: 60 },
            width = this.props.width - margin.left - margin.right,
            height = this.props.height - margin.top - margin.bottom;

        d3.select(".lollipop-report-chart > *").remove()

        // append the svg object to the body of the page
        var svg = d3.select(".lollipop-report-chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // X axis
        const x = d3.scaleBand()
            .range([0, width])
            .domain(dataset.map(function (d) { return d.symptom; }))
            .padding(1);
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        // Add Y axis
        const y = d3.scaleLinear()
            .domain([0, d3.max(dataset, d => d.count)])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y))
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 0 - margin.left)
            .attr('x', 0 - (height / 2))
            .attr('dy', '2em')
            .style('text-anchor', 'middle')
            .style('fill', '#141414')
            .text('Symptoms');

        // Lines
        svg.selectAll("myline")
            .data(dataset)
            .enter()
            .append("line")
            .attr("x1", function (d) { return x(d.symptom); })
            .attr("x2", function (d) { return x(d.symptom); })
            .attr("y1", function (d) { return y(d.count); })
            .attr("y2", y(0))
            .attr("stroke", "grey")
            .transition()
            .duration(2000)

        // Circles
        svg.selectAll("mycircle")
            .data(dataset)
            .join("circle")
            .attr("cx", function (d) { return x(d.symptom); })
            .attr("cy", function (d) { return y(d.count); })
            .attr("r", "4")
            .style("fill", "#0CED1")
            .attr("stroke", "blue")



        return (
            <div id='report-lollipop-view' className='pane'>
                <div className='header'>Symptoms</div>
                <div className='lollipop-report-chart' ></div>
            </div>
        )
    }
}
