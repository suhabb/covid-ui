import React, { Component } from 'react';
import BarChart from '../../d3_graph/bar_chart';
import './bar-view.css';

export default class BarChartView extends Component {
    render() {
        const {data} = this.props;
        return (
            <div id='bar-view' className='pane'>
                <div className='header'>Age</div>
                <div style={{ overflowX: 'scroll',overflowY:'hidden' }}>
                <BarChart data={data} width={1000} height={550}/>
                </div>                
            </div>
        )
    }
}