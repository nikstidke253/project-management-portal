import React, { useState, useRef } from 'react';
import {
    Box,
    Typography,
    Grid,
    Paper,
    Avatar,
    Button,
    TextField,
    IconButton,
    CircularProgress,
    Chip,
    Tabs,
    Tab,
    Switch,
    Stack
} from '@mui/material';
import { 
    PhotoCamera, 
    Security, 
    Person, 
    Notifications as NotificationsIcon,
    Fingerprint,
    VerifiedUser,
    CloudUpload
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { settingsService } from '../services/api';
import axios from 'axios';
import toast from 'react-hot-toast';

const ProfilePage = () => {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const fileInputRef = useRef();

    const handleTabChange = (event, newValue) => setActiveTab(newValue);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await settingsService.updateProfile(formData);
            setUser(response.data.user);
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error('Passwords do not match');
        }
        setLoading(true);
        try {
            await settingsService.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            toast.success('Password changed successfully');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Password change failed');
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('avatar', file);

        setUploading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${process.env.REACT_APP_API_URL || 'https://project-management-portal-71cw.onrender.com/api'}/upload/avatar`, uploadData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            setUser({ ...user, avatar: response.data.avatarUrl });
            toast.success('Avatar updated successfully');
        } catch (error) {
            toast.error('Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <Box className="fade-in">
            {/* Cover Photo & Header Section */}
            <Paper sx={{ 
                borderRadius: 8, 
                overflow: 'hidden', 
                mb: 4, 
                boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
                position: 'relative'
            }}>
                <Box sx={{ 
                    height: 200, 
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%)',
                    position: 'relative'
                }}>
                    <Button
                        startIcon={<CloudUpload />}
                        sx={{ 
                            position: 'absolute', top: 20, right: 20, 
                            bgcolor: 'rgba(255,255,255,0.2)', color: '#fff',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                        }}
                    >
                        Change Cover
                    </Button>
                </Box>
                
                <Box sx={{ px: 4, pb: 4, mt: -8, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 4 }}>
                    <Box sx={{ position: 'relative' }}>
                        <Avatar
                            src={user?.avatar}
                            sx={{ width: 160, height: 160, border: '6px solid #fff', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', bgcolor: 'primary.main', fontSize: 64 }}
                        >
                            {user?.name?.charAt(0)}
                        </Avatar>
                        <IconButton
                            onClick={() => fileInputRef.current.click()}
                            sx={{ 
                                position: 'absolute', bottom: 10, right: 10, 
                                bgcolor: 'primary.main', color: '#fff',
                                '&:hover': { bgcolor: 'primary.dark' },
                                boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                            }}
                        >
                            {uploading ? <CircularProgress size={20} color="inherit" /> : <PhotoCamera fontSize="small" />}
                        </IconButton>
                        <input type="file" hidden ref={fileInputRef} onChange={handleAvatarUpload} accept="image/*" />
                    </Box>
                    
                    <Box sx={{ flexGrow: 1, textAlign: { xs: 'center', md: 'left' }, mt: { xs: 0, md: 6 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                            <Typography variant="h4" fontWeight="800">{user?.name}</Typography>
                            <VerifiedUser color="primary" />
                        </Box>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>{user?.email}</Typography>
                        <Stack direction="row" spacing={1} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                            <Chip label={user?.role?.toUpperCase()} size="small" sx={{ fontWeight: 800, bgcolor: 'primary.50', color: 'primary.main' }} />
                            <Chip label="Active Account" size="small" variant="outlined" color="success" sx={{ fontWeight: 700 }} />
                        </Stack>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <Button variant="outlined" sx={{ borderRadius: '50px' }}>View Public Profile</Button>
                        <Button variant="contained" sx={{ borderRadius: '50px' }}>Share Profile</Button>
                    </Box>
                </Box>
                
                <Tabs value={activeTab} onChange={handleTabChange} sx={{ px: 4, borderTop: '1px solid #f1f5f9' }}>
                    <Tab label="Personal Info" icon={<Person />} iconPosition="start" />
                    <Tab label="Security" icon={<Security />} iconPosition="start" />
                    <Tab label="Notifications" icon={<NotificationsIcon />} iconPosition="start" />
                </Tabs>
            </Paper>

            <Grid container spacing={4}>
                <Grid item xs={12}>
                    {activeTab === 0 && (
                        <Paper className="fade-in" sx={{ p: 4, borderRadius: 6 }}>
                            <Typography variant="h6" fontWeight="800" sx={{ mb: 4 }}>Basic Information</Typography>
                            <form onSubmit={handleUpdateProfile}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Full Name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Email Address"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button variant="contained" type="submit" disabled={loading} sx={{ mt: 2, borderRadius: '50px', px: 6 }}>
                                            Save Profile Changes
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </Paper>
                    )}

                    {activeTab === 1 && (
                        <Stack spacing={4} className="fade-in">
                            <Paper sx={{ p: 4, borderRadius: 6 }}>
                                <Typography variant="h6" fontWeight="800" sx={{ mb: 4 }}>Change Password</Typography>
                                <form onSubmit={handleChangePassword}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Current Password"
                                                type="password"
                                                value={passwordData.currentPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="New Password"
                                                type="password"
                                                value={passwordData.newPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Confirm New Password"
                                                type="password"
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button variant="contained" type="submit" disabled={loading} sx={{ mt: 2, borderRadius: '50px', px: 6 }}>
                                                Update Credentials
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </form>
                            </Paper>

                            <Paper sx={{ p: 4, borderRadius: 6 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <Box sx={{ p: 1.5, bgcolor: 'primary.50', borderRadius: 3, color: 'primary.main' }}>
                                            <Fingerprint />
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight="800">Two-Factor Authentication</Typography>
                                            <Typography variant="body2" color="text.secondary">Add an extra layer of security to your account.</Typography>
                                        </Box>
                                    </Box>
                                    <Switch />
                                </Box>
                            </Paper>
                        </Stack>
                    )}

                    {activeTab === 2 && (
                        <Paper className="fade-in" sx={{ p: 4, borderRadius: 6 }}>
                            <Typography variant="h6" fontWeight="800" sx={{ mb: 4 }}>Notification Settings</Typography>
                            <Stack spacing={3}>
                                {[
                                    { label: 'Email Notifications', desc: 'Receive updates via your primary email.' },
                                    { label: 'Project Milestones', desc: 'Get notified when a project reaches a key stage.' },
                                    { label: 'System Alerts', desc: 'Important news about maintenance and updates.' }
                                ].map((item, i) => (
                                    <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight="700">{item.label}</Typography>
                                            <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                                        </Box>
                                        <Switch defaultChecked={i < 2} />
                                    </Box>
                                ))}
                            </Stack>
                        </Paper>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default ProfilePage;
