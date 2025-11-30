import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CardHeader,
  Avatar,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  useTheme
} from '@mui/material';
import { 
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  ExitToApp as ExitToAppIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
  AttachMoney as AttachMoneyIcon
} from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import MainNavbarComp from '../components/main-navbarComp/MainNavbarComp';

// Componente de tarjeta de estadísticas
const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }) => (
  <Card sx={{ 
    height: '100%', 
    display: 'flex', 
    flexDirection: 'column',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: 3,
    }
  }}>
    <CardContent sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography color="textSecondary" variant="subtitle2" sx={{ fontSize: '0.75rem' }}>
          {title}
        </Typography>
        <Avatar sx={{ 
          bgcolor: `${color}.light`, 
          color: `${color}.dark`, 
          width: 28, 
          height: 28,
          '& .MuiSvgIcon-root': {
            fontSize: '1rem'
          }
        }}>
          <Icon fontSize="inherit" />
        </Avatar>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600 }}>{value}</Typography>
        {trend && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            bgcolor: trend === 'up' ? 'success.light' : 'error.light',
            color: trend === 'up' ? 'success.dark' : 'error.dark',
            px: 0.75,
            py: 0.25,
            borderRadius: 1,
            fontSize: '0.7rem'
          }}>
            {trend === 'up' ? <ArrowUpwardIcon fontSize="inherit" /> : <ArrowDownwardIcon fontSize="inherit" />}
            <Typography variant="body2" sx={{ ml: 0.25, fontSize: '0.7rem', fontWeight: 600 }}>
              {trendValue}%
            </Typography>
          </Box>
        )}
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const theme = useTheme();
  const { isAuthenticated, user, isLoading, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Datos de ejemplo para las tarjetas
  const stats = [
    { title: 'Ingresos Totales', value: '$24,780', icon: AttachMoneyIcon, color: 'primary', trend: 'up', trendValue: '12' },
    { title: 'Nuevos Usuarios', value: '1,254', icon: PeopleIcon, color: 'success', trend: 'up', trendValue: '8' },
    { title: 'Ventas', value: '845', icon: ShoppingCartIcon, color: 'warning', trend: 'down', trendValue: '5' },
    { title: 'Ganancias', value: '$12,450', icon: AccountBalanceWalletIcon, color: 'error', trend: 'up', trendValue: '15' },
  ];

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sidebar */}
      <Box
        component="nav"
        sx={{
          width: { sm: 220 },
          flexShrink: { sm: 0 },
          bgcolor: 'primary.main',
          color: 'white',
          display: { xs: 'none', sm: 'block' },
        }}
      >
        <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="h6" component="div" sx={{ fontSize: '1.1rem' }}>
            DIMAR
          </Typography>
        </Box>
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
        <List>
          {['Dashboard', 'Usuarios', 'Reportes', 'Configuración'].map((text, index) => (
            <ListItem button key={text} sx={{ color: 'white' }}>
              <ListItemIcon sx={{ color: 'white' }}>
                {index === 0 && <DashboardIcon />}
                {index === 1 && <PersonIcon />}
                {index === 2 && <BarChartIcon />}
                {index === 3 && <SettingsIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', my: 1 }} />
          <ListItem button onClick={logoutUser} sx={{ color: 'white' }}>
            <ListItemIcon sx={{ color: 'white' }}>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Cerrar Sesión" />
          </ListItem>
        </List>
      </Box>

      {/* Contenido principal */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Barra de navegación */}
        <MainNavbarComp onMenuClick={handleDrawerToggle} />
        
        {/* Contenido del dashboard */}
        <Box component="main" sx={{ flexGrow: 1, p: 2, bgcolor: 'background.default' }}>
          <Container maxWidth="xl" sx={{ p: 1 }}>
            {/* Título y botón */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
                Panel de Control
              </Typography>
              <Button variant="contained" color="primary" size="small">
                Generar Reporte
              </Button>
            </Box>

            {/* Tarjetas de estadísticas */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
              {stats.map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <StatCard {...stat} />
                </Grid>
              ))}
            </Grid>

            {/* Gráficos y tablas */}
            <Grid container spacing={3}>
              {/* Gráfico de barras */}
              <Grid item xs={12} md={8}>
                <Card sx={{ height: '100%' }}>
                  <CardHeader 
                    title="Ventas Mensuales" 
                    subheader="Evolución de ventas en los últimos 6 meses"
                  />
                  <CardContent>
                    <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography color="textSecondary">
                        Gráfico de ventas mensuales iría aquí
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Últimas transacciones */}
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardHeader 
                    title="Últimas Transacciones" 
                    subheader="Las 5 transacciones más recientes"
                  />
                  <List>
                    {[1, 2, 3, 4, 5].map((item) => (
                      <React.Fragment key={item}>
                        <ListItem>
                          <ListItemIcon>
                            <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.dark' }}>
                              <PersonIcon />
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText 
                            primary={`Transacción ${item}`}
                            secondary={`Hace ${item} ${item === 1 ? 'hora' : 'horas'}`}
                          />
                          <Typography variant="subtitle2" color="primary">
                            ${(1000 * item).toLocaleString()}
                          </Typography>
                        </ListItem>
                        {item < 5 && <Divider variant="inset" component="li" />}
                      </React.Fragment>
                    ))}
                  </List>
                </Card>
              </Grid>

              {/* Tabla de usuarios recientes */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Card>
                  <CardHeader 
                    title="Usuarios Recientes"
                    action={
                      <Button color="primary" size="small">Ver todos</Button>
                    }
                  />
                  <CardContent>
                    <Box sx={{ minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography color="textSecondary">
                        Tabla de usuarios recientes iría aquí
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
