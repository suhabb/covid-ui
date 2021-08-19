import React, { Component } from 'react'
import * as d3 from 'd3'
import './report-linear-bar.css'

export default class ReportLinearBarChart extends Component {

    render() {
        console.log('Report Chart', this.props.reportData)
        const symptomsData = this.props.reportData;
        console.log("Symptoms Data",symptomsData)
        const dataset = [];
        if (symptomsData !== undefined) {
            delete symptomsData.total_patients;
            delete symptomsData.symptoms;
            const keys = Object.keys(symptomsData);
            console.log("Keys",keys);
            keys.forEach((key, index) => {
                let data = {
                    'symptom': key,
                    'count': symptomsData[key]
                }
                dataset.push(data);
            });
            console.log("Report Data Set",dataset);
        }
        d3.select('.report-linear-barchart > *').remove();

        // set the dimensions and margins of the graph
        var margin = { top: 20, right: 30, bottom: 130, left: 80 },
            width = this.props.width - margin.left - margin.right,
            height = this.props.height - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select(".report-linear-barchart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


        // Add X axis
        var x = d3.scaleLinear()
            .domain([0, d3.max(dataset, d => d.count)])
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x)
                .ticks(10))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        // Y axis
        var y = d3.scaleBand()
            .range([0, height])
            .domain(dataset.map(function (d) { return d.symptom; }))
            .padding(.1);
        svg.append("g")
            .call(d3.axisLeft(y))

        //Bars
        svg.selectAll("myRect")
            .data(dataset)
            .enter()
            .append("rect")
            .transition() // <---- Here is the transition
            .duration(200)
            .attr("x", x(0))
            .attr("y", function (d) { return y(d.symptom); })
            .attr("width", function (d) { return x(d.count); })
            .attr("height", y.bandwidth())
            .attr("fill", "#e28743");


        return (
            <div id='report-linear-view' className='pane'>
                <div className='header'>Report Linear Chart </div>
                <div>
                    <div className='report-linear-barchart' />
                </div>
            </div>
        )
    }
}


