import React, { useState, useEffect } from 'react';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    LinearProgress,
    Button,
    IconButton,
    Chip,
    Paper,
    Divider
} from '@mui/material';
import {
    Assignment,
    CheckCircle,
    Pending,
    TrendingUp,
    Refresh,
    ArrowForward,
    Person,
    Work
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { projectService, reportService } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const UserDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [, projectsRes] = await Promise.all([
                reportService.getDashboardStats(),
                projectService.getAll()
            ]);
            setProjects(projectsRes.data.projects || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'completed': return 'success';
            case 'in-progress': return 'primary';
            case 'pending': return 'warning';
            case 'on-hold': return 'error';
            default: return 'default';
        }
    };

    if (loading) {
        return (
            <Box>
                <LinearProgress />
                <Typography sx={{ mt: 2, textAlign: 'center' }}>Loading dashboard...</Typography>
            </Box>
        );
    }

    return (
        <Box>
            {/* Welcome Section */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                    Welcome back, {user?.name}!
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Here's an overview of your assigned projects and tasks.
                </Typography>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white'
                    }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                        Assigned Projects
                                    </Typography>
                                    <Typography variant="h3" fontWeight="bold">
                                        {projects.length}
                                    </Typography>
                                </Box>
                                <Assignment sx={{ fontSize: 48, opacity: 0.8 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Completed
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold" color="success.main">
                                        {projects.filter(p => p.status === 'completed').length}
                                    </Typography>
                                </Box>
                                <CheckCircle sx={{ fontSize: 40, color: '#48bb78' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        In Progress
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold" color="primary.main">
                                        {projects.filter(p => p.status === 'in-progress').length}
                                    </Typography>
                                </Box>
                                <TrendingUp sx={{ fontSize: 40, color: '#4299e1' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Pending
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold" color="warning.main">
                                        {projects.filter(p => p.status === 'pending').length}
                                    </Typography>
                                </Box>
                                <Pending sx={{ fontSize: 40, color: '#ed8936' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* My Projects Section */}
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
                My Projects
                <IconButton onClick={fetchDashboardData} sx={{ ml: 1 }}>
                    <Refresh />
                </IconButton>
            </Typography>

            <Grid container spacing={3}>
                {projects.length === 0 ? (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                            <Work sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" gutterBottom>
                                No Projects Assigned
                            </Typography>
                            <Typography color="text.secondary">
                                You don't have any projects assigned yet. Check back later!
                            </Typography>
                        </Paper>
                    </Grid>
                ) : (
                    projects.map((project) => (
                        <Grid item xs={12} md={6} key={project.id}>
                            <Card sx={{ 
                                height: '100%',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 4
                                }
                            }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Typography variant="h6" fontWeight="bold">
                                            {project.name}
                                        </Typography>
                                        <Chip 
                                            label={project.status ? project.status.replace('-', ' ').toUpperCase() : 'PENDING'} 
                                            color={getStatusColor(project.status)}
                                            size="small"
                                        />
                                    </Box>
                                    
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        {project.description || 'No description provided'}
                                    </Typography>
                                    
                                    <Divider sx={{ my: 2 }} />
                                    
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Priority
                                            </Typography>
                                            <Chip 
                                                label={project.priority ? project.priority.toUpperCase() : 'MEDIUM'} 
                                                size="small"
                                                color={project.priority === 'high' ? 'error' : project.priority === 'medium' ? 'warning' : 'success'}
                                                variant="outlined"
                                            />
                                        </Box>
                                        
                                        <Button 
                                            size="small" 
                                            endIcon={<ArrowForward />}
                                            onClick={() => navigate(`/projects/${project.id}`)}
                                        >
                                            View Details
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>

            {/* Quick Actions */}
            <Paper sx={{ mt: 4, p: 3, bgcolor: '#f7fafc' }}>
                <Typography variant="h6" gutterBottom>
                    Quick Actions
                </Typography>
                <Grid container spacing={2}>
                    <Grid item>
                        <Button variant="outlined" startIcon={<Assignment />}>
                            View All Projects
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="outlined" startIcon={<Person />} onClick={() => navigate('/profile')}>
                            Update Profile
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default UserDashboard;