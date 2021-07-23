import React, { Component } from 'react';
import './area-view.css';
import AreaChart from '../../../d3_graph/vaccination/area_chart';
import data from '../../../data/index'

export default class AreaChartView extends Component {


    render() {
      
        let { countryData } = this.props;
        if(countryData === undefined || (Object.keys(countryData).length === 0)){
            countryData = data
        }
        const width = 560;
        const height = 480;
        return (
            <div id='area-view' className='pane'>
                <div className='header'>Area Chart : {countryData.country}</div>
                <AreaChart data={countryData} width={width} height={height} />
            </div>
        )
    }
} 