import React from 'react'

import FooterView from '../../footer'
import TestInfo from './test-info'
import WorldTestView from './world-test'
import { Layout } from 'antd';
import './covid-testing.css'
import LinearBarChart from './linear-bar';
import CircularPlotView from './circular-barplot';
import DonutChartView from './donut-chart';
import LollipopChartView from './lollipop-chart';


const { Sider, Content } = Layout;

export class TestingView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            covidTestingData: {},
            covidTimelineData: {},
            worldData: []
        }
    }

    componentWillMount() {
        fetch("http://localhost:9000/covid-testing-service/testing/all")
            .then(resp => {
                if (resp.status !== 200) {
                    console.log(`There was a problem: ${resp.status}`)
                    return
                }
                resp.json().then(world => {
                    this.setState({ worldData: world })
                })

            });
    }


    callbackFunction = (covidData, timelineData) => {
        this.setState({ covidTestingData: covidData })
        this.setState({ covidTimelineData: timelineData })
    }

    render() {

        return (
            <div>
                <Layout style={{ height: 920 }}>
                    <Sider width={300} style={{ backgroundColor: '#eee' }}>
                        <Content style={{ height: 400 }}>
                            <TestInfo covidTestingData={this.state.covidTestingData}/>
                        </Content>
                        <Content style={{ height: 320 }}>
                            <LollipopChartView timelineData={this.state.covidTimelineData} width={300} height={490} />
                        </Content>
                    </Sider>
                    <Layout>
                        <Content style={{ height: 600 }}>
                            <WorldTestView parentCallback={this.callbackFunction} width={800} height={350} />
                            <DonutChartView covidTestingData={this.state.covidTestingData} width={850} height={450} />
                        </Content>
                        <Sider width={600} style={{ backgroundColor: '#eee' }}>
                            <Content style={{ height: 400 }}>
                                <LinearBarChart worldDataProp={this.state.worldData} width={560} height={440} />
                            </Content>
                            <Content style={{ height: 320 }}>
                                <CircularPlotView worldDataProp={this.state.worldData} width={560} height={440} />
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
};

export default TestingView;