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

export interface SpecAccessEntry {
  specificationId: number;
  specificationType: string;
  accessCount: number;
  totalCreditsSpent: number;
}

export interface AdminStats {
  totalUsers: number;
  totalAds: number;
  totalSubscriptions: number;
  totalRevenue: number;
  subscriptionRevenue: number;
  totalCreditsPurchased: number;
  totalCreditsUsed: number;
  totalSpecAccesses: number;
  recentTransactions: Transaction[];
  monthlyTransactions: MonthlyData[];
  monthlyUsers: MonthlyData[];
  monthlySubscriptions: MonthlyData[];
  monthlyRevenue: MonthlyData[];
  monthlyCredits: MonthlyData[];
  monthlySpecAccesses: MonthlyData[];
  topSpecifications: SpecAccessEntry[];
}

export interface AdminAnalytics {
  totalCreditsPurchased: number;
  totalCreditsUsed: number;
  totalCreditsBalance: number;
  totalSpecAccesses: number;
  monthlyCredits: MonthlyData[];
  monthlySpecAccesses: MonthlyData[];
  topSpecifications: SpecAccessEntry[];
}

export interface SubscriptionRow {
  id: string;
  plan: string;
  status: string;
  startDate: string;
  endDate: string;
  amount: number;
  isAnnual: boolean;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface PaginatedSubscriptions {
  subscriptions: SubscriptionRow[];
  total: number;
  pages: number;
}
