import React from 'react';
import { Typography, Paper, Container } from '@mui/material';

const Dashboard = () => {
  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Panel de Control
        </Typography>
        <Typography variant="body1">
          ¡Bienvenido al panel de administración!
        </Typography>
      </Paper>
    </Container>
  );
};

export default Dashboard;
