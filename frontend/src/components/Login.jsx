import React, { useState, useContext } from 'react';
import { TextField, Button, Box, Typography, Alert, Paper } from '@mui/material';
import { AuthContext } from '../context/AuthContext';

const Login = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      setError('');
    } catch (err) {
      setError('Credenciais inválidas');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Login
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          sx={{ mb: 2 }}
        />
        <Button type="submit" fullWidth variant="contained" sx={{ mb: 2 }}>
          Entrar
        </Button>
        <Button fullWidth onClick={onSwitchToRegister}>
          Não tem conta? Registrar
        </Button>
      </Box>
    </Paper>
  );
};

export default Login;
