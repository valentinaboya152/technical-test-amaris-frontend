import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authServices/authService';

import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Alert, 
  CircularProgress, 
  InputAdornment,
  IconButton,
  Divider,
  Container,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { Visibility, VisibilityOff, LockOutlined, PersonOutline, ArrowBack, Google, Facebook } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';

// Custom styled components
const GradientButton = styled(Button)({
  background: 'linear-gradient(45deg, #3f51b5 0%, #5c6bc0 100%)',
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

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.username || !formData.password) {
      setError('Por favor ingrese nombre de usuario y contraseña');
      return;
    }

    try {
      setIsLoading(true);
      const response = await authService.login(formData.username, formData.password);
      
      // Save tokens and update auth state - pass the entire response
      await loginUser(response);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Error al iniciar sesión. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
      <Container component="main" maxWidth="xs">
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
              <Typography component="h1" variant="h5" fontWeight={700} color="text.primary" gutterBottom>
                Iniciar sesión
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8 }}>
                Ingresa tus credenciales para continuar
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Usuario o correo"
                name="username"
                autoComplete="username"
                autoFocus
                value={formData.username}
                onChange={handleChange}
                disabled={isLoading}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ color: 'text.secondary' }}>
                      <PersonOutline />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 1.5,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '& fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.1)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderWidth: '1px',
                      boxShadow: '0 0 0 3px rgba(63, 81, 181, 0.1)'
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'text.secondary',
                  },
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ color: 'text.secondary' }}>
                      <LockOutlined />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        edge="end"
                        size="small"
                        sx={{
                          color: 'text.secondary',
                          '&:hover': {
                            background: 'transparent',
                            color: 'primary.main'
                          }
                        }}
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 1.5,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '& fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.1)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderWidth: '1px',
                      boxShadow: '0 0 0 3px rgba(63, 81, 181, 0.1)'
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'text.secondary',
                  },
                }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      size="small" 
                      id="rememberMe"
                      sx={{
                        color: 'text.secondary',
                        '&.Mui-checked': {
                          color: 'primary.main',
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(63, 81, 181, 0.04)'
                        }
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" color="text.secondary">
                      Recordarme
                    </Typography>
                  }
                  sx={{ m: 0 }}
                />
                <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'primary.main',
                      fontWeight: 500,
                      '&:hover': { 
                        textDecoration: 'underline',
                        textUnderlineOffset: '2px'
                      } 
                    }}
                  >
                    ¿Olvidaste tu contraseña?
                  </Typography>
                </Link>
              </Box>

              <GradientButton
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                  py: 1,
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  mb: 2,
                  mt: 1
                }}
              >
                {isLoading ? <CircularProgress size={22} color="inherit" /> : 'Iniciar sesión'}
              </GradientButton>

              <Divider sx={{ my: 3, '&::before, &::after': { borderColor: 'rgba(0, 0, 0, 0.06)' } }}>
                <Typography variant="body2" color="text.secondary" sx={{ px: 2, fontSize: '0.8125rem' }}>
                  O continúa con
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
                  ¿No tienes una cuenta?{' '}
                  <Link 
                    to="/register" 
                    style={{ 
                      color: '#3f51b5',
                      fontWeight: 600,
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                        textUnderlineOffset: '2px'
                      }
                    }}
                  >
                    Regístrate
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Login;
