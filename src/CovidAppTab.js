import './CovidApp.css';
import 'antd/dist/antd.css';
import React from 'react'
import VaccinationView from './ui-components/vaccination'
import TestingView from './ui-components/testing'
import ReportView from './ui-components/report'
import { Tabs } from 'antd';

const { TabPane } = Tabs;


const CovidApp = () => (
<div>
  <Tabs defaultActiveKey="3" centered>
    <TabPane tab="Vaccination" key="1">
      <VaccinationView />
    </TabPane>
    <TabPane tab="Testing" key="2">
      <TestingView />
    </TabPane>
    <TabPane tab="Report" key="3">
      <ReportView />
    </TabPane>
  </Tabs>
  </div>
);

export default CovidApp;
