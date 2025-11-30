import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Chip,
  CircularProgress,
  Box,
  Alert,
} from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import subscriptionService from '../../services/subscriptionService';

const SubscriptionsList = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const data = await subscriptionService.getSubscriptions();
      
      // Log detailed information about the received data
      console.log('Raw subscriptions data from API:', data);
      console.log('Number of subscriptions:', data.length);
      data.forEach((sub, index) => {
        console.log(`Subscription ${index + 1}:`, {
          id: sub.id,
          fund_name: sub.fund_name,
          transaction_type: sub.transaction_type,
          created_at: sub.created_at,
          canceled_at: sub.canceled_at
        });
      });
      
      setSubscriptions(data);
      setError('');
    } catch (err) {
      setError('Error al cargar las suscripciones');
      console.error('Error fetching subscriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleCancelSubscription = async (subscription) => {
    if (!subscription?.id) {
      console.error('Invalid subscription data:', subscription);
      setError('No se pudo cancelar la suscripción: ID de suscripción no válido');
      return;
    }

    if (!window.confirm('¿Estás seguro de que deseas cancelar esta suscripción?')) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await subscriptionService.cancelSubscription(subscription.id);
      setSuccess('Suscripción cancelada exitosamente');
      
      // Refresh the list
      await fetchSubscriptions();
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error('Error canceling subscription:', err);
      const errorMsg = err.response?.data?.detail || 
                      err.response?.data?.message || 
                      'Error al cancelar la suscripción';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'PPPp', { locale: es });
  };

  if (loading) {
    return (
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography>Cargando suscripciones...</Typography>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 1, width: '100%', overflowX: 'auto' }}>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
        Historial
      </Typography>
      
      {success && <Alert severity="success" sx={{ mb: 1, py: 0.5 }}>{success}</Alert>}

      <TableContainer component={Paper} sx={{ maxHeight: 500, '& .MuiTableCell-root': { py: 0.5, px: 1 } }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ minWidth: 100, py: 1 }}>FONDO</TableCell>
              <TableCell align="right" sx={{ minWidth: 80, py: 1 }}>MONTO</TableCell>
              <TableCell sx={{ minWidth: 80, py: 1 }}>CATEG.</TableCell>
              <TableCell sx={{ minWidth: 80, py: 1 }}>TIPO</TableCell>
              <TableCell sx={{ minWidth: 80, py: 1 }}>NOTIF.</TableCell>
              <TableCell sx={{ minWidth: 100, py: 1 }}>APERTURA</TableCell>
              <TableCell sx={{ minWidth: 100, py: 1 }}>CANCEL.</TableCell>
              <TableCell sx={{ minWidth: 80, py: 1 }}>ACCIONES</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subscriptions.length > 0 ? (
              subscriptions.map((subscription, index) => (
                <TableRow key={`subscription-${subscription.id || index}`}>
                  <TableCell>{subscription.fund_name}</TableCell>
                  <TableCell>
                    {subscription.currency} {subscription.amount?.toLocaleString()}
                  </TableCell>
                  <TableCell>{subscription.category}</TableCell>
                  <TableCell>
                    <Chip 
                      label={subscription.transaction_type === 'SUBSCRIPTION' ? 'Suscripción' : 'Cancelación'}
                      color={subscription.transaction_type === 'SUBSCRIPTION' ? 'primary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={subscription.notification_preference}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDate(subscription.created_at)}</TableCell>
                  <TableCell>{subscription.canceled_at ? formatDate(subscription.canceled_at) : 'Activa'}</TableCell>
                  <TableCell>
                    {!subscription.canceled_at && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        disabled={loading}
                        onClick={() => handleCancelSubscription(subscription)}
                        aria-label={`Cancelar suscripción ${subscription.fund_name || ''}`}
                      >
                        {loading ? 'Cancelando...' : 'Cancelar'}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No hay suscripciones para mostrar
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default SubscriptionsList;
