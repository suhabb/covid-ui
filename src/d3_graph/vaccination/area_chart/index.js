import React, { Component } from 'react';
import AreaView from './vaccine-area-chart'

export default class AreaChart extends Component {

    componentDidMount() {
        AreaView(this.props);
    }

    componentDidUpdate(preProps) {
        AreaView(this.props);
    }
 
    render() {
        return (
            <div className='vaccine-areachart'/>
        )
    }
}
