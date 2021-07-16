import React, { Component } from 'react';
import BarView from './vaccine-bar-chart'

export default class BarChart extends Component {

    componentDidMount() {
        BarView(this.props);
    }

    componentDidUpdate(preProps) {
        BarView(this.props);
    }
 
    render() {
        return (
            <div className='vaccine-barchart'/>
        )
    }
}
