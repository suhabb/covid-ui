import React from 'react'

import WorldView from './world'
import PieView from './pie';
import TabularView from './tabular'
import BarChartView from './bar';
import FooterView from '../../footer'
import Info from './info'
import { Layout } from 'antd';
import './vaccination.css'
import AreaChartView from './area';
const { Sider, Content } = Layout;

export class VaccinationView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            vaccine: {},
            manufacturer: {}
        }
    }

    callbackFunction = (vaccineData, manufacturerData) => {
        this.setState({ vaccine: vaccineData })
        this.setState({ manufacturer: manufacturerData })
    }

    render() {
        return (
            <div>
                <Layout style={{ height: 920 }}>
                    <Sider width={300} style={{ backgroundColor: '#eee' }}>
                        <Content style={{ height: 400 }}>
                            <Info countryData={this.state.vaccine} />
                        </Content>
                        <Content style={{ height: 640 }}>
                            <PieView countryData={this.state.vaccine} manufacturerData={this.state.manufacturer} />
                        </Content>
                    </Sider>
                    <Layout>
                        <Content style={{ height: 320 }}>
                            <WorldView parentCallback={this.callbackFunction} width={800} height={350}/>
                            <BarChartView manufacturerData={this.state.manufacturer} />
                        </Content>
                        <Sider width={600} style={{ backgroundColor: '#eee' }}>
                            <Content style={{ height: 400 }}>
                                <AreaChartView countryData={this.state.vaccine} width={1000} height={750} />
                            </Content>
                            <Content style={{ height: 350 }}>
                                <TabularView countryData={this.state.vaccine}/>
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

export default VaccinationView;