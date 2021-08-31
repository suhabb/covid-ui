import React, { Component } from 'react'
import './report-info.css';


export default class ReportInfo extends Component {
  
    render() {

        let reportData  = this.props.reportData;
    
        return (
            <div id='info-report-chart' className='pane'>
                <div className='header'>Symptoms:Info View<span></span></div>
                <div>     
                    <div className={'info-report-view'} >
                        <div><span>Total Patients:</span> {reportData.total_patients}</div>
                        <div><span>Eye Pain:</span> {reportData.eye_pain}</div>
                        <div><span>Chest Pain:</span> {reportData.chest_pain}</div>
                        <div><span>Soar Throat:</span> {reportData.soar_throat}</div>
                        <div><span>Fever:</span> {reportData.fever}</div>
                        <div><span>Cough:</span> {reportData.cough}</div>
                        <div><span>Headache:</span> {reportData.headache}</div>
                        <div><span>Breathlessness:</span> {reportData.breathlessness}</div>
                    </div>
                </div>
            </div>
        )
    }
}
