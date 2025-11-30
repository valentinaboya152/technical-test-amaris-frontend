// En src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Alert, 
  CircularProgress,
  Paper,
  Divider
} from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import { clientService } from '@/services/clientServices/clientService';
import SubscriptionForm from '../components/dashboard/SubscriptionForm';
import SubscriptionsList from '../components/dashboard/SubscriptionsList';

const DashboardPage = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [clientInfo, setClientInfo] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Función para cargar la información del cliente
  const fetchClientInfo = async () => {
    try {
      const data = await clientService.getClientInfo();
      setClientInfo(data);
    } catch (err) {
      console.error('Error al cargar información del cliente:', err);
      setError('No se pudo cargar la información del saldo');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchClientInfo();
    }
  }, [isAuthenticated, authLoading]);

  const handleSubscriptionCreated = () => {
    // Refrescar la información del cliente después de una nueva suscripción
    fetchClientInfo();
    setRefreshKey(prev => prev + 1);
  };

  const handleError = (errorMsg) => {
    setError(errorMsg);
  };

  if (authLoading || (!isAuthenticated && !authLoading) || isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  // Función para formatear el saldo como moneda
  const formatCurrency = (amount, currency = 'COP') => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Tarjeta de saldo */}
      {clientInfo && (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            mb: 4,
            background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
            color: 'white'
          }}
        >
          <Typography variant="h6" gutterBottom>
            Saldo disponible
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" component="div">
              {formatCurrency(clientInfo.amount, clientInfo.currency)}
            </Typography>
          </Box>
          <Typography variant="caption" display="block" sx={{ mt: 1, opacity: 0.9 }}>
            Última actualización: {new Date(clientInfo.updated_at).toLocaleString()}
          </Typography>
        </Paper>
      )}

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }} 
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <SubscriptionForm 
          onSubscriptionCreated={handleSubscriptionCreated}
          onError={handleError}
          currentBalance={clientInfo?.amount || 0}
        />
      </Box>

      <Box>
        <SubscriptionsList key={refreshKey} />
      </Box>
    </Container>
  );
};

export default DashboardPage;
