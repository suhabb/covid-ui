import React, { Component } from 'react'
import './test-info.css';
import Flag from 'react-world-flags'
import data from  '../../../data/bar-test'

export default class TestInfo extends Component {
  
    render() {

        let countryData  = this.props.covidTestingData;
        if(countryData === undefined || (Object.keys(countryData).length === 0)){
            countryData = data
        }
        console.log("Testing:",countryData)
    
        return (
            <div id='info-test-view' className='pane'>
                <div className='header'>Country:<span> {countryData.country}</span></div>
                <Flag  width="270" height="200" code={countryData.countryInfo.iso3} fallback={ <img src="no-image-icon.png" alt="No Flag Available" height="200" width="270"/>} />
                <div>     
                    <div className={'info-test-view'} >
                        <div><span>Country:</span> {countryData.country}</div>
                        <div><span>Date:</span> {countryData.updated}</div>
                        <div><span>Cases Per Million:</span> {countryData.casesPerOneMillion}</div>
                        <div><span>Deaths Per Million:</span> {countryData.deathsPerOneMillion}</div>
                        <div><span>Tests Per Million:</span> {countryData.testsPerOneMillion}</div>
                        <div><span>Recovered Per Million:</span> {countryData.recoveredPerOneMillion}</div>
                        <div><span>Critical Per Million:</span> {countryData.criticalPerOneMillion}</div>
                    </div>
                </div>
            </div>
        )
    }
}
