import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, AppBar, Toolbar, Typography, IconButton, Container, Grid, Paper, Box } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import MapComponent from './components/MapComponent';
import DemandasList from './components/DemandasList';
import DemandaForm from './components/DemandaForm';
import axios from 'axios';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [obras, setObras] = useState([]);
  const [demandas, setDemandas] = useState([]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      setDarkMode(JSON.parse(savedTheme));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    fetchObras();
    fetchDemandas();
  }, []);

  const fetchObras = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/obras');
      setObras(response.data);
    } catch (error) {
      console.error('Erro ao buscar obras:', error);
    }
  };

  const fetchDemandas = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/demandas');
      setDemandas(response.data);
    } catch (error) {
      console.error('Erro ao buscar demandas:', error);
    }
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleAddDemanda = async (novaDemanda) => {
    try {
      await axios.post('http://localhost:5000/api/demandas', novaDemanda);
      fetchDemandas();
    } catch (error) {
      console.error('Erro ao adicionar demanda:', error);
    }
  };

  const handleRemoveLocalizacao = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/demandas/${id}/remover-localizacao`);
      fetchDemandas();
    } catch (error) {
      console.error('Erro ao remover localização:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            CleanWork - Transparência e Participação Comunitária em São Luís
          </Typography>
          <IconButton color="inherit" onClick={handleToggleDarkMode}>
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h5" gutterBottom>
                Mapa de Obras Públicas
              </Typography>
              <MapComponent obras={obras} demandas={demandas} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', mb: 2 }}>
              <Typography variant="h5" gutterBottom>
                Criar Nova Demanda
              </Typography>
              <DemandaForm onAddDemanda={handleAddDemanda} />
            </Paper>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h5" gutterBottom>
                Lista de Demandas
              </Typography>
              <DemandasList demandas={demandas} onRemoveLocalizacao={handleRemoveLocalizacao} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default App;
