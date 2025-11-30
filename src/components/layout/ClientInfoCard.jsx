import React from 'react';
import { Card, CardContent, Typography, Box, Divider } from '@mui/material';
import { 
  Person as PersonIcon, 
  Email as EmailIcon, 
  Phone as PhoneIcon,
  CreditCard as CreditCardIcon,
  AccountBalanceWallet as WalletIcon
} from '@mui/icons-material';

const InfoRow = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
    <Box sx={{ color: 'text.secondary', mr: 1.5, minWidth: 24 }}>
      {icon}
    </Box>
    <Box>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="body2">
        {value || 'No especificado'}
      </Typography>
    </Box>
  </Box>
);

const ClientInfoCard = ({ client }) => {
  if (!client) return null;

  return (
    <Card elevation={3} sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <PersonIcon color="primary" sx={{ mr: 1 }} />
          Información del Cliente
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <InfoRow 
          icon={<PersonIcon fontSize="small" />} 
          label="Nombre completo" 
          value={client.full_name} 
        />
        
        <InfoRow 
          icon={<EmailIcon fontSize="small" />} 
          label="Correo electrónico" 
          value={client.email} 
        />
        
        <InfoRow 
          icon={<PhoneIcon fontSize="small" />} 
          label="Teléfono" 
          value={client.phone} 
        />
        
        <InfoRow 
          icon={<CreditCardIcon fontSize="small" />} 
          label="NIT" 
          value={client.nit} 
        />
        
        <Divider sx={{ my: 1.5 }} />
        
        <Box sx={{ 
          backgroundColor: 'primary.light', 
          p: 2, 
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box>
            <Typography variant="caption" display="block" color="primary.contrastText">
              Saldo disponible
            </Typography>
            <Typography variant="h6" color="primary.contrastText">
              {client.currency} {client.amount?.toLocaleString() || '0'}
            </Typography>
          </Box>
          <WalletIcon sx={{ color: 'primary.contrastText' }} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ClientInfoCard;
