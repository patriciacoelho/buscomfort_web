import axios from 'axios';

export default axios.create({
  baseURL: 'http://localhost:3080/api',
  headers: {
    'Content-type': 'application/json',
  },
});
