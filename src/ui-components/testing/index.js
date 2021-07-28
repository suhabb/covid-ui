import React from 'react'
import { Button } from 'antd';

import FooterView from '../../footer'
import Test from '../../ui-components/test'
import WorldTestView from './world-test'
import { Layout } from 'antd';
import './covid-testing.css'

const { Sider, Content } = Layout;

export class TestingView extends React.Component {

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
                        <Content style={{ height: 380 }}>
                            <Test countryData={this.state.vaccine} />
                        </Content>
                        <Content style={{ height: 640 }}>
                            <Test />
                        </Content>
                    </Sider>
                    <Layout>
                        <Content style={{ height: 300 }}>
                            <WorldTestView style={{ height: 300, width: 800 }} />
                        </Content>
                        <Sider width={600} style={{ backgroundColor: '#eee' }}>
                            <Content style={{ height: 450 }}>
                                <Test />
                            </Content>
                            <Content style={{ height: 350 }}>
                                <Test countryData={this.state.vaccine} />
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