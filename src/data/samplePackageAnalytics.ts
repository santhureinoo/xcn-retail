export interface PackageAnalytics {
  orderSuccessRate: {
    completed: number;
    failed: number;
    pending: number;
    partial: number;
  };
  processingMetrics: {
    averageProcessingTime: number;
    totalOrdersProcessed: number;
    successRate: number;
    failureReasons: Array<{
      reason: string;
      count: number;
    }>;
  };
  monthlyTrend: Array<{
    month: string;
    amount: number;
    orderCount: number;
  }>;
  popularPackages: Array<{
    packageCode: string;
    orderCount: number;
    revenue: number;
    successRate: number;
  }>;
  timeDistribution: Array<{
    hour: number;
    orderCount: number;
  }>;
  playerAnalytics: {
    uniquePlayers: number;
    repeatCustomers: number;
    averageOrderValue: number;
  };
}

export const samplePackageAnalytics: PackageAnalytics = {
  orderSuccessRate: {
    completed: 156,
    failed: 23,
    pending: 8,
    partial: 12
  },
  processingMetrics: {
    averageProcessingTime: 18,
    totalOrdersProcessed: 199,
    successRate: 84.2,
    failureReasons: [
      { reason: "Insufficient inventory", count: 8 },
      { reason: "Invalid player ID", count: 6 },
      { reason: "Server unavailable", count: 5 },
      { reason: "Payment processing issue", count: 4 }
    ]
  },
  monthlyTrend: [
    { month: "Jan", amount: 1240, orderCount: 45 },
    { month: "Feb", amount: 1680, orderCount: 62 },
    { month: "Mar", amount: 2100, orderCount: 78 },
    { month: "Apr", amount: 1890, orderCount: 69 },
    { month: "May", amount: 2340, orderCount: 89 },
    { month: "Jun", amount: 2680, orderCount: 98 }
  ],
  popularPackages: [
    { packageCode: "💎wkp", orderCount: 89, revenue: 6764, successRate: 92.1 },
    { packageCode: "💎premium", orderCount: 67, revenue: 8040, successRate: 88.5 },
    { packageCode: "💎weekly", orderCount: 45, revenue: 2250, successRate: 95.6 },
    { packageCode: "💎monthly", orderCount: 34, revenue: 5100, successRate: 91.2 }
  ],
  timeDistribution: [
    { hour: 0, orderCount: 2 },
    { hour: 6, orderCount: 8 },
    { hour: 12, orderCount: 25 },
    { hour: 18, orderCount: 35 },
    { hour: 21, orderCount: 28 }
  ],
  playerAnalytics: {
    uniquePlayers: 142,
    repeatCustomers: 67,
    averageOrderValue: 76.50
  }
};