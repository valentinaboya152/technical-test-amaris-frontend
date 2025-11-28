import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

const AuthLayout = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        p: 2
      }}
    >
      <Outlet />
    </Box>
  );
};

export default AuthLayout;
