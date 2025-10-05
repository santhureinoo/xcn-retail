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

// Import the new TransactionDetailsPage
import TransactionDetailsPage from './pages/TransactionDetailsPage';

// Protected route component for authenticated users
const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated, loading } = useAuth();
  
  // If still loading auth state, show a loading indicator or nothing
  if (loading) {
    return <div>Loading...</div>; // Or some loading component
  }
  
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

// Special protected route that redirects to home when on /chat route
const ChatRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated, loading } = useAuth();
  
  // If still loading auth state, show a loading indicator or nothing
  if (loading) {
    return <div>Loading...</div>; // Or some loading component
  }
  
  
  // Otherwise, if authenticated, render the element; if not, redirect to login
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

// Guest route component for non-authenticated users
const GuestRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated, loading } = useAuth();
  
  // If still loading auth state, show a loading indicator or nothing
 if (loading) {
    return <div>Loading...</div>; // Or some loading component
  }
  
  return isAuthenticated ? <Navigate to="/home" replace /> : element;
};

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Guest routes - redirect to home if logged in */}
        <Route path="/" element={
          <GuestRoute element={
            <PageTransition>
              <LoginPage />
            </PageTransition>
          } />
        } />
        <Route path="/login" element={
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

        {/* Package Order Page - redirect to home on refresh only for this route */}
        <Route path="/chat" element={
          <ChatRoute element={
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
        <Route path="/transaction-details/:id" element={
          <ProtectedRoute element={
            <Layout>
              <PageTransition>
                <TransactionDetailsPage />
              </PageTransition>
            </Layout>
          } />
        } />
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

        {/* Fallback route - redirect to home or login based on auth status */}
        <Route path="*" element={
          isAuthenticated ? <Navigate to="/chat" replace /> : <Navigate to="/login" replace />
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