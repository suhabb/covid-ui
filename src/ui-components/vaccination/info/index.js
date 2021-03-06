import React, { Component } from 'react';
import './info.css';
import Flag from 'react-world-flags'
import data from '../../../data'

export default class Info extends Component {

    state = {
        countryVaccine: this.props.countryData
    }

    render() {

        let { countryData } = this.props;
        if(countryData === undefined || (Object.keys(countryData).length === 0)){
            countryData = data
        }
        const lastItem= countryData.data.slice(-1)[0]
      
        const numFormatter = (num)=> {
            if(num > 999 && num < 1000000){
                return (num/1000).toFixed(0) + 'K'; 
            }else if(num > 1000000){
                return (num/1000000).toFixed(0) + 'M'; 
            }else if(num < 900){
                return num; 
            }
        }
    
        return (
            <div id='info' className='pane'>
                <div className='header'>Country:<span> {countryData.country}</span></div>
                <Flag  width="270" height="200" code={this.props.countryData.iso_code} fallback={ <img src="no-image-icon.png" alt="No Flag Available" height="200" width="270"/>} />
                <div>
                    
                    <div className={'info-view'} >
                        <div><span>Country:</span> {countryData.country}</div>
                        <div><span>Date :</span> {lastItem.date}</div>
                        <div><span>Daily Vaccinations:</span>{numFormatter(lastItem.daily_vaccinations)}</div>
                        <div><span>Total Vaccinated:</span> {numFormatter(lastItem.total_vaccinations)}</div>
                        <div><span>People Fully Vaccinated:</span> {numFormatter(lastItem.people_fully_vaccinated)}</div>
                    </div>
                </div>
            </div>
        )
    }
}