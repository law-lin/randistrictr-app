import axios from 'axios';

const HOST = 'http://localhost:8080/randistrictr';

const defaultInstance = {
  baseURL: HOST,
  timeout: 10000,
};

const apiCaller = axios.create(defaultInstance);

export default apiCaller;
