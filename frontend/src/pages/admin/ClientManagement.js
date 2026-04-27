import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    LinearProgress,
    Avatar,
    Grid,
    Tooltip
} from '@mui/material';
import { Edit, Delete, Add, Business, Mail, Phone, Person } from '@mui/icons-material';
import { clientService } from '../../services/api';
import toast from 'react-hot-toast';

const ClientManagement = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [formData, setFormData] = useState({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await clientService.getAll();
            setClients(response.data.clients);
        } catch (error) {
            toast.error('Failed to fetch clients');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (client = null) => {
        if (client) {
            setEditingClient(client);
            setFormData({
                companyName: client.companyName,
                contactPerson: client.contactPerson,
                email: client.email,
                phone: client.phone || '',
                address: client.address || ''
            });
        } else {
            setEditingClient(null);
            setFormData({
                companyName: '',
                contactPerson: '',
                email: '',
                phone: '',
                address: ''
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingClient(null);
    };

    const handleSubmit = async () => {
        try {
            if (editingClient) {
                await clientService.update(editingClient.id, formData);
                toast.success('Client updated successfully');
            } else {
                await clientService.create(formData);
                toast.success('Client added successfully');
            }
            fetchClients();
            handleCloseDialog();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this client?')) {
            try {
                await clientService.delete(id);
                toast.success('Client deleted successfully');
                fetchClients();
            } catch (error) {
                toast.error('Failed to delete client');
            }
        }
    };

    if (loading) return <LinearProgress sx={{ borderRadius: 2 }} />;

    return (
        <Box className="fade-in">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight="800">Portfolio Accounts</Typography>
                    <Typography variant="body2" color="text.secondary">Manage your organization's client relationships and contact data.</Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenDialog()}
                    sx={{ 
                        borderRadius: '50px', 
                        px: 4, 
                        py: 1.5,
                        background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%)',
                        boxShadow: '0 10px 20px rgba(30, 58, 138, 0.2)'
                    }}
                >
                    Onboard New Client
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 6, boxShadow: '0 10px 30px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 800, py: 2.5 }}>Client / Company</TableCell>
                            <TableCell sx={{ fontWeight: 800 }}>Primary Contact</TableCell>
                            <TableCell sx={{ fontWeight: 800 }}>Communication</TableCell>
                            <TableCell sx={{ fontWeight: 800 }}>Account Status</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 800 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {clients.map((client) => (
                            <TableRow key={client.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{ bgcolor: 'secondary.main', width: 42, height: 42 }}>
                                            <Business />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight="bold">{client.companyName}</Typography>
                                            <Typography variant="caption" color="text.secondary">ACC-{client.id.toString().padStart(4, '0')}</Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Person fontSize="small" sx={{ color: 'text.disabled' }} />
                                        <Typography variant="body2" fontWeight="600">{client.contactPerson}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Mail sx={{ fontSize: 14, color: 'primary.main' }} />
                                            <Typography variant="caption">{client.email}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Phone sx={{ fontSize: 14, color: 'text.disabled' }} />
                                            <Typography variant="caption">{client.phone || 'No phone set'}</Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label="ACTIVE ACCOUNT" 
                                        size="small" 
                                        sx={{ 
                                            bgcolor: '#dcfce7', 
                                            color: '#22c55e', 
                                            fontWeight: 800, 
                                            fontSize: '0.65rem',
                                            height: 24
                                        }} 
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <Tooltip title="Modify Account">
                                        <IconButton onClick={() => handleOpenDialog(client)} size="small" color="primary" sx={{ bgcolor: 'primary.50', mr: 1 }}>
                                            <Edit fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Remove Client">
                                        <IconButton onClick={() => handleDelete(client.id)} size="small" color="error" sx={{ bgcolor: 'error.50' }}>
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 6, p: 2 } }}>
                <DialogTitle sx={{ fontWeight: 800, px: 3, pt: 3 }}>
                    {editingClient ? 'Synchronize Client Intelligence' : 'Onboard Strategic Partner'}
                </DialogTitle>
                <DialogContent sx={{ px: 3 }}>
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Organization Legal Name"
                                value={formData.companyName}
                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                required
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Principal Contact Representative"
                                value={formData.contactPerson}
                                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                                required
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Official Correspondence Email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Direct Contact Line"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Physical Headquarters Address"
                                multiline
                                rows={2}
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={handleCloseDialog} sx={{ color: 'text.secondary' }}>Discard</Button>
                    <Button variant="contained" onClick={handleSubmit} sx={{ px: 4, borderRadius: '50px' }}>
                        {editingClient ? 'Commit Synchronized Data' : 'Initialize Partnership'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ClientManagement;
