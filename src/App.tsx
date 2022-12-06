import React from 'react';
import './App.css';
import {Layout} from "antd";
import logo from './lightricks.png';
import FollowersReportPage from "./Modules/FollowerReport/FollowersReportPage";

const {Header, Content} = Layout;

function App() {
    return (
        <div className="App">
            <Layout className="layout">
                <Header className={"header"}>
                    <img className={"logo"} src={logo} alt="Lightricks"/>
                </Header>
                <Content style={{padding: '0 50px'}}>
                    <FollowersReportPage/>
                </Content>
            </Layout>
        </div>
    );
}

export default App;
