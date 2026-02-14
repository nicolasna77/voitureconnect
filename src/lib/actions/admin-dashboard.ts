import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AdminStats, AdminAnalytics, PaginatedSubscriptions } from "@/types/admin";

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const { data } = await axios.get<AdminStats>("/api/admin/stats");
      return data;
    },
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const { data } = await axios.get("/api/admin/users");
      return data;
    },
  });
}

export function useAdminAds() {
  return useQuery({
    queryKey: ["admin", "ads"],
    queryFn: async () => {
      const { data } = await axios.get("/api/admin/ads");
      return data;
    },
  });
}

export function useAdminSubscriptions() {
  return useQuery({
    queryKey: ["admin", "subscriptions"],
    queryFn: async () => {
      const { data } = await axios.get("/api/admin/subscriptions");
      return data;
    },
  });
}

export function useAdminAnalytics() {
  return useQuery({
    queryKey: ["admin", "analytics"],
    queryFn: async () => {
      const { data } = await axios.get<AdminAnalytics>("/api/admin/analytics");
      return data;
    },
  });
}

export const subscriptionApi = {
  getSubscriptions: async ({
    page = 1,
    search = "",
    plan = "",
    status = "",
  }: {
    page?: number;
    search?: string;
    plan?: string;
    status?: string;
  } = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      ...(search && { search }),
      ...(plan && { plan }),
      ...(status && { status }),
    });

    const { data } = await axios.get<PaginatedSubscriptions>(
      `/api/admin/subscriptions?${params}`
    );
    return data;
  },
};
