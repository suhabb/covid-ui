import React, { useState, useEffect } from "react"
import { geoEqualEarth, geoPath } from "d3-geo"
import { feature } from "topojson-client"
import axios from 'axios'


const projection = geoEqualEarth()
  .scale(160)
  .translate([ 800 / 2, 450 / 2 ])

const WorldMap = () => {
  const [geographies, setGeographies] = useState([])

  useEffect(() => {
    axios.get("https://unpkg.com/world-atlas@2.0.2/countries-110m.json")
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

  const handleCountryClick = countryIndex => {
   // console.log("Clicked on country: ", geographies[countryIndex])
  }



  return (
    <svg width={ 800 } height={ 450 } viewBox="0 0 800 450">
      <g className="countries">
        {
          geographies.map((d,i) => (
            <path
              key={ `path-${ i }` }
              d={ geoPath().projection(projection)(d) }
              className="country"
              fill={ `rgba(38,50,56,${ 1 / geographies.length * i})` }
              stroke="#FFFFFF"
              strokeWidth={ 0.5 }
              onClick={ () => handleCountryClick(i) }
            />
          ))
        }
      </g>
    </svg>
  )
}

export default WorldMap