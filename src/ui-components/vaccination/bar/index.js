import React, { Component } from 'react';
import BarChart from '../../../d3_graph/vaccination/bar_chart';
import './bar-view.css';
import data from '../../../data/vaccine-company-data'

export default class BarChartView extends Component {

    state = {
        manufacturerData: this.props.manufacturerData
    }

    render() {
        let { manufacturerData } = this.props;
        if (manufacturerData === undefined || (Object.keys(manufacturerData).length === 0)) {
            manufacturerData = data
        }
        console.log(manufacturerData)
        return (
            <div id='bar-view' className='pane'>
                <div className='header'>Bar Chart : {manufacturerData.location}</div>
                <div>
                    <BarChart data={manufacturerData} width={800} height={450} />
                </div>
            </div>
        )
    }
}