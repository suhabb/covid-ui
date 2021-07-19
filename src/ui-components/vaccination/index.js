import React from 'react'

import WorldView from './world'
import PieView from './pie';
import BarChartView from './bar';
import FooterView from './footer'
import Info from './info'
import Test from './test'
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
        console.log("Vaccine data", vaccineData)
        console.log("Manuufacturer  data", manufacturerData)
        console.log("VaccineView data", this.state.vaccine)
    }

    render() {
        return (
            <div>
                <Layout style={{ height: 920 }}>
                    <Sider width={300} style={{ backgroundColor: '#eee' }}>
                        <Content style={{ height: 380 }}>
                            <Info countryData={this.state.vaccine} />
                        </Content>
                        <Content style={{ height: 640 }}>
                            <PieView countryData={this.state.vaccine} manufacturerData={this.state.manufacturer} />
                        </Content>
                    </Sider>
                    <Layout>
                        <Content style={{ height: 300 }}>
                            <WorldView parentCallback={this.callbackFunction} style={{ height: 300 ,width:300}}/>
                            <BarChartView manufacturerData={this.state.manufacturer} width={600} height={650} />
                        </Content>
                        <Sider width={600} style={{ backgroundColor: '#eee' }}>
                            <Content style={{ height: 450 }}>
                                <AreaChartView countryData={this.state.vaccine} width={1000} height={750}/>
                            </Content>
                            <Content style={{ height: 340 }}>
                                <Test />
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