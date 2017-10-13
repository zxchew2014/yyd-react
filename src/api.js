import axios from 'axios';

export default {
  user: {
    login: accessToken =>
      axios.post('/api/auth/login', { accessToken }).then(res => res.data.user),
    updateprofile: data =>
      axios.post('/api/users/updateDO', { data }).then(res => res.data.user)
  }
};
