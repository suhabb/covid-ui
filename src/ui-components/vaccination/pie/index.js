import React, { Component } from 'react';
import './pie-view.css';
import PieChart from '../../../d3_graph/vaccination/pie_chart';
import data from '../../../data/vaccine-company-data'

export default class PieView extends Component {

    state = {
        manufacturerData: this.props.manufacturerData
    }

    render() {
        let { manufacturerData } = this.props;
        if(manufacturerData === undefined || (Object.keys(manufacturerData).length === 0)){
            manufacturerData = data
        }
        console.log(manufacturerData)
        const width = 260;
        const height = 450;
        return (
            <div id='pie-view' className='pane'>
                <div className='header'>Pie Chart : {manufacturerData.location}</div>
                <PieChart data={manufacturerData} width={width} height={height} />
            </div>
        )
    }
}