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
    MenuItem,
    Switch,
    FormControlLabel,
    LinearProgress,
    Avatar,
    Tooltip,
    InputAdornment,
    Fab
} from '@mui/material';
import { 
    Edit, 
    Delete, 
    Add, 
    Search, 
    FilterList, 
    Mail, 
    Security,
    MoreVert
} from '@mui/icons-material';
import { userService } from '../../services/api';
import toast from 'react-hot-toast';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user',
        isActive: true
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await userService.getAll();
            setUsers(response.data.users);
        } catch (error) {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                name: user.name,
                email: user.email,
                password: '',
                role: user.role,
                isActive: user.isActive
            });
        } else {
            setEditingUser(null);
            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'user',
                isActive: true
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingUser(null);
    };

    const handleSubmit = async () => {
        try {
            if (editingUser) {
                await userService.update(editingUser.id, formData);
                toast.success('User updated successfully');
            } else {
                await userService.create(formData);
                toast.success('User created successfully');
            }
            fetchUsers();
            handleCloseDialog();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await userService.delete(id);
                toast.success('User deleted successfully');
                fetchUsers();
            } catch (error) {
                toast.error('Failed to delete user');
            }
        }
    };

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleColor = (role) => {
        switch(role) {
            case 'admin': return { bg: '#fee2e2', text: '#ef4444' };
            case 'client': return { bg: '#dcfce7', text: '#22c55e' };
            default: return { bg: '#e0e7ff', text: '#6366f1' };
        }
    };

    if (loading) return <LinearProgress sx={{ borderRadius: 2 }} />;

    return (
        <Box className="fade-in">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight="800">Team Management</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage your administrators, clients, and regular users.
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        size="small"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search sx={{ color: 'text.secondary', fontSize: 20 }} />
                                </InputAdornment>
                            ),
                            sx: { borderRadius: '50px', bgcolor: '#fff', width: 250 }
                        }}
                    />
                    <Button variant="outlined" startIcon={<FilterList />} sx={{ borderRadius: '50px' }}>Filter</Button>
                </Box>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 6, boxShadow: '0 10px 30px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', py: 2.5 }}>User Profile</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Contact</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Access Level</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }} align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.map((user) => {
                            const roleStyle = getRoleColor(user.role);
                            return (
                                <TableRow key={user.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar src={user.avatar} sx={{ width: 42, height: 42, bgcolor: roleStyle.text, fontWeight: 'bold' }}>
                                                {user.name.charAt(0)}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight="bold">{user.name}</Typography>
                                                <Typography variant="caption" color="text.secondary">ID: USR-{user.id.toString().padStart(4, '0')}</Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Mail sx={{ fontSize: 14, color: 'text.disabled' }} />
                                                <Typography variant="body2">{user.email}</Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={user.role.toUpperCase()} 
                                            sx={{ 
                                                bgcolor: roleStyle.bg, 
                                                color: roleStyle.text, 
                                                fontWeight: 800, 
                                                fontSize: '0.65rem',
                                                height: 24
                                            }} 
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: user.isActive ? '#22c55e' : '#94a3b8' }} />
                                            <Typography variant="body2" sx={{ color: user.isActive ? '#22c55e' : '#64748b', fontWeight: 600 }}>
                                                {user.isActive ? 'Active' : 'Inactive'}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Edit User">
                                            <IconButton onClick={() => handleOpenDialog(user)} size="small" sx={{ mr: 1, color: 'primary.main', bgcolor: 'primary.50' }}>
                                                <Edit fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete User">
                                            <IconButton onClick={() => handleDelete(user.id)} size="small" sx={{ color: 'error.main', bgcolor: 'error.50' }}>
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <Fab 
                color="primary" 
                sx={{ position: 'fixed', bottom: 32, right: 32, background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%)' }}
                onClick={() => handleOpenDialog()}
            >
                <Add />
            </Fab>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 6, p: 2 } }}>
                <DialogTitle sx={{ fontWeight: 800, px: 3, pt: 3 }}>
                    {editingUser ? 'Update User Account' : 'Register New User'}
                </DialogTitle>
                <DialogContent sx={{ px: 3 }}>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Full Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            margin="normal"
                            required
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        />
                        <TextField
                            fullWidth
                            label="Email Address"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            margin="normal"
                            required
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        />
                        {!editingUser && (
                            <TextField
                                fullWidth
                                label="Access Password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                margin="normal"
                                required
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                            />
                        )}
                        <TextField
                            fullWidth
                            select
                            label="User Role"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            margin="normal"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        >
                            <MenuItem value="admin">System Administrator</MenuItem>
                            <MenuItem value="client">Organization Client</MenuItem>
                            <MenuItem value="user">Regular User</MenuItem>
                        </TextField>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    color="success"
                                />
                            }
                            label={<Typography variant="body2" fontWeight="600">Active Account Status</Typography>}
                            sx={{ mt: 3, ml: 1 }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={handleCloseDialog} sx={{ color: 'text.secondary' }}>Discard</Button>
                    <Button onClick={handleSubmit} variant="contained" sx={{ px: 4, borderRadius: '50px' }}>
                        {editingUser ? 'Save Changes' : 'Create Account'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UserManagement;