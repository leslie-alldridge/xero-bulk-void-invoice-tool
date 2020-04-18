import request from 'superagent';

export default function consume(method = 'get', endpoint, data = {}) {
  const dataMethod = method.toLowerCase() === 'get' ? 'query' : 'send';
  const headers = {
    Accept: 'application/json'
  };

  return request[method](endpoint)
    .set(headers)
    [dataMethod](data)
    .then(res => {
      return res;
    })
    .catch(err => {
      throw err;
    });
}
