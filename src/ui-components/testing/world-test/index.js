
import React from "react"
import { geoEqualEarth, geoPath } from "d3-geo"
import axios from 'axios'
import * as d3 from 'd3'
import './world-test.css'
import tsvData from './110m.tsv'
import { feature } from "topojson-client"
import mockData from '../../../data/bar-test'
import mockLineData from '../../../data/line-test'

const projection = geoEqualEarth()
    .scale(160)
    .translate([800 / 2, 450 / 2])

export default class WorldTestView extends React.Component {
    state = {
        geographies: [],
        covidSummary: {},
        worldData: [],
        timelineData: {}
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
                        })
                    });

            })
            this.handleOnLoad('GBR');
    };


    handleCountryMouseOver = (countryIndex, i) => {
        const countryData = this.state.geographies[countryIndex]
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
                if (covid.data === undefined || (Object.keys(covid.data).length === 0)) {
                    covid.data = mockData;
                    console.log("Mock Data", mockData)
                }
                this.setState({ covidSummary: covid.data })
                const covidTimelineRequest = this.covidTimelineRequest(iso);
                covidTimelineRequest.then(timeline => {
                    console.log("Covid Timeline Data", timeline.data)
                    if (timeline.data === undefined || (Object.keys(timeline.data).length === 0)) {
                        timeline.data = mockLineData;
                        console.log("Mock Line Data", mockLineData)
                    }
                    this.setState({ timelineData: timeline.data })
                    this.props.parentCallback(covid.data, timeline.data);
                });
            });
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

    covidTimelineRequest = (iso) => {
        try {
            const timelineUrl = 'http://localhost:8081/covid-testing-service/testing/timeline/' + iso
            console.log(timelineUrl)
            return axios.get(timelineUrl);
        } catch (err) {
            console.error(err);
        }
    }

    handleOnLoad = (iso) => {
        const covidResponse = this.covidRequest(iso)
        covidResponse.then(covid => {
            this.setState({ covidSummary: covid.data })
            const timeLineRequest = this.covidTimelineRequest(iso)
            timeLineRequest.then(timeline => {
                this.setState({ timelineData: timeline.data })
                this.props.parentCallback(covid.data, timeline.data);
            });
        });
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

        const width = this.props.width;
        const height = this.props.height;

        const zoomWorld =
            d3.zoom()
                .scaleExtent([-15, 30])
                .translateExtent([
                    [0, 0],
                    [width, height]
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
                                    onMouseOver={() => this.handleCountryMouseOver(i)}
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
