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

