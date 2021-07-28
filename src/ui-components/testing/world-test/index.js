
import React from "react"
import { geoEqualEarth, geoPath } from "d3-geo"
import axios from 'axios'
import * as d3 from 'd3'
import './world-test.css'
import tsvData from './110m.tsv'
import { feature } from "topojson-client"

const projection = geoEqualEarth()
    .scale(160)
    .translate([800 / 2, 450 / 2])

const cities = [
    { name: "Tokyo", coordinates: [139.6917, 35.6895], population: 37843000 },
    { name: "Jakarta", coordinates: [106.8650, -6.1751], population: 30539000 },
    { name: "Delhi", coordinates: [77.1025, 28.7041], population: 24998000 },
    { name: "Manila", coordinates: [120.9842, 14.5995], population: 24123000 },
    { name: "Seoul", coordinates: [126.9780, 37.5665], population: 23480000 },
    { name: "Shanghai", coordinates: [121.4737, 31.2304], population: 23416000 },
    { name: "Karachi", coordinates: [67.0099, 24.8615], population: 22123000 },
    { name: "Beijing", coordinates: [116.4074, 39.9042], population: 21009000 },
    { name: "New York", coordinates: [-74.0059, 40.7128], population: 20630000 },
    { name: "Guangzhou", coordinates: [113.2644, 23.1291], population: 20597000 },
    { name: "Sao Paulo", coordinates: [-46.6333, -23.5505], population: 20365000 },
    { name: "Mexico City", coordinates: [-99.1332, 19.4326], population: 20063000 },
    { name: "Mumbai", coordinates: [72.8777, 19.0760], population: 17712000 },
    { name: "Osaka", coordinates: [135.5022, 34.6937], population: 17444000 },
    { name: "Moscow", coordinates: [37.6173, 55.7558], population: 16170000 },
    { name: "Dhaka", coordinates: [90.4125, 23.8103], population: 15669000 },
    { name: "Greater Cairo", coordinates: [31.2357, 30.0444], population: 15600000 },
    { name: "Los Angeles", coordinates: [-118.2437, 34.0522], population: 15058000 },
    { name: "Bangkok", coordinates: [100.5018, 13.7563], population: 14998000 },
    { name: "Kolkata", coordinates: [88.3639, 22.5726], population: 14667000 },
    { name: "Buenos Aires", coordinates: [-58.3816, -34.6037], population: 14122000 },
    { name: "Tehran", coordinates: [51.3890, 35.6892], population: 13532000 },
    { name: "Istanbul", coordinates: [28.9784, 41.0082], population: 13287000 },
    { name: "Lagos", coordinates: [3.3792, 6.5244], population: 13123000 },
    { name: "Shenzhen", coordinates: [114.0579, 22.5431], population: 12084000 },
    { name: "Rio de Janeiro", coordinates: [-43.1729, -22.9068], population: 11727000 },
    { name: "Kinshasa", coordinates: [15.2663, -4.4419], population: 11587000 },
    { name: "Tianjin", coordinates: [117.3616, 39.3434], population: 10920000 },
    { name: "Paris", coordinates: [2.3522, 48.8566], population: 10858000 },
    { name: "Lima", coordinates: [-77.0428, -12.0464], population: 10750000 },
]

export default class WorldTestView extends React.Component {
    state = {
        geographies: [],
        covidSummary: {},
        worldData: []
    }

    componentDidMount() {
        fetch("https://unpkg.com/world-atlas@2.0.2/countries-110m.json")
            .then(response => {
                if (response.status !== 200) {
                    console.log(`There was a problem: ${response.status}`)
                    return
                }
                response.json().then(worlddata => {
                    this.setState({ geographies: feature(worlddata, worlddata.objects.countries).features })
                });
                fetch("http://localhost:8081/covid-testing-service/testing/all")
                    .then(resp => {
                        if (resp.status !== 200) {
                            console.log(`There was a problem: ${resp.status}`)
                            return
                        }
                        resp.json().then(world => {
                            this.setState({ worldData: world })
                            console.log("World data", this.state.worldData)
                        })
                    });

            })
    };


