import React, { useState, useEffect } from 'react';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    Avatar,
    Chip,
    Paper,
    CardActionArea,
    Divider,
    IconButton,
    Tooltip,
    Button
} from '@mui/material';
import {
    Assignment,
    CheckCircle,
    Pending,
    Notifications,
    TrendingUp,
    MoreVert,
    CalendarToday
} from '@mui/icons-material';
import { projectService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ClientDashboard = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await projectService.getAll();
            setProjects(response.data.projects);
        } catch (error) {
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LinearProgress sx={{ borderRadius: 2 }} />;

    const stats = {
        total: projects.length,
        completed: projects.filter(p => p.status === 'completed').length,
        inProgress: projects.filter(p => p.status === 'in-progress').length,
        pending: projects.filter(p => p.status === 'pending').length
    };

    const kpiCards = [
        {
            title: 'My Projects',
            value: stats.total,
            icon: <Assignment sx={{ fontSize: 32 }} />,
            color: '#1e3a8a',
            path: '/client/projects'
        },
        {
            title: 'Completed',
            value: stats.completed,
            icon: <CheckCircle sx={{ fontSize: 32 }} />,
            color: '#22c55e',
            path: '/client/projects'
        },
        {
            title: 'Active Work',
            value: stats.inProgress,
            icon: <TrendingUp sx={{ fontSize: 32 }} />,
            color: '#3b82f6',
            path: '/client/projects'
        },
        {
            title: 'Action Needed',
            value: stats.pending,
            icon: <Pending sx={{ fontSize: 32 }} />,
            color: '#f59e0b',
            path: '/client/projects'
        }
    ];

    return (
        <Box className="fade-in">
            {/* Welcome Section */}
            <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h3" fontWeight="800" sx={{ letterSpacing: -1, mb: 1 }}>
                        Hello, {user?.name.split(' ')[0]}!
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Track your projects and see how we're building your vision.
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="subtitle2" fontWeight="800">26 April, 2024</Typography>
                        <Typography variant="caption" color="text.secondary">Current Project Cycle</Typography>
                    </Box>
                    <IconButton sx={{ bgcolor: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                        <CalendarToday fontSize="small" />
                    </IconButton>
                </Box>
            </Box>

            {/* KPI Grid */}
            <Grid container spacing={3} sx={{ mb: 5 }}>
                {kpiCards.map((card, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card sx={{ 
                            borderRadius: 6, 
                            boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
                            background: '#fff',
                            transition: 'all 0.3s ease',
                            '&:hover': { transform: 'translateY(-10px)', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }
                        }}>
                            <CardActionArea onClick={() => navigate(card.path)} sx={{ p: 1 }}>
                                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                    <Box sx={{ 
                                        p: 2, 
                                        borderRadius: 4, 
                                        bgcolor: `${card.color}10`, 
                                        color: card.color,
                                        display: 'flex'
                                    }}>
                                        {card.icon}
                                    </Box>
                                    <Box>
                                        <Typography variant="h4" className="stat-number">{card.value}</Typography>
                                        <Typography variant="caption" color="text.secondary" fontWeight="700" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                                            {card.title}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={4}>
                {/* Project Overview List */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ borderRadius: 6, p: 4, boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                            <Typography variant="h6" fontWeight="800">Recently Updated Projects</Typography>
                            <Button variant="text" color="primary" onClick={() => navigate('/client/projects')}>View All</Button>
                        </Box>
                        <List sx={{ p: 0 }}>
                            {projects.slice(0, 4).map((project, index) => (
                                <Box key={project.id}>
                                    <ListItem 
                                        sx={{ 
                                            px: 0, 
                                            py: 3,
                                            '&:hover': { bgcolor: 'transparent' }
                                        }}
                                    >
                                        <Box sx={{ width: '100%' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#f1f5f9' }}>
                                                        <Assignment color="primary" />
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="subtitle1" fontWeight="800">{project.name}</Typography>
                                                        <Typography variant="caption" color="text.secondary">Lead: {project.User?.name || 'Assigned soon'}</Typography>
                                                    </Box>
                                                </Box>
                                                <Chip 
                                                    label={project.status.replace('-', ' ').toUpperCase()} 
                                                    sx={{ 
                                                        height: 24, 
                                                        fontSize: '0.65rem', 
                                                        fontWeight: 800,
                                                        bgcolor: project.status === 'completed' ? '#dcfce7' : '#e0e7ff',
                                                        color: project.status === 'completed' ? '#22c55e' : '#6366f1'
                                                    }}
                                                />
                                            </Box>
                                            <Box sx={{ width: '100%', mt: 2 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                    <Typography variant="caption" fontWeight="700">Project Health</Typography>
                                                    <Typography variant="caption" fontWeight="700">75%</Typography>
                                                </Box>
                                                <LinearProgress 
                                                    variant="determinate" 
                                                    value={75} 
                                                    sx={{ height: 6, borderRadius: 3, bgcolor: '#f1f5f9' }} 
                                                />
                                            </Box>
                                        </Box>
                                    </ListItem>
                                    {index < projects.slice(0, 4).length - 1 && <Divider />}
                                </Box>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                {/* Notifications & Social Feed */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ borderRadius: 6, p: 4, boxShadow: '0 10px 30px rgba(0,0,0,0.02)', height: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                            <Box sx={{ p: 1, borderRadius: '50%', bgcolor: 'error.main' }}>
                                <Notifications sx={{ color: '#fff', fontSize: 20 }} />
                            </Box>
                            <Typography variant="h6" fontWeight="800">Alerts & News</Typography>
                        </Box>
                        <List>
                            {[
                                { title: 'New milestone reached!', sub: 'Project alpha is now 80% complete', time: '2h ago' },
                                { title: 'Status Update', sub: 'Beta test version is now available', time: '5h ago' },
                                { title: 'Welcome!', sub: 'Explore your new client dashboard', time: '1d ago' }
                            ].map((note, i) => (
                                <ListItem key={i} sx={{ px: 0, py: 2, display: 'block' }}>
                                    <Typography variant="subtitle2" fontWeight="800">{note.title}</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>{note.sub}</Typography>
                                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>{note.time}</Typography>
                                </ListItem>
                            ))}
                        </List>
                        <Button 
                            fullWidth 
                            variant="outlined" 
                            sx={{ mt: 3, borderRadius: '50px', textTransform: 'none' }}
                        >
                            View All Notifications
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ClientDashboard;
