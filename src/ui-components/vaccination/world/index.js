import React from "react"
import { geoEqualEarth, geoEquirectangular,geoPath } from "d3-geo"
import axios from 'axios'
import { tsv, select, selectAll } from "d3"
import './world-view.css'
import tsvData from './110m.tsv'
import { feature } from "topojson-client"

const projection = geoEquirectangular()
    .scale(160)
    .translate([800 / 2, 450 / 2])

export default class WorldView extends React.Component {

    state = {
        geographies: [],
        vaccineSummary: {},
        manufacturerSummary: {}
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
                })
            })
        this.handleOnLoad('GBR');
    }


    handleCountryClick = (countryIndex) => {
        const countryData = this.state.geographies[countryIndex]
        let iso;
        Promise.all([
            tsv(tsvData),
        ]).then(data => {
            data[0].forEach(item => {
                if (countryData.id === item.iso_n3) {
                    iso = item.iso_a3;
                }
            })
            const vaccineResponse = this.vaccineRequest(iso)
            vaccineResponse.then(vaccine => {
                this.setState({ vaccineSummary: vaccine.data })
                const manufacturerResponse = this.manufacturerRequest(iso)
                manufacturerResponse.then(manufacturer => {
                    this.setState({ manufacturerSummary: manufacturer.data })
                    this.props.parentCallback(vaccine.data, manufacturer.data);
                });
            });
        });
    }

    handleOnLoad = (iso) => {
        const vaccineResponse = this.vaccineRequest(iso)
        vaccineResponse.then(vaccine => {
            this.setState({ vaccineSummary: vaccine.data })
            const manufacturerResponse = this.manufacturerRequest(iso)
            manufacturerResponse.then(manufacturer => {
                this.setState({ manufacturerSummary: manufacturer.data })
                this.props.parentCallback(vaccine.data, manufacturer.data);
            });
        });
    }

    vaccineRequest = (iso) => {
        try {
            const vaccineUrl = 'http://localhost:9000/covid-vaccination-service/vaccination/country/iso-code/' + iso
            console.log(vaccineUrl)
            return axios.get(vaccineUrl);
        } catch (err) {
            console.error(err);
        }
    }

    manufacturerRequest = (iso) => {
        try {
            const manufacturerUrl = 'http://localhost:9000/covid-vaccination-service/vaccination/manufacturer/iso-code/' + iso
            console.log(manufacturerUrl)
            return axios.get(manufacturerUrl);
        } catch (err) {
            console.error(err);
        }
    }

    render() {

        selectAll('.tooltip').remove();
        const tooltip =
            select(".world-map")
                .append("div")
                .attr("class", "hidden tooltip");
        const width = this.props.width;
        const height = this.props.height;
        return (
            <div className='pane'>
                <div className='header'>World Map</div>
                <div className="world-map"> </div>
                <svg width={width} height={height} viewBox="0 0 800 450">
                    <g className="world-view">
                        {
                            this.state.geographies.map((d, i) => (
                                <path
                                    id={`path-${i}`}
                                    key={`path-${i}`}
                                    d={geoPath().projection(projection)(d)}
                                    className="country"
                                    fill={`rgba(38,50,56,${1 / this.state.geographies.length * i})`}
                                    stroke="aliceblue"
                                    strokeWidth={0.5}
                                    onClick={() => this.handleCountryClick(i)}
                                    onMouseMove={(event) => {
                                        tooltip
                                            .classed("hidden", false)
                                            .html(
                                                "<h6>" +
                                                d.properties.name
                                                +
                                                "</h6>"
                                            )
                                            .attr(
                                                "style",
                                                "left:" +
                                                (event.pageX + 15) +
                                                "px; top:" +
                                                (event.pageY + 20) +
                                                "px"
                                            );
                                    }}
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


