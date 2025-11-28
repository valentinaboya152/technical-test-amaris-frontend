import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/authServices/authService';

const MainNavbarComp = () => {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (accessToken && refreshToken) {
        await authService.logout(accessToken, refreshToken);
      }
      
      // Clear local storage and update auth state
      logoutUser();
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      // Even if there's an error, we'll proceed with local logout
      logoutUser();
      navigate('/login');
    } finally {
      handleClose();
    }
  };

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
          Mi Aplicación
        </Typography>

        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ mr: 2 }}>
              {user.username}
            </Typography>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar sx={{ bgcolor: 'secondary.main' }}>
                {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
              </Avatar>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={() => {
                navigate('/profile');
                handleClose();
              }}>
                Perfil
              </MenuItem>
              <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box>
            <Button color="inherit" onClick={() => navigate('/login')}>Iniciar sesión</Button>
            <Button color="inherit" onClick={() => navigate('/register')} variant="outlined" sx={{ ml: 1 }}>
              Registrarse
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default MainNavbarComp;