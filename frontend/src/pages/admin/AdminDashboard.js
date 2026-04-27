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
    ListItemAvatar,
    Avatar,
    Chip,
    CardActionArea,
    Paper,
    Button
} from '@mui/material';
import {
    People,
    Business,
    Assignment,
    TrendingUp,
    ChevronRight,
    ArrowUpward,
    Notifications
} from '@mui/icons-material';
import { reportService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer
} from 'recharts';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const response = await reportService.getDashboardStats();
            setStats(response.data.stats);
        } catch (error) {
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: 'Total Users',
            value: stats?.totalUsers || 0,
            icon: <People />,
            color: '#1e3a8a',
            path: '/admin/users',
            trend: '+12% from last month'
        },
        {
            title: 'Total Clients',
            value: stats?.totalClients || 0,
            icon: <Business />,
            color: '#14b8a6',
            path: '/admin/clients',
            trend: '+5% from last month'
        },
        {
            title: 'Active Projects',
            value: stats?.totalProjects || 0,
            icon: <Assignment />,
            color: '#7c3aed',
            path: '/admin/projects',
            trend: '+8% from last month'
        },
        {
            title: 'Completion Rate',
            value: stats?.totalProjects ? 
                `${Math.round((stats.projectsByStatus?.completed / stats.totalProjects) * 100)}%` : '0%',
            icon: <TrendingUp />,
            color: '#f59e0b',
            path: '/admin/reports',
            trend: '+3% from last month'
        }
    ];

    const pieData = stats?.projectsByStatus ? [
        { name: 'Pending', value: stats.projectsByStatus.pending, color: '#f6ad55' },
        { name: 'In Progress', value: stats.projectsByStatus['in-progress'], color: '#4299e1' },
        { name: 'Completed', value: stats.projectsByStatus.completed, color: '#48bb78' },
        { name: 'On Hold', value: stats.projectsByStatus['on-hold'], color: '#ed8936' }
    ] : [];

    if (loading) return <LinearProgress sx={{ borderRadius: 2 }} />;

    return (
        <Box className="fade-in">
            {/* Welcome Banner */}
            <Paper sx={{ 
                p: 4, 
                mb: 4, 
                borderRadius: 6, 
                background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%)',
                color: '#fff',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography variant="h4" fontWeight="800" sx={{ mb: 1 }}>
                        Welcome back, {user?.name}! 👋
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                        Here's what's happening with your projects and team today.
                    </Typography>
                </Box>
                <Box sx={{ 
                    position: 'absolute', top: '-50%', right: '-10%', width: '300px', height: '300px', 
                    borderRadius: '50%', background: 'rgba(255,255,255,0.1)', filter: 'blur(50px)' 
                }} />
            </Paper>

            {/* KPI Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {statCards.map((card, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card sx={{ 
                            borderRadius: 6, 
                            borderTop: `4px solid ${card.color}`,
                            transition: 'all 0.3s ease',
                            '&:hover': { transform: 'translateY(-10px)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }
                        }}>
                            <CardActionArea onClick={() => navigate(card.path)} sx={{ height: '100%' }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Box sx={{ p: 1.5, borderRadius: 4, bgcolor: `${card.color}15`, color: card.color }}>
                                            {card.icon}
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                                            <ArrowUpward sx={{ fontSize: 16, mr: 0.5 }} />
                                            <Typography variant="caption" fontWeight="700">Live</Typography>
                                        </Box>
                                    </Box>
                                    <Typography variant="h3" className="stat-number" sx={{ mb: 0.5 }}>
                                        {card.value}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" fontWeight="600">
                                        {card.title}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', mt: 1 }}>
                                        {card.trend}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                {/* Status Donut Chart */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ borderRadius: 6, height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight="800" sx={{ mb: 3 }}>Project Status</Typography>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }} 
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <Box sx={{ mt: 2 }}>
                                {pieData.map((item, i) => (
                                    <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.color }} />
                                            <Typography variant="body2" color="text.secondary">{item.name}</Typography>
                                        </Box>
                                        <Typography variant="body2" fontWeight="bold">{item.value}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Progress Bar Chart */}
                <Grid item xs={12} md={8}>
                    <Card sx={{ borderRadius: 6, height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" fontWeight="800">Overall Performance</Typography>
                                <Button variant="text" size="small" endIcon={<ChevronRight />}>Detailed View</Button>
                            </Box>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={pieData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                    <Tooltip 
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Recent Activity Timeline */}
                <Grid item xs={12}>
                    <Card sx={{ borderRadius: 6 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                <Notifications color="primary" />
                                <Typography variant="h6" fontWeight="800">Live Activity Feed</Typography>
                            </Box>
                            <List>
                                {stats?.recentActivities?.map((activity, index) => (
                                    <ListItem 
                                        key={index} 
                                        sx={{ 
                                            px: 2, 
                                            py: 2, 
                                            borderRadius: 4, 
                                            mb: 1,
                                            '&:hover': { bgcolor: '#f8fafc' }
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 'bold' }}>
                                                {activity.User?.name?.charAt(0)}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography variant="body1" fontWeight="bold">{activity.action}</Typography>
                                                    <Chip label={activity.User?.name} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }} />
                                                </Box>
                                            }
                                            secondary={activity.description}
                                        />
                                        <Typography variant="caption" color="text.disabled" sx={{ minWidth: 100, textAlign: 'right' }}>
                                            {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </Typography>
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminDashboard;