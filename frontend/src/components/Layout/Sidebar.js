import React from 'react';
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Box,
    Typography,
    Divider,
    Avatar,
    Chip,
    IconButton
} from '@mui/material';
import {
    Dashboard,
    People,
    Business,
    Assignment,
    Assessment,
    Settings,
    Person,
    ChevronLeft,
    ChevronRight
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 280;

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const menuItems = {
        admin: [
            { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
            { text: 'User Management', icon: <People />, path: '/admin/users' },
            { text: 'Client Management', icon: <Business />, path: '/admin/clients' },
            { text: 'Project Management', icon: <Assignment />, path: '/admin/projects' },
            { text: 'Reports', icon: <Assessment />, path: '/admin/reports' },
            { text: 'Settings', icon: <Settings />, path: '/admin/settings' }
        ],
        client: [
            { text: 'Dashboard', icon: <Dashboard />, path: '/client/dashboard' },
            { text: 'My Projects', icon: <Assignment />, path: '/client/projects' },
            { text: 'Profile', icon: <Person />, path: '/profile' }
        ],
        user: [
            { text: 'Dashboard', icon: <Dashboard />, path: '/user/dashboard' },
            { text: 'Profile', icon: <Person />, path: '/profile' }
        ]
    };

    const currentMenu = menuItems[user?.role] || [];

    const drawer = (
        <Box sx={{ 
            height: '100%', 
            background: 'linear-gradient(180deg, #1e3a8a 0%, #4c1d95 100%)',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Toolbar sx={{ px: 3, py: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: 1, color: '#fff' }}>
                    PROPORTAL
                </Typography>
            </Toolbar>
            
            <List sx={{ px: 2, flexGrow: 1 }}>
                {currentMenu.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItem
                            button
                            key={item.text}
                            onClick={() => navigate(item.path)}
                            sx={{
                                borderRadius: '12px',
                                mb: 1,
                                backgroundColor: isActive ? '#fff' : 'transparent',
                                color: isActive ? '#4c1d95' : '#e2e8f0',
                                '&:hover': {
                                    backgroundColor: isActive ? '#fff' : 'rgba(255,255,255,0.1)',
                                    transform: 'translateX(5px)',
                                    transition: 'all 0.3s ease'
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <ListItemIcon sx={{ 
                                color: isActive ? '#4c1d95' : '#e2e8f0',
                                minWidth: '40px'
                            }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText 
                                primary={item.text} 
                                primaryTypographyProps={{ 
                                    fontWeight: isActive ? 700 : 500,
                                    fontSize: '0.95rem'
                                }} 
                            />
                        </ListItem>
                    );
                })}
            </List>

            <Box sx={{ p: 3, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar 
                        src={user?.avatar} 
                        sx={{ width: 45, height: 45, border: '2px solid rgba(255,255,255,0.2)' }}
                    >
                        {user?.name?.charAt(0)}
                    </Avatar>
                    <Box sx={{ overflow: 'hidden' }}>
                        <Typography variant="subtitle2" noWrap fontWeight="bold">
                            {user?.name}
                        </Typography>
                        <Chip 
                            label={user?.role?.toUpperCase()} 
                            size="small" 
                            sx={{ 
                                height: '18px', 
                                fontSize: '0.65rem', 
                                bgcolor: 'rgba(255,255,255,0.2)', 
                                color: '#fff',
                                fontWeight: 700
                            }} 
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );

    return (
        <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' }
                }}
            >
                {drawer}
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' }
                }}
                open
            >
                {drawer}
            </Drawer>
        </Box>
    );
};

export default Sidebar;