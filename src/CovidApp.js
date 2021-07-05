import './CovidApp.css';
import { Layout } from 'antd';
import HeaderView from './segments/navigation';
import FooterView from './segments/footer';




function CovidApp() {
  return (
    <div>
    <Layout className="layout">
      <HeaderView/>
      <FooterView/>
  </Layout>
  </div>
  )
}

export default CovidApp;
