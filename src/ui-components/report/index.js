import React, { Component } from 'react'


import FooterView from '../../footer'
import { Layout } from 'antd';
import './covid-report.css'
import ReportLinearBarChart from './linear-bar';
import ReportInfo from './report-info'
import ReportImageView from './report-view'
import PieReportChart from './pie-report'
import ReportLollipopChart from './report-lollipop'

import { Helmet } from "react-helmet";

const {Sider, Content } = Layout;

export default class ReportView extends Component {

    state = {
        reportData: {}
    }

    componentDidMount() {
        fetch("http://localhost:9000/covid-reporting-service/reporting/all/stats")
            .then(response => {
                if (response.status !== 200) {
                    console.log(`There was a problem: ${response.status}`)
                    return
                }
                response.json().then(responseData => {
                    this.setState({ reportData: responseData })
                });
            })
    };


    render() {
        return (
            <div>
                <Layout style={{ height: 920 }}>
                    <Sider width={300} style={{ backgroundColor: '#eee' }}>
                        <Content style={{ height: 400 }}>
                            <ReportInfo reportData={this.state.reportData} />
                        </Content>
                        <Content style={{ height: 320 }}>
                            <ReportLollipopChart reportData={this.state.reportData} width={300} height={490}/>
                        </Content>
                    </Sider>
                    <Layout>
                        <Content style={{ height: 920 }}>
                            <ReportImageView width={450} height={850} />
                        </Content>
                        <Sider width={600} style={{ backgroundColor: '#eee' }}>
                            <Content style={{ height: 400 }}>
                                <ReportLinearBarChart  reportData={this.state.reportData} width={560} height={440} />
                            </Content>
                            <Content style={{ height: 320 }}>
                                <PieReportChart reportData={this.state.reportData} width={450} height={430} />
                            </Content>
                        </Sider>
                    </Layout>
                </Layout>
                <Layout>
                    <FooterView />
                </Layout>
            </div>
        )
    }
}

