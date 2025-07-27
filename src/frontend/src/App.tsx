import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { icpService } from './services/icpService';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ItemsPage from './pages/ItemsPage';
import AddItemPage from './pages/AddItemPage';
import Navbar from './components/Navbar';
import LoadingScreen from './components/LoadingScreen';
import { User } from './types';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await icpService.init();
      const isAuthenticated = await icpService.isAuthenticated();
      
      if (isAuthenticated) {
        const principal = await icpService.getPrincipal();
        setUser({
          principal,
          isAuthenticated: true
        });
      }
    } catch (error) {
      console.error('Failed to initialize app:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true); // 添加加载状态
    try {
      const success = await icpService.login();
      if (success) {
        // 重新初始化应用状态
        await initializeApp();
      }
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await icpService.logout();
    setUser(null);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          {user && <Navbar user={user} onLogout={handleLogout} />}
          
          <Box sx={{ flex: 1 }}>
            <Routes>
              <Route 
                path="/login" 
                element={
                  user ? <Navigate to="/dashboard" replace /> : 
                  <LoginPage onLogin={handleLogin} />
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  user ? <DashboardPage user={user} /> : 
                  <Navigate to="/login" replace />
                } 
              />
              <Route 
                path="/items" 
                element={
                  user ? <ItemsPage user={user} /> : 
                  <Navigate to="/login" replace />
                } 
              />
              <Route 
                path="/add-item" 
                element={
                  user ? <AddItemPage user={user} /> : 
                  <Navigate to="/login" replace />
                } 
              />
              <Route 
                path="/" 
                element={
                  <Navigate to={user ? "/dashboard" : "/login"} replace />
                } 
              />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;