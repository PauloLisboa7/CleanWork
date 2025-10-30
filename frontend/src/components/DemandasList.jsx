import React from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography, Chip } from '@mui/material';
import { DeleteForever } from '@mui/icons-material';

const DemandasList = ({ demandas, onRemoveLocalizacao }) => {
  return (
    <List>
      {demandas.length === 0 ? (
        <Typography variant="body2" color="textSecondary">
          Nenhuma demanda encontrada.
        </Typography>
      ) : (
        demandas.map((demanda) => (
          <ListItem key={demanda.id} alignItems="flex-start">
            <ListItemText
              primary={demanda.titulo}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="textPrimary">
                    {demanda.descricao}
                  </Typography>
                  <br />
                  <Typography component="span" variant="body2" color="textSecondary">
                    Bairro: {demanda.bairro || 'Não informado'}
                  </Typography>
                  <br />
                  <Chip label={demanda.status} size="small" color={demanda.status === 'aberta' ? 'primary' : 'secondary'} />
                  {demanda.latitude && demanda.longitude && (
                    <>
                      <br />
                      <Typography component="span" variant="body2" color="textSecondary">
                        Localização: {demanda.latitude.toFixed(4)}, {demanda.longitude.toFixed(4)}
                      </Typography>
                    </>
                  )}
                </>
              }
            />
            {demanda.latitude && demanda.longitude && (
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="remover localização" onClick={() => onRemoveLocalizacao(demanda.id)}>
                  <DeleteForever />
                </IconButton>
              </ListItemSecondaryAction>
            )}
          </ListItem>
        ))
      )}
    </List>
  );
};

export default DemandasList;
