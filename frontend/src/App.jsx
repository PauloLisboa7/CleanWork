import React, { useState, useEffect, useContext } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, AppBar, Toolbar, Typography, IconButton, Container, Grid, Paper, Box, Card, CardContent, Tabs, Tab, Button, Pagination } from '@mui/material';
import { Brightness4, Brightness7, Map, Assignment, Add, Logout, AccountCircle } from '@mui/icons-material';
import MapComponent from './components/MapComponent';
import DemandasList from './components/DemandasList';
import DemandaForm from './components/DemandaForm';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import Register from './components/Register';
import ObrasGraph from './components/ObrasGraph';
import { AuthContext } from './context/AuthContext';
import axios from 'axios';
import { io } from 'socket.io-client';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [obras, setObras] = useState([]);
  const [obrasPage, setObrasPage] = useState(1);
  const [obrasLimit] = useState(12);
  const [obrasTotal, setObrasTotal] = useState(0);
  const [demandas, setDemandas] = useState([]);
  const [demandasPage, setDemandasPage] = useState(1);
  const [demandasLimit] = useState(10);
  const [demandasTotal, setDemandasTotal] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const { user, logout, loading } = useContext(AuthContext);
  const totalWorks = obras.length + demandas.length;

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
    fetchObras(obrasPage);
    fetchDemandas(demandasPage);
    // Conectar ao Socket.IO para atualizações em tempo real
    const socket = io('http://localhost:5000');
    socket.on('obrasUpdated', (payload) => {
      // refetch obras quando evento recebido
      fetchObras(obrasPage);
    });
    socket.on('demandasUpdated', (payload) => {
      fetchDemandas(demandasPage);
    });
    return () => socket.disconnect();
  }, []);

  const fetchObras = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/obras', { params: { page: obrasPage, limit: obrasLimit } });
      const data = response.data;
      setObras(data.items || data);
      setObrasTotal(data.total || (data.items ? data.items.length : data.length));
    } catch (error) {
      console.error('Erro ao buscar obras:', error);
    }
  };

  const handleObrasPageChange = (newPage) => {
    setObrasPage(newPage);
    fetchObras(newPage);
  };

  const fetchDemandas = async (page = 1) => {
    try {
      const response = await axios.get('http://localhost:5000/api/demandas', {
        params: { page, limit: demandasLimit },
      });
      const data = response.data;
      setDemandas(data.items || data);
      setDemandasTotal(data.total || (data.items ? data.items.length : data.length));
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
      // Atualiza demandas e refaz contagem/mapa
      await fetchDemandas(demandasPage);
    } catch (error) {
      console.error('Erro ao adicionar demanda:', error);
    }
  };

  const handleRemoveLocalizacao = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/demandas/${id}/remover-localizacao`);
      fetchDemandas(demandasPage);
    } catch (error) {
      console.error('Erro ao remover localização:', error);
    }
  };

  const handleSelectDemanda = ({ lat, lng }) => {
    setSelectedLocation({ lat, lng });
  };

  const handleDemandasPageChange = (newPage) => {
    setDemandasPage(newPage);
    fetchDemandas(newPage);
  };

  // Construir lista de bairros únicos com coordenadas aproximadas (a partir das obras)
  const bairrosMap = {};
  obras.forEach((o) => {
    if (o && o.bairro && !(o.bairro in bairrosMap) && o.latitude && o.longitude) {
      bairrosMap[o.bairro] = { name: o.bairro, lat: o.latitude, lng: o.longitude };
    }
  });
  const bairros = Object.values(bairrosMap);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Card sx={{ maxWidth: 400, width: '100%', mx: 2 }}>
            <CardContent>
              <Typography variant="h5" align="center" gutterBottom>
                CleanWork Login
              </Typography>
              {authMode === 'login' ? (
                <Login onSwitchToRegister={() => setAuthMode('register')} />
              ) : (
                <Register onSwitchToLogin={() => setAuthMode('login')} />
              )}
            </CardContent>
          </Card>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', py: 2 }}>
        <AppBar position="static" sx={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: 2, mx: 2, mt: 1 }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
              🏗️ CleanWork - Transparência e Participação Comunitária em São Luís ({totalWorks} obras cadastradas)
            </Typography>
            <AccountCircle sx={{ mr: 1 }} />
            <Typography variant="body1" sx={{ mr: 2 }}>
              {user.email} ({user.role})
            </Typography>
            <Button color="inherit" onClick={logout} startIcon={<Logout />}>
              Logout
            </Button>
            <IconButton color="inherit" onClick={handleToggleDarkMode} sx={{ ml: 1 }}>
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Toolbar>
        </AppBar>
        <Container maxWidth="xl" sx={{ mt: 3, mb: 4 }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
            <Tab label="Home" />
            <Tab label="Obras" />
          </Tabs>
          {tabValue === 0 && (
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
                      {/* No Home mostramos apenas as obras no mapa (remover demandas da Home) */}
                      <MapComponent obras={obras} selectedLocation={selectedLocation} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} lg={4}>
                <Card sx={{ background: 'rgba(255,255,255,0.95)' }}>
                  <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>
                      <Add sx={{ mr: 1, color: theme.palette.secondary.main }} />
                      Criar Nova Demanda
                    </Typography>
                    <DemandaForm onAddDemanda={handleAddDemanda} bairros={bairros} />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
          {tabValue === 1 && (
            <Grid container spacing={4}>
              <Grid item xs={12} lg={6}>
                <Card sx={{ background: 'rgba(255,255,255,0.95)' }}>
                  <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>
                      <Assignment sx={{ mr: 1, color: theme.palette.primary.main }} />
                      Lista de Demandas
                    </Typography>
                      <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
                      <DemandasList
                        demandas={demandas}
                        onRemoveLocalizacao={handleRemoveLocalizacao}
                        onSelectDemanda={handleSelectDemanda}
                        page={demandasPage}
                        limit={demandasLimit}
                        total={demandasTotal}
                        onPageChange={handleDemandasPageChange}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} lg={6}>
                <Card sx={{ background: 'rgba(255,255,255,0.95)' }}>
                  <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>
                      📊 Gráfico de Obras por Bairro
                    </Typography>
                    <ObrasGraph obras={obras} />
                    {Math.ceil((obrasTotal || obras.length) / obrasLimit) > 1 && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                        <Pagination count={Math.max(1, Math.ceil((obrasTotal || obras.length) / obrasLimit))} page={obrasPage} onChange={(e, v) => handleObrasPageChange(v)} color="primary" />
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
          {/* Aba Admin visível apenas para administradores */}
          {user && user.role === 'admin' && (
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mt: 2 }}>
              {/* Forçar uma aba adicional para admin */}
            </Tabs>
          )}
          {user && user.role === 'admin' && tabValue === 2 && (
            <Container maxWidth="xl" sx={{ mt: 3 }}>
              <AdminPanel />
            </Container>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App;
