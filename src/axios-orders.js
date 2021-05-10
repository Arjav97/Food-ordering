import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-burger-89318.firebaseio.com/'
});

export default instance;