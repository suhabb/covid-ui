import React, { Component } from 'react';
import './pie-view.css';
import PieChart from '../../d3_graph/pie_chart';

export default class PieView extends Component {
    render() {
        const {data} = this.props;
        const width = 260;
        const height = 260;
        return (
            <div id='pie-view' className='pane'>
                <div className='header'>Vaccinated Pie Chart</div>
                <PieChart data={data} width={width} height={height} />
            </div>
        )
    }
}