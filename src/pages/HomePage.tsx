import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLocation } from 'react-router-dom';
import packageService, { Game } from '../services/packageService';
import { useBalance } from '../hooks/useBalance';

// Message types
type MessageType = 'incoming' | 'outgoing' | 'system';

interface Message {
  id: string;
  content: string;
  type: MessageType;
  timestamp: Date;
  isProcessing?: boolean;
}

// ADD THESE NEW INTERFACES
export interface MultiPackageOrderData {
  packages: {
    packageId: string;
    packageCode: string;
    quantity: number;
  }[];
  playerId: string;
  identifier: string;
  gameName: string;
  playerDetails: {
    playerId: string;
    identifier: string;
    game: string;
  };
}

const HomePage: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  // Get game info from route state if available
  const routeState = location.state as {
    selectedGame?: Game,
    preMessage?: string
  } | null;

  const selectedGame = routeState?.selectedGame;
  const preMessage = routeState?.preMessage;

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [availableRegions, setAvailableRegions] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const { balance, smileCoinBalance, loading, error, refetch: refreshBalance, fetchSmileCoinBalanceByRegion } = useBalance(selectedRegion, 'both');
  const [regionSmileCoinBalance, setRegionSmileCoinBalance] = useState<number>(0);
  const [availablePackages, setAvailablePackages] = useState<{ code: string, name: string, price: number }[]>([]);
  const [currentBalance, setCurrentBalance] = useState(balance);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update local balance when global balance changes
  useEffect(() => {
    setCurrentBalance(balance);
  }, [balance]);

  // Initialize messages based on selected game
  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      content: selectedGame
        ? `Welcome ${user?.firstName || 'valued customer'}! You've selected ${selectedGame.name}. Please provide your player details in this format: "PLAYER_ID IDENTIFIER PACKAGE_CODE"`
        : `Welcome ${user?.firstName || 'valued customer'}! To place an order, please enter your details in this format: "PLAYER_ID IDENTIFIER PACKAGE_CODE"`,
      type: 'incoming',
      timestamp: new Date()
    };

    setMessages([welcomeMessage]);

    // Set pre-message if available
    if (preMessage) {
      setInputValue(preMessage);
    }
  }, [selectedGame, preMessage, user?.firstName]);

  // Load regions and packages for selected game
  useEffect(() => {
    if (selectedGame) {
      loadGameData(selectedGame.name);
    }
  }, [selectedGame]);

  // Refresh smile coin balance when region changes
  useEffect(() => {
    // Debounce the API call to prevent excessive calls
    const debounceTimer = setTimeout(async () => {
      if (selectedRegion && selectedRegion.trim() !== '') {
        try {
          // Fetch the smile coin balance for the selected region using the hook function
          const regionBalance = await fetchSmileCoinBalanceByRegion(selectedRegion);
          setRegionSmileCoinBalance(regionBalance);
        } catch (error) {
          console.error('Failed to fetch smile coin balance for region:', error);
          setRegionSmileCoinBalance(0);
        }
      }
    }, 300); // 300ms debounce

    // Clear the timeout if the effect is re-run before the delay
    return () => clearTimeout(debounceTimer);
  }, [selectedRegion, fetchSmileCoinBalanceByRegion]); // Depend on selectedRegion and fetchSmileCoinBalanceByRegion

  const loadGameData = async (gameName: string) => {
    try {
      const regions = await packageService.getRegionsForGame(gameName);
      setAvailableRegions(regions);
      // Only set the first region as default if available and no region is already selected
      // and if the available regions don't already include the selected region
      if (regions.length > 0 && (!selectedRegion || !regions.includes(selectedRegion))) {
        // Only set the region if it's different from the current one to avoid unnecessary re-renders
        if (selectedRegion !== regions[0]) {
          setSelectedRegion(regions[0]);
        }
      }
      console.log('Loaded regions for', gameName, ':', regions);
    } catch (error) {
      console.error('Failed to load game data:', error);
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Add this additional effect to handle initial scroll
  useEffect(() => {
    // Scroll to the first message with a slight delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      type: 'outgoing',
      timestamp: new Date()
    };

    // Add user message
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);

    // Simulate processing
    const processingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: 'Processing your request...',
      type: 'system',
      timestamp: new Date(),
      isProcessing: true
    };

    setMessages(prev => [...prev, processingMessage]);

    // Simulate API response
    setTimeout(async () => {
      setMessages(prev => prev.filter(msg => !msg.isProcessing));

      // Generate response based on input
      const response = await generateResponse(userMessage.content, selectedGame);

      const botMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: response,
        type: 'incoming',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsProcessing(false);
    }, 2000);
  };

  const generateResponse = async (userInput: string, selectedGame?: Game): Promise<string> => {
    const input = userInput.toLowerCase();

    // Split by comma to get different orders/users
    const orderLines = userInput.trim().split(',').map(line => line.trim()).filter(line => line);

    // Original single order pattern
    const orderPattern = /^[\w\d]+\s+[\w\d]+\s+[\w\d_+]+$/;

    // Check if this looks like order(s)
    const isOrderInput = orderLines.every(line => orderPattern.test(line));

    if (isOrderInput) {
      const gameName = selectedGame?.name || 'the selected game';

      try {
        // Process each order line
        const allOrderResults = [];
        let totalCost = 0;
        

        // First, validate all orders and calculate total cost
        for (const orderLine of orderLines) {
          const parts = orderLine.trim().split(/\s+/);

          if (parts.length !== 3) {
            return `❌ Invalid format in: "${orderLine}"\nPlease use: "PLAYER_ID IDENTIFIER PACKAGE_CODE"`;
          }

          const [playerId, identifier, packageCodesString] = parts;

          // Parse package codes (split by +)
          const packageCodes = packageService.parsePackageCodes(packageCodesString);

          if (packageCodes.length === 0) {
            return `❌ No valid package codes found in: "${orderLine}"`;
          }

          // Search for packages
          // Get all packages for the game first
          const allPackages = await packageService.getPackagesByGame(gameName);

          // Filter by region if selected
          const regionFilteredPackages = selectedRegion
            ? allPackages.filter(pkg => pkg.region === selectedRegion)
            : allPackages;

          // Search for packages within the filtered list
          const { found: foundPackages, notFound: notFoundCodes } = await packageService.searchMultiplePackagesByCodes(
            packageCodes,
            gameName,
            regionFilteredPackages
          );

          if (notFoundCodes.length > 0) {
            return `❌ Some packages not found for ${gameName} in order: "${orderLine}"      
              ❌ Not found: ${notFoundCodes.join(', ')}
              ${foundPackages.length > 0 ? `✅ Found: ${foundPackages.map(p => p.vendorPackageCode).join(', ')}` : ''}`;
          }

          // Calculate cost using effective pricing for resellers
          // Get vendorName from the last package if available
          const lastPackage = foundPackages[foundPackages.length - 1];
          const vendorName = lastPackage?.vendorName || '';
          
          const orderCost = foundPackages.reduce((total, pkg) => {
            return total + packageService.getEffectivePrice(pkg, user?.role || 'RETAILER', vendorName);
          }, 0);
          totalCost += orderCost;

          allOrderResults.push({
            playerId,
            identifier,
            packageCodes,
            foundPackages,
            orderCost,
            orderLine
          });
        }

        // Get vendorName from the last package of the first order if available
                let vendorName = '';
                if (allOrderResults.length > 0 && allOrderResults[0].foundPackages.length > 0) {
                  const lastPackage = allOrderResults[0].foundPackages[allOrderResults[0].foundPackages.length - 1];
                  vendorName = lastPackage?.vendorName || '';
                }
                
                const userBalance = await packageService.getUserBalanceWithVendor(vendorName, selectedRegion);

          console.log(userBalance, totalCost);

        // Check total balance
        if (userBalance < totalCost) {
          return `❌ Insufficient balance for all orders!
          Orders to process: ${orderLines.length}`;
        }

        // Now create all orders
        const finalResults = [];
        let newBalance = userBalance;

        for (const orderData of allOrderResults) {
          try {
            // Create ONE order with multiple packages for this user
            const multiPackageOrderData = {
              packageId: orderData.foundPackages.map(pkg => pkg.id).join(','),
              playerId: orderData.playerId,
              // packages: orderData.foundPackages.map(pkg => ({
              //   packageId: pkg.id,
              //   packageCode: pkg.vendorPackageCode,
              //   quantity: 1
              // })),
              // playerId: orderData.playerId,
              identifier: orderData.identifier,
              gameName: gameName,
              packageCode: orderData.foundPackages.map(pkg => pkg.vendorPackageCode).join(','),
              playerDetails: {
                playerId: orderData.playerId,
                identifier: orderData.identifier,
                game: gameName
              }
            };

            // Call the multi-package order function (you need this in backend)
            const orderResult = await packageService.createMultiPackageOrder(multiPackageOrderData);

            if (orderResult.success) {
              finalResults.push({
                playerId: orderData.playerId,
                identifier: orderData.identifier,
                packages: orderData.foundPackages,
                cost: orderData.orderCost,
                orderId: orderResult.order?.id || orderResult.orderId,
                success: true
              });
              newBalance -= orderData.orderCost;
            } else {
              finalResults.push({
                playerId: orderData.playerId,
                identifier: orderData.identifier,
                packages: orderData.foundPackages,
                cost: orderData.orderCost,
                error: orderResult.message,
                success: false
              });
            }
          } catch (error: any) {
            finalResults.push({
              playerId: orderData.playerId,
              identifier: orderData.identifier,
              packages: orderData.foundPackages,
              cost: orderData.orderCost,
              error: error.message,
              success: false
            });
          }
        }

        // Update balance by refreshing from server
        // The newBalance variable represents the balance used for the transaction
        // but we should refresh both balances from the server to ensure accuracy
        if (refreshBalance) {
          refreshBalance();
        }

        // Format response
        const successfulOrders = finalResults.filter(r => r.success);
        const failedOrders = finalResults.filter(r => !r.success);

        if (successfulOrders.length === orderLines.length) {
          // All successful
          let response = `✅ All ${orderLines.length} order(s) successful!\n\n`;

          successfulOrders.forEach((order, index) => {
            response += `📋 Order ${index + 1}:\n`;
            response += `👤 Player: ${order.playerId} | ${order.identifier}\n`;
            response += `📦 Packages (${order.packages.length}):\n`;
            // Get vendorName from the last package if available
            const lastPackage = order.packages[order.packages.length - 1];
            const vendorName = lastPackage?.vendorName || '';
            
            order.packages.forEach(pkg => {
              console.log(user, ' --- User in order response');
              const pricingInfo = packageService.formatPricingDisplay(pkg, user?.role || 'RESELLER', vendorName);
              const currency = pricingInfo.currency || 'XCN';
              // Format the price to remove any leading zeros if it's a number that should be treated as integer
              const formattedPrice = Number.isInteger(pricingInfo.price) ? pricingInfo.price : parseFloat(pricingInfo.price.toFixed(2));
              if (pricingInfo.isSpecialPricing) {
                response += `   • ${pkg.vendorPackageCode} - ${pkg.name} (${formattedPrice} ${currency})\n`;
              } else {
                response += `   • ${pkg.vendorPackageCode} - ${pkg.name} (${formattedPrice} ${currency})\n`;
              }
            });
            // Get currency from the first package in the order
            const firstPackage = order.packages[0];
            const firstPackageVendorName = firstPackage?.vendorName || '';
            const firstPackagePricingInfo = packageService.formatPricingDisplay(firstPackage, user?.role || 'RESELLER', firstPackageVendorName);
            const orderCurrency = firstPackagePricingInfo.currency || 'XCN';
            // Format the cost to remove any leading zeros if it's a number that should be treated as integer
            const formattedCost = Number.isInteger(order.cost) ? order.cost : parseFloat(order.cost.toFixed(2));
            response += `💰 Cost: ${formattedCost} ${orderCurrency}\n`;
            response += `🆔 Order ID: ${order.orderId}\n\n`;
          });

          // Determine currency from first order's first package
          let currency = 'XCN';
          if (successfulOrders.length > 0 && successfulOrders[0].packages.length > 0) {
            const firstPackage = successfulOrders[0].packages[0];
            const firstPackageVendorName = firstPackage?.vendorName || '';
            const firstPackagePricingInfo = packageService.formatPricingDisplay(firstPackage, user?.role || 'RESELLER', firstPackageVendorName);
            currency = firstPackagePricingInfo.currency || 'XCN';
          }
          
          // response += `💳 Total cost: ${totalCost} ${currency}\n`;
          // response += `💳 New balance: ${newBalance} ${currency}\n\n`;
          response += `Need anything else? 🎮`;

          return response;

        } else {
          // Some failed
          let response = `⚠️ ${successfulOrders.length}/${orderLines.length} orders successful!\n\n`;

          if (successfulOrders.length > 0) {
            response += `✅ Successful orders:\n`;
            successfulOrders.forEach((order, index) => {
              // Get currency from the first package in the order
              const firstPackage = order.packages[0];
              const firstPackageVendorName = firstPackage?.vendorName || '';
              const firstPackagePricingInfo = packageService.formatPricingDisplay(firstPackage, user?.role || 'RESELLER', firstPackageVendorName);
              const orderCurrency = firstPackagePricingInfo.currency || 'XCN';
              // Format the cost to remove any leading zeros if it's a number that should be treated as integer
              const formattedCost = Number.isInteger(order.cost) ? order.cost : parseFloat(order.cost.toFixed(2));
              response += `• Player ${order.playerId}: ${order.packages.length} packages (${formattedCost} ${orderCurrency})\n`;
            });
            response += '\n';
          }

          if (failedOrders.length > 0) {
            response += `❌ Failed orders:\n`;
            failedOrders.forEach((order, index) => {
              response += `• Player ${order.playerId}: ${order.error}\n`;
            });
          }

          // Determine currency based on the first successful order if available, otherwise use first failed order
          let currency = 'XCN';
          if (successfulOrders.length > 0 && successfulOrders[0].packages.length > 0) {
            const firstPackage = successfulOrders[0].packages[0];
            const firstPackageVendorName = firstPackage?.vendorName || '';
            const firstPackagePricingInfo = packageService.formatPricingDisplay(firstPackage, (user as any)?.role || 'RESELLER', firstPackageVendorName);
            currency = firstPackagePricingInfo.currency || 'XCN';
          } else if (failedOrders.length > 0 && failedOrders[0].packages.length > 0) {
            const firstPackage = failedOrders[0].packages[0];
            const firstPackageVendorName = firstPackage?.vendorName || '';
            const firstPackagePricingInfo = packageService.formatPricingDisplay(firstPackage, (user as any)?.role || 'RESELLER', firstPackageVendorName);
            currency = firstPackagePricingInfo.currency || 'XCN';
          }
          
          // Format the new balance to remove any leading zeros if it's a number that should be treated as integer
          const formattedNewBalance = Number.isInteger(newBalance) ? newBalance : parseFloat(newBalance.toFixed(2));
          response += `\n💳 New balance: ${formattedNewBalance} ${currency}`;

          return response;
        }

      } catch (error: any) {
        console.error('Order creation failed:', error);
        return `❌ Order failed: ${error.message}`;
      }
    }

    // Handle package inquiry using service
    if (input.includes('package') || input.includes('code') || input.includes('price')) {
      if (selectedGame) {
        try {
          const packages = await packageService.getPackagesByGame(selectedGame.name);

          // Filter packages by selected region if one is selected
          const filteredPackages = selectedRegion
            ? packages.filter(pkg => pkg.region === selectedRegion)
            : packages;

          if (filteredPackages.length > 0) {
            // Group by region/identifier if available
            const packagesByRegion = filteredPackages.reduce((acc: any, pkg: any) => {
              const region = pkg.region || 'General';
              if (!acc[region]) acc[region] = [];
              acc[region].push(pkg);
              return acc;
            }, {});

            let response = `Available packages for ${selectedGame.name}:\n\n`;

            // If a specific region is selected, only show packages for that region
            if (selectedRegion) {
              const regionPackages = packagesByRegion[selectedRegion] || [];
              response += `📍 ${selectedRegion}:\n`;
              regionPackages.slice(0, 10).forEach((pkg: any) => { // Show max 10 packages
                const stockStatus = pkg.stock > 0 ? '✅' : '❌';
                // Show dual pricing for resellers on Smile packages
                if (pkg.vendorName === 'Smile') {
                  response += `${stockStatus} ${pkg.resellKeyword} - ${pkg.name}\n`;
                  response += `   💰Reseller: ${pkg.baseVendorCost || 0} Smile Coins\n`;
                } else {
                  response += `${stockStatus} ${pkg.resellKeyword} - ${pkg.name} (${pkg.price} XCN)\n`;
                }
              });
            } else {
              // Show packages grouped by region
              Object.entries(packagesByRegion).forEach(([region, pkgs]: [string, any]) => {
                response += `📍 ${region}:\n`;
                pkgs.slice(0, 5).forEach((pkg: any) => { // Show max 5 per region
                  const stockStatus = pkg.stock > 0 ? '✅' : '❌';
                  // Show dual pricing for resellers on Smile packages
                  if (pkg.vendorName === 'Smile') {
                    response += `${stockStatus} ${pkg.resellKeyword} - ${pkg.name}\n`;
                    response += `   💰Reseller: ${pkg.vendorPrice || 0} Smile Coins\n`;
                  } else {
                    response += `${stockStatus} ${pkg.resellKeyword} - ${pkg.name} (${pkg.price} XCN)\n`;
                  }
                });
                response += '\n';
              });
            }

            response += `💰 Your balances:\n`;
            response += `   • XCN: ${currentBalance}\n`;
            response += `   • Smile Coins: ${regionSmileCoinBalance || smileCoinBalance}\n\n`;
            response += 'Use format: "PLAYER_ID IDENTIFIER PACKAGE_CODE"\n';
            response += 'Example: "1234566 12345 ML_86"';
            return response;
          }
        } catch (error) {
          console.error('Failed to fetch packages:', error);
        }

        return `I'm having trouble fetching package information right now. Please try again later or contact support.`;
      } else {
        return `Please select a game first to see available packages. You can go to the games page to choose a game.`;
      }
    }

    // Handle balance inquiry using service
    if (input.includes('balance') || input.includes('money') || input.includes('coin')) {
      try {
        const fetchedBalance = await packageService.getUserBalance();
        setCurrentBalance(fetchedBalance);

        return `💰 Your current balance: ${fetchedBalance} XCN

You can use your XCN to purchase game packages. Each package has a different cost.

Would you like to:
• See available packages
• Place an order
• Check top-up options

How can I help you?`;
      } catch (error) {
        console.error('Failed to fetch balance:', error);

        return `💰 Your current balance: ${currentBalance} XCN (cached)

Having trouble fetching latest balance. Please try again.`;
      }
    }

    // Handle help
    if (input.includes('help') || input.includes('how')) {
      const gameInfo = selectedGame ? `You've selected ${selectedGame.name}.` : 'Please select a game first.';

      return `I'm here to help you purchase game diamonds! Here's how it works:

${gameInfo}

💰 Your balance: ${currentBalance} XCN

🔄 How to order:
1️⃣ Choose your game from the games page (if not selected)
2️⃣ Provide your details in one of these formats:

📝 Single package:
"PLAYER_ID IDENTIFIER PACKAGE_CODE"
• "391379101 15749 wk"
• "124442415749 225"

📝 Multiple packages:
"PLAYER_ID IDENTIFIER CODE1+CODE2+CODE3"
• "391379101 15749 wk+86"
• "391379101 15749 wk+86+172"

📝 Bulk orders (multiple players):
Paste multiple lines, each with player details

3️⃣ I'll process your order and deduct XCN from your balance

💡 You can ask me about:
• Available packages and codes
• Your balance
• Order status

Need help with anything specific?`;
    }

    // Handle order status
    if (input.includes('status') || input.includes('order')) {
      return `To check your order status, please provide your Order ID.

If you want to place a new order, use this format:
"PLAYER_ID IDENTIFIER PACKAGE_CODE"

Example: "1234566 12345 ML_86"

💰 Your current balance: ${balance} XCN`;
    }

    // Default response
    if (!input.includes('package') && !input.includes('balance') && !input.includes('status')) {
      const gameContext = selectedGame
        ? `You've selected ${selectedGame.name}. `
        : 'Please select a game first from the games page. ';

      return `${gameContext}To place an order, use one of these formats:

📝 Single package:
"PLAYER_ID IDENTIFIER PACKAGE_CODE"
• "391379101 15749 wk"
• "124442415749 225"

📝 Multiple packages:
"PLAYER_ID IDENTIFIER CODE1+CODE2+CODE3"
• "391379101 15749 wk+86"
• "391379101 15749 wk+86+172"

💰 Your balance: ${currentBalance} XCN

You can also ask me about:
• Available packages and prices
• Your current balance
• How to place orders

What would you like to do? 🎮`;
    }

    // Fallback return
    return "I'm not sure how to help with that. Please try asking about packages, balance, or placing an order.";
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Gaming Assistant
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedGame ? `${selectedGame.name} • ` : ''}
                  {`XCN: ${currentBalance} | Smile: ${regionSmileCoinBalance || smileCoinBalance}`
                  }
                </p>
              </div>
            </div>

            {/* Game Selection Indicator */}
            {selectedGame && (
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-90/30 px-3 py-2 rounded-lg">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${selectedGame.gradient}`}></div>
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    {selectedGame.name}
                  </span>
                </div>

                {/* Region Selector */}
                {availableRegions.length > 0 && (
                  <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Region:
                    </label>
                    <select
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      className="bg-white dark:bg-gray-600 text-gray-900 dark:text-white text-sm rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {availableRegions.map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Messages Container */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-4xl mx-auto px-4 py-6">
          <div className="h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col">

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'outgoing' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.type === 'outgoing'
                        ? 'bg-blue-600 text-white'
                        : message.type === 'system'
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      } ${message.isProcessing ? 'animate-pulse' : ''}`}
                  >
                    <div className="whitespace-pre-wrap text-sm">
                      {message.content}
                    </div>
                    <div className={`text-xs mt-1 ${message.type === 'outgoing'
                        ? 'text-blue-100'
                        : message.type === 'system'
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder={selectedGame ? "Enter: PLAYER_ID IDENTIFIER PACKAGE_CODE" : "Type your message..."}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isProcessing}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isProcessing ? (
                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  onClick={() => setInputValue('help')}
                  className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Help
                </button>
                <button
                  onClick={() => setInputValue('packages')}
                  className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Show Packages
                </button>
                <button
                  onClick={() => setInputValue('balance')}
                  className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Check Balance
                </button>
                {/* {selectedGame && (
                  <button
                    onClick={() => setInputValue('123456789 MY ML_86')}
                    className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    Example Order
                  </button>
                )} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;