import axios from "axios";

export default {
  user: {
    login: accessToken =>
      axios.post("/api/auth", { accessToken }).then(res => res.data.user),
    updateprofile: data =>
      axios
        .post("/api/users/update-teacher", { data })
        .then(res => res.data.user)
  }
};
