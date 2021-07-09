import React from 'react'

import WorldView from '../world'
import PieView from '../pie';
import BarChartView from '../bar';
import Info from '../info'
import { Layout } from 'antd';
import './vaccination.css'
const { Sider, Content } = Layout;

export class VaccinationView extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            vaccine: {} 
        }
    }

    callbackFunction = (childData) => {
        this.setState({vaccine: childData})
        console.log("Child data",childData)
        console.log("VaccineView data",this.state.vaccine)
    }  

    render() {
        return (
            <div>
                <Layout style={{ height: 920 }}>
                    <Sider width={300} style={{ backgroundColor: '#eee' }}>
                        <Content style={{ height: 360 }}>
                            <Info countryData={this.state.vaccine}/>
                        </Content>
                        <Content style={{ height: 500 }}>
                            <PieView countryData={this.state.vaccine}/>
                        </Content>
                    </Sider>
                    <React.Fragment>
                        <WorldView parentCallback={this.callbackFunction}
                        />
                    
                        <BarChartView />
                    </React.Fragment>
                    <div>
                        Country in world  {this.state.vaccine.country}
                    </div>
                </Layout>
            
            </div>
        )
    }
};

export default VaccinationView;