import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useAuth } from '@/context/AuthContext';

const Header = () => {
  const { logoutUser } = useAuth();

  const handleLogout = () => {
    logoutUser();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - 240px)` },
        ml: { sm: '240px' },
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Aplicación
        </Typography>
        <Button color="inherit" onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
