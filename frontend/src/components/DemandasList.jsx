import React from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography, Chip, Box, Divider, Pagination } from '@mui/material';
import { DeleteForever, LocationOn, Schedule } from '@mui/icons-material';

const DemandasList = ({ demandas, onRemoveLocalizacao, onSelectDemanda, page = 1, limit = 10, total = 0, onPageChange }) => {
  const totalPages = Math.max(1, Math.ceil((total || demandas.length) / limit));

  return (
    <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
      <List sx={{ py: 0 }}>
        {(!demandas || demandas.length === 0) ? (
          <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
            📝 Nenhuma demanda encontrada.
          </Typography>
        ) : (
          demandas.map((demanda, index) => (
        <React.Fragment key={demanda.id}>
          <ListItem alignItems="flex-start" sx={{ py: 2, cursor: demanda.latitude && demanda.longitude ? 'pointer' : 'default' }} onClick={() => (demanda.latitude && demanda.longitude && onSelectDemanda ? onSelectDemanda({ lat: demanda.latitude, lng: demanda.longitude }) : null)}>
                <ListItemText
                  primary={
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
                      {demanda.titulo}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.primary" sx={{ mb: 1, lineHeight: 1.4 }}>
                        {demanda.descricao}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Schedule sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          Bairro: {demanda.bairro || 'Não informado'}
                        </Typography>
                      </Box>
                      <Chip
                        label={demanda.status}
                        size="small"
                        color={demanda.status === 'aberta' ? 'primary' : 'default'}
                        sx={{ mb: 1 }}
                      />
                      {demanda.latitude && demanda.longitude && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'secondary.main' }} />
                          <Typography variant="body2" color="text.secondary">
                            {demanda.latitude.toFixed(4)}, {demanda.longitude.toFixed(4)}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  }
                />
                {demanda.latitude && demanda.longitude && (
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="remover localização"
                      onClick={(e) => { e.stopPropagation(); onRemoveLocalizacao(demanda.id); }}
                      sx={{ color: 'error.main' }}
                    >
                      <DeleteForever />
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
              {index < demandas.length - 1 && <Divider />}
            </React.Fragment>
          ))
        )}
      </List>
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <Pagination count={totalPages} page={page} onChange={(e, v) => onPageChange && onPageChange(v)} color="primary" />
        </Box>
      )}
    </Box>
  );
};

export default DemandasList;
