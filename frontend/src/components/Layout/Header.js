import React, { useState } from 'react';
import { 
    AppBar, 
    Toolbar, 
    IconButton, 
    Typography, 
    Box, 
    Menu, 
    MenuItem, 
    Avatar,
    Badge,
    Tooltip,
    Divider,
    ListItemIcon
} from '@mui/material';
import {
    Menu as MenuIcon,
    Notifications,
    Settings,
    Logout,
    Person,
    DarkMode,
    LightMode,
    Search
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = ({ handleDrawerToggle }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const handleMenu = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
        handleClose();
    };

    const getBreadcrumbs = () => {
        const paths = location.pathname.split('/').filter(p => p);
        return paths.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' / ');
    };

    return (
        <AppBar
            position="fixed"
            sx={{
                width: { sm: `calc(100% - 280px)` },
                ml: { sm: `280px` },
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                color: '#333',
                boxShadow: 'none',
                borderBottom: '1px solid rgba(0,0,0,0.05)',
                zIndex: (theme) => theme.zIndex.drawer + 1
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 4 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    
                    <Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 600, mb: -0.5 }}>
                            {getBreadcrumbs()}
                        </Typography>
                        <Typography variant="h6" fontWeight="800" sx={{ letterSpacing: -0.5 }}>
                            Project Dashboard
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', bgcolor: '#f1f5f9', borderRadius: '50px', px: 2, py: 0.5, mr: 2 }}>
                        <Search sx={{ color: 'text.secondary', fontSize: 20, mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">Search anything...</Typography>
                    </Box>

                    <Tooltip title="Toggle Theme">
                        <IconButton onClick={() => setIsDarkMode(!isDarkMode)}>
                            {isDarkMode ? <LightMode /> : <DarkMode />}
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Notifications">
                        <IconButton>
                            <Badge badgeContent={4} color="error" overlap="circular">
                                <Notifications />
                            </Badge>
                        </IconButton>
                    </Tooltip>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1, cursor: 'pointer' }} onClick={handleMenu}>
                        <Avatar 
                            src={user?.avatar} 
                            sx={{ 
                                width: 38, 
                                height: 38, 
                                border: '2px solid #fff',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                            }}
                        >
                            {user?.name?.charAt(0)}
                        </Avatar>
                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <Typography variant="subtitle2" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
                                {user?.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {user?.role}
                            </Typography>
                        </Box>
                    </Box>
                    
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        PaperProps={{
                            sx: {
                                mt: 1.5,
                                width: 200,
                                borderRadius: 3,
                                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                                border: '1px solid rgba(0,0,0,0.05)'
                            }
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <MenuItem onClick={() => { navigate('/profile'); handleClose(); }} sx={{ py: 1.5 }}>
                            <ListItemIcon><Person fontSize="small" /></ListItemIcon>
                            Profile
                        </MenuItem>
                        <MenuItem onClick={() => { navigate('/settings'); handleClose(); }} sx={{ py: 1.5 }}>
                            <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
                            Settings
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main' }}>
                            <ListItemIcon><Logout fontSize="small" color="error" /></ListItemIcon>
                            Logout
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;