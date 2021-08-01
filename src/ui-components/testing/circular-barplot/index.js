import React, { Component } from 'react'
import * as d3 from 'd3'
import './circular-barplot.css'

export default class CircularPlotView extends Component {

    render() {
        console.log('Circulat chart Chart', this.props.worldDataProp)
        let filterDataset = [];
        let countryList = [];
        this.props.worldDataProp.forEach(item => {
            let worldObj = {
                'deaths': item.deathsPerOneMillion,
                'cases': item.casesPerOneMillion,
                'active': item.activePerOneMillion,
                'recovered': item.recoveredPerOneMillion,
                'continent': item.continent,
                'country': item.country,
                'population': item.population
            }
            filterDataset.push(worldObj);
            countryList.push(item.country);
        })

        filterDataset = filterDataset.sort((a, b) => b.active - a.active).slice(0, 22);
        console.log(filterDataset)

        d3.selectAll('.circular-bar-plot > *').remove();

        // set the dimensions and margins of the graph
        const margin = { top: 70, right: 60, bottom: 50, left: 50 },
            width = this.props.width - margin.left - margin.right,
            height = this.props.height - margin.top - margin.bottom;

        const svg = d3.select(".circular-bar-plot")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Add X axis
        const x = d3.scaleLinear()
            .domain([0, d3.max(filterDataset, d => d.cases)])
            .range([0, width]);
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x));

        // Add Y axis
        const y = d3.scaleLinear()
            .domain([0, d3.max(filterDataset, d => d.active) + 20000])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Add a scale for bubble size
        const z = d3.scaleLinear()
            .domain([d3.min(filterDataset, d => d.population), d3.max(filterDataset, d => d.population)])
            .range([d3.min(filterDataset, d => d.recovered), d3.max(filterDataset, d => d.recovered)]);


        // Add a scale for bubble color
        const myColor = d3.scaleOrdinal()
            .domain(countryList)
            .range(d3.schemeSet2);

        // -1- Create a tooltip div that is hidden by default:
        const tooltip = d3.select(".circular-bar-plot")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip-plot");

        // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
        const showTooltip = function (event, d) {
            console.log("Tooltip", d);
            tooltip
                .transition()
                .duration(200)
            tooltip
                .style("opacity", 1)
                .html("Country: " + d.country)
                .style("left", (event.x) / 2 + "px")
                .style("top", (event.y) / 2 + "px")
        }
        const moveTooltip = function (event, d) {
            tooltip
                .style("left", (event.x) / 2 + "px")
                .style("top", (event.y) / 2 + 30 + "px")
        }
        const hideTooltip = function (event, d) {
            tooltip
                .transition()
                .duration(200)
                .style("opacity", 0)
        }

        // Add dots
        svg.append('g')
            .selectAll("dot")
            .data(filterDataset)
            .join("circle")
            .attr("class", "bubbles")
            .attr("cx", d => x(d.cases))
            .attr("cy", d => y(d.active))
            .attr("r", d => z((d.recovered)))
            .style("fill", d => myColor(d.country))
            .on("mouseover", showTooltip)
            .on("mousemove", moveTooltip)
            .on("mouseleave", hideTooltip)



        return (
            <div id='circular-plot-view' className='pane' >
                <div className='header'>Circular Bubble View </div>
                <div>
                    <div className='circular-bar-plot' />
                </div>
            </div>
        )
    }
}
