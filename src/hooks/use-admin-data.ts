import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface AdminStats {
  totalUsers: number;
  totalAds: number;
  totalSubscriptions: number;
  recentTransactions: any[];
}

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
