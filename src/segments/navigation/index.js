import React from 'react'
import { Menu } from 'antd'
import './navigation.css'

import { Layout } from 'antd';

const { Header } = Layout;

function HeaderView() {
    return (
        <div>
            <Header>
            
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                    <Menu.Item key="1">Vaccination</Menu.Item>
                    <Menu.Item key="2">Testing</Menu.Item>
                    <Menu.Item key="3">Report</Menu.Item>
                </Menu>
            </Header>
        </div>
    )
};

export default HeaderView;