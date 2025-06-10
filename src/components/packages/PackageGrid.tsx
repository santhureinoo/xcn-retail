import React, { memo, useEffect } from 'react';
import { Package } from '../../types/package';
import PackageCard from './PackageCard';

interface PackageGridProps {
  packages: Package[];
  onViewDetails: (pkg: Package) => void;
  onPurchase: (pkg: Package) => void;
  lastElementRef: (node: HTMLDivElement | null) => void;
}

const PackageGrid: React.FC<PackageGridProps> = ({ 
  packages, 
  onViewDetails, 
  onPurchase, 
  lastElementRef 
}) => {

 useEffect(()=>{
    console.log('rendering grid');
 },[packages])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {packages.map((pkg, index) => {
        const isLastElement = index === packages.length - 1;
        return (
          <PackageCard
            key={pkg.id}
            pkg={pkg}
            onViewDetails={onViewDetails}
            onPurchase={onPurchase}
            forwardedRef={isLastElement ? lastElementRef : undefined}
          />
        );
      })}
    </div>
  );
};

export default memo(PackageGrid);