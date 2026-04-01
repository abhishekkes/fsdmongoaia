import axios from "axios";

const API = axios.create({
  baseURL: "https://fsdmongoaia-1-medr.onrender.com/api"
});

// 🔥 Attach token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.authorization = token;
  }

  return req;
});

export default API;