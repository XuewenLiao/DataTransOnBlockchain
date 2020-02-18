import axios from 'axios';

export const findData = () => axios.get('http://127.0.0.1:4000/axiostest/findindb').
    then(function (response) {

        // handle success
        console.log(response.data);
        return response.data;
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    });

//从数据库读数据
export const getOrigData = () => axios.get('http://127.0.0.1:4000/datacotrol/findallindb')
    .then(function (response) {
        // handle success
        console.log("response==", response);
        const thedata = response.data;
        console.log("thedata==", thedata);
        return response.data;
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    });

//上传更新ipfshash后的数据
export const sendData = (newData) => axios.post('http://127.0.0.1:4000/datacotrol/updatehashdata', {
    headers: {
        'Content-Type': 'application/json'
    },
    data: newData
})
    .then(function (response) {
        console.log("sendResult==",response.data);
        alert(JSON.stringify(response.data));
        return response.data;
    })
    .catch(function (error) {
        console.log(error);
    });