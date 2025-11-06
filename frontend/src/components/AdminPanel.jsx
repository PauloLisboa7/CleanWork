import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, Button, List, ListItem, ListItemText, Divider, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Pagination } from '@mui/material';
import axios from 'axios';

const AdminPanel = () => {
  const [demandas, setDemandas] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedToRemove, setSelectedToRemove] = useState(null);
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescricao, setEditDescricao] = useState('');

  useEffect(() => {
    fetchDemandas(page);
  }, []);

  const fetchDemandas = async (p = 1) => {
    try {
      const res = await axios.get('http://localhost:5000/api/demandas', { params: { page: p, limit } });
      const data = res.data;
      setDemandas(data.items || data);
      setTotal(data.total || (data.items ? data.items.length : data.length));
    } catch (err) {
      console.error('Erro ao buscar demandas:', err);
    }
  };

  const startEdit = (d) => {
    setEditId(d.id);
    setEditTitle(d.titulo);
    setEditDescricao(d.descricao || '');
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditTitle('');
    setEditDescricao('');
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/demandas/${id}`, { titulo: editTitle, descricao: editDescricao, bairro: '', latitude: null, longitude: null, status: 'aberta' });
      cancelEdit();
      fetchDemandas(page);
    } catch (err) {
      console.error(err);
    }
  };

  const markConcluida = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/demandas/${id}`, { status: 'concluida' });
      fetchDemandas(page);
    } catch (err) {
      console.error(err);
    }
  };

  const removeDemanda = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/demandas/${id}`);
      setConfirmOpen(false);
      setSelectedToRemove(null);
      fetchDemandas(page);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchDemandas(newPage);
  };

  return (
    <>
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>Admin - Painel de Controle</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Aqui você pode gerenciar demandas: marcar como concluída ou remover.
        </Typography>
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle1">Total demandas: {total || demandas.length}</Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField size="small" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} sx={{ mr: 1 }} />
              <Button variant="outlined" sx={{ mr: 1 }} onClick={() => fetchDemandas(page)}>Atualizar</Button>
            </Box>
          </Box>
          <List>
            {demandas.filter(d => (d.titulo + ' ' + (d.descricao || '')).toLowerCase().includes(search.toLowerCase())).map((d) => (
              <React.Fragment key={d.id}>
                <ListItem>
                  {editId === d.id ? (
                    <Box sx={{ width: '100%' }}>
                      <TextField fullWidth value={editTitle} onChange={(e) => setEditTitle(e.target.value)} sx={{ mb: 1 }} />
                      <TextField fullWidth multiline rows={2} value={editDescricao} onChange={(e) => setEditDescricao(e.target.value)} sx={{ mb: 1 }} />
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button variant="contained" color="primary" onClick={() => saveEdit(d.id)}>Salvar</Button>
                        <Button variant="outlined" onClick={cancelEdit}>Cancelar</Button>
                      </Box>
                    </Box>
                  ) : (
                    <>
                      <ListItemText primary={d.titulo} secondary={`Bairro: ${d.bairro || 'N/A'} — Status: ${d.status || 'N/A'}`} />
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button variant="contained" color="success" onClick={() => markConcluida(d.id)}>Marcar Concluída</Button>
                        <Button variant="outlined" onClick={() => startEdit(d)}>Editar</Button>
                        <Button variant="outlined" color="error" onClick={() => { setSelectedToRemove(d); setConfirmOpen(true); }}>Remover</Button>
                      </Box>
                    </>
                  )}
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
          {Math.ceil((total || demandas.length) / limit) > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <Pagination count={Math.max(1, Math.ceil((total || demandas.length) / limit))} page={page} onChange={(e, v) => handlePageChange(v)} color="primary" />
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
    <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
      <DialogTitle>Confirmar remoção</DialogTitle>
      <DialogContent>
        Deseja realmente remover a demanda "{selectedToRemove?.titulo}"? Essa ação não pode ser desfeita.
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setConfirmOpen(false)}>Cancelar</Button>
        <Button color="error" onClick={() => removeDemanda(selectedToRemove.id)}>Remover</Button>
      </DialogActions>
    </Dialog>
    </>
  );
 };

export default AdminPanel;
