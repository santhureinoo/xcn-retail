import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sheet, SheetHeader, SheetTitle, SheetClose, SheetContent } from '../ui/sheet';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { t } = useTranslation();
  const location = useLocation();
  
  // For swipe gesture
  const touchStartX = useRef<number | null>(null);
  const currentX = useRef<number | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [swiping, setSwiping] = useState(false);
  const [swipePosition, setSwipePosition] = useState(0);
  const sidebarWidth = 280; // Width of the sidebar in pixels
  const minSwipeDistance = 50; // Minimum distance required for a swipe
  const edgeThreshold = 30; // Distance from the edge to start detecting swipes
  
  // Check if the current path matches or starts with the given path
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/home';
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  const menuItems = [
    { name: t('home'), path: '/packages', icon: '🏠' },
    // { name: t('packages'), path: '/packages', icon: '📦' },
    { 
      name: t('transactions'), 
      path: '/transactions', 
      icon: '💰',
      submenu: [
        // { name: t('currencyTransactions'), path: '/transactions/currency' },
        // { name: t('packageTransactions'), path: '/transactions/packages' }
      ]
    },
    { name: t('settings'), path: '/settings', icon: '⚙️' },
  ];

  // Reset swipe state when sidebar is toggled programmatically
  useEffect(() => {
    if (!swiping) {
      setSwipePosition(isOpen ? sidebarWidth : 0);
    }
  }, [isOpen, swiping]);

  // Setup touch event listeners for swipe detection
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      // Only detect swipes starting from the left edge of the screen when sidebar is closed
      if (!isOpen && e.touches[0].clientX <= edgeThreshold) {
        touchStartX.current = e.touches[0].clientX;
        currentX.current = e.touches[0].clientX;
        setSwiping(true);
        setSwipePosition(0);
      } 
      // Or detect swipes anywhere when sidebar is open (to close it)
      else if (isOpen) {
        touchStartX.current = e.touches[0].clientX;
        currentX.current = e.touches[0].clientX;
        setSwiping(true);
        setSwipePosition(sidebarWidth);
      } else {
        touchStartX.current = null;
        currentX.current = null;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartX.current !== null && currentX.current !== null) {
        // Prevent default to avoid scrolling while swiping
        e.preventDefault();
        
        currentX.current = e.touches[0].clientX;
        
        if (!isOpen) {
          // Opening: limit swipe position to sidebar width
          const newPosition = Math.min(currentX.current - touchStartX.current, sidebarWidth);
          setSwipePosition(Math.max(0, newPosition));
        } else {
          // Closing: calculate how much we've swiped left from the initial position
          const swipedLeft = touchStartX.current - currentX.current;
          const newPosition = Math.max(0, sidebarWidth - swipedLeft);
          setSwipePosition(newPosition);
        }
      }
    };

    const handleTouchEnd = () => {
      if (touchStartX.current !== null && currentX.current !== null) {
        const distance = currentX.current - touchStartX.current;
        
        // Determine whether to open or close based on swipe distance and direction
        if (!isOpen && distance > minSwipeDistance) {
          // Open if swiped right enough
          toggleSidebar();
        } else if (isOpen && distance < -minSwipeDistance) {
          // Close if swiped left enough
          toggleSidebar();
        } else {
          // Snap back to original position if swipe wasn't far enough
          setSwipePosition(isOpen ? sidebarWidth : 0);
        }
      }
      
      // Reset values
      touchStartX.current = null;
      currentX.current = null;
      setSwiping(false);
    };

    // Add event listeners
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    // Cleanup
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isOpen, toggleSidebar]);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        <span className="text-xl font-semibold text-gray-800 dark:text-white">{t('appName')}</span>
      </div>
      <nav className="flex-1 mt-5 px-2">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <React.Fragment key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-2 text-base font-medium rounded-md transition-colors ${
                  isActive(item.path)
                    ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => window.innerWidth < 1024 && toggleSidebar()}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </Link>
              
              {/* Submenu items */}
              {item.submenu && isActive(item.path) && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.submenu.map((subItem : any) => (
                    <Link
                      key={subItem.name}
                      to={subItem.path}
                      className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        location.pathname === subItem.path
                          ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white'
                      }`}
                      onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </nav>
    </div>
  );

  // Mobile version with swipe gesture
  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
    return (
      <>
        {/* Swipe indicator when sidebar is closed */}
        {!isOpen && !swiping && (
          <div 
            className="fixed top-1/2 left-0 transform -translate-y-1/2 h-24 w-2 bg-blue-500 dark:bg-blue-400 rounded-r-md opacity-30 z-20"
            aria-hidden="true"
          />
        )}
        
        {/* Custom swipeable sidebar */}
        <div 
          className={`fixed inset-0 z-50 ${(isOpen || swiping) ? 'visible' : 'invisible'}`}
          style={{
            pointerEvents: (isOpen || swiping) ? 'auto' : 'none',
          }}
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black transition-opacity duration-300"
            style={{
              opacity: swipePosition / sidebarWidth * 0.5,
              pointerEvents: swipePosition > 0 ? 'auto' : 'none'
            }}
            onClick={toggleSidebar}
          />
          
          {/* Sidebar */}
          <div 
            ref={sidebarRef}
            className="absolute top-0 left-0 h-full w-[280px] bg-white dark:bg-gray-800 shadow-xl transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(${swipePosition - sidebarWidth}px)`,
              transition: swiping ? 'none' : 'transform 0.3s ease-out'
            }}
          >
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
              <span className="text-xl font-semibold text-gray-800 dark:text-white">{t('appName')}</span>
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="mt-5 px-2">
              <div className="space-y-1">
                {menuItems.map((item) => (
                  <React.Fragment key={item.name}>
                    <Link
                      to={item.path}
                      className={`flex items-center px-4 py-2 text-base font-medium rounded-md transition-colors ${
                        isActive(item.path)
                          ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      onClick={toggleSidebar}
                    >
                      <span className="mr-3 text-lg">{item.icon}</span>
                      {item.name}
                    </Link>
                    
                    {/* Submenu items */}
                    {item.submenu && isActive(item.path) && (
                      <div className="ml-8 mt-1 space-y-1">
                        {item.submenu.map((subItem : any) => (
                          <Link
                            key={subItem.name}
                            to={subItem.path}
                            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                              location.pathname === subItem.path
                                ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white'
                            }`}
                            onClick={toggleSidebar}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </>
    );
  }

  // Desktop version (fixed sidebar)
  return (
    <div className="hidden lg:block lg:w-64 bg-white dark:bg-gray-800 h-screen border-r border-gray-200 dark:border-gray-700">
      <SidebarContent />
    </div>
  );
};

export default Sidebar;