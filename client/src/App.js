import React, { Component } from "react";
import { Layout, Menu, Icon } from 'antd';
import Button from 'antd/lib/button';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import SimpleStorageContract from "./contracts/SimpleStorage.json";

import getWeb3 from "./getWeb3";

import "./App.css";

import routes from './models/router.js';

const { Header, Sider, Content } = Layout;

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null, collapsed: false };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  // componentDidMount = async () => {
  //   try {
  //     // Get network provider and web3 instance.
  //     const web3 = await getWeb3();

  //     // Use web3 to get the user's accounts.
  //     const accounts = await web3.eth.getAccounts();

  //     // Get the contract instance.
  //     const networkId = await web3.eth.net.getId();
  //     const deployedNetwork = SimpleStorageContract.networks[networkId];
  //     const instance = new web3.eth.Contract(
  //       SimpleStorageContract.abi,
  //       deployedNetwork && deployedNetwork.address,
  //     );

  //     // Set web3, accounts, and contract to the state, and then proceed with an
  //     // example of interacting with the contract's methods.
  //     this.setState({ web3, accounts, contract: instance }, this.runExample);
  //   } catch (error) {
  //     // Catch any errors for any of the above operations.
  //     alert(
  //       `Failed to load web3, accounts, or contract. Check console for details.`,
  //     );
  //     console.error(error);
  //   }
  // };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  render() {
    // if (!this.state.web3) {
    //   return <div>Loading Web3, accounts, and contract...</div>;
    // }
    return (
      <Router>
        <div className="app">

          <Layout>
            <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
              <div className="logo" />
              <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                <Menu.Item key="1">
                  <Icon type="user" />
                  <span>  <Link to="/">Home</Link></span>
                </Menu.Item>
                <Menu.Item key="2">
                  <Icon type="video-camera" />
                  <span><Link to="/news">Mine</Link></span>
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
