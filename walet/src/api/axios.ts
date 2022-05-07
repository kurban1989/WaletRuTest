import axios from "axios";

export const mainInstance = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
});
