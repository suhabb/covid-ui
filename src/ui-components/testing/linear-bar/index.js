import React, { Component } from 'react'
import * as d3 from 'd3'
import './linear-bar.css'

export default class LinearBarChart extends Component {

    render() {

        let filterDataset = [];
        this.props.worldDataProp.forEach(item => {
            let worldObj = {
                'country': item.country,
                'cases': item.cases
            }
            filterDataset.push(worldObj);
        })

        filterDataset = filterDataset.sort((a, b) => b.cases - a.cases).slice(0, 10);
        d3.select('.testing-linear-barchart > *').remove();

        // set the dimensions and margins of the graph
        var margin = { top: 20, right: 30, bottom: 130, left: 60 },
            width = this.props.width - margin.left - margin.right,
            height = this.props.height - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select(".testing-linear-barchart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


        // Add X axis
        var x = d3.scaleLinear()
            .domain([0, d3.max(filterDataset, d => d.cases)])
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x)
                .ticks(10)
                .tickFormat(d => numFormatter(d)))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        // Y axis
        var y = d3.scaleBand()
            .range([0, height])
            .domain(filterDataset.map(function (d) { return d.country; }))
            .padding(.1);
        svg.append("g")
            .call(d3.axisLeft(y))

        //Bars
        svg.selectAll("myRect")
            .data(filterDataset)
            .enter()
            .append("rect")
            .transition() // <---- Here is the transition
            .duration(200)
            .attr("x", x(0))
            .attr("y", function (d) { return y(d.country); })
            .attr("width", function (d) { return x(d.cases); })
            .attr("height", y.bandwidth())
            .attr("fill", "#e28743");


        return (
            <div id='linear-bar-view' className='pane'>
                <div className='header'>Linear Bar Chart : Top Countries Of Maximum Cases </div>
                <div>
                    <div className='testing-linear-barchart' />
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
