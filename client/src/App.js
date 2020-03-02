import React, { Component } from "react";
import { Layout, Menu, Icon } from 'antd';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


import "./App.css";

import routes from './models/router.js';

const { Header, Sider, Content } = Layout;

class App extends Component {
  state = { collapsed: false };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };


  autorefresh = () => {

    window.location.reload();

  }
  render() {

    return (
      <Router >
        <div className="app">

          <Layout>
            <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
              <div className="logo" />
              <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                <Menu.Item key="1">
                  <Icon type="user" />
                  <span onClick={this.autorefresh}>  <Link to="/">Home</Link></span>
                </Menu.Item>
                <Menu.Item key="2">
                  <Icon type="video-camera" />
                  <span><Link to="/mine">Mine</Link></span>
                </Menu.Item>
                <Menu.Item key="3">
                  <Icon type="upload" />
                  <span><Link to="/uploadmanage">Upload manage</Link></span>
                </Menu.Item>
              </Menu>
            </Sider>
            <Layout>
              <Header style={{ background: '#fff', padding: 0 }}>
                <Icon
                  className="trigger"
                  type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                  onClick={this.toggle}
                />
              </Header>
              <Content
                style={{
                  margin: '24px 16px',
                  padding: 24,
                  background: '#fff',
                  minHeight: 280,
                }}
              >
                {
                  routes.map((route, key) => {
                    if (route.exact) {
                      return <Route key={key} exact path={route.path} component={route.component} />
                    } else {
                      return <Route key={key} path={route.path} component={route.component} />
                    }
                  })
                }
              </Content>
            </Layout>
          </Layout>

        </div>
      </Router>
    );
  }
}

export default App;
