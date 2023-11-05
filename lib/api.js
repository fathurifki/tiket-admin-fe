import axios from "axios";

const Axios = axios.create();
Axios.defaults.baseURL = process.env.SECRET_API_URL || process.env.NEXT_PUBLIC_API_URL;
// const token = localStorage.getItem("token");
// const AUTH_TOKEN = token ? `${token}` : "";

// axios.defaults.headers.common["Authorization"] = `Bearer ${AUTH_TOKEN}`;

Axios.interceptors.request.use(function (config) {
//   config.headers["Authorization"] = `Bearer ${AUTH_TOKEN}`;
  return config;
});

Axios.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    const { response } = error;
    if (response?.status === 401) {
      alert("error");
      //   toast({
      //     title: "An error occurred.",
      //     description: "Token is expired, please Login again",
      //     status: "error",
      //     duration: 3000,
      //     isClosable: true,
      //   });
      return response;
    } else {
      return response;
    }
  }
);

Axios.defaults.timeout = 2000;
Axios.defaults.withCredentials = true;

export default Axios;
