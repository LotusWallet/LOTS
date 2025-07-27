import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  Badge
} from '@mui/material';
import {
  Login,
  CreditCard,
  AccountBalance,
  Person,
  AccountBalanceWallet,
  Note,
  Extension,
  Add
} from '@mui/icons-material';
import { ItemType } from '../types';

interface CategorySidebarProps {
  selectedCategory: ItemType | 'All';
  onCategorySelect: (category: ItemType | 'All') => void;
  categoryCounts: Record<ItemType | 'All', number>;
  onAddItem: () => void;
}

const categoryConfig = {
  All: { icon: Extension, label: 'All Items', color: '#666' },
  Login: { icon: Login, label: 'Logins', color: '#1976d2' },
  CreditCard: { icon: CreditCard, label: 'Credit Cards', color: '#f57c00' },
  BankAccount: { icon: AccountBalance, label: 'Bank Accounts', color: '#388e3c' },
  Identity: { icon: Person, label: 'Identities', color: '#7b1fa2' },
  CryptoWallet: { icon: AccountBalanceWallet, label: 'Crypto Wallets', color: '#d32f2f' },
  SecureNote: { icon: Note, label: 'Secure Notes', color: '#455a64' },
  Custom: { icon: Extension, label: 'Custom', color: '#795548' }
};

const CategorySidebar: React.FC<CategorySidebarProps> = ({
  selectedCategory,
  onCategorySelect,
  categoryCounts,
  onAddItem
}) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          position: 'relative',
          height: '100%',
          borderRight: '1px solid #e0e0e0'
        }
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
          LotS Vault
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Secure Password Manager
        </Typography>
      </Box>
      
      <Divider />
      
      <Box sx={{ p: 1 }}>
        <ListItemButton
          onClick={onAddItem}
          sx={{
            borderRadius: 1,
            mb: 1,
            bgcolor: '#1976d2',
            color: 'white',
            '&:hover': {
              bgcolor: '#1565c0'
            }
          }}
        >
          <ListItemIcon sx={{ color: 'white', minWidth: 36 }}>
            <Add />
          </ListItemIcon>
          <ListItemText primary="Add Item" />
        </ListItemButton>
      </Box>
      
      <Divider />
      
      <List sx={{ pt: 1 }}>
        {Object.entries(categoryConfig).map(([category, config]) => {
          const IconComponent = config.icon;
          const isSelected = selectedCategory === category;
          const count = categoryCounts[category as ItemType | 'All'] || 0;
          
          return (
            <ListItem key={category} disablePadding sx={{ px: 1 }}>
              <ListItemButton
                selected={isSelected}
                onClick={() => onCategorySelect(category as ItemType | 'All')}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    bgcolor: '#e3f2fd',
                    '&:hover': {
                      bgcolor: '#e3f2fd'
                    }
                  }
                }}
              >
                <ListItemIcon sx={{ color: config.color, minWidth: 36 }}>
                  <IconComponent fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary={config.label}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: isSelected ? 600 : 400
                  }}
                />
                {count > 0 && (
                  <Badge 
                    badgeContent={count} 
                    color="primary" 
                    sx={{
                      '& .MuiBadge-badge': {
                        fontSize: '0.7rem',
                        height: 18,
                        minWidth: 18
                      }
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default CategorySidebar;