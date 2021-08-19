import React, { Component } from 'react'
import './report-view.css';
import { Helmet } from "react-helmet";


export default class ReportImageView extends Component {


    render() {

        return (
            <div id='scan-report-view' className='pane'>
                <div className='header'>Scan Viewer</div>
                <div>
                    <div className={'scan-report-chart'} >
                        <Helmet>
                            <script src="papaya.js" type="text/javascript" />
                            <link rel="stylesheet" type="text/css" href="papaya.css" />
                        </Helmet>
                        <div className="papaya" data-params="params"></div>
                    </div>
                </div>
            </div>
        )
    }
}
