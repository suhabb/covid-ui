import './CovidApp.css';
import 'antd/dist/antd.css';
import { Layout } from 'antd';
import React from 'react'
import VaccinationView from './ui-components/vaccination'
import TestingView from './ui-components/testing'
import ReportView from './ui-components/report'

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";





function CovidApp() {

  return (
    <Router>
      <Layout className="layout">
          <Switch>
            <Route path="/" exact component={VaccinationView}/>
            <Route path="/testing" exact component={TestingView}/> 
            <Route path="/report" exact component={ReportView}/>
          </Switch>
      </Layout>
    </Router>

  );
}

export default CovidApp;
