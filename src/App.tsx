import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MusicProvider } from './contexts/MusicContext';
import PageTransition from './components/layout/PageTransition';
import { App as CapApp } from '@capacitor/app';
import './i18n/i18n';

// Import your pages
import Home from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GuestHomePage from './pages/GuestHomePage';
import PackagesPage from './pages/PackagesPage';
import CurrencyTransactionsPage from './pages/CurrencyTransactionsPage';
import PackageTransactionsPage from './pages/PackageTransactionsPage';
import TransactionDetailPage from './pages/TransactionDetailPage';
import PackageOrderPage from './pages/PackageOrderPage';
import HomePage from './pages/HomePage';

// Protected route component for authenticated users
const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

// Guest route component for non-authenticated users
const GuestRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/home" replace /> : element;
};

// Back button handler component - must be inside Router
function BackButtonHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleBackButton = () => {
      // If we're on the login page, exit the app
      if (location.pathname === '/' || location.pathname === '/login') {
        CapApp.exitApp();
      } else {
        // Otherwise, navigate back in the app
        navigate(-1);
      }
    };

    const backButtonListener = CapApp.addListener('backButton', handleBackButton);

    return () => {
      backButtonListener.then(listener => listener.remove());
    };
  }, [navigate, location.pathname]);

  return null; // This component doesn't render anything
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <BackButtonHandler /> {/* Add this inside Router */}
      <Routes>
        {/* Guest routes - redirect to home if logged in */}
        <Route path="/" element={
          <GuestRoute element={
            <PageTransition>
              <LoginPage />
            </PageTransition>
          } />
        } />
        {/* <Route path="/register" element={
          <GuestRoute element={
            <PageTransition>
              <RegisterPage />
            </PageTransition>
          } />
        } /> */}
        {/* <Route path="/" element={
          isAuthenticated ?
            <Navigate to="/home" replace /> :
            <PageTransition>
              <GuestHomePage />
            </PageTransition>
        } /> */}

        {/* App routes - require authentication */}
        <Route path="/home" element={
          <ProtectedRoute element={
            <Layout>
              <PageTransition>
                <PackagesPage />
              </PageTransition>
            </Layout>
          } />
        } />

        {/* Packages routes - require authentication */}
        <Route path="/packages" element={
          <ProtectedRoute element={
            <Layout>
              <PageTransition>
                <PackagesPage />
              </PageTransition>
            </Layout>
          } />
        } />

        <Route path="/packages/:packageId" element={
          <ProtectedRoute element={
            <Layout>
              <PageTransition>
                <PackagesPage />
              </PageTransition>
            </Layout>
          } />
        } />

        {/* Package Order Page */}
        <Route path="/chat" element={
          <ProtectedRoute element={
            <Layout>
              <PageTransition>
                <HomePage />
              </PageTransition>
            </Layout>
          } />
        } />

        {/* Transaction routes */}
        <Route path="/transactions/currency" element={
          <ProtectedRoute element={
            <Layout>
              <PageTransition>
                <CurrencyTransactionsPage />
              </PageTransition>
            </Layout>
          } />
        } />
        {/* <Route path="/transactions/packages" element={
          <ProtectedRoute element={
            <Layout>
              <PageTransition>
                <PackageTransactionsPage />
              </PageTransition>
            </Layout>
          } />
        } /> */}
        <Route path="/transactions/:transactionId" element={
          <ProtectedRoute element={
            <Layout>
              <PageTransition>
                <TransactionDetailPage />
              </PageTransition>
            </Layout>
          } />
        } />

        {/* Default transactions route redirects to currency transactions */}
        <Route path="/transactions" element={
          <ProtectedRoute element={
            <Layout>
              <PageTransition>
                <PackageTransactionsPage />
              </PageTransition>
            </Layout>
          } />
        } />

        {/* Fallback route - redirect to home or guest home */}
        <Route path="*" element={
          isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/" replace />
        } />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MusicProvider>
          <AppRoutes />
        </MusicProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;