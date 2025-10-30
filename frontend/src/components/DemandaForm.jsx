import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Grid, Alert } from '@mui/material';
import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>📍 Localização selecionada</Popup>
    </Marker>
  );
};

const DemandaForm = ({ onAddDemanda }) => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [bairro, setBairro] = useState('');
  const [position, setPosition] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const novaDemanda = {
      titulo,
      descricao,
      bairro,
      latitude: position ? position.lat : null,
      longitude: position ? position.lng : null,
      usuario_id: 1, // Placeholder, pode ser implementado com autenticação
    };
    onAddDemanda(novaDemanda);
    // Reset form
    setTitulo('');
    setDescricao('');
    setBairro('');
    setPosition(null);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  // Coordenadas centrais de São Luís (aproximadas)
  const center = [-2.5307, -44.3068];

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          ✅ Demanda criada com sucesso!
        </Alert>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="titulo"
            label="Título da Demanda"
            name="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="descricao"
            label="Descrição Detalhada"
            name="descricao"
            multiline
            rows={3}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="bairro"
            label="Bairro (opcional)"
            name="bairro"
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            📍 Clique no mapa para definir a localização (opcional):
          </Typography>
          <Box sx={{ height: '250px', width: '100%', borderRadius: 2, overflow: 'hidden', boxShadow: 1, mb: 2 }}>
            <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationMarker position={position} setPosition={setPosition} />
            </MapContainer>
          </Box>
          {position && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Localização selecionada: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
            </Alert>
          )}
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{
              mt: 1,
              mb: 1,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
              }
            }}
          >
            🚀 Criar Demanda
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DemandaForm;
