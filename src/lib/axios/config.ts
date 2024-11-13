import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api`,
});

export default api;
