export interface Transaction {
  id: string;
  amount: number;
  buyer: {
    name: string;
    email: string;
  };
  seller: {
    name: string;
    email: string;
  };
  createdAt: string;
}

export interface MonthlyData {
  name: string;
  total: number;
}

export interface AdminStats {
  totalUsers: number;
  totalAds: number;
  totalSubscriptions: number;
  recentTransactions: Transaction[];
  monthlyTransactions: MonthlyData[];
  monthlyUsers: MonthlyData[];
  monthlySubscriptions: MonthlyData[];
}