    handleCountryClick = (countryIndex, i) => {
        const countryData = this.state.geographies[countryIndex]
        console.log("CD", countryIndex)
        let iso;
        Promise.all([
            d3.tsv(tsvData),
        ]).then(data => {
            console.log(data)
            data[0].forEach(item => {
                if (countryData.id === item.iso_n3) {
                    iso = item.iso_a3;
                }
            })
            const covidResponse = this.covidRequest(iso)
            covidResponse.then(covid => {
                this.setState({ covidSummary: covid.data })
            });
            console.log("Covid Respone:", this.state.covidSummary);
        });
    }

    covidRequest = (iso) => {
        try {
            const covidUrl = 'http://localhost:8081/covid-testing-service/testing/iso-code/' + iso
            console.log(covidUrl)
            return axios.get(covidUrl);
        } catch (err) {
            console.error(err);
        }
    }

    handleMarkerClick = (i) => {
        console.log("Marker: ", cities[i]);
    }

    numFormatter = (num) => {
        if (num > 999 && num < 1000000) {
            return (num / 1000).toFixed(0) + 'K'; // convert to K for number from > 1000 < 1 million 
        } else if (num > 1000000) {
            return (num / 1000000).toFixed(0) + 'M'; // convert to M for number from > 1 million 
        } else if (num < 900) {
            return num; // if value < 1000, nothing to do
        }
    }

    showToolTip = (elem, event, d) => {
        elem
            .classed("hidden", false)
            .html(
                "<span class='tooltip-header'><b>" + d.properties.name + "</b></span><br><hr>" +
                "Date: <span class='tooltip-text'>" + this.state.covidSummary.updated + "</span><br>" +
                "Cases: <span class='tooltip-text'>" + this.numFormatter(this.state.covidSummary.cases) + "</span><br>" +
                "Todays Cases: <span class='tooltip-text'>" + this.numFormatter(this.state.covidSummary.todayCases) + "</span><br>" +
                "Deaths: <span class='tooltip-text'>" + this.numFormatter(this.state.covidSummary.deaths) + "</span><br>" +
                "Recovered: <span class='tooltip-text'>" + this.numFormatter(this.state.covidSummary.recovered) + "</span><br>" +
                "Active: <span class='tooltip-text'>" + this.numFormatter(this.state.covidSummary.active) + "</span><br>" +
                "Critical: <span class='tooltip-text'>" + this.numFormatter(this.state.covidSummary.critical) + "</span><br>" +
                "Tests: <span class='tooltip-text'>" + this.numFormatter(this.state.covidSummary.tests) + "</span><br>" +
                "Population: <span class='tooltip-text'>" + this.numFormatter(this.state.covidSummary.population) + "</span><br>"
            )
            .attr(
                "style",
                "left:" +
                (event.pageX + 15) +
                "px; top:" +
                (event.pageY + 20) +
                "px"
            );

    }

    render() {
        d3.selectAll('.tooltip').remove();
        const tooltip =
            d3.select(".world-map")
                .append("div")
                .attr("class", "hidden tooltip");

        const width = 800;
        const height = 450;

        const zoomWorld =
            d3.zoom()
                .scaleExtent([-15, 30])
                .translateExtent([
                    [0, 0],
                    [{ width }, { height }]
                ])
                .on("zoom", function (event) {
                    d3.select("g").attr("transform", event.transform);
                });

        const svg =
            d3.select(".svg-map")
                .attr("width", width)
                .attr("height", height)
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", `0 0 ${width} ${height}`)
                .call(zoomWorld);

        const currentCountry = this.state.covidSummary;
        console.log("CR", currentCountry);

        return (
            <div className='pane'>
                <div className='header'>World Map</div>
                <div className="world-map"> </div>
                <svg width={width} height={height} viewBox="0 0 800 450" className="svg-map">
                    <g className="world-view">
                        {
                            this.state.geographies.map((d, i) => (
                                <path
                                    id={`path-${i}`}
                                    key={`path-${i}`}
                                    d={geoPath().projection(projection)(d)}
                                    className="country"
                                    fill={`rgba(38,50,56,${1 / this.state.geographies.length * i})`}
                                    data-name={d.properties.name}
                                    stroke="aliceblue"
                                    strokeWidth={0.5}
                                    onMouseOver={() => this.handleCountryClick(i)}
                                    onMouseMove={(event) => this.showToolTip(tooltip, event, d)}
                                    onMouseOut={() => {
                                        tooltip.classed("hidden", true);
                                    }}
                                />
                            ))
                        }
                    </g>
                </svg>
            </div>
        )
    }
}
