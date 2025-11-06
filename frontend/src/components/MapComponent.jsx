import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons (várias cores conforme status/tipo)
const makeIcon = (colorUrl) => new L.Icon({
  iconUrl: colorUrl,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const icons = {
  obra_concluida: makeIcon('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png'),
  obra_andamento: makeIcon('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png'),
  obra_padrao: makeIcon('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png'),
  demanda_aberta: makeIcon('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png'),
  demanda_fechada: makeIcon('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png'),
};

const MapComponent = ({ obras, demandas = [], selectedLocation = null }) => {
  const mapRef = useRef(null);

  // Coordenadas centrais de São Luís (aproximadas)
  const center = [-2.5307, -44.3068];

  useEffect(() => {
    if (selectedLocation && mapRef.current) {
      // manter o zoom atual, apenas centralizar (sem dar zoom)
      const currentZoom = mapRef.current.getZoom();
      mapRef.current.setView([selectedLocation.lat, selectedLocation.lng], currentZoom);
    }
  }, [selectedLocation]);

  return (
    <div style={{ height: '600px', width: '100%', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }} whenCreated={(map) => (mapRef.current = map)}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {obras.map((obra) => (
          obra.latitude && obra.longitude && (
            <Marker key={obra.id} position={[obra.latitude, obra.longitude]} icon={obra.status === 'concluida' ? icons.obra_concluida : (obra.status === 'andamento' ? icons.obra_andamento : icons.obra_padrao)}>
            <Popup>
              <div style={{ fontFamily: 'Roboto, sans-serif', maxWidth: '250px' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#667eea' }}>{obra.titulo}</h3>
                <p style={{ margin: '4px 0' }}>{obra.descricao}</p>
                <p style={{ margin: '4px 0', fontWeight: 'bold' }}>Status: <span style={{ color: obra.status === 'concluida' ? '#4caf50' : '#ff9800' }}>{obra.status}</span></p>
                <p style={{ margin: '4px 0' }}><strong>Bairro:</strong> {obra.bairro}</p>
              </div>
            </Popup>
          </Marker>
          )
        ))}
        {demandas.map((demanda) => (
          demanda.latitude && demanda.longitude && (
            <Marker key={demanda.id} position={[demanda.latitude, demanda.longitude]} icon={demanda.status === 'aberta' ? icons.demanda_aberta : icons.demanda_fechada}>
              <Popup>
                <div style={{ fontFamily: 'Roboto, sans-serif', maxWidth: '250px' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#764ba2' }}>{demanda.titulo}</h3>
                  <p style={{ margin: '4px 0' }}>{demanda.descricao}</p>
                  <p style={{ margin: '4px 0', fontWeight: 'bold' }}>Status: <span style={{ color: demanda.status === 'aberta' ? '#2196f3' : '#757575' }}>{demanda.status}</span></p>
                  <p style={{ margin: '4px 0' }}><strong>Bairro:</strong> {demanda.bairro}</p>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
