import axiosInstance from './axiosConfig';

export interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  type: string;
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
  status: string;
  stock: number;
  resellKeyword?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Game {
  id: string;
  name: string;
  description: string;
  image: string;
  gradient: string;
  popular?: boolean;
  new?: boolean;
  packageCount?: number;
}

// NEW: Bulk order interfaces
export interface BulkOrderRequest {
  orders: Array<{
    playerId: string;
    identifier: string;
    packageCodes: string[];
    gameName: string;
  }>;
}

export interface BulkOrderResponse {
  success: boolean;
  message: string;
  summary: {
    totalOrders: number;
    successfulOrders: number;
    failedOrders: number;
    partialSuccessOrders: number;
    totalCost: number;
  };
  results: Array<{
    playerId: string;
    identifier: string;
    success: boolean;
    error?: string;
    packages: Array<{
      packageCode: string;
      success: boolean;
      price: number;
      error?: string;
    }>;
  }>;
}

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
  error?: string;
  summary: {
    totalOrders: number;
    validOrders: number;
    invalidOrders: number;
    totalCost: number;
  };
  results: Array<{
    playerId: string;
    identifier: string;
    gameName: string;
    isValid: boolean;
    foundPackages: Array<{
      vendorPackageCode: string;
      name: string;
      price: number;
    }>;
    notFoundCodes: string[];
    totalCost: number;
  }>;
}

export class PackageService {
  // Get all packages (ORIGINAL METHOD)
  static async getAllPackages(): Promise<Package[]> {
    try {
      const response = await axiosInstance.get('/packages?limit=1000');
      return response.data.packages || [];
    } catch (error: any) {
      console.error('Failed to fetch packages:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch packages');
    }
  }
  
  // Get unique games from packages (ORIGINAL METHOD)
  static async getGames(): Promise<Game[]> {
    try {
      const packages = await this.getAllPackages();
      
      // Group packages by game name
      const gameMap = new Map<string, { packages: Package[], count: number }>();
      
      packages.forEach(pkg => {
        if (!gameMap.has(pkg.gameName)) {
          gameMap.set(pkg.gameName, { packages: [], count: 0 });
        }
        gameMap.get(pkg.gameName)!.packages.push(pkg);
        gameMap.get(pkg.gameName)!.count++;
      });
      
      // Convert to Game objects
      const games: Game[] = Array.from(gameMap.entries()).map(([gameName, data]) => {
        const gameId = gameName.toLowerCase().replace(/\s+/g, '-');
        
        // Define gradients for different games
        const gameGradients: { [key: string]: string } = {
          'mobile legends': 'from-blue-500 to-purple-600',
          'free fire': 'from-orange-500 to-red-600',
          'pubg mobile': 'from-yellow-500 to-orange-600',
          'genshin impact': 'from-indigo-500 to-blue-600',
          'call of duty mobile': 'from-gray-700 to-gray-900',
          'valorant': 'from-red-500 to-pink-600',
          'cod mobile': 'from-gray-700 to-gray-900',
        };
        
        // Define descriptions for games
        const gameDescriptions: { [key: string]: string } = {
          'mobile legends': 'Popular MOBA game with millions of players worldwide',
          'free fire': 'Battle royale game with fast-paced action',
          'pubg mobile': 'The ultimate battle royale experience on mobile',
          'genshin impact': 'Open-world action RPG with stunning visuals',
          'call of duty mobile': 'First-person shooter with multiple game modes',
          'valorant': 'Tactical first-person shooter',
          'cod mobile': 'First-person shooter with multiple game modes',
        };
        
        const lowerGameName = gameName.toLowerCase();
        
        return {
          id: gameId,
          name: gameName,
          description: gameDescriptions[lowerGameName] || `Popular ${gameName} game`,
          image: `/images/games/${gameId}.jpg`,
          gradient: gameGradients[lowerGameName] || 'from-gray-500 to-gray-700',
          packageCount: data.count,
          popular: data.count >= 3,
          new: data.packages.some(pkg => {
            const createdDate = new Date(pkg.createdAt);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return createdDate > thirtyDaysAgo;
          })
        };
      });
      
      return games.sort((a, b) => {
        if (b.packageCount !== a.packageCount) {
          return (b.packageCount || 0) - (a.packageCount || 0);
        }
        return a.name.localeCompare(b.name);
      });
      
    } catch (error: any) {
      console.error('Failed to fetch games:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch games');
    }
  }

  // Get packages for a specific game (ORIGINAL METHOD)
  static async getPackagesByGame(gameName: string): Promise<Package[]> {
    try {
      const response = await axiosInstance.get(`/packages?gameName=${encodeURIComponent(gameName)}&limit=1000`);
      return response.data.packages || [];
    } catch (error: any) {
      console.error('Failed to fetch packages for game:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch packages for game');
    }
  }

