import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar
} from '@mui/material';
import { Logout } from '@mui/icons-material';
import { User } from '../types';

interface NavbarProps {
  user: User;
  onLogout: () => void;
  isMobile: boolean;
  onLockVault: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, isMobile, onLockVault }) => {
  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          LotS Vault
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
            {user.principal.slice(0, 2).toUpperCase()}
          </Avatar>
          
          <Button
            color="inherit"
            onClick={onLogout}
            startIcon={<Logout />}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;