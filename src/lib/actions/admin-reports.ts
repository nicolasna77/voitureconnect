import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

export const reportApi = {
  getReports: async ({
    page = 1,
    status = "PENDING",
  }: {
    page?: number;
    status?: string;
  } = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      status,
    });
    const { data } = await api.get(`/admin/reports?${params}`);
    return data;
  },

  handleReport: async ({
    reportId,
    action,
  }: {
    reportId: string;
    action: "resolve" | "dismiss" | "delete_comment";
  }) => {
    const { data } = await api.patch("/admin/reports", { reportId, action });
    return data;
  },
};