  // MISSING METHODS THAT HOMEPAGE NEEDS:

  // Get regions for a specific game
  static async getRegionsForGame(gameName: string): Promise<string[]> {
    try {
      const packages = await this.getPackagesByGame(gameName);
      const regions = Array.from(new Set(packages.map(pkg => pkg.region).filter(region => region)));
      return regions.sort();
    } catch (error: any) {
      console.error('Error fetching regions for game:', error);
      return [];
    }
  }

  // Parse package codes from string (handles + separator)
  static parsePackageCodes(packageCodesString: string): string[] {
    return packageCodesString
      .split(/[+,]/)
      .map(code => code.trim())
      .filter(code => code.length > 0);
  }

  // Search multiple packages by codes
  static async searchMultiplePackagesByCodes(packageCodes: string[], gameName: string): Promise<{
    found: Package[];
    notFound: string[];
  }> {
    try {
      const packages = await this.getPackagesByGame(gameName);
      const found: Package[] = [];
      const notFound: string[] = [];

      packageCodes.forEach(code => {
        const foundPackage = packages.find(pkg => 
          pkg.resellKeyword && pkg.resellKeyword === code
        );
        
        if (foundPackage) {
          found.push(foundPackage);
        } else {
          notFound.push(code);
        }
      });

      return { found, notFound };
    } catch (error: any) {
      console.error('Failed to search packages:', error);
      throw new Error(error.response?.data?.message || 'Failed to search packages');
    }
  }

  // Get available packages with limit
  static async getAvailablePackages(gameName: string, limit: number = 15): Promise<Package[]> {
    try {
      const packages = await this.getPackagesByGame(gameName);
      return packages.slice(0, limit);
    } catch (error: any) {
      console.error('Failed to fetch available packages:', error);
      return [];
    }
  }

  // Calculate total price of packages
  static calculateTotalPrice(packages: Package[]): number {
    return packages.reduce((total, pkg) => total + pkg.price, 0);
  }

  // Create multi-package order
  static async createMultiPackageOrder(orderData: any): Promise<any> {
    try {
      const response = await axiosInstance.post('/transactions/orders', orderData);
      return response.data;
    } catch (error: any) {
      console.error('Failed to create multi-package order:', error);
      throw new Error(error.response?.data?.message || 'Failed to create multi-package order');
    }
  }

  // Get available games (simple list for chat)
  static async getAvailableGames(): Promise<string[]> {
    try {
      const games = await this.getGames();
      return games.map(game => game.name);
    } catch (error: any) {
      console.error('Error fetching games:', error);
      return ['Mobile Legends', 'Free Fire', 'PUBG Mobile', 'Genshin Impact', 'Call of Duty Mobile'];
    }
  }

  // Get package codes for a specific game
  static async getPackageCodesForGame(gameName: string): Promise<string[]> {
    try {
      const packages = await this.getPackagesByGame(gameName);
      const codes = Array.from(new Set(
        packages
          .map(pkg => pkg.vendorPackageCode.split(','))
          .flat()
          .map(code => code.trim())
          .filter(code => code)
      ));
      return codes.sort();
    } catch (error: any) {
      console.error('Error fetching package codes:', error);
      return this.getFallbackPackageCodes(gameName);
    }
  }

  // Search package by code and game
  static async searchPackageByCode(code: string, gameName: string): Promise<Package | null> {
    try {
      const packages = await this.getPackagesByGame(gameName);
      return packages.find(pkg => 
        pkg.vendorPackageCode.split(',').map(c => c.trim()).includes(code)
      ) || null;
    } catch (error: any) {
      console.error('Failed to search package:', error);
      throw new Error(error.response?.data?.message || 'Failed to search package');
    }
  }

  // NEW: Bulk order methods
  static async createBulkOrder(bulkOrderData: BulkOrderRequest): Promise<BulkOrderResponse> {
    try {
      console.log('Creating bulk order:', bulkOrderData);
      const response = await axiosInstance.post('/transactions/orders/bulk', bulkOrderData);
      return response.data;
    } catch (error: any) {
      console.error('Failed to create bulk order:', error);
      throw new Error(error.response?.data?.message || 'Failed to create bulk order');
    }
  }

  static async validateBulkOrder(validationData: PackageValidationRequest): Promise<PackageValidationResponse> {
    try {
      const response = await axiosInstance.post('/packages/validate-bulk', validationData);
      return response.data;
    } catch (error: any) {
      console.error('Error validating bulk order:', error);
      throw new Error(error.response?.data?.message || 'Failed to validate bulk order');
    }
  }

