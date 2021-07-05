import React from 'react'
import './footer.css';
import { Layout } from 'antd';

const { Footer } = Layout;

function FooterView() {
    return (
        <div>
           <Footer style={{ textAlign: 'center' }}>Kcl Covid App</Footer>
        </div>
    )
};

export default FooterView;