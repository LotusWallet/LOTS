import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, useMediaQuery } from '@mui/material';
import { icpService } from './services/icpService';
import { cryptoService } from './services/cryptoService';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ItemsPage from './pages/ItemsPage';
import AddItemPage from './pages/AddItemPage';
import Navbar from './components/Navbar';
import LoadingScreen from './components/LoadingScreen';
import MasterPasswordDialog from './components/MasterPasswordDialog';
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
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '16px',
          paddingRight: '16px',
          '@media (max-width: 600px)': {
            paddingLeft: '8px',
            paddingRight: '8px',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          '@media (max-width: 900px)': {
            width: '280px',
          },
        },
      },
    },
  },
});

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMasterPassword, setShowMasterPassword] = useState(false);
  const [isFirstTimeSetup, setIsFirstTimeSetup] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
        
        // Check if master password is set up
        checkMasterPasswordSetup();
      }
    } catch (error) {
      console.error('Failed to initialize app:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkMasterPasswordSetup = () => {
    const storedSalt = localStorage.getItem('lots_master_salt');
    if (!storedSalt) {
      setIsFirstTimeSetup(true);
      setShowMasterPassword(true);
    } else if (!cryptoService.isVaultUnlocked()) {
      setIsFirstTimeSetup(false);
      setShowMasterPassword(true);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const success = await icpService.login();
      if (success) {
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
    cryptoService.lockVault();
    setUser(null);
  };

  const handleMasterPasswordUnlock = () => {
    setShowMasterPassword(false);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh',
          overflow: 'hidden'
        }}>
          {user && (
            <Navbar 
              user={user} 
              onLogout={handleLogout}
              isMobile={isMobile}
              onLockVault={() => {
                cryptoService.lockVault();
                setShowMasterPassword(true);
                setIsFirstTimeSetup(false);
              }}
            />
          )}
          
          <Box sx={{ 
            flex: 1,
            display: 'flex',
            overflow: 'hidden'
          }}>
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
                  user ? <ItemsPage user={user} isMobile={isMobile} /> : 
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
        
        {/* Master Password Dialog */}
        <MasterPasswordDialog
          open={showMasterPassword}
          onClose={() => !isFirstTimeSetup && setShowMasterPassword(false)}
          onUnlock={handleMasterPasswordUnlock}
          isFirstTime={isFirstTimeSetup}
        />
      </Router>
    </ThemeProvider>
  );
}

export default App;