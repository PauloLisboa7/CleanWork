import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, AppBar, Toolbar, Typography, IconButton, Container, Grid, Paper, Box, Card, CardContent } from '@mui/material';
import { Brightness4, Brightness7, Map, Assignment, Add } from '@mui/icons-material';
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
      primary: {
        main: '#667eea',
      },
      secondary: {
        main: '#764ba2',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 500,
          },
        },
      },
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
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', py: 2 }}>
        <AppBar position="static" sx={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: 2, mx: 2, mt: 1 }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
              🏗️ CleanWork - Transparência e Participação Comunitária em São Luís
            </Typography>
            <IconButton color="inherit" onClick={handleToggleDarkMode} sx={{ ml: 1 }}>
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Toolbar>
        </AppBar>
        <Container maxWidth="xl" sx={{ mt: 3, mb: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant="h4" align="center" sx={{ mb: 4, color: 'white', fontWeight: 700 }}>
                Visualize e Participe das Obras Públicas
              </Typography>
            </Grid>
            <Grid item xs={12} lg={8}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.95)' }}>
                <CardContent sx={{ flexGrow: 1, p: 0 }}>
                  <Box sx={{ p: 3, pb: 1 }}>
                    <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>
                      <Map sx={{ mr: 1, color: theme.palette.primary.main }} />
                      Mapa de Obras Públicas
                    </Typography>
                  </Box>
                  <Box sx={{ px: 3, pb: 3 }}>
                    <MapComponent obras={obras} demandas={demandas} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Card sx={{ background: 'rgba(255,255,255,0.95)' }}>
                  <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>
                      <Add sx={{ mr: 1, color: theme.palette.secondary.main }} />
                      Criar Nova Demanda
                    </Typography>
                    <DemandaForm onAddDemanda={handleAddDemanda} />
                  </CardContent>
                </Card>
                <Card sx={{ background: 'rgba(255,255,255,0.95)', flexGrow: 1 }}>
                  <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>
                      <Assignment sx={{ mr: 1, color: theme.palette.primary.main }} />
                      Lista de Demandas
                    </Typography>
                    <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                      <DemandasList demandas={demandas} onRemoveLocalizacao={handleRemoveLocalizacao} />
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App;
