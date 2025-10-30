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

const MapComponent = ({ obras, demandas }) => {
  const mapRef = useRef();

  // Coordenadas centrais de São Luís (aproximadas)
  const center = [-2.5307, -44.3068];

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }} ref={mapRef}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {obras.map((obra) => (
          <Marker key={obra.id} position={[obra.latitude, obra.longitude]}>
            <Popup>
              <div>
                <h3>{obra.titulo}</h3>
                <p>{obra.descricao}</p>
                <p><strong>Status:</strong> {obra.status}</p>
                <p><strong>Bairro:</strong> {obra.bairro}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        {demandas.map((demanda) => (
          demanda.latitude && demanda.longitude && (
            <Marker key={demanda.id} position={[demanda.latitude, demanda.longitude]}>
              <Popup>
                <div>
                  <h3>{demanda.titulo}</h3>
                  <p>{demanda.descricao}</p>
                  <p><strong>Status:</strong> {demanda.status}</p>
                  <p><strong>Bairro:</strong> {demanda.bairro}</p>
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
