import React from 'react';
import { 
  Box, 
  Typography, 
  Button,
  Divider,
  IconButton,
  Link,
  Container,
  Paper
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import RegisterFormComp from '../components/registerComp/RegisterFormComp';
import { ArrowBack, LockOutlined, Google, Facebook } from '@mui/icons-material';

// Custom styled components
const GradientButton = styled('button')({
  background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)',
  border: 0,
  borderRadius: 8,
  color: 'white',
  height: 44,
  padding: '0 24px',
  textTransform: 'none',
  fontWeight: 600,
  letterSpacing: '0.5px',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #303f9f 0%, #3949ab 100%)',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(63, 81, 181, 0.3)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
  '&:disabled': {
    background: '#e0e0e0',
    color: '#9e9e9e',
  },
});

const RegisterPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8f9ff 0%, #eef2ff 100%)',
        p: 2
      }}
    >
      <Container component="main" maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <Paper 
            elevation={3}
            sx={{
              p: { xs: 2.5, sm: 3 },
              borderRadius: 2,
              background: 'white',
              border: '1px solid rgba(0, 0, 0, 0.04)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
            }}
          >
            <Box display="flex" alignItems="center" mb={3}>
              <IconButton 
                onClick={() => navigate(-1)}
                size="small"
                sx={{ mr: 1, color: 'text.secondary' }}
              >
                <ArrowBack />
              </IconButton>
              <Box flexGrow={1} textAlign="center">
                <Typography 
                  component="h1" 
                  variant="h5" 
                  fontWeight={700} 
                  color="text.primary"
                >
                  Crear cuenta
                </Typography>
              </Box>
              <Box width={40} />
            </Box>

            <Box textAlign="center" mb={3}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  margin: '0 auto 16px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(63, 81, 181, 0.2)',
                  transition: 'all 0.3s ease'
                }}
              >
                <LockOutlined sx={{ color: 'white', fontSize: 28 }} />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8, mb: 1 }}>
                Completa el formulario para registrarte
              </Typography>
            </Box>

            <RegisterFormComp />

            <Divider sx={{ my: 3, '&::before, &::after': { borderColor: 'rgba(0, 0, 0, 0.06)' } }}>
              <Typography variant="body2" color="text.secondary" sx={{ px: 2, fontSize: '0.8125rem' }}>
                O regístrate con
              </Typography>
            </Divider>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Google />}
                size="small"
                sx={{
                  py: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  borderColor: 'rgba(0, 0, 0, 0.12)',
                  color: 'text.primary',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'rgba(63, 81, 181, 0.02)',
                  },
                }}
              >
                Google
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Facebook color="primary" />}
                size="small"
                sx={{
                  py: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  borderColor: 'rgba(0, 0, 0, 0.12)',
                  color: 'text.primary',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'rgba(63, 81, 181, 0.02)',
                  },
                }}
              >
                Facebook
              </Button>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 3, mb: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                ¿Ya tienes una cuenta?{' '}
                <Link 
                  component={RouterLink}
                  to="/login"
                  sx={{ 
                    color: '#3f51b5',
                    fontWeight: 600,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                      textUnderlineOffset: '2px'
                    }
                  }}
                >
                  Inicia sesión
                </Link>
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export { GradientButton };
export default RegisterPage;