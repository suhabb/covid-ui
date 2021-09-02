import React, { Component } from 'react';
import './treemap-vaccine.css';
import * as d3 from 'd3'
import mockData from './treemap-data'
import data from './treemap-data';

export default class TreeMapView extends Component {

    state = {
        manufacturerData: this.props.manufacturerData
    }

    render() {

        let manufacturerData = this.props.manufacturerData;
        if (manufacturerData === undefined || (Object.keys(manufacturerData).length === 0)) {
            manufacturerData = mockData
        }

        const dataset = manufacturerData;
        const children =[];
        dataset.vaccineCompanies.forEach(item=>{
            var obj = {};
            obj.vaccine = item.vaccine;
            obj.totalVaccinations = item.totalVaccinations
            children.push(obj);
        });
        dataset.children = children;
        
        const root = d3.hierarchy(dataset)
            .sum((d) => {
                return d.totalVaccinations
            });

        d3.select('.treemap-view-chart > *').remove();

        const margin = { top: 10, right: 10, bottom: 30, left: 80 },
            width = this.props.width - margin.left - margin.right,
            height = this.props.height - margin.top - margin.bottom;

        var svg = d3.select(".treemap-view-chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");;

        d3.treemap()
            .size([width, height])
            .padding(4)
            (root)

        svg
            .selectAll("rect")
            .data(root.leaves())
            .enter()
            .append("rect")
            .attr('x', function (d) { return d.x0; })
            .attr('y', function (d) { return d.y0; })
            .attr('width', function (d) { return d.x1 - d.x0; })
            .attr('height', function (d) { return d.y1 - d.y0; })
            .style("stroke", "black")
            .style("fill", "#69b3a2");

        // and to add the text labels
        svg
            .selectAll("text")
            .data(root.leaves())
            .enter()
            .append("text")
            .attr("x", function (d) { return d.x0 + 10 })
            .attr("y", function (d) { return d.y0 + 20 })
            .text(function (d) { return d.data.vaccine })
            .attr("font-size", "15px")
            .attr("fill", "white")


        return (

            <div id='treemap-view' className='pane' >
                <div className='header'>Treemap Chart : {manufacturerData.location}</div>
                <div>
                    <div className='treemap-view-chart' />
                </div>
            </div>
        )
    }
}

