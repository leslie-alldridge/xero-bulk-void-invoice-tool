import request from 'superagent';

export default function consume(method = 'get', endpoint, data = {}) {
  const dataMethod = method.toLowerCase() === 'get' ? 'query' : 'send';
  const headers = {
    Accept: 'application/json',
  };

  return request[method](endpoint)
    .set(headers)
    .timeout({
      response: 300000, // Wait 5 seconds for the server to start sending,
      deadline: 60000, // but allow 1 minute for the file to finish loading.
    })
    [dataMethod](data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
}
