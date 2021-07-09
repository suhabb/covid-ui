import React, { useState, useEffect, ReactNode } from "react"
import { geoEqualEarth, geoPath } from "d3-geo"
import { feature } from "topojson-client"
import axios from 'axios'
import { tsv, select, helper } from "d3"
import './world-view.css'
import tsvData from './110m.tsv'
import { Popover, Button } from 'antd';



const projection = geoEqualEarth()
    .scale(160)
    .translate([800 / 2, 450 / 2])



const WorldView = () => {

    const [geographies, setGeographies] = useState([])
    const [vaccineSummary, setVaccineSummary] = useState({});


    useEffect(() => {
        fetch("https://unpkg.com/world-atlas@2.0.2/countries-110m.json")
            .then(response => {
                if (response.status !== 200) {
                    console.log(`There was a problem: ${response.status}`)
                    return
                }
                response.json().then(worlddata => {
                    setGeographies(feature(worlddata, worlddata.objects.countries).features)
                })
            })
    }, [])

    useEffect(() => {
        select('#tooltip')
            .attr('style', 'position: absolute; opacity: 0;');
    })

    const handleCountryClick = (countryIndex, event) => {
        // console.log("Clicked on country: ", geographies[countryIndex])
        const countryData = geographies[countryIndex]
        console.log("CountryIndex:", countryData.id)
        let iso;
        Promise.all([
            tsv(tsvData),
        ]).then(data => {
            console.log("tsv", data)
            data[0].forEach(item => {
                if (countryData.id === item.iso_n3) {
                    iso = item.iso_a3;
                    console.log("ISO:", iso, item.iso_a3)
                }
            })
            const vaccineResponse = vaccineRequest()
            vaccineResponse.then(vaccine => {
                console.log("Vaccine data", vaccine.data)
                setVaccineSummary(vaccine.data)
            });

        });

        const vaccineRequest = () => {
            try {
                const vaccineUrl = 'http://localhost:8080/covid-vaccination-service/country/iso-code/' + iso
                console.log(vaccineUrl)
                return axios.get(vaccineUrl);
            } catch (err) {
                console.error(err);
            }
        };


 
    }

    return (
        <div>
            <div id="tooltip">
                Vaccine1:{vaccineSummary.country}
            </div>
            <svg width={800} height={450} viewBox="0 0 800 450">
                <g className="world-view">
                    {
                        geographies.map((d, i) => (
                            <path
                                id={`path-${i}`}
                                key={`path-${i}`}
                                d={geoPath().projection(projection)(d)}
                                className="country"
                                fill={`rgba(38,50,56,${1 / geographies.length * i})`}
                                stroke="aliceblue"
                                strokeWidth={0.5}
                                onClick={(event) => handleCountryClick(i, event)}

                            />
                        ))
                    }
                </g>
            </svg>
            <div>
                Vaccine1:{vaccineSummary.country}
            </div>
        </div>
    )
}

export default WorldView