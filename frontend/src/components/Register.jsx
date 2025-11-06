import React, { useState, useContext } from 'react';
import { TextField, Button, Box, Typography, Alert, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { AuthContext } from '../context/AuthContext';

const Register = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(email, password, role);
      setError('');
    } catch (err) {
      setError('Erro ao registrar');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Registrar
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
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Função</InputLabel>
          <Select value={role} onChange={(e) => setRole(e.target.value)}>
            <MenuItem value="user">Usuário</MenuItem>
            <MenuItem value="admin">Administrador</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" fullWidth variant="contained" sx={{ mb: 2 }}>
          Registrar
        </Button>
        <Button fullWidth onClick={onSwitchToLogin}>
          Já tem conta? Login
        </Button>
      </Box>
    </Paper>
  );
};

export default Register;
