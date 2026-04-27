import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import Layout from './components/Layout/Layout';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, CircularProgress } from '@mui/material';

// Performance Optimization: Lazy load all route components
const Login = lazy(() => import('./pages/auth/Login'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));
const ClientManagement = lazy(() => import('./pages/admin/ClientManagement'));
const ReportsPage = lazy(() => import('./pages/admin/ReportsPage'));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'));
const ProjectManagement = lazy(() => import('./pages/admin/ProjectManagement'));
const ClientDashboard = lazy(() => import('./pages/client/ClientDashboard'));
const ClientProjects = lazy(() => import('./pages/client/ClientProjects'));
const UserDashboard = lazy(() => import('./pages/user/UserDashboard'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

const theme = createTheme({
    palette: {
        primary: {
            main: '#1e3a8a',
            light: '#7c3aed',
        },
        secondary: {
            main: '#14b8a6',
        },
        background: {
            default: '#f8fafc',
        },
        text: {
            primary: '#0f172a',
            secondary: '#334155',
        }
    },
    typography: {
        fontFamily: "'Inter', sans-serif",
        h1: { fontFamily: "'Poppins', sans-serif", fontWeight: 700 },
        h2: { fontFamily: "'Poppins', sans-serif", fontWeight: 700 },
        h3: { fontFamily: "'Poppins', sans-serif", fontWeight: 700 },
        h4: { fontFamily: "'Poppins', sans-serif", fontWeight: 700 },
        h5: { fontFamily: "'Poppins', sans-serif", fontWeight: 700 },
        h6: { fontFamily: "'Poppins', sans-serif", fontWeight: 600 },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: '50px',
                    padding: '8px 24px',
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                    border: '1px solid rgba(255,255,255,0.3)',
                }
            }
        }
    }
});

const LoadingScreen = () => (
    <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        bgcolor: '#f8fafc'
    }}>
        <CircularProgress color="primary" />
    </Box>
);

const AppRoutes = () => {
    const { user, loading } = useAuth();

    if (loading) return <LoadingScreen />;

    const getDefaultRoute = () => {
        if (!user) return '/login';
        switch(user.role) {
            case 'admin': return '/admin/dashboard';
            case 'client': return '/client/dashboard';
            default: return '/user/dashboard';
        }
    };

    return (
        <Suspense fallback={<LoadingScreen />}>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
                
                {/* Admin Routes */}
                <Route path="/admin/*" element={
                    <ProtectedRoute allowedRoles="admin">
                        <Layout>
                            <Routes>
                                <Route path="dashboard" element={<AdminDashboard />} />
                                <Route path="users" element={<UserManagement />} />
                                <Route path="clients" element={<ClientManagement />} />
                                <Route path="projects" element={<ProjectManagement />} />
                                <Route path="reports" element={<ReportsPage />} />
                                <Route path="settings" element={<SettingsPage />} />
                            </Routes>
                        </Layout>
                    </ProtectedRoute>
                } />
                
                {/* Client Routes */}
                <Route path="/client/*" element={
                    <ProtectedRoute allowedRoles="client">
                        <Layout>
                            <Routes>
                                <Route path="dashboard" element={<ClientDashboard />} />
                                <Route path="projects" element={<ClientProjects />} />
                            </Routes>
                        </Layout>
                    </ProtectedRoute>
                } />
                
                {/* User Routes */}
                <Route path="/user/*" element={
                    <ProtectedRoute allowedRoles="user">
                        <Layout>
                            <Routes>
                                <Route path="dashboard" element={<UserDashboard />} />
                            </Routes>
                        </Layout>
                    </ProtectedRoute>
                } />
                
                {/* Common Profile Route */}
                <Route path="/profile" element={
                    <ProtectedRoute>
                        <Layout>
                            <ProfilePage />
                        </Layout>
                    </ProtectedRoute>
                } />
                
                <Route path="/" element={<Navigate to={getDefaultRoute()} />} />
            </Routes>
        </Suspense>
    );
};

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Router>
                <AuthProvider>
                    <Toaster position="top-right" />
                    <AppRoutes />
                </AuthProvider>
            </Router>
        </ThemeProvider>
    );
}

export default App;