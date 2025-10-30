import React from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography, Chip, Box, Divider } from '@mui/material';
import { DeleteForever, LocationOn, Schedule } from '@mui/icons-material';

const DemandasList = ({ demandas, onRemoveLocalizacao }) => {
  return (
    <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
      <List sx={{ py: 0 }}>
        {demandas.length === 0 ? (
          <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
            📝 Nenhuma demanda encontrada.
          </Typography>
        ) : (
          demandas.map((demanda, index) => (
            <React.Fragment key={demanda.id}>
              <ListItem alignItems="flex-start" sx={{ py: 2 }}>
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
                      onClick={() => onRemoveLocalizacao(demanda.id)}
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
    </Box>
  );
};

export default DemandasList;
