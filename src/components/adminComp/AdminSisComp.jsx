import React from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Button, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Avatar, 
  Card, 
  CardContent,
  LinearProgress
} from '@mui/material';
import {
  People as PeopleIcon,
  Store as StoreIcon,
  AttachMoney as MoneyIcon,
  Assessment as ChartIcon,
  Notifications as NotificationsIcon,
  EventNote as EventIcon,
  PersonAdd as AddUserIcon,
  Settings as SettingsIcon,
  BarChart as BarChartIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const AdminSisComp = () => {
  const theme = useTheme();

  // Datos de ejemplo
  const stats = [
    { title: 'Usuarios', value: '2,345', icon: <PeopleIcon />, color: theme.palette.primary.main },
    { title: 'Ventas', value: '$34,245', icon: <AttachMoney />, color: theme.palette.success.main },
    { title: 'Productos', value: '1,234', icon: <StoreIcon />, color: theme.palette.warning.main },
    { title: 'Rendimiento', value: '89.5%', icon: <Assessment />, color: theme.palette.info.main },
  ];

  const recentActivities = [
    { id: 1, user: 'Juan Pérez', action: 'actualizó el producto', target: 'Laptop HP', time: 'Hace 5 min' },
    { id: 2, user: 'Ana Gómez', action: 'creó un nuevo usuario', target: 'Carlos López', time: 'Hace 1 hora' },
    { id: 3, user: 'Sistema', action: 'se realizó una copia de seguridad', target: '', time: 'Hace 2 horas' },
    { id: 4, user: 'Luis Martínez', action: 'eliminó el producto', target: 'Mouse Inalámbrico', time: 'Ayer' },
  ];

  const quickActions = [
    { title: 'Agregar Usuario', icon: <AddUserIcon />, path: '/admin/users/add' },
    { title: 'Generar Reporte', icon: <BarChartIcon />, path: '/admin/reports' },
    { title: 'Configuración', icon: <SettingsIcon />, path: '/admin/settings' },
    { title: 'Ver Estadísticas', icon: <TimelineIcon />, path: '/admin/analytics' },
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
        Panel de Administración
      </Typography>

      {/* Estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', boxShadow: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h5" component="div">
                      {stat.value}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: `${stat.color}20`, color: stat.color, width: 56, height: 56 }}>
                    {React.cloneElement(stat.icon, { fontSize: 'large' })}
                  </Avatar>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.floor(Math.random() * 100)} 
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Actividades Recientes */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="h2">Actividades Recientes</Typography>
              <Button color="primary">Ver todo</Button>
            </Box>
            <List>
              {recentActivities.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <NotificationsIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <React.Fragment>
                          <Typography component="span" variant="subtitle2">
                            {activity.user}{' '}
                          </Typography>
                          {activity.action} 
                          {activity.target && (
                            <Typography component="span" color="primary" variant="subtitle2">
                              {activity.target}
                            </Typography>
                          )}
                        </React.Fragment>
                      }
                      secondary={activity.time}
                    />
                  </ListItem>
                  {index < recentActivities.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Acciones Rápidas */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" component="h2" sx={{ mb: 2 }}>Acciones Rápidas</Typography>
            <List>
              {quickActions.map((action, index) => (
                <React.Fragment key={index}>
                  <ListItem button component="a" href={action.path}>
                    <ListItemIcon sx={{ color: 'primary.main' }}>
                      {action.icon}
                    </ListItemIcon>
                    <ListItemText primary={action.title} />
                  </ListItem>
                  {index < quickActions.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>

            {/* Próximos Eventos */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" component="h3" sx={{ mb: 2 }}>Próximos Eventos</Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <EventIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Reunión de equipo" 
                    secondary="Mañana, 10:00 AM" 
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <EventIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Actualización del sistema" 
                    secondary="15 Dic, 11:00 PM" 
                    secondaryTypographyProps={{ color: 'error.main' }}
                  />
                </ListItem>
              </List>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminSisComp;