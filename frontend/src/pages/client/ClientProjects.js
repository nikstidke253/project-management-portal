import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Chip,
    Button,
    LinearProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    TextField,
    Avatar,
    AvatarGroup,
    Tooltip,
    Stack,
    Paper
} from '@mui/material';
import { 
    Assignment, 
    Edit, 
    CalendarToday, 
    TrendingUp,
    Schedule,
    CheckCircle
} from '@mui/icons-material';
import { projectService } from '../../services/api';
import toast from 'react-hot-toast';

const ClientProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [newStatus, setNewStatus] = useState('');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await projectService.getAll();
            setProjects(response.data.projects);
        } catch (error) {
            toast.error('Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (project) => {
        setSelectedProject(project);
        setNewStatus(project.status);
        setOpenDialog(true);
    };

    const handleUpdateStatus = async () => {
        if (!selectedProject) return;
        try {
            await projectService.update(selectedProject.id, { status: newStatus });
            toast.success('Status updated successfully');
            fetchProjects();
            setOpenDialog(false);
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    if (loading) return <LinearProgress sx={{ borderRadius: 2 }} />;

    const getStatusStyles = (status) => {
        switch (status) {
            case 'completed': return { color: '#22c55e', bg: '#dcfce7', icon: <CheckCircle /> };
            case 'in-progress': return { color: '#3b82f6', bg: '#dbeafe', icon: <TrendingUp /> };
            case 'pending': return { color: '#f59e0b', bg: '#fef3c7', icon: <Schedule /> };
            case 'on-hold': return { color: '#ef4444', bg: '#fee2e2', icon: <Schedule /> };
            default: return { color: '#64748b', bg: '#f1f5f9', icon: <Schedule /> };
        }
    };

    return (
        <Box className="fade-in">
            <Box sx={{ mb: 5 }}>
                <Typography variant="h4" fontWeight="800" sx={{ letterSpacing: -1 }}>Project Portfolio</Typography>
                <Typography variant="body1" color="text.secondary">
                    Detailed overview of all ongoing and completed initiatives.
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {projects.map((project) => {
                    const statusStyle = getStatusStyles(project.status);
                    const progress = project.status === 'completed' ? 100 : (project.status === 'in-progress' ? 65 : 15);
                    
                    return (
                        <Grid item xs={12} md={6} lg={4} key={project.id}>
                            <Card sx={{ 
                                borderRadius: 6, 
                                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'all 0.3s ease',
                                '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }
                            }}>
                                <CardContent sx={{ p: 4, flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                                        <Box sx={{ p: 1.5, bgcolor: 'primary.50', color: 'primary.main', borderRadius: 4 }}>
                                            <Assignment />
                                        </Box>
                                        <Chip 
                                            icon={statusStyle.icon}
                                            label={project.status.replace('-', ' ').toUpperCase()} 
                                            sx={{ 
                                                fontWeight: 800, 
                                                fontSize: '0.65rem',
                                                bgcolor: statusStyle.bg,
                                                color: statusStyle.color,
                                                '& .MuiChip-icon': { color: 'inherit', fontSize: 16 }
                                            }}
                                        />
                                    </Box>
                                    
                                    <Typography variant="h6" fontWeight="800" gutterBottom>
                                        {project.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, minHeight: 45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {project.description || 'No description provided for this project.'}
                                    </Typography>

                                    <Box sx={{ mb: 3 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="caption" fontWeight="800">Overall Progress</Typography>
                                            <Typography variant="caption" fontWeight="800" color="primary">{progress}%</Typography>
                                        </Box>
                                        <LinearProgress 
                                            variant="determinate" 
                                            value={progress} 
                                            sx={{ height: 8, borderRadius: 4, bgcolor: '#f1f5f9' }} 
                                        />
                                    </Box>

                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Box>
                                            <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mb: 0.5 }}>Team</Typography>
                                            <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: 12, border: '2px solid #fff' } }}>
                                                <Tooltip title={project.User?.name || 'Unassigned'}>
                                                    <Avatar alt={project.User?.name}>{project.User?.name?.charAt(0)}</Avatar>
                                                </Tooltip>
                                                <Avatar alt="Team member" />
                                                <Avatar alt="Team member" />
                                            </AvatarGroup>
                                        </Box>
                                        <Box sx={{ textAlign: 'right' }}>
                                            <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mb: 0.5 }}>Deadline</Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: project.status !== 'completed' ? 'error.main' : 'text.secondary' }}>
                                                <CalendarToday sx={{ fontSize: 12 }} />
                                                <Typography variant="caption" fontWeight="800">
                                                    {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Stack>
                                </CardContent>
                                <Box sx={{ p: 3, pt: 0 }}>
                                    <Button 
                                        fullWidth 
                                        variant="contained" 
                                        startIcon={<Edit />}
                                        onClick={() => handleOpenDialog(project)}
                                        sx={{ 
                                            borderRadius: 4, 
                                            bgcolor: '#fff', 
                                            color: 'text.primary',
                                            border: '1px solid #e2e8f0',
                                            boxShadow: 'none',
                                            '&:hover': { bgcolor: '#f8fafc', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }
                                        }}
                                    >
                                        Manage Status
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                    );
                })}
                {projects.length === 0 && (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 6, border: '2px dashed #e2e8f0', bgcolor: 'transparent' }}>
                            <Assignment sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                            <Typography variant="h6" fontWeight="bold">No projects found</Typography>
                            <Typography color="text.secondary">Contact support if you believe this is an error.</Typography>
                        </Paper>
                    </Grid>
                )}
            </Grid>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 6 } }}>
                <DialogTitle sx={{ fontWeight: 800, pt: 3 }}>Update Project Phase</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            select
                            fullWidth
                            label="Current Phase"
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        >
                            <MenuItem value="pending">Pending Review</MenuItem>
                            <MenuItem value="in-progress">In Active Progress</MenuItem>
                            <MenuItem value="completed">Work Completed</MenuItem>
                            <MenuItem value="on-hold">On Hold / Paused</MenuItem>
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenDialog(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
                    <Button variant="contained" onClick={handleUpdateStatus} sx={{ borderRadius: '50px', px: 4 }}>
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ClientProjects;
