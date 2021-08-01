import React, { Component } from 'react'
import './tabular-view.css'
import data from '../../../data'
import { Table } from 'antd';

export default class Tabular extends Component {


    render() {

        let { countryData } = this.props;
        if (countryData === undefined || (Object.keys(countryData).length === 0)) {
            countryData = data
        }

        let vaccineDayToDayList = [];

        const numFormatter = (num) => {
            if (num > 999 ) {
                return (num / 1000).toFixed(0) + 'K'; // convert to K for number from > 1000 < 1 million 
            } else if (num < 900) {
                return num; // if value < 1000, nothing to do
            }
        }

        countryData.data.forEach((vaccine, index) => {
            vaccine.daily_vaccinations_formatted = numFormatter(vaccine.daily_vaccinations)
            vaccine.key = index
            vaccineDayToDayList.push(vaccine)
        });
        vaccineDayToDayList.sort(function (vaccine1, vaccine2) {
            return new Date(vaccine2.date) - new Date(vaccine1.date);
        });


        const columns = [
            {
                title: 'Date',
                dataIndex: 'date',
                key: 'date'
            },
            {
                title: 'Daily Vaccinations',
                dataIndex: 'daily_vaccinations_formatted',
                key: 'daily_vaccinations'
            },
            {
                title: 'Daily Vaccinations Per Million',
                dataIndex: 'daily_vaccinations_per_million',
                key: 'daily_vaccinations_per_million'
            }
        ]

        return (
            <div>
                <div id='tabular-view' className='pane'>
                    <div className='header'>Tabular Chart: {countryData.country}</div>
                    <Table columns={columns} dataSource={vaccineDayToDayList} height={500} scroll={{ y: 283 }} />
                </div>
            </div>
        )
    }
}

