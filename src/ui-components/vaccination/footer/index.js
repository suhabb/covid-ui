import React from 'react'
import './footer.css';
import { Layout } from 'antd';

const { Footer } = Layout;

function FooterView() {
    return (
        <React.Fragment>
           <Footer style={{ textAlign: 'center' }}>Kcl Covid App</Footer>
        </React.Fragment>
    )
};

export default FooterView;