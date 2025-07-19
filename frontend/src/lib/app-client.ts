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
  labels: {
    createLabel: async (payload: { name: string; color?: string }) => {
      const response = await axiosInstance.post("/labels", payload);
      return response.data;
    },
    getLabels: async () => {
      const response = await axiosInstance.get("/labels");
      return response.data;
    },
    updateLabel: async (
      id: string,
      payload: { name?: string; color?: string }
    ) => {
      const response = await axiosInstance.put(`/labels/${id}`, payload);
      return response.data;
    },
    deleteLabel: async (id: string) => {
      const response = await axiosInstance.delete(`/labels/${id}`);
      return response.data;
    },
  },
  tasks: {
    createTask: async (payload: any) => {
      const response = await axiosInstance.post("/tasks", payload);
      return response.data;
    },
    getTasks: async (params?: any) => {
      const response = await axiosInstance.get("/tasks", { params });
      return response.data;
    },
    updateTask: async (id: string, payload: any) => {
      const response = await axiosInstance.put(`/tasks/${id}`, payload);
      return response.data;
    },
    deleteTask: async (id: string) => {
      const response = await axiosInstance.delete(`/tasks/${id}`);
      return response.data;
    },
  },
};
