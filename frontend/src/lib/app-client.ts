import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true,
});

export const appClient = {
  auth: {
    login: async (payload: { email: string; password: string }) => {
      const response = await axiosInstance.post("/auth/login", payload);
      return response.data;
    },
    signup: async (payload: {
      name: string;
      email: string;
      password: string;
    }) => {
      const response = await axiosInstance.post("/auth/signup", payload);
      return response.data;
    },
  },
};
