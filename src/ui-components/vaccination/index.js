import React from 'react'

import WorldView from './world'
import PieView from './pie';
import BarChartView from '../bar';
import Info from './info'
import { Layout } from 'antd';
import './vaccination.css'
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
        console.log("Mnaufacturer  data", manufacturerData)
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
                        <React.Fragment>
                            <WorldView parentCallback={this.callbackFunction}
                            style={{ height: 300 }}/>
                            <BarChartView  manufacturerData={this.state.manufacturer}  width={600} height={650}/>
                        </React.Fragment>
                    </Layout>
                </Layout>
            </div>
        )
    }
};

export default VaccinationView;