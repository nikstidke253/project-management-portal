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
    LinearProgress,
    Grid,
    Avatar,
    AvatarGroup,
    Tooltip
} from '@mui/material';
import { Edit, Delete, Add, Assignment, CalendarToday, MoreVert } from '@mui/icons-material';
import { projectService, clientService, userService } from '../../services/api';
import toast from 'react-hot-toast';

const ProjectManagement = () => {
    const [projects, setProjects] = useState([]);
    const [clients, setClients] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        clientId: '',
        assignedTo: '',
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [pRes, cRes, uRes] = await Promise.all([
                projectService.getAll(),
                clientService.getAll(),
                userService.getAll()
            ]);
            setProjects(pRes.data.projects);
            setClients(cRes.data.clients);
            setUsers(uRes.data.users);
        } catch (error) {
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (project = null) => {
        if (project) {
            setEditingProject(project);
            setFormData({
                name: project.name,
                description: project.description || '',
                status: project.status,
                priority: project.priority,
                clientId: project.clientId,
                assignedTo: project.assignedTo || '',
                startDate: project.startDate ? project.startDate.split('T')[0] : '',
                endDate: project.endDate ? project.endDate.split('T')[0] : ''
            });
        } else {
            setEditingProject(null);
            setFormData({
                name: '',
                description: '',
                status: 'pending',
                priority: 'medium',
                clientId: '',
                assignedTo: '',
                startDate: '',
                endDate: ''
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingProject(null);
    };

    const handleSubmit = async () => {
        try {
            if (editingProject) {
                await projectService.update(editingProject.id, formData);
                toast.success('Project updated successfully');
            } else {
                await projectService.create(formData);
                toast.success('Project created successfully');
            }
            fetchData();
            handleCloseDialog();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await projectService.delete(id);
                toast.success('Project deleted successfully');
                fetchData();
            } catch (error) {
                toast.error('Failed to delete project');
            }
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'completed': return { bg: '#dcfce7', text: '#22c55e' };
            case 'in-progress': return { bg: '#e0e7ff', text: '#6366f1' };
            case 'pending': return { bg: '#fef3c7', text: '#f59e0b' };
            case 'on-hold': return { bg: '#fee2e2', text: '#ef4444' };
            default: return { bg: '#f1f5f9', text: '#64748b' };
        }
    };

    if (loading) return <LinearProgress sx={{ borderRadius: 2 }} />;

    return (
        <Box className="fade-in">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight="800">Global Initiatives</Typography>
                    <Typography variant="body2" color="text.secondary">Orchestrate all organization-wide projects and resource mapping.</Typography>
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
                    Initialize Project
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 6, boxShadow: '0 10px 30px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 800, py: 2.5 }}>Project Name</TableCell>
                            <TableCell sx={{ fontWeight: 800 }}>Account / Client</TableCell>
                            <TableCell sx={{ fontWeight: 800 }}>Assigned To</TableCell>
                            <TableCell sx={{ fontWeight: 800 }}>Current Phase</TableCell>
                            <TableCell sx={{ fontWeight: 800 }}>Priority</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 800 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {projects.map((project) => {
                            const statusStyle = getStatusColor(project.status);
                            return (
                                <TableRow key={project.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#f1f5f9' }}>
                                                <Assignment fontSize="small" color="primary" />
                                            </Box>
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight="bold">{project.name}</Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {project.endDate ? `Due: ${new Date(project.endDate).toLocaleDateString()}` : 'No deadline'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="600">{project.Client?.companyName}</Typography>
                                        <Typography variant="caption" color="text.secondary">{project.Client?.contactPerson}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Avatar sx={{ width: 28, height: 28, fontSize: 12, bgcolor: 'primary.main' }}>
                                                {project.User?.name?.charAt(0)}
                                            </Avatar>
                                            <Typography variant="body2">{project.User?.name || 'Unassigned'}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={project.status.toUpperCase()} 
                                            sx={{ 
                                                bgcolor: statusStyle.bg, 
                                                color: statusStyle.text, 
                                                fontWeight: 800, 
                                                fontSize: '0.65rem',
                                                height: 24
                                            }} 
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={project.priority.toUpperCase()} 
                                            variant="outlined"
                                            color={project.priority === 'high' ? 'error' : 'default'}
                                            sx={{ fontWeight: 700, fontSize: '0.65rem', height: 22 }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Edit Project">
                                            <IconButton onClick={() => handleOpenDialog(project)} size="small" color="primary" sx={{ bgcolor: 'primary.50', mr: 1 }}>
                                                <Edit fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete Project">
                                            <IconButton onClick={() => handleDelete(project.id)} size="small" color="error" sx={{ bgcolor: 'error.50' }}>
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

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 6, p: 2 } }}>
                <DialogTitle sx={{ fontWeight: 800, px: 3, pt: 3 }}>
                    {editingProject ? 'Modify Initiative Parameters' : 'Launch New Strategic Initiative'}
                </DialogTitle>
                <DialogContent sx={{ px: 3 }}>
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Initiative Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Detailed Description"
                                multiline
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Target Account / Client"
                                value={formData.clientId}
                                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                                required
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                            >
                                {clients.map((client) => (
                                    <MenuItem key={client.id} value={client.id}>
                                        {client.companyName}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Assigned Lead"
                                value={formData.assignedTo}
                                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                            >
                                <MenuItem value="">Hold Unassigned</MenuItem>
                                {users.filter(u => u.role === 'user').map((user) => (
                                    <MenuItem key={user.id} value={user.id}>
                                        {user.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Current Lifecycle Phase"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                            >
                                <MenuItem value="pending">Pending Strategy</MenuItem>
                                <MenuItem value="in-progress">In Active Execution</MenuItem>
                                <MenuItem value="completed">Work Finalized</MenuItem>
                                <MenuItem value="on-hold">Operational Hold</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Business Priority"
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                            >
                                <MenuItem value="low">Standard</MenuItem>
                                <MenuItem value="medium">High Impact</MenuItem>
                                <MenuItem value="high">Mission Critical</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Commencement Date"
                                InputLabelProps={{ shrink: true }}
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Target Completion"
                                InputLabelProps={{ shrink: true }}
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={handleCloseDialog} sx={{ color: 'text.secondary' }}>Discard</Button>
                    <Button variant="contained" onClick={handleSubmit} sx={{ px: 4, borderRadius: '50px' }}>
                        {editingProject ? 'Synchronize Updates' : 'Launch Initiative'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ProjectManagement;
