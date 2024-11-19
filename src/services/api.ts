import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
});

export const userApi = {
  getUsers: async () => {
    const { data } = await api.get("/admin/users");
    return data;
  },
  updateUserRole: async ({
    userId,
    role,
  }: {
    userId: string;
    role: string;
  }) => {
    const { data } = await api.patch(`/admin/users/${userId}/role`, { role });
    return data;
  },
  deleteUser: async (userId: string) => {
    const { data } = await api.delete(`/admin/users/${userId}`);
    return data;
  },
};
