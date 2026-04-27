import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Grid, 
    Paper, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow,
    Button,
    TextField,
    Chip,
    LinearProgress,
    Stack,
    IconButton,
    Avatar,
    Tooltip as MuiTooltip
} from '@mui/material';
import { 
    FileDownload, 
    FilterList, 
    Assessment,
    Assignment,
    InfoOutlined,
    TrendingUp,
    BarChart as BarChartIcon
} from '@mui/icons-material';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { reportService, projectService } from '../../services/api';
import toast from 'react-hot-toast';

const COLORS = ['#1e3a8a', '#14b8a6', '#7c3aed', '#f59e0b'];

const ReportsPage = () => {
    const [stats, setStats] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = {};
            if (dateRange.startDate && dateRange.endDate) {
                params.startDate = dateRange.startDate;
                params.endDate = dateRange.endDate;
            }
            
            const [statsRes, projectsRes] = await Promise.all([
                reportService.getDashboardStats(params),
                projectService.getAll()
            ]);
            
            setStats(statsRes.data.stats);
            setProjects(projectsRes.data.projects);
        } catch (error) {
            toast.error('Failed to load report data');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            const response = await reportService.exportReport();
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'detailed_report.csv');
            document.body.appendChild(link);
            link.click();
            toast.success('Report exported successfully');
        } catch (error) {
            toast.error('Export failed');
        }
    };

    const chartData = stats?.projectsByStatus ? [
        { name: 'Pending', value: stats.projectsByStatus.pending },
        { name: 'In Progress', value: stats.projectsByStatus['in-progress'] },
        { name: 'Completed', value: stats.projectsByStatus.completed },
        { name: 'On Hold', value: stats.projectsByStatus['on-hold'] }
    ] : [];

    return (
        <Box className="fade-in">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5, flexWrap: 'wrap', gap: 3 }}>
                <Box>
                    <Typography variant="h4" fontWeight="800" sx={{ letterSpacing: -1 }}>Intelligence & Insights</Typography>
                    <Typography variant="body1" color="text.secondary">Deep dive into project performance and resource allocation.</Typography>
                </Box>
                <Button 
                    variant="contained" 
                    startIcon={<FileDownload />}
                    onClick={handleExport}
                    sx={{ 
                        borderRadius: '50px', 
                        px: 4, 
                        py: 1.5,
                        background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%)',
                        boxShadow: '0 10px 20px rgba(30, 58, 138, 0.2)'
                    }}
                >
                    Export Intelligence Report
                </Button>
            </Box>

            <Paper sx={{ p: 4, mb: 5, borderRadius: 6, boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems={{ xs: 'flex-start', md: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <FilterList color="primary" />
                        <Typography variant="subtitle1" fontWeight="800">Timeframe:</Typography>
                    </Box>
                    
                    <Stack direction="row" spacing={3} sx={{ flexGrow: 1, width: { xs: '100%', md: 'auto' } }}>
                        <TextField
                            type="date"
                            label="Start Date"
                            InputLabelProps={{ shrink: true }}
                            size="small"
                            fullWidth
                            value={dateRange.startDate}
                            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        />
                        <TextField
                            type="date"
                            label="End Date"
                            InputLabelProps={{ shrink: true }}
                            size="small"
                            fullWidth
                            value={dateRange.endDate}
                            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        />
                    </Stack>

                    <Stack direction="row" spacing={2}>
                        <Button variant="contained" onClick={fetchData} sx={{ borderRadius: '50px', px: 4 }}>
                            Refine Analysis
                        </Button>
                        <Button variant="text" onClick={() => {
                            setDateRange({ startDate: '', endDate: '' });
                            setTimeout(fetchData, 0);
                        }} sx={{ color: 'text.secondary' }}>
                            Reset
                        </Button>
                    </Stack>
                </Stack>
            </Paper>

            {loading && <LinearProgress sx={{ mb: 5, borderRadius: 2 }} />}

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 4, height: 450, borderRadius: 6, boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <BarChartIcon color="primary" />
                                <Typography variant="h6" fontWeight="800">Project Delivery Velocity</Typography>
                            </Box>
                            <MuiTooltip title="Showing distribution of project phases">
                                <IconButton size="small"><InfoOutlined fontSize="small" /></IconButton>
                            </MuiTooltip>
                        </Box>
                        <ResponsiveContainer width="100%" height="80%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }} 
                                />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 4, height: 450, borderRadius: 6, boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
                            <TrendingUp color="primary" />
                            <Typography variant="h6" fontWeight="800">Work Distribution</Typography>
                        </Box>
                        <ResponsiveContainer width="100%" height="80%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }} 
                                />
                                <Legend verticalAlign="bottom" />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="h6" fontWeight="800" sx={{ mt: 2, mb: 3 }}>Comprehensive Data Table</Typography>
                    <TableContainer component={Paper} sx={{ borderRadius: 6, boxShadow: '0 10px 30px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
                        <Table>
                            <TableHead sx={{ bgcolor: '#f8fafc' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 800, py: 2.5 }}>Initiative Name</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>Account</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>Owner</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>Phase</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>Criticality</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>Target Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {projects.map((project) => (
                                    <TableRow key={project.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell sx={{ fontWeight: 600 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#f1f5f9' }}>
                                                    <Assignment fontSize="small" sx={{ color: 'primary.main' }} />
                                                </Box>
                                                {project.name}
                                            </Box>
                                        </TableCell>
                                        <TableCell>{project.Client?.companyName || 'Global'}</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Avatar sx={{ width: 24, height: 24, fontSize: 10, bgcolor: 'primary.main' }}>
                                                    {project.User?.name?.charAt(0)}
                                                </Avatar>
                                                <Typography variant="body2">{project.User?.name || 'Unassigned'}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={project.status.toUpperCase()} 
                                                size="small" 
                                                sx={{ 
                                                    fontWeight: 800, 
                                                    fontSize: '0.65rem',
                                                    bgcolor: project.status === 'completed' ? '#dcfce7' : '#e0e7ff',
                                                    color: project.status === 'completed' ? '#22c55e' : '#6366f1'
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={project.priority?.toUpperCase()} 
                                                size="small" 
                                                variant="outlined"
                                                color={project.priority === 'high' ? 'error' : 'default'}
                                                sx={{ fontWeight: 700, fontSize: '0.65rem' }}
                                            />
                                        </TableCell>
                                        <TableCell fontWeight="600">
                                            {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'TBD'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ReportsPage;
