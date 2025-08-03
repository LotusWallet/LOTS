import React from 'react';
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Badge
} from '@mui/material';
import {
  Dashboard,
  List,
  Add,
  Settings,
  Search
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

interface MobileBottomNavigationProps {
  itemCount?: number;
}

const MobileBottomNavigation: React.FC<MobileBottomNavigationProps> = ({
  itemCount = 0
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getCurrentValue = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 0;
      case '/items':
        return 1;
      case '/add-item':
        return 2;
      case '/settings':
        return 3;
      default:
        return 0;
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 0:
        navigate('/dashboard');
        break;
      case 1:
        navigate('/items');
        break;
      case 2:
        navigate('/add-item');
        break;
      case 3:
        navigate('/settings');
        break;
    }
  };

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0,
        zIndex: 1000
      }} 
      elevation={3}
    >
      <BottomNavigation
        value={getCurrentValue()}
        onChange={handleChange}
        showLabels
      >
        <BottomNavigationAction
          label="Dashboard"
          icon={<Dashboard />}
        />
        <BottomNavigationAction
          label="Items"
          icon={
            <Badge badgeContent={itemCount} color="primary">
              <List />
            </Badge>
          }
        />
        <BottomNavigationAction
          label="Add"
          icon={<Add />}
        />
        <BottomNavigationAction
          label="Settings"
          icon={<Settings />}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default MobileBottomNavigation;