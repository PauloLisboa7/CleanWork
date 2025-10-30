import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Grid } from '@mui/material';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
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
      <Popup>Clique no mapa para definir a localização</Popup>
    </Marker>
  );
};

const DemandaForm = ({ onAddDemanda }) => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [bairro, setBairro] = useState('');
  const [position, setPosition] = useState(null);

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
  };

  // Coordenadas centrais de São Luís (aproximadas)
  const center = [-2.5307, -44.3068];

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="titulo"
        label="Título da Demanda"
        name="titulo"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="descricao"
        label="Descrição"
        name="descricao"
        multiline
        rows={4}
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
      />
      <TextField
        margin="normal"
        fullWidth
        id="bairro"
        label="Bairro"
        name="bairro"
        value={bairro}
        onChange={(e) => setBairro(e.target.value)}
      />
      <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
        Clique no mapa para definir a localização (opcional):
      </Typography>
      <div style={{ height: '200px', width: '100%', marginBottom: '16px' }}>
        <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationMarker position={position} setPosition={setPosition} />
        </MapContainer>
      </div>
      {position && (
        <Typography variant="body2" color="textSecondary">
          Localização selecionada: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
        </Typography>
      )}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Criar Demanda
      </Button>
    </Box>
  );
};

export default DemandaForm;
