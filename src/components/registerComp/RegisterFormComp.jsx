import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authServices/authService';
import { styled } from '@mui/material/styles';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Alert, 
  CircularProgress, 
  InputAdornment,
  IconButton,
  Grid,
  FormControlLabel,
  Checkbox,
  FormHelperText
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  LockOutlined, 
  PersonOutline, 
  EmailOutlined, 
  BadgeOutlined, 
  PhoneOutlined
} from '@mui/icons-material';
import { registerUserService } from '../../services/registerServices/registerUserService';
import './RegisterFormComp.css';

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : '#1a2027',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: theme.palette.mode === 'light' ? '#f8f9fa' : '#2c3238',
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : '#2c3238',
      boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.2)',
    },
    '& fieldset': {
      borderColor: theme.palette.mode === 'light' ? '#e9ecef' : '#2d3748',
      borderWidth: '1px',
      transition: 'all 0.2s ease',
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.light,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      borderWidth: '1px',
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
    '&.Mui-focused': {
      color: theme.palette.primary.main,
    },
  },
  '& .MuiInputBase-input': {
    padding: '8px 12px',
    fontSize: '0.875rem',
    '&::placeholder': {
      color: theme.palette.text.disabled,
      opacity: 1,
      fontSize: '0.875rem',
    },
  },
  '& .MuiInputAdornment-root': {
    color: theme.palette.text.secondary,
    '&:hover': {
      color: theme.palette.primary.main,
    },
    '& button': {
      padding: '4px',
    }
  },
  marginBottom: '0.5rem',
}));

const RegisterFormComp = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    nit: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!formData.acceptTerms) {
      setError('Debes aceptar los términos y condiciones');
      return;
    }

    try {
      setIsLoading(true);
      // Eliminamos campos que no van al servidor
      const { confirmPassword, acceptTerms, ...userData } = formData;
      
      const response = await registerUserService.register(userData);
      
      // Redirigir a login después de registro exitoso
      navigate('/login', { 
        state: { 
          message: '¡Registro exitoso! Por favor inicia sesión.' 
        } 
      });
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Error al registrar el usuario. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit} 
      noValidate
      className="form-container"
    >
      <Grid container spacing={2}>
        <Typography 
          variant="h6" 
          component="h2" 
          className="form-title"
        >
          Crear una nueva cuenta
        </Typography>

      {error && (
        <Alert 
          severity="error"
          className="error-alert"
        >
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
        <Box sx={{ flex: 1 }}>
          <StyledTextField
            autoComplete="given-name"
            name="full_name"
            required
            fullWidth
            id="full_name"
            label="Nombre completo"
            autoFocus
            size="small"
            value={formData.full_name}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ color: 'text.secondary' }}>
                  <PersonOutline />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <StyledTextField
            required
            fullWidth
            id="nit"
            label="NIT"
            name="nit"
            size="small"
            value={formData.nit}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ color: 'text.secondary' }}>
                  <BadgeOutlined />
                </InputAdornment>
              ),
            }}
            inputProps={{
              maxLength: 20,
              inputMode: 'numeric',
              pattern: '[0-9]*',
            }}
          />
        </Box>
      </Box>
      
      <Box sx={{ width: '600px' }}>
        <StyledTextField
          required
          fullWidth
          id="email"
          label="Correo electrónico"
          name="email"
          type="email"
          size="small"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ color: 'text.secondary' }}>
                <EmailOutlined />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      
      <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
        <Box sx={{ flex: 1 }}>
          <StyledTextField
            required
            fullWidth
            id="phone"
            label="Teléfono"
            name="phone"
            type="tel"
            size="small"
            autoComplete="tel"
            value={formData.phone}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ color: 'text.secondary' }}>
                  <PhoneOutlined />
                </InputAdornment>
              ),
            }}
            inputProps={{
              maxLength: 15,
              inputMode: 'tel',
              pattern: '[0-9+]*',
            }}
          />
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <StyledTextField
            required
            fullWidth
            id="username"
            label="Nombre de usuario"
            name="username"
            size="small"
            autoComplete="username"
            value={formData.username}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ color: 'text.secondary' }}>
                  <PersonOutline />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>
        
        
        <div className="password-fields">
          <div className="field-container">
            <StyledTextField
              required
              fullWidth
              name="password"
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              id="password"
              size="small"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
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
            />
            <FormHelperText className="password-helper">
              Mínimo 8 caracteres, incluyendo mayúsculas, minúsculas y números
            </FormHelperText>
          </div>
          
          <div className="field-container">
            <StyledTextField
              required
              fullWidth
              name="confirmPassword"
              label="Confirmar contraseña"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              size="small"
              value={formData.confirmPassword}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: 'text.secondary' }}>
                    <LockOutlined />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={toggleConfirmPasswordVisibility}
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
                      {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </div>
        
        <Grid item xs={12} className="terms-container">
          <FormControlLabel
            control={
              <Checkbox 
                name="acceptTerms" 
                checked={formData.acceptTerms} 
                onChange={handleChange}
                color="primary"
                size="small"
                sx={{
                  color: 'text.secondary',
                  p: 0.5,
                  '&.Mui-checked': {
                    color: 'primary.main',
                  },
                  '&:hover': {
                    backgroundColor: (theme) => 
                      theme.palette.mode === 'light' 
                        ? 'rgba(99, 102, 241, 0.08)' 
                        : 'rgba(99, 102, 241, 0.15)',
                  },
                  '& .MuiSvgIcon-root': {
                    fontSize: '1.25rem',
                  }
                }}
              />
            }
            label={
              <Typography className="terms-label">
                Acepto los{' '}
                <Link to="/terms" className="terms-link">
                  Términos y Condiciones
                </Link>
              </Typography>
            }
            sx={{ 
              margin: 0,
              width: '100%',
              alignItems: 'flex-start',
              '& .MuiFormControlLabel-label': {
                margin: 0,
                flex: 1,
              }
            }}
          />
        </Grid>
      </Grid>
      
      <Grid item xs={12}>
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          className="submit-button"
        >
          {isLoading ? (
            <CircularProgress 
              size={20} 
              color="inherit" 
              style={{ color: 'white' }}
            />
          ) : (
            'Crear cuenta'
          )}
        </Button>
      </Grid>
    </Box>
  );
};

export default RegisterFormComp;