import { Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      // 1. Eliminar tokens
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      
      // 2. Redirigir al login
      navigate('/login');
    }
  };

  return (
    <Button
      onClick={handleLogout}
      startIcon={<LogoutIcon />}
      variant="outlined"
      color="inherit"
      sx={{
        color: 'white',
        borderColor: 'rgba(255, 255, 255, 0.5)',
        '&:hover': {
          borderColor: 'white',
          backgroundColor: 'rgba(255, 255, 255, 0.1)'
        }
      }}
    >
      Cerrar sesión
    </Button>
  );
};

export default LogoutButton;