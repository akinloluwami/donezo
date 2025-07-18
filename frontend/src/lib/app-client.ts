import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true,
});

export const appClient = {
  auth: {
    login: async (email: string, password: string) => {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      return response.data;
    },
  },
};
