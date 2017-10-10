import axios from 'axios';

export default {
  user: {
    login: credentials =>
      axios.post('/', { credentials }).then(res => res.data.user)
  }
};
