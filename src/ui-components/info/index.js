import React, { Component } from 'react';
import './info.css';
import Flag from 'react-world-flags'
import data from '../../data'

export default class Info extends Component {

    state = {
        countryVaccine: this.props.countryData
    }



    render() {

        let { countryData } = this.props;
        if(countryData === undefined || (Object.keys(countryData).length === 0)){
            countryData = data
        }
        console.log(countryData)
        console.log(data)
        const lastItem= countryData.data.slice(-1)[0]
        console.log("last item",lastItem)
      
        
        return (
            <div id='info' className='pane'>
                <div className='header'>Country</div>
                <Flag  width="270" height="200" code={this.props.countryData.iso_code} fallback={ <img src="no-image-icon.png" alt="No Flag Available" height="200" width="270"/>} />
                <div>
                    
                    <div className={'info-view'} >
                        <div><span>Country:</span> {countryData.country}</div>
                        <div><span>Daily Vaccinations:</span>{lastItem.daily_vaccinations}</div>
                        <div><span>Vaccinated:</span> {lastItem.people_vaccinated}</div>
                        <div><span>People Fully Vaccinated:</span> {lastItem.people_fully_vaccinated}</div>
                    </div>
                </div>
            </div>
        )
    }
}