  // Helper methods for chat functionality
  static getFallbackPackageCodes(gameName: string): string[] {
    const fallbackCodes: { [key: string]: string[] } = {
      'Mobile Legends': ['86', '172', '257', '344', '429', '514', '600', '706', '878', '963'],
      'Free Fire': ['100', '210', '520', '1080', '2200', '5600'],
      'PUBG Mobile': ['60', '325', '660', '1800', '3850', '8100'],
      'Genshin Impact': ['60', '300', '980', '1980', '3280', '6480'],
      'Call of Duty Mobile': ['80', '400', '800', '2000', '5000', '10000']
    };
    return fallbackCodes[gameName] || [];
  }

  // Chat parsing methods
  static parseChatMessage(message: string): {
    type: 'single' | 'bulk' | 'invalid';
    orders: Array<{
      playerId: string;
      identifier: string;
      packageCodes: string[];
      gameName: string;
      rawText: string;
    }>;
    errors: string[];
  } {
    try {
      const lines = message.trim().split('\n').filter(line => line.trim());
      const orders = [];
      const errors = [];

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        const orderResult = this.parseOrderLine(trimmedLine);
        
        if (orderResult.success && orderResult.order) {
          orders.push(orderResult.order);
        } else {
          errors.push(`Invalid line: "${trimmedLine}" - ${orderResult.error}`);
        }
      }

      return {
        type: orders.length === 0 ? 'invalid' : (orders.length === 1 ? 'single' : 'bulk'),
        orders,
        errors
      };
    } catch (error) {
      console.error('Error parsing chat message:', error);
      return {
        type: 'invalid',
        orders: [],
        errors: ['Failed to parse message']
      };
    }
  }

  static parseOrderLine(line: string): {
    success: boolean;
    order?: {
      playerId: string;
      identifier: string;
      packageCodes: string[];
      gameName: string;
      rawText: string;
    };
    error?: string;
  } {
    try {
      const parts = line.split('|').map(part => part.trim());
      
      if (parts.length !== 4) {
        return {
          success: false,
          error: 'Expected format: playerId|identifier|packageCodes|gameName'
        };
      }

      const [playerId, identifier, packageCodesStr, gameName] = parts;

      if (!playerId || !identifier || !packageCodesStr || !gameName) {
        return {
          success: false,
          error: 'All fields are required'
        };
      }

      const packageCodes = this.parsePackageCodes(packageCodesStr);
      
      if (packageCodes.length === 0) {
        return {
          success: false,
          error: 'No valid package codes found'
        };
      }

      return {
        success: true,
        order: {
          playerId,
          identifier,
          packageCodes,
          gameName,
          rawText: line
        }
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to parse order line'
      };
    }
  }

  static formatValidationResults(validationResult: PackageValidationResponse): string {
    let message = `📊 **Validation Results:**\n\n`;
    message += `• Total orders: ${validationResult.summary.totalOrders}\n`;
    message += `• Valid orders: ${validationResult.summary.validOrders}\n`;
    message += `• Invalid orders: ${validationResult.summary.invalidOrders}\n`;
    message += `• Total cost: ${validationResult.summary.totalCost.toFixed(2)} XCN\n\n`;

    if (validationResult.results.length > 0) {
      message += `📋 **Order Details:**\n\n`;
      
      validationResult.results.forEach((result, index) => {
        const status = result.isValid ? '✅' : '❌';
        message += `${status} **Order ${index + 1}:** ${result.playerId} | ${result.identifier}\n`;
        message += `   Game: ${result.gameName}\n`;
        
        if (result.foundPackages.length > 0) {
          message += `   Found packages:\n`;
          result.foundPackages.forEach(pkg => {
            message += `   • ${pkg.vendorPackageCode} - ${pkg.name} (${pkg.price} XCN)\n`;
          });
        }
        
        if (result.notFoundCodes.length > 0) {
          message += `   ❌ Not found: ${result.notFoundCodes.join(', ')}\n`;
        }
        
        if (result.isValid) {
          message += `   💰 Cost: ${result.totalCost.toFixed(2)} XCN\n`;
        }
        
        message += '\n';
      });
    }

    return message;
  }

  // Get user balance (ORIGINAL METHOD)
  static async getUserBalance(): Promise<number> {
    try {
      const response = await axiosInstance.get('/users/balance');
      return response.data.balance || 0;
    } catch (error: any) {
      console.error('Failed to fetch user balance:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch user balance');
    }
  }

  // Create order (ORIGINAL METHOD)
  static async createOrder(orderData: {
    packageId: string;
    playerId: string;
    identifier: string;
    gameName: string;
  }): Promise<any> {
    try {
      const response = await axiosInstance.post('/transactions/orders', orderData);
      return response.data;
    } catch (error: any) {
      console.error('Failed to create order:', error);
      throw new Error(error.response?.data?.message || 'Failed to create order');
    }
  }

  // Get order by ID (ORIGINAL METHOD)
  static async getOrderById(orderId: string): Promise<any> {
    try {
      const response = await axiosInstance.get(`/transactions/orders/${orderId}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch order:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch order');
    }
  }

  // Get user orders (ORIGINAL METHOD)
  static async getUserOrders(): Promise<any[]> {
    try {
      const response = await axiosInstance.get('/transactions/orders/user');
      return response.data.orders || [];
    } catch (error: any) {
      console.error('Failed to fetch user orders:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch user orders');
    }
  }

  // Search packages (ORIGINAL METHOD)
  static async searchPackages(query: string): Promise<Package[]> {
    try {
      const response = await axiosInstance.get(`/packages/search?q=${encodeURIComponent(query)}`);
      return response.data.packages || [];
    } catch (error: any) {
      console.error('Failed to search packages:', error);
      throw new Error(error.response?.data?.message || 'Failed to search packages');
    }
  }

  // Get package by ID (ORIGINAL METHOD)
  static async getPackageById(packageId: string): Promise<Package> {
    try {
      const response = await axiosInstance.get(`/packages/${packageId}`);
      return response.data.package;
    } catch (error: any) {
      console.error('Failed to fetch package:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch package');
    }
  }

  // Get featured packages (ORIGINAL METHOD)
  static async getFeaturedPackages(): Promise<Package[]> {
    try {
      const response = await axiosInstance.get('/packages?featured=true&limit=10');
      return response.data.packages || [];
    } catch (error: any) {
      console.error('Failed to fetch featured packages:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch featured packages');
    }
  }

  // Get packages by region (ORIGINAL METHOD)
  static async getPackagesByRegion(region: string): Promise<Package[]> {
    try {
      const response = await axiosInstance.get(`/packages?region=${encodeURIComponent(region)}&limit=1000`);
      return response.data.packages || [];
    } catch (error: any) {
      console.error('Failed to fetch packages by region:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch packages by region');
    }
  }

  // Get all regions (ORIGINAL METHOD)
  static async getRegions(): Promise<string[]> {
    try {
      const packages = await this.getAllPackages();
      const regions = Array.from(new Set(packages.map(pkg => pkg.region).filter(region => region)));
      return regions.sort();
    } catch (error: any) {
      console.error('Failed to fetch regions:', error);
      return [];
    }
  }

  // Get package statistics (ORIGINAL METHOD)
  static async getPackageStats(): Promise<any> {
    try {
      const response = await axiosInstance.get('/packages/stats');
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch package stats:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch package stats');
    }
  }

  // Check package availability (ORIGINAL METHOD)
  static async checkPackageAvailability(packageId: string): Promise<boolean> {
    try {
      const response = await axiosInstance.get(`/packages/${packageId}/availability`);
      return response.data.available || false;
    } catch (error: any) {
      console.error('Failed to check package availability:', error);
      return false;
    }
  }

  // Get package price (ORIGINAL METHOD)
  static async getPackagePrice(packageId: string): Promise<number> {
    try {
      const response = await axiosInstance.get(`/packages/${packageId}/price`);
      return response.data.price || 0;
    } catch (error: any) {
      console.error('Failed to fetch package price:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch package price');
    }
  }

  // Validate order data (ORIGINAL METHOD)
  static validateOrderData(orderData: {
    packageId: string;
    playerId: string;
    identifier: string;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!orderData.packageId || orderData.packageId.trim() === '') {
      errors.push('Package ID is required');
    }

    if (!orderData.playerId || orderData.playerId.trim() === '') {
      errors.push('Player ID is required');
    }

    if (!orderData.identifier || orderData.identifier.trim() === '') {
      errors.push('Identifier is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Format price (ORIGINAL METHOD)
  static formatPrice(price: number): string {
    return `${price.toFixed(2)} XCN`;
  }

  // Format package name (ORIGINAL METHOD)
  static formatPackageName(pkg: Package): string {
    return `${pkg.name} - ${pkg.gameName}`;
  }

  // Get package display info (ORIGINAL METHOD)
  static getPackageDisplayInfo(pkg: Package): {
    title: string;
    subtitle: string;
    price: string;
    badge?: string;
  } {
    return {
      title: pkg.name,
      subtitle: `${pkg.gameName} - ${pkg.region}`,
      price: this.formatPrice(pkg.price),
      badge: pkg.featured ? 'Featured' : pkg.discount > 0 ? `${pkg.discount}% OFF` : undefined
    };
  }
}

export default PackageService;
