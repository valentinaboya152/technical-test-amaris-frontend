import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormControlLabel, 
  Radio, 
  RadioGroup, 
  Typography,
  Paper,
  Alert
} from '@mui/material';
import fundService from '../../services/fundService';
import subscriptionService from '../../services/subscriptionService';

const SubscriptionForm = ({ onSubscriptionCreated, onError, currentBalance }) => {
  const [funds, setFunds] = useState([]);
  const [selectedFund, setSelectedFund] = useState('');
  const [notificationPreference, setNotificationPreference] = useState('EMAIL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchFunds = async () => {
      try {
        const data = await fundService.getFunds();
        setFunds(data);
        if (data.length > 0) {
          setSelectedFund(data[0].id);
        }
      } catch (err) {
        setError('Error al cargar los fondos disponibles');
        onError && onError('Error al cargar los fondos disponibles');
      } finally {
        setLoading(false);
      }
    };

    fetchFunds();
  }, [onError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFund) return;

    try {
      setError('');
      setSuccess('');
      
      const response = await subscriptionService.createSubscription(
        selectedFund, 
        notificationPreference
      );
      
      setSuccess('Suscripción creada exitosamente');
      onSubscriptionCreated && onSubscriptionCreated(response);
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error('Subscription error:', err);
      let errorMsg = 'Error al crear la suscripción';
      
      if (err.response) {
        // Try to parse the response data if it's a string
        let responseData = err.response.data;
        if (typeof responseData === 'string') {
          try {
            responseData = JSON.parse(responseData);
          } catch (e) {
            console.error('Error parsing error response:', e);
          }
        }
        
        // Handle 400 Bad Request with specific error message
        if (err.response.status === 400) {
          if (responseData?.detail) {
            errorMsg = responseData.detail;
          } else if (responseData?.message) {
            errorMsg = responseData.message;
          } else if (typeof responseData === 'string' && responseData) {
            errorMsg = responseData;
          } else {
            errorMsg = 'No se pudo procesar la solicitud. Por favor, intente de nuevo.';
          }
        } 
        // Handle other API errors
        else if (responseData?.message) {
          errorMsg = responseData.message;
        }
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      console.log('Setting error message:', errorMsg);
      setError(errorMsg);
      onError && onError(errorMsg);
    }
  };

  if (loading) {
    return (
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography>Cargando fondos disponibles...</Typography>
      </Paper>
    );
  }

  if (funds.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography>No hay fondos disponibles para suscripción.</Typography>
      </Paper>
    );
  }

    const validateAmount = (amount) => {
    if (amount > currentBalance) {
      return 'El monto no puede ser mayor a tu saldo disponible';
      }
      return true;
    };
  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
        Nueva Suscripción
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 1, py: 0.5, '& .MuiAlert-message': { py: 0.5 } }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 1, py: 0.5, '& .MuiAlert-message': { py: 0.5 } }}>{success}</Alert>}

      <Box component="form" onSubmit={handleSubmit} sx={{ '& .MuiFormControl-root': { mb: 1 } }}>
        <FormControl fullWidth size="small">
          <InputLabel id="fund-select-label">Fondo</InputLabel>
          <Select
            labelId="fund-select-label"
            id="fund-select"
            value={selectedFund}
            label="Fondo"
            onChange={(e) => setSelectedFund(e.target.value)}
            disabled={loading || funds.length === 0}
          >
            {funds.map((fund) => (
              <MenuItem key={fund.id} value={fund.id}>
                {fund.fund_name} - {fund.min_amount} {fund.currency}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl component="fieldset" sx={{ mt: 1, mb: 1 }}>
          <Typography variant="caption" color="textSecondary" sx={{ mb: 0.5, display: 'block' }}>
            Notificación por:
          </Typography>
          <RadioGroup
            row
            aria-label="notification-preference"
            name="notification-preference"
            value={notificationPreference}
            onChange={(e) => setNotificationPreference(e.target.value)}
            sx={{ '& .MuiFormControlLabel-root': { mr: 1 } }}
          >
            <FormControlLabel 
              value="EMAIL" 
              control={<Radio size="small" sx={{ py: 0.5 }} />} 
              label="Email" 
              labelPlacement="end"
              sx={{ m: 0, '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
            />
            <FormControlLabel 
              value="SMS" 
              control={<Radio size="small" sx={{ py: 0.5 }} />} 
              label="SMS" 
              labelPlacement="end"
              sx={{ m: 0, '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
            />
            <FormControlLabel 
              value="NONE" 
              control={<Radio size="small" sx={{ py: 0.5 }} />} 
              label="Ninguna" 
              labelPlacement="end"
              sx={{ m: 0, '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
            />
          </RadioGroup>
        </FormControl>

        <Button 
          type="submit" 
          variant="contained" 
          size="small"
          disabled={loading || funds.length === 0}
          fullWidth
          sx={{ mt: 1 }}
        >
          {loading ? 'Cargando...' : 'Suscribirse'}
        </Button>
      </Box>
    </Paper>
  );
};

export default SubscriptionForm;
