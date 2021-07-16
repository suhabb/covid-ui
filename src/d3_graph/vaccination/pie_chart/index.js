import React, { Component } from 'react';
import PieView from './vaccine-pie-chart';

export default class PieChart extends Component {

     componentDidMount() {
        PieView(this.props);
    }

    componentDidUpdate(preProps) {
        PieView(this.props);
    }

    render() {
        return (
            <React.Fragment>
                   <div className='vaccine-piechart'/>
            </React.Fragment>
        )
    }
}

