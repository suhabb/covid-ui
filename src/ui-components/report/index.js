import React, { Component } from 'react'


import FooterView from '../../footer'
import { Layout } from 'antd';
import './covid-report.css'
import ReportInfo from './report-info'
import ReportImageView from './report-view'
import ReportLinearBarChart from './linear-bar'


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
                    <Sider width={580} style={{ backgroundColor: '#eee' }}>
                        <Content style={{ height: 250 }}>
                            <ReportInfo reportData={this.state.reportData} />
                        </Content>
                        <Content style={{ height: 650 }}>
                            <ReportLinearBarChart reportData={this.state.reportData} width={580} height={650}/>
                        </Content>
                    </Sider>
                    <Layout>
                        <Content style={{ height: 920 , width:900 }}>
                            <ReportImageView />
                        </Content>
                    </Layout>
                </Layout>
                <Layout>
                    <FooterView />
                </Layout>
            </div>
        )
    }
}

