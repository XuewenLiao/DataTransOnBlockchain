import React, { Component } from "react";
import { Table, Button, Form, Input, Icon } from 'antd';
import { getOrigData, calcuQod, calcuRewards, changeSold } from '../methodTool'
import QodRewardContract from "../contracts/QodReward.json";
import getWeb3 from "../getWeb3";
var { cacheSelectedRows, cacheRewardValue, cacheTansLog } = require("../models/CacheData")

const FormItem = Form.Item
const columns = [
  {
    title: 'User Address',
    dataIndex: 'uaddress',
    width: 100,
  },
  {
    title: 'Data Date',
    dataIndex: 'datadate',
    width: 80,
  },
  {
    title: 'Collection Place',
    dataIndex: 'dataplace',
    width: 80,
  },
  {
    title: 'Data Hash',
    dataIndex: 'ipfsdatahash',
    width: 100,
  },
  {
    title: 'Sell status',
    dataIndex: 'hassell',
    width: 100,
  },
];


const data = [];

class Home extends React.Component {
  state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
    rewardValue: '',
    data: [],
    web3: null, accounts: null, contract: null,
    glableSelectData: []
  };

  componentDidMount = async () => {
    this.connectBlockChain();
    this.start();
  }

  start = () => {

    //后台拿数据
    this.setState({ loading: true });
    // ajax request after empty completing
    getOrigData().then(res => {

      //设置卖出状态
      for (var i in res) {
        if (res[i].hassell == false) {
          res[i].hassell = 'Unsold'
        } else {
          res[i].hassell = 'Sold out'
        }
      }

      this.setState({
        data: [...res, data.map(val => {
          return val
        })],

        selectedRowKeys: [],
        loading: false,
      });

    })
  };

  calcuAndSaveQodByPro = () => {
    var dataIdArray = []

    //取缓存数据
    var selectedRows = JSON.parse(window.localStorage.getItem("glableSelectData"));
    console.log("sessionSelectData", selectedRows)

    for (var i in selectedRows) {
      var data = this.state.data
      dataIdArray.push(data[selectedRows[i]]._id)
    }
    console.log("datasArray==", dataIdArray)

    //计算qod
    calcuQod(dataIdArray).then(res => {
      console.log("res==", res)
      console.log("qodData==", res);
      console.log("type==", typeof (res));
      //存储到区块链
      this.saveQodToBlockChainByPro(res);
    })

  }

  saveQodToBlockChainByPro = async (qodData) => {
    const { accounts, contract } = this.state;

    //上传至区块链
    var saveQodLog = []
    for (var i in qodData) {
      var address = qodData[i].uaddress
      console.log("address==", address)
      var qod = JSON.stringify(qodData[i].qod)
      console.log("qod==", qod)
      console.log("qodType==", typeof (qod))

      await contract.methods.calcuQodByProvider(address, qod).send({ from: this.state.accounts[0], gas: 3000000, gasPrice: '10' }) //from: '0x15f13625bf2aE99CebF1BE776e18835bF93Ea623'
        .on('transactionHash', function (hash) {
          console.log("SaveQodTransHashByPro==", hash)

          let logInfo = {}
          logInfo.address = address
          logInfo.SaveQodTransHashByPro = hash
          saveQodLog.push(logInfo)

        })
        .on('receipt', function (receipt) {
          console.log("receipt==", receipt)
        })

    }
    alert(JSON.stringify(saveQodLog))
    cacheTansLog.push(JSON.stringify(saveQodLog))
    console.log("cacheTansLogQod==", cacheTansLog)
  }



  calcuAndSaveQodByConsu = () => {
    var dataIdArray = []

    //取缓存数据
    var selectedRows = JSON.parse(window.localStorage.getItem("glableSelectData"));
    console.log("sessionSelectData", selectedRows)

    for (var i in selectedRows) {
      var data = this.state.data
      dataIdArray.push(data[selectedRows[i]]._id)
    }
    console.log("datasArray==", dataIdArray)

    //计算qod
    calcuQod(dataIdArray).then(res => {
      console.log("res==", res)
      console.log("qodData==", res);
      console.log("type==", typeof (res));
      //存储到区块链
      this.saveQodToBlockChainByConsu(res);
    })

  }

  saveQodToBlockChainByConsu = async (qodData) => {
    const { accounts, contract } = this.state;

    //上传至区块链
    var saveQodLog = []
    for (var i in qodData) {
      var address = qodData[i].uaddress
      console.log("address==", address)
      var qod = JSON.stringify(qodData[i].qod)
      console.log("qod==", qod)
      console.log("qodType==", typeof (qod))

      await contract.methods.calcuQodByConsumer(address, qod).send({ from: this.state.accounts[0], gas: 3000000, gasPrice: '10' }) //from: '0x15f13625bf2aE99CebF1BE776e18835bF93Ea623'
        .on('transactionHash', function (hash) {
          console.log("SaveQodTransHashByConsu==", hash)

          let logInfo = {}
          logInfo.address = address
          logInfo.SaveQodTransHashByConsu = hash
          saveQodLog.push(logInfo)

        })
        .on('receipt', function (receipt) {
          console.log("receipt==", receipt)
        })

    }
    alert(JSON.stringify(saveQodLog))
    cacheTansLog.push(JSON.stringify(saveQodLog))
    console.log("cacheTansLogQod==", cacheTansLog)
  }


  consumerVerifiedQod = async () => {
    const { accounts, contract } = this.state;
    //奖金额公布到区块链
    var consumerVerifiedQodLog = {}
    console.log("rewardValue==", this.state.rewardValue)
    console.log("typerewardValue==", typeof (this.state.rewardValue))
    await contract.methods.consumerVerifiedQod().send({ from: this.state.accounts[0], gas: 3000000, gasPrice: '10' }) //from: '0x15f13625bf2aE99CebF1BE776e18835bF93Ea623'
      .on('transactionHash', function (hash) {
        console.log("consumerVerifiedQodHash==", hash)

        consumerVerifiedQodLog.address = accounts[0]
        consumerVerifiedQodLog.consumerVerifiedQodHash = hash

      })
      .on('receipt', function (receipt) {
        console.log("receipt==", receipt)
      })

    alert(JSON.stringify(consumerVerifiedQodLog))
    cacheTansLog.push(JSON.stringify(consumerVerifiedQodLog))
  }


  connectBlockChain = async () => {
    // state = { isSaveIpfsSuccess: false, web3: null, accounts: null, contract: null };
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      console.log("accounts==", accounts)

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      console.log("networkId==", networkId)
      const deployedNetwork = QodRewardContract.networks[networkId];
      const instance = new web3.eth.Contract(
        QodRewardContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      // this.setState({ web3, accounts, contract: instance }, this.SaveIpfsHashInBlockChain);
      this.setState({ web3, accounts, contract: instance });
      this.setState({ web3, accounts });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }

  SaveIpfsHashInBlockChain = async () => {
    //创建合约
    // this.connectBlockChain();

    const { accounts, contract } = this.state;

    //处理数据
    // var testSelectData = [{ "address": "0x276ea10526355d106a1abb3853b41aa9adc9af54", "ipfsArray": ["a11", "a12", "a13"] }]

    var selectedRows = this.state.selectedRowKeys

    //缓存consumer选择的数据id
    cacheSelectedRows = JSON.parse(JSON.stringify(this.state.selectedRowKeys));
    window.localStorage.setItem("glableSelectData", JSON.stringify(cacheSelectedRows));


    var data = this.state.data
    var selectedData = []
    for (var i in selectedRows) {
      let eachData = {}
      eachData.address = data[selectedRows[i]].uaddress
      eachData.ipfsdatahash = data[selectedRows[i]].ipfsdatahash
      selectedData.push(eachData)
    }
    console.log("selectedData==", selectedData)

    var dataArray = []
    var tempwData = JSON.parse(JSON.stringify(selectedData)) //深拷贝
    for (var i in selectedData) {
      var aToi = {}
      if (tempwData[i].address == null) {
        continue
      }
      aToi.address = selectedData[i].address
      var ipfses = []
      for (var j in selectedData) {
        if (selectedData[j].address == selectedData[i].address) {
          ipfses.push(selectedData[j].ipfsdatahash)

          tempwData[j].address = null
        } else {
          continue
        }
      }
      aToi.ipfsArray = ipfses
      dataArray.push(aToi)
    }
    console.log("dataArray==", dataArray)


    //上传至区块链
    var saveIpfsLog = []
    for (var i in dataArray) {
      var address = dataArray[i].address
      console.log("address==", typeof (address))
      var ipfsArray = dataArray[i].ipfsArray
      //对象转数组
      var ipfsArr = Array.from(ipfsArray)

      console.log("ipfsArrayType==", typeof (ipfsArr))

      await contract.methods.registerAsProvider(ipfsArr, address).send({ from: this.state.accounts[0], gas: 3000000, gasPrice: '10' }) //from: '0x15f13625bf2aE99CebF1BE776e18835bF93Ea623'
        .on('transactionHash', function (hash) {
          console.log("SaveIpfsTransHash==", hash)

          let logInfo = {}
          logInfo.address = address
          logInfo.SaveIpfsTransHash = hash
          saveIpfsLog.push(logInfo)

        })
        .on('receipt', function (receipt) {
          console.log("receipt==", receipt)
        })

    }
    alert(JSON.stringify(saveIpfsLog))
    cacheTansLog.push(JSON.stringify(saveIpfsLog))

  }


  calcuRewardC = async () => {
    const { accounts, contract } = this.state;
    //缓存rewardValue:comsumer公布的总奖金额
    window.localStorage.setItem("glableRewardValue", JSON.stringify(this.state.rewardValue))

    //奖金额公布到区块链
    var publishRewardsLog = {}
    console.log("rewardValue==", this.state.rewardValue)
    console.log("typerewardValue==", typeof (this.state.rewardValue))
    await contract.methods.publishTotalMoney(Number(this.state.rewardValue)).send({ from: this.state.accounts[0], gas: 3000000, gasPrice: '10' }) //from: '0x15f13625bf2aE99CebF1BE776e18835bF93Ea623'
      .on('transactionHash', function (hash) {
        console.log("publishRewardHash==", hash)

        publishRewardsLog.address = accounts[0]
        publishRewardsLog.publishRewardHash = hash

      })
      .on('receipt', function (receipt) {
        console.log("receipt==", receipt)
      })

    alert(JSON.stringify(publishRewardsLog))
    cacheTansLog.push(JSON.stringify(publishRewardsLog))

    //计算每人的激励金额
    // var calcuRewardByConsumerLog = []
    calcuRewards(this.state.rewardValue).then(res => {
      console.log("reward==", res);
      console.log("type==", typeof (res));
      alert(JSON.stringify(res))
      this.saveRewardByC(res)

    })


  }

  saveRewardByC = async (res) => {
    const { accounts, contract } = this.state;
    //暂存到区块链
    var calcuRewardByConsumerLog = []
    console.log("rewardValue==", this.state.rewardValue)
    console.log("typerewardValue==", typeof (this.state.rewardValue))
    for (var i in res) {
      var address = res[i].uaddress
      var reward = res[i].reward
      await contract.methods.calcuRewardByConsumer(address, reward).send({ from: this.state.accounts[0], gas: 3000000, gasPrice: '10' }) //from: '0x15f13625bf2aE99CebF1BE776e18835bF93Ea623'
        .on('transactionHash', function (hash) {
          console.log("calcuRewardByConsumerHash==", hash)
          let log = {}
          log.address = address
          log.calcuRewardByConsumerHash = hash
          calcuRewardByConsumerLog.push(log)

        })
        .on('receipt', function (receipt) {
          console.log("receipt==", receipt)
        })

    }

    console.log("calcuRewardByConsumerLog==", JSON.stringify(calcuRewardByConsumerLog))
    alert(JSON.stringify(calcuRewardByConsumerLog))
    cacheTansLog.push(JSON.stringify(calcuRewardByConsumerLog))
  }



  consumerVerifiedReward = async () => {
    const { accounts, contract } = this.state;
    //奖金额公布到区块链
    var consumerVerifiedRewardLog = {}
    console.log("rewardValue==", this.state.rewardValue)
    console.log("typerewardValue==", typeof (this.state.rewardValue))
    await contract.methods.consumerVerifiedReward().send({ from: this.state.accounts[0], gas: 3000000, gasPrice: '10' }) //from: '0x15f13625bf2aE99CebF1BE776e18835bF93Ea623'
      .on('transactionHash', function (hash) {
        console.log("consumerVerifiedRewardHash==", hash)

        consumerVerifiedRewardLog.address = accounts[0]
        consumerVerifiedRewardLog.consumerVerifiedRewardHash = hash

      })
      .on('receipt', function (receipt) {
        console.log("receipt==", receipt)
      })

    alert(JSON.stringify(consumerVerifiedRewardLog))
    cacheTansLog.push(JSON.stringify(consumerVerifiedRewardLog))
  }


  calcuRewardP = () => {

    cacheRewardValue = JSON.parse(window.localStorage.getItem("glableRewardValue"));
    console.log("cacheRewardValue", cacheRewardValue)
    //计算每人的激励金额

    calcuRewards(cacheRewardValue).then(res => {
      console.log("reward==", res);
      console.log("type==", typeof (res));
      alert(JSON.stringify(res))
      this.saveRewardByP(res)

    })

  }

  saveRewardByP = async (res) => {
    const { contract } = this.state;

    var calcuRewardByProviderLog = []
    //暂存到区块链

    for (var i in res) {
      var address = res[i].uaddress
      var reward = res[i].reward
      await contract.methods.calcuRewardByProvider(address, reward).send({ from: this.state.accounts[0], gas: 3000000, gasPrice: '10' }) //from: '0x15f13625bf2aE99CebF1BE776e18835bF93Ea623'
        .on('transactionHash', function (hash) {
          console.log("calcuRewardByProviderHash==", hash)
          let log = {}
          log.address = address
          log.calcuRewardByProviderHash = hash
          calcuRewardByProviderLog.push(log)

        })
        .on('receipt', function (receipt) {
          console.log("receipt==", receipt)
        })
    }
    alert(JSON.stringify(calcuRewardByProviderLog))
    cacheTansLog.push(JSON.stringify(calcuRewardByProviderLog))
  }



  providerVertifyQod = async () => {
    const { accounts, contract } = this.state;
    //奖金额公布到区块链
    var providerVerifiedQodLog = {}
    console.log("rewardValue==", this.state.rewardValue)
    console.log("typerewardValue==", typeof (this.state.rewardValue))
    await contract.methods.providerVerifiedQod().send({ from: this.state.accounts[0], gas: 3000000, gasPrice: '10' }) //from: '0x15f13625bf2aE99CebF1BE776e18835bF93Ea623'
      .on('transactionHash', function (hash) {
        console.log("providerVerifiedQodHash==", hash)

        providerVerifiedQodLog.address = accounts[0]
        providerVerifiedQodLog.providerVerifiedQodHash = hash

      })
      .on('receipt', function (receipt) {
        console.log("receipt==", receipt)
      })

    alert(JSON.stringify(providerVerifiedQodLog))
    cacheTansLog.push(JSON.stringify(providerVerifiedQodLog))
  }



  providerVerifiedReward = async () => {
    const { accounts, contract } = this.state;
    //奖金额公布到区块链
    var providerVerifiedRewardLog = {}
    console.log("rewardValue==", this.state.rewardValue)
    console.log("typerewardValue==", typeof (this.state.rewardValue))
    await contract.methods.providerVerifiedReward().send({ from: this.state.accounts[0], gas: 3000000, gasPrice: '10' }) //from: '0x15f13625bf2aE99CebF1BE776e18835bF93Ea623'
      .on('transactionHash', function (hash) {
        console.log("providerVerifiedRewardHash==", hash)

        providerVerifiedRewardLog.address = accounts[0]
        providerVerifiedRewardLog.providerVerifiedRewardHash = hash

      })
      .on('receipt', function (receipt) {
        console.log("receipt==", receipt)
      })

    alert(JSON.stringify(providerVerifiedRewardLog))
    cacheTansLog.push(JSON.stringify(providerVerifiedRewardLog))
  }

  tansfer = async () => {
    const { accounts, contract } = this.state;
    var transferLog = {}

    await contract.methods.transferMoney().send({ from: this.state.accounts[0], gas: 3000000, gasPrice: '80', value: 200 }) //from: '0x15f13625bf2aE99CebF1BE776e18835bF93Ea623'
      .on('transactionHash', function (hash) {
        console.log("transferHash==", hash)

        transferLog.address = accounts[0]
        transferLog.transaction = hash

      })
      .on('receipt', function (receipt) {
        console.log("receipt==", receipt)
      })

    alert(JSON.stringify(transferLog))
    cacheTansLog.push(JSON.stringify(transferLog))

    //改变卖出状态
    this.soldOut(this.state.selectedRowKeys);

    //交易结束，清空当前合约中用户选择de数据
    this.clearSelectedData(contract);
  }

  clearSelectedData = async (contract) => {
    await contract.methods.clearLastTrans().send({ from: this.state.accounts[0], gas: 3000000, gasPrice: '10' }) //from: '0x15f13625bf2aE99CebF1BE776e18835bF93Ea623'
      .on('transactionHash', function (hash) {
        console.log("clearHash==", hash)
      })
      .on('receipt', function (receipt) {
        console.log("receipt==", receipt)
        alert(" The transaction was successfully completed !")
      })
  }

  soldOut = (selectIdArray) => {
    var soldIdArray = []
    for (var i in selectIdArray) {
      soldIdArray.push(this.state.data[selectIdArray[i]])
    }
    console.log("soldIdArray==", JSON.stringify(soldIdArray))

    changeSold(soldIdArray).then(res => {
      console.log("changeSold==", res)
      console.log("type==", typeof (res));
      // alert(JSON.stringify(res))
    })

  }



  statisticQod = async () => {
    const { accounts, contract } = this.state;
    var statisticQodLog = {}

    await contract.methods.statisticQod().send({ from: this.state.accounts[0], gas: 3000000, gasPrice: '10' }) //from: '0x15f13625bf2aE99CebF1BE776e18835bF93Ea623'
      .on('transactionHash', function (hash) {
        console.log("statisticQodHash==", hash)

        statisticQodLog.address = accounts[0]
        statisticQodLog.statisticQodHash = hash

      })
      .on('receipt', function (receipt) {
        console.log("receipt==", receipt)
      })

    alert(JSON.stringify(statisticQodLog))
    cacheTansLog.push(JSON.stringify(statisticQodLog))
  }



  statisticReward = async () => {
    const { accounts, contract } = this.state;
    var statisticRewardLog = {}

    await contract.methods.statisticReward().send({ from: this.state.accounts[0], gas: 3000000, gasPrice: '10' }) //from: '0x15f13625bf2aE99CebF1BE776e18835bF93Ea623'
      .on('transactionHash', function (hash) {
        console.log("statisticRewardHash==", hash)

        statisticRewardLog.address = accounts[0]
        statisticRewardLog.statisticRewardHash = hash

      })
      .on('receipt', function (receipt) {
        console.log("receipt==", receipt)
      })

    alert(JSON.stringify(statisticRewardLog))
    cacheTansLog.push(JSON.stringify(statisticRewardLog))
  }


  isAccept = async () => {
    const { accounts, contract } = this.state;
    var isAcceptLog = {}

    await contract.methods.isAcceptReward().send({ from: this.state.accounts[0], gas: 3000000, gasPrice: '10' }) //from: '0x15f13625bf2aE99CebF1BE776e18835bF93Ea623'
      .on('transactionHash', function (hash) {
        console.log("isAcceptHash==", hash)

        isAcceptLog.address = accounts[0]
        isAcceptLog.isAcceptHash = hash

      })
      .on('receipt', function (receipt) {
        console.log("receipt==", receipt)
      })

    alert(JSON.stringify(isAcceptLog))
    cacheTansLog.push(JSON.stringify(isAcceptLog))
  }

  onValueChange = (event) => {
    this.setState({ rewardValue: event.target.value })
    console.log("eventrewardValue==", event.target.value)
  }

  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };




  render() {
    var { loading, selectedRowKeys } = this.state;


    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;

    return (
      <div>
        <div style={{ marginBottom: 16 }}>

          <Button type="primary" onClick={this.SaveIpfsHashInBlockChain} disabled={!hasSelected} loading={loading}>
            SaveIpfsHashInBlockChain
          </Button>
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
          </span>

          <span style={{ marginLeft: 8 }}>
          < Button type="primary" onClick={this.calcuAndSaveQodByConsu} loading={loading}>
            CalcuQAByConsumer
          </Button>
          </span>

          <span style={{ marginLeft: 8 }}>
          < Button type="primary" onClick={this.consumerVerifiedQod} loading={loading}>
            ConsumerVerifiedQod
          </Button>
          </span>

          <span style={{ marginLeft: 8 }}>
            <FormItem>
              <Input size="default size" prefix={<Icon type="pay-circle" style={{ fontSize: 15, textAlign: "center" }} />} placeholder="Enter incentive amount" value={this.state.rewardValue} onChange={this.onValueChange} />
            </FormItem>
          </span>
         
            <Button type="primary" onClick={this.calcuRewardC} disabled={!hasSelected} loading={loading}>
              CalcuRewardByConsumer
          </Button>
          <span style={{ float: "right" }}>
            <Button type="primary" onClick={this.tansfer} disabled={!hasSelected} loading={loading}>
              Transfer
          </Button>
          </span>

          <span style={{ marginLeft: 8 }}>
            <Button type="primary" onClick={this.consumerVerifiedReward} loading={loading}>
            consumerVerifiedReward
          </Button>
          </span>

          <span style={{ float: "right" }}>
            <Button type="primary" onClick={this.statisticQod} loading={loading}>
            statisticQod
          </Button>
          </span>

          <span style={{ float: "right" }}>
            <Button type="primary" onClick={this.statisticReward} loading={loading}>
              statisticReward
          </Button>
          </span>

        </div>

        <div style={{ marginTop: 36 }}>
          < Button type="primary" onClick={this.calcuAndSaveQodByPro} loading={loading}>
            CalcuQAByProvider
          </Button>
          <span style={{ marginLeft: 8 }}>
            <Button type="primary" onClick={this.providerVertifyQod} loading={loading}>
            ProviderVertifiedQod
          </Button>
          </span>
          <span style={{ marginLeft: 8 }}>
            <Button type="primary" onClick={this.calcuRewardP} loading={loading}>
              CalcuRewardByProvider
          </Button>
          </span>
          <span style={{ marginLeft: 8 }}>
            <Button type="primary" onClick={this.providerVerifiedReward} loading={loading}>
            providerVerifiedReward
          </Button>
          </span>

          <span style={{ marginLeft: 8 }}>
            <Button type="primary" onClick={this.isAccept} loading={loading}>
              isAccept
          </Button>
          </span>

        </div>

        <Table rowSelection={rowSelection} columns={columns} dataSource={this.state.data} />
      </div >
    );
  }




  // render() {
  //   var { loading, selectedRowKeys } = this.state;


  //   const rowSelection = {
  //     selectedRowKeys,
  //     onChange: this.onSelectChange,
  //   };
  //   const hasSelected = selectedRowKeys.length > 0;

  //   return (
  //     <div>
  //       <div style={{ marginBottom: 16 }}>

  //         <Button type="primary" onClick={this.SaveIpfsHashInBlockChain} disabled={!hasSelected} loading={loading}>
  //           SaveIpfsHashInBlockChain
  //         </Button>
  //         <span style={{ marginLeft: 8 }}>
  //           {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
  //         </span>

  //         <span style={{ float: "right" }}>
  //           <Button type="primary" onClick={this.calcuRewardC} disabled={!hasSelected} loading={loading}>
  //             CalcuRewardByConsumer
  //         </Button>
  //         </span>
  //         <span style={{ float: "right" }}>
  //           <FormItem>
  //             <Input size="default size" prefix={<Icon type="pay-circle" style={{ fontSize: 15, textAlign: "center" }} />} placeholder="Enter incentive amount" value={this.state.rewardValue} onChange={this.onValueChange} />
  //           </FormItem>
  //         </span>

  //       </div>

  //       <div style={{ marginBottom: 16 }}>
  //         < Button type="primary" onClick={this.calcuAndSaveQod} loading={loading}>
  //           CalcuQod
  //         </Button>
  //         <span style={{ marginLeft: 8 }}>
  //           <Button type="primary" onClick={this.calcuRewardP} loading={loading}>
  //             CalcuRewardByProvider
  //         </Button>
  //         </span>
  //         <span style={{ marginLeft: 8 }}>
  //           <Button type="primary" onClick={this.providerVerifiedReward} loading={loading}>
  //             providerVerified
  //         </Button>
  //         </span>

  //         <span style={{ marginLeft: 8 }}>
  //           <Button type="primary" onClick={this.statisticReward} loading={loading}>
  //             statisticReward
  //         </Button>
  //         </span>

  //         <span style={{ marginLeft: 8 }}>
  //           <Button type="primary" onClick={this.isAccept} loading={loading}>
  //             isAccept
  //         </Button>
  //         </span>

  //         <span style={{ marginLeft: 8 }}>
  //           <Button type="primary" onClick={this.tansfer} disabled={!hasSelected} loading={loading}>
  //             Transfer
  //         </Button>
  //         </span>

  //       </div>

  //       <Table rowSelection={rowSelection} columns={columns} dataSource={this.state.data} />
  //     </div >
  //   );
  // }

}

export default Home;
