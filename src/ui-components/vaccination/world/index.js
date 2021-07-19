import React from "react"
import { geoEqualEarth, geoPath } from "d3-geo"
import axios from 'axios'
import { tsv,select } from "d3"
import './world-view.css'
import tsvData from './110m.tsv'
import { feature } from "topojson-client"

const projection = geoEqualEarth()
    .scale(160)
    .translate([800 / 2, 450 / 2])

export default class WorldView extends React.Component {

    state = {
        geographies: [],
        vaccineSummary: {},
        manufacturerSummary :{}
    }

    componentDidMount() {
        fetch("https://unpkg.com/world-atlas@2.0.2/countries-110m.json")
            .then(response => {
                if (response.status !== 200) {
                   // console.log(`There was a problem: ${response.status}`)
                    return
                }
                response.json().then(worlddata => {
                    this.setState({ geographies: feature(worlddata, worlddata.objects.countries).features })
                })
            })
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
                   // console.log("ISO:", iso, item.iso_a3)
                }
            })
            const vaccineResponse = this.vaccineRequest(iso)
            vaccineResponse.then(vaccine => {
                console.log("Vaccine data", vaccine.data)
                this.setState({ vaccineSummary: vaccine.data })
                const manufacturerResponse = this.manufacturerRequest(iso)
                manufacturerResponse.then(manufacturer => {
                    console.log("Manufacturer data", manufacturer.data)
                    this.setState({ manufacturerSummary: manufacturer.data })
                    this.props.parentCallback(vaccine.data,manufacturer.data);
                });
            });
        });
    }

    vaccineRequest = (iso) => {
        try {
            const vaccineUrl = 'http://localhost:8080/covid-vaccination-service/country/iso-code/' + iso
            console.log(vaccineUrl)
            return axios.get(vaccineUrl);
        } catch (err) {
            console.error(err);
        }
    }

    manufacturerRequest = (iso) => {
        try {
            const manufacturerUrl = 'http://localhost:8080/covid-vaccination-service/manufacturer/iso-code/' + iso
            console.log(manufacturerUrl)
            return axios.get(manufacturerUrl);
        } catch (err) {
            console.error(err);
        }
    }

    handleMouseOver=(countryIndex,i,n)=>{
        console.log("iso")
        const countryData = this.state.geographies[countryIndex]
        let iso;
        Promise.all([
            tsv(tsvData),
        ]).then(data => {
            data[0].forEach(item => {
                if (countryData.id === item.iso_n3) {
                    iso = item.iso_a3;
                    console.log("ISO:", iso, item.iso_a3)
                }
            })
        }).then(()=>{
            console.log("2nd iso",iso)
            console.log("Path:",n[countryIndex])

            //TODO
            select("path#path-"+countryIndex)
            .attr("text-anchor", "middle")  
            .style("font-size", "16px") 
            .style("text-decoration", "underline") 
            .text(()=>"Hello:"+iso);
        });
    }


    render() {
        return (
            <div className='pane'>
                <div className='header'>World Map</div>
                <svg width={800} height={350} viewBox="0 0 800 450">
                    <g className="world-view">
                        {
                            this.state.geographies.map((d,i,n) => (
                                <path
                                    id={`path-${i}`}
                                    key={`path-${i}`}
                                    d={geoPath().projection(projection)(d)}
                                    className="country"
                                    fill={`rgba(38,50,56,${1 / this.state.geographies.length * i})`}
                                    stroke="aliceblue"
                                    strokeWidth={0.5}
                                    onMouseOver={()=> this.handleMouseOver(i,d,n)}
                                    onClick={() => this.handleCountryClick(i)}
                                />
                            ))
                        }
                    </g>
                </svg>
            </div>
        )
    }
}


