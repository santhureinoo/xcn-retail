// Package type definition
export interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  type: 'diamond' | 'weekly' | 'monthly' | 'special' | 'subscription';
  gameId: string;
  featured: boolean;
  discount: number;
  amount: number;
  duration: number;
  region: string;
  gameName: string;
  vendor: string;
  vendorPackageCode: string;
  vendorPrice: number;
  currency: string;
  status: 'active' | 'inactive' | 'out_of_stock';
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface VendorPackage {
  code: string;
  name: string;
  price: number;
  currency: string;
  diamonds?: number;
  description?: string;
}

export interface Vendor {
  id: string;
  name: string;
  region: string;
  gameName: string;
  packages: VendorPackage[];
}

export interface PackageFilters {
  region?: string;
  gameName?: string;
  vendor?: string;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// NEW: Bulk Order Types
export interface BulkOrderRequest {
  orders: UserOrderData[];
}

export interface UserOrderData {
  playerId: string;
  identifier: string;
  packageCodes: string[];
  gameName: string;
}

export interface BulkOrderResponse {
  success: boolean;
  results: UserOrderResult[];
  summary: {
    totalOrders: number;
    successfulOrders: number;
    failedOrders: number;
    totalCost: number;
    partialSuccessOrders: number;
  };
  message: string;
}

export interface UserOrderResult {
  playerId: string;
  identifier: string;
  gameName: string;
  success: boolean;
  packages: PackageOrderResult[];
  totalCost: number;
  transactionId?: string;
  orderId?: string;
  error?: string;
}

export interface PackageOrderResult {
  packageCode: string;
  packageName: string;
  price: number;
  success: boolean;
  error?: string;
}

// NEW: Package Search Types
export interface PackageSearchRequest {
  code: string;
  gameName: string;
}

export interface PackageSearchResponse {
  success: boolean;
  package: Package | null;
  found: boolean;
  error?: string;
}

export interface BulkPackageSearchRequest {
  codes: string[];
  gameName: string;
}

export interface BulkPackageSearchResponse {
  success: boolean;
  found: Package[];
  notFound: string[];
  foundCount: number;
  notFoundCount: number;
  error?: string;
}

// NEW: Package Validation Types
export interface PackageValidationRequest {
  orders: Array<{
    playerId: string;
    identifier: string;
    packageCodes: string[];
    gameName: string;
  }>;
}

export interface PackageValidationResponse {
  success: boolean;
  results: PackageValidationResult[];
  summary: {
    totalOrders: number;
    validOrders: number;
    invalidOrders: number;
    totalCost: number;
  };
  error?: string;
}

export interface PackageValidationResult {
  playerId: string;
  identifier: string;
  gameName: string;
  foundPackages: Package[];
  notFoundCodes: string[];
  isValid: boolean;
  totalCost: number;
}

// NEW: Chat Parsing Types
export interface ParsedChatMessage {
  type: 'single' | 'bulk' | 'invalid';
  orders: ParsedOrder[];
  errors: string[];
}

export interface ParsedOrder {
  playerId: string;
  identifier: string;
  packageCodes: string[];
  gameName: string;
  rawText: string;
}

// NEW: Order Processing Types
export interface OrderProcessingState {
  isProcessing: boolean;
  currentStep: string;
  progress: number;
  results: UserOrderResult[];
  errors: string[];
}

// NEW: Chat Response Types
export interface ChatResponse {
  type: 'search' | 'validation' | 'order' | 'error';
  message: string;
  data?: any;
  timestamp: string;
}

// Existing single order types (keeping for backward compatibility)
export interface CreateOrderRequest {
  packageId: string;
  playerId: string;
  identifier: string;
  packageCode: string;
  gameName: string;
  playerDetails: {
    playerId: string;
    identifier: string;
    game: string;
  };
}

export interface CreateOrderResponse {
  success: boolean;
  order: {
    id: string;
    status: string;
    amount: number;
    packageName: string;
    playerId: string;
    createdAt: string;
  };
  orderId: string;
  message: string;
}

// Add this interface
export interface Game {
  id: string;
  name: string;
  gradient: string;
  popular?: boolean;
  new?: boolean;
  packageCount: number;
}