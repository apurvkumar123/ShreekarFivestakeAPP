import axios from 'axios';
import {serverPath} from './serverConfig';
import constant from '../constants/constant';
import NetInfo from '@react-native-community/netinfo';
import {Alert, BackHandler} from 'react-native';
var config = {
  baseUrl: serverPath,
  headers: {
    Accept: 'application/json',
    Authorization: constant.ACCESS_TOKEN,
  },
};

const base = async param => {
  const CancelToken = axios.CancelToken;
  let source = CancelToken.source();
  setTimeout(() => {
    source.cancel();
  }, 10000);

  return await axios({
    method: param.method,
    baseURL: config.baseUrl,
    url: param.url,
    headers: {
      'Content-Type': 'application/json',
      accept: '*/*',
    },
    cancelToken: source.token,
    data: param.data,
  })
    .then(res => {
      return Promise.resolve(res);
    })
    .catch(err => {
      if (err.response) {
        return Promise.reject(err.response);
      } else {
        return Promise.reject('TIMEOUT');
      }
    });
};

const request = async (method, url) => {
  console.log('Acc-', constant.ACCESS_TOKEN);
  return await base({method, url})
    .then(res => Promise.resolve(res))
    .catch(err => Promise.reject(err));
};

const requestData = async (method, url, data) => {
  console.log('url:', url);
  return await base({method, url, data})
    .then(res => Promise.resolve(res))
    .catch(err => Promise.reject(err));
};

export default {
  request,
  requestData,
};
