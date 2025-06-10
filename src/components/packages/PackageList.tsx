import React from 'react';

const PackageList: React.FC = () => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
        Available Packages
      </h3>
      <div className="bg-gray-100 dark:bg-gray-700 rounded-md p-4 max-h-80 overflow-y-auto">
        <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-mono">
          {`List of products
💎 svp - R$39.00
💎 55 - R$39.00
💎 86 - R$61.50
💎 wkp - R$76.00
💎 165 - R$116.90
💎 172 - R$122.00
💎 wkp2 - R$152.00
💎 257 - R$177.50
💎 275 - R$187.50
💎 cpn - R$219.40
💎 wkp3 - R$228.00
💎 343 - R$239.00
💎 344 - R$244.00
💎 429 - R$299.50
💎 wkp4 - R$304.00
💎 430 - R$305.50
💎 514 - R$355.00
💎 wkp5 - R$380.00
💎 565 - R$385.00
💎 twilight - R$402.50
💎 600 - R$416.50
💎 706 - R$480.00
💎 792 - R$541.50
💎 878 - R$602.00
💎 963 - R$657.50
💎 1049 - R$719.00
💎 1050 - R$724.00
💎 1135 - R$779.50
💎 1220 - R$835.00
💎 1412 - R$960.00
💎 1669 - R$1137.50
💎 1841 - R$1259.50
💎 2195 - R$1453.00
💎 2901 - R$1940.00
💎 3688 - R$2424.00
💎 5532 - R$3660.00
💎 9288 - R$6080.00`}
        </pre>
      </div>
    </div>
  );
};

export default PackageList;