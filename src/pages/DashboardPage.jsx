import React, { useState, useEffect } from 'react';
import { Container, Box, Grid, Typography, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import SubscriptionForm from '../components/dashboard/SubscriptionForm';
import SubscriptionsList from '../components/dashboard/SubscriptionsList';
import AppBar from '../components/layout/AppBar';
import ClientInfoCard from '../components/layout/ClientInfoCard';
import clientService from '../services/clientService';

const DashboardPage = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [clientData, setClientData] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { isAuthenticated, isLoading: authLoading, user, logout } = useAuth();
  const navigate = useNavigate();

  const fetchClientData = async () => {
    try {
      const data = await clientService.getClientInfo();
      setClientData(data);
    } catch (error) {
      console.error('Error fetching client data:', error);
      setError('No se pudo cargar la información del cliente');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only check authentication if not already loading
    if (!authLoading) {
      // If not authenticated, redirect to login
      if (!isAuthenticated) {
        navigate('/login', { 
          state: { 
            message: 'Por favor inicia sesión para acceder al panel',
            severity: 'warning'
          },
          replace: true
        });
      } else {
        // If authenticated, fetch client data
        fetchClientData();
      }
    }
  }, [isAuthenticated, authLoading, navigate, refreshKey]);

  const handleSubscriptionCreated = () => {
    // This will trigger a refresh of the subscriptions list
    window.scrollTo(0, 0);
    setError('');
    setRefreshKey(prevKey => prevKey + 1);
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    window.scrollTo(0, 0);
  };

  // Show loading state while checking authentication or loading data
  if (authLoading || isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar user={clientData} onLogout={logout} />
      
      <Container maxWidth="xl" sx={{ mt: 3, mb: 4, flex: 1 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        
        <Grid container spacing={3}>
          {/* Left Column - Client Info */}
          <Grid item xs={12} md={4} lg={3}>
            <ClientInfoCard client={clientData} />
          </Grid>
          
          {/* Right Column - Subscription Form and List */}
          <Grid item xs={12} md={8} lg={9}>
            <Box sx={{ mb: 3 }}>
              <SubscriptionForm 
                onSubscriptionCreated={handleSubscriptionCreated} 
                onError={handleError} 
              />
            </Box>
            
            <Box>
              <SubscriptionsList key={refreshKey} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default DashboardPage;
