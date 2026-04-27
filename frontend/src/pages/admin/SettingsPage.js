import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Switch,
    Button,
    Divider,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Stack,
    LinearProgress
} from '@mui/material';
import { 
    Settings as SettingsIcon, 
    Palette, 
    Language, 
    Security, 
    Storage,
    CloudDone
} from '@mui/icons-material';
import toast from 'react-hot-toast';

const SettingsPage = () => {
    const [settings, setSettings] = useState({
        darkMode: false,
        emailNotifications: true,
        projectAlerts: true,
        language: 'en',
        timezone: 'UTC'
    });

    const handleToggle = (name) => {
        setSettings({ ...settings, [name]: !settings[name] });
        toast.success('Preference updated locally');
    };

    const handleSave = () => {
        toast.success('Global settings synchronized successfully');
    };

    return (
        <Box className="fade-in">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 5 }}>
                <Box sx={{ p: 1.5, borderRadius: 4, bgcolor: 'primary.main', color: '#fff' }}>
                    <SettingsIcon fontSize="large" />
                </Box>
                <Box>
                    <Typography variant="h4" fontWeight="800">System Architecture</Typography>
                    <Typography variant="body1" color="text.secondary">Configure your portal environment and global preferences.</Typography>
                </Box>
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Stack spacing={4}>
                        {/* Appearance Section */}
                        <Paper sx={{ p: 4, borderRadius: 6, boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                                <Palette color="primary" />
                                <Typography variant="h6" fontWeight="800">Visual Environment</Typography>
                            </Box>
                            <Stack spacing={3}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight="700">High Contrast Mode</Typography>
                                        <Typography variant="body2" color="text.secondary">Optimize visual clarity for accessibility.</Typography>
                                    </Box>
                                    <Switch checked={settings.darkMode} onChange={() => handleToggle('darkMode')} />
                                </Box>
                                <Divider />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight="700">Glassmorphism Effects</Typography>
                                        <Typography variant="body2" color="text.secondary">Enable modern translucent UI elements.</Typography>
                                    </Box>
                                    <Switch defaultChecked />
                                </Box>
                            </Stack>
                        </Paper>

                        {/* Regional Section */}
                        <Paper sx={{ p: 4, borderRadius: 6, boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                                <Language color="primary" />
                                <Typography variant="h6" fontWeight="800">Regional & Localization</Typography>
                            </Box>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Primary Language</InputLabel>
                                        <Select
                                            value={settings.language}
                                            label="Primary Language"
                                            onChange={(e) => setSettings({...settings, language: e.target.value})}
                                            sx={{ borderRadius: 3 }}
                                        >
                                            <MenuItem value="en">English (US)</MenuItem>
                                            <MenuItem value="es">Spanish</MenuItem>
                                            <MenuItem value="fr">French</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>System Timezone</InputLabel>
                                        <Select
                                            value={settings.timezone}
                                            label="System Timezone"
                                            onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                                            sx={{ borderRadius: 3 }}
                                        >
                                            <MenuItem value="UTC">UTC (Universal)</MenuItem>
                                            <MenuItem value="EST">EST (New York)</MenuItem>
                                            <MenuItem value="IST">IST (India)</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Paper>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <Button variant="text" sx={{ color: 'text.secondary' }}>Discard Changes</Button>
                            <Button variant="contained" onClick={handleSave} sx={{ borderRadius: '50px', px: 6 }}>
                                Apply Global Settings
                            </Button>
                        </Box>
                    </Stack>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Stack spacing={4}>
                        {/* Security Card */}
                        <Paper sx={{ p: 4, borderRadius: 6, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Security sx={{ color: 'primary.main' }} />
                                <Typography variant="h6" fontWeight="800">Security Audit</Typography>
                            </Box>
                            <Typography variant="body2" sx={{ mb: 3 }}>Your account security score is currently <b>Optimal (92%)</b>.</Typography>
                            <Button fullWidth variant="outlined" sx={{ borderRadius: 3 }}>Run Compliance Check</Button>
                        </Paper>

                        {/* Storage Card */}
                        <Paper sx={{ p: 4, borderRadius: 6, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Storage sx={{ color: 'primary.main' }} />
                                <Typography variant="h6" fontWeight="800">Cloud Storage</Typography>
                            </Box>
                            <Box sx={{ mb: 1.5 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="caption" fontWeight="700">Project Assets</Typography>
                                    <Typography variant="caption" fontWeight="700">4.2 / 10 GB</Typography>
                                </Box>
                                <LinearProgress variant="determinate" value={42} sx={{ height: 6, borderRadius: 3 }} />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'success.main', mt: 2 }}>
                                <CloudDone sx={{ fontSize: 16 }} />
                                <Typography variant="caption" fontWeight="700">All data synchronized</Typography>
                            </Box>
                        </Paper>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SettingsPage;
