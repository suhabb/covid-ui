import React from 'react'

import FooterView from '../../footer'
import Test from '../../ui-components/test'
import WorldTestView from './world-test'
import { Layout } from 'antd';
import './covid-testing.css'
import BarTestView from './bar-test';
import LinearBarChart from './linear-bar';
import CircularPlotView from './circular-barplot';


const { Sider, Content } = Layout;

export class TestingView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            covidTestingData: {},
            covidTimelineData: {},
            worldData:[]
        }
    }

    componentWillMount() {
        fetch("http://localhost:8081/covid-testing-service/testing/all")
            .then(resp => {
                if (resp.status !== 200) {
                    console.log(`There was a problem: ${resp.status}`)
                    return
                }
                resp.json().then(world => {
                    console.log('Wordldddddddd',world)
                    this.setState({ worldData: world })
                })
                
            });
    }


    callbackFunction = (covidData, timelineData) => {
        this.setState({ covidTestingData: covidData })
        this.setState({ covidTimelineData: timelineData })
    }

    render() {
        console.log("World----",this.state.worldData)
        return (
            <div>
                <Layout style={{ height: 920 }}>
                    <Sider width={300} style={{ backgroundColor: '#eee' }}>
                        <Content style={{ height: 380 }}>
                            <Test countryData={this.state.vaccine} />
                        </Content>
                        <Content style={{ height: 640 }}>
                            <Test />
                        </Content>
                    </Sider>
                    <Layout>
                        <Content style={{ height: 300 }}>
                            <WorldTestView parentCallback={this.callbackFunction} width={800} height={350} />
                            <BarTestView covidTestingData={this.state.covidTestingData} width={800} height={450} />
                        </Content>
                        <Sider width={600} style={{ backgroundColor: '#eee' }}>
                            <Content style={{ height: 400 }}>
                                <LinearBarChart worldDataProp={this.state.worldData} width={560} height={440} />
                            </Content>
                            <Content style={{ height: 320 }}>
                                <CircularPlotView  worldDataProp={this.state.worldData} width={560} height={440}  />
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