import axios from "axios";
const API_URL = "/api/";

class AuthService {
  getUsers() {
    return axios.get(API_URL + "users").then((response) => {
      return response;
    });
  }

  login(email, password) {
    return axios
      .post(API_URL + "login", {
        email,
        password,
      })
      .then((response) => {
        if (response.data.token) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      })
      .catch((er) => {
        console.log(er);
        alert("Wrong Credentials!☹️");
        return er;
      });
  }

  logout() {
    localStorage.removeItem("user");
    return axios.get(API_URL + "logout");
  }

  async isLoggedIn() {
    var user = localStorage.getItem("user");
    const user2 = JSON.parse(user);
    var res = await axios.get(API_URL + "validate");
    console.log("From Validate");
    console.log(res);
    if (user2 && user2.token && res.data.isAuth) {
      console.log("successfull logged in");
      return true;

    } else {
      console.log("Something is wrong");
      return false;
    }
  }

  register(name, email, password) {
    return axios
      .post(API_URL + "register", {
        name,
        email,
        password,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

export default new AuthService();
