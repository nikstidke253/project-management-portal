import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';

// Path-based icon imports for better performance
import Google from '@mui/icons-material/Google';
import GitHub from '@mui/icons-material/GitHub';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import RocketLaunch from '@mui/icons-material/RocketLaunch';
import CheckCircle from '@mui/icons-material/CheckCircle';

import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(formData);
            toast.success('Welcome back!');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#f8fafc' }}>
            {/* Left Side: Branding */}
            <Grid container sx={{ flexGrow: 1 }}>
                <Grid item xs={12} md={6} sx={{ 
                    display: { xs: 'none', md: 'flex' },
                    flexDirection: 'column',
                    justifyContent: 'center',
                    p: 8,
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%)',
                    color: '#fff',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Optimized animated shapes */}
                    <Box sx={{ 
                        position: 'absolute', top: '-10%', right: '-10%', width: '400px', height: '400px', 
                        borderRadius: '50%', background: 'rgba(255,255,255,0.1)', filter: 'blur(50px)' 
                    }} />
                    <Box sx={{ 
                        position: 'absolute', bottom: '10%', left: '10%', width: '200px', height: '200px', 
                        borderRadius: '50%', background: 'rgba(255,255,255,0.05)', filter: 'blur(30px)' 
                    }} />

                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <RocketLaunch sx={{ fontSize: 64, mb: 4 }} />
                        <Typography variant="h2" fontWeight="800" sx={{ mb: 2, letterSpacing: -1, fontFamily: 'Poppins' }}>
                            Manage Projects<br />Like a Pro.
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 6, opacity: 0.8, fontWeight: 400 }}>
                            Everything you need to ship products faster,<br />together in one place.
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {[
                                'Real-time collaboration tools',
                                'Advanced analytics & reporting',
                                'Client portal for transparent updates'
                            ].map((text, i) => (
                                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <CheckCircle sx={{ color: '#14b8a6' }} />
                                    <Typography variant="subtitle1" fontWeight="500">{text}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Grid>

                {/* Right Side: Form */}
                <Grid item xs={12} md={6} sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    p: 4
                }}>
                    <Paper elevation={0} sx={{ 
                        p: { xs: 4, sm: 6 }, 
                        maxWidth: 480, 
                        width: '100%', 
                        borderRadius: 6,
                        boxShadow: '0 20px 50px rgba(0,0,0,0.03)',
                        border: '1px solid rgba(0,0,0,0.05)',
                        bgcolor: '#fff'
                    }}>
                        <Typography variant="h4" fontWeight="800" sx={{ mb: 1, color: '#0f172a', fontFamily: 'Poppins' }}>
                            Welcome Back
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>
                            Enter your credentials to access your workspace.
                        </Typography>

                        <form onSubmit={handleSubmit}>
                            <Box sx={{ mb: 3 }}>
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    variant="outlined"
                                    sx={{ 
                                        '& .MuiOutlinedInput-root': { borderRadius: 3 }
                                    }}
                                />
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    variant="outlined"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                    sx={{ 
                                        '& .MuiOutlinedInput-root': { borderRadius: 3 }
                                    }}
                                />
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                                <FormControlLabel
                                    control={<Checkbox size="small" defaultChecked />}
                                    label={<Typography variant="body2">Remember me</Typography>}
                                />
                                <Link href="#" variant="body2" sx={{ fontWeight: 600, color: '#1e3a8a', textDecoration: 'none' }}>
                                    Forgot Password?
                                </Link>
                            </Box>

                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={loading}
                                sx={{ 
                                    py: 2, 
                                    borderRadius: 3, 
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%)',
                                    boxShadow: '0 10px 20px rgba(30, 58, 138, 0.2)',
                                    '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 15px 30px rgba(30, 58, 138, 0.3)' },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In to Portal'}
                            </Button>
                        </form>

                        <Box sx={{ my: 4, position: 'relative' }}>
                            <Divider>
                                <Typography variant="caption" color="text.secondary" sx={{ px: 2 }}>OR CONTINUE WITH</Typography>
                            </Divider>
                        </Box>

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<Google />}
                                    sx={{ borderRadius: 3, py: 1, borderColor: '#e2e8f0', color: '#64748b', fontWeight: 600 }}
                                >
                                    Google
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<GitHub />}
                                    sx={{ borderRadius: 3, py: 1, borderColor: '#e2e8f0', color: '#64748b', fontWeight: 600 }}
                                >
                                    GitHub
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Login;