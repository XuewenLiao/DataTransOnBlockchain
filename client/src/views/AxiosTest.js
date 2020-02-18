import React, { Component } from "react";
import Button from 'antd/lib/button';
import axios from 'axios'
class AxiosTest extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    getData = () => {
        axios.get('http://127.0.0.1:4000/axiostest/getdata')
            .then(function (response) {
                // handle success
                console.log(response);
                alert(response.data);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });

    }

    postData = () => {
        axios.post('http://127.0.0.1:4000/axiostest/postdata', {
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "dataType": "json",
                "dataContent": "axios post success"
            }
        })
            .then(function (response) {
                console.log(response.data.data);
                alert(JSON.stringify(response.data.data));
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    insertData = () => {
        axios.post('http://127.0.0.1:4000/axiostest/inserttodb', {
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "username": "u4",
                "password": "p3",
                "location": "长沙3"
            }
        })
            .then(function (response) {
                console.log(response.data);
                alert(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    findData = () => {
        axios.get('http://127.0.0.1:4000/axiostest/findindb')
            .then(function (response) {
                // handle success
                console.log(response.data);
                alert(JSON.stringify(response.data));
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });

    }

    render() {
        return (
            <div>
                <h2>axios获取服务器数据</h2>
                <Button onClick={this.getData}>get data</Button>
                <br />
                <Button onClick={this.postData}>post data</Button>
                <br />
                <Button onClick={this.insertData}>insertData</Button>
                <br />
                <Button type="primary" onClick={this.findData}>findData</Button>
            </div>
        );
    }
}

export default AxiosTest;