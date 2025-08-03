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
  Badge,
  Collapse,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Login,
  CreditCard,
  AccountBalance,
  Person,
  AccountBalanceWallet,
  Note,
  Extension,
  Add,
  DriveEta,
  Security,
  ExpandLess,
  ExpandMore
} from '@mui/icons-material';
import { ItemType } from '../types';

interface CategorySidebarProps {
  selectedCategory: ItemType | 'All';
  onCategorySelect: (category: ItemType | 'All') => void;
  categoryCounts: Record<ItemType | 'All', number>;
  onAddItem: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const categoryConfig = {
  All: { icon: Extension, label: 'All Items', color: '#666', group: 'overview' },
  Login: { icon: Login, label: 'Logins', color: '#1976d2', group: 'accounts' },
  CreditCard: { icon: CreditCard, label: 'Credit Cards', color: '#f57c00', group: 'financial' },
  BankAccount: { icon: AccountBalance, label: 'Bank Accounts', color: '#388e3c', group: 'financial' },
  Identity: { icon: Person, label: 'Identities', color: '#7b1fa2', group: 'personal' },
  DriverLicense: { icon: DriveEta, label: 'Driver Licenses', color: '#795548', group: 'personal' },
  CryptoWallet: { icon: AccountBalanceWallet, label: 'Crypto Wallets', color: '#d32f2f', group: 'crypto' },
  OTP: { icon: Security, label: 'OTP/2FA', color: '#ff5722', group: 'security' },
  SecureNote: { icon: Note, label: 'Secure Notes', color: '#455a64', group: 'notes' },
  Custom: { icon: Extension, label: 'Custom', color: '#795548', group: 'other' }
};

const categoryGroups = {
  overview: 'Overview',
  accounts: 'Accounts',
  financial: 'Financial',
  personal: 'Personal Info',
  crypto: 'Cryptocurrency',
  security: 'Security',
  notes: 'Notes',
  other: 'Other'
};

const CategorySidebar: React.FC<CategorySidebarProps> = ({
  selectedCategory,
  onCategorySelect,
  categoryCounts,
  onAddItem,
  mobileOpen = false,
  onMobileClose
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [expandedGroups, setExpandedGroups] = React.useState<Record<string, boolean>>({
    overview: true,
    accounts: true,
    financial: true,
    personal: true,
    crypto: true,
    security: true,
    notes: true,
    other: true
  });

  const handleGroupToggle = (group: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  const groupedCategories = Object.entries(categoryConfig).reduce((acc, [category, config]) => {
    if (!acc[config.group]) {
      acc[config.group] = [];
    }
    acc[config.group].push({ category, config });
    return acc;
  }, {} as Record<string, Array<{ category: string; config: any }>>);

  const drawerContent = (
    <>
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
      
      <List sx={{ pt: 1, px: 1 }}>
        {Object.entries(groupedCategories).map(([group, categories]) => (
          <React.Fragment key={group}>
            <ListItemButton
              onClick={() => handleGroupToggle(group)}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                minHeight: 36
              }}
            >
              <ListItemText 
                primary={categoryGroups[group as keyof typeof categoryGroups]}
                primaryTypographyProps={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'text.secondary'
                }}
              />
              {expandedGroups[group] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            
            <Collapse in={expandedGroups[group]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {categories.map(({ category, config }) => {
                  const IconComponent = config.icon;
                  const isSelected = selectedCategory === category;
                  const count = categoryCounts[category as ItemType | 'All'] || 0;
                  
                  return (
                    <ListItem key={category} disablePadding sx={{ pl: 2 }}>
                      <ListItemButton
                        selected={isSelected}
                        onClick={() => {
                          onCategorySelect(category as ItemType | 'All');
                          if (isMobile && onMobileClose) {
                            onMobileClose();
                          }
                        }}
                        sx={{
                          borderRadius: 1,
                          mb: 0.5,
                          minHeight: 36,
                          '&.Mui-selected': {
                            bgcolor: '#e3f2fd',
                            '&:hover': {
                              bgcolor: '#e3f2fd'
                            }
                          }
                        }}
                      >
                        <ListItemIcon sx={{ color: config.color, minWidth: 32 }}>
                          <IconComponent fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={config.label}
                          primaryTypographyProps={{
                            fontSize: '0.85rem',
                            fontWeight: isSelected ? 600 : 400
                          }}
                        />
                        {count > 0 && (
                          <Badge 
                            badgeContent={count} 
                            color="primary" 
                            sx={{
                              '& .MuiBadge-badge': {
                                fontSize: '0.65rem',
                                height: 16,
                                minWidth: 16
                              }
                            }}
                          />
                        )}
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </Collapse>
          </React.Fragment>
        ))}
      </List>
    </>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{
          keepMounted: true
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box'
          }
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

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
      {drawerContent}
    </Drawer>
  );
};

export default CategorySidebar;