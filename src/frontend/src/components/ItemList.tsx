import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
  Paper,
  Divider
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  ContentCopy,
  Login,
  CreditCard,
  AccountBalance,
  Person,
  AccountBalanceWallet,
  Note,
  Extension
} from '@mui/icons-material';
import { StorageItem, ItemType } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface ItemListProps {
  items: StorageItem[];
  selectedItem: StorageItem | null;
  onItemSelect: (item: StorageItem) => void;
  onItemEdit: (item: StorageItem) => void;
  onItemDelete: (item: StorageItem) => void;
  onItemCopy: (item: StorageItem) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const getItemIcon = (itemType: ItemType) => {
  const iconMap = {
    Login: Login,
    CreditCard: CreditCard,
    BankAccount: AccountBalance,
    Identity: Person,
    CryptoWallet: AccountBalanceWallet,
    SecureNote: Note,
    Custom: Extension
  };
  return iconMap[itemType] || Extension;
};

const getItemColor = (itemType: ItemType) => {
  const colorMap = {
    Login: '#1976d2',
    CreditCard: '#f57c00',
    BankAccount: '#388e3c',
    Identity: '#7b1fa2',
    CryptoWallet: '#d32f2f',
    SecureNote: '#455a64',
    Custom: '#795548'
  };
  return colorMap[itemType] || '#666';
};

const ItemList: React.FC<ItemListProps> = ({
  items,
  selectedItem,
  onItemSelect,
  onItemEdit,
  onItemDelete,
  onItemCopy,
  currentPage,
  totalPages,
  onPageChange
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuItem, setMenuItem] = useState<StorageItem | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, item: StorageItem) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuItem(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuItem(null);
  };

  const handleMenuAction = (action: 'edit' | 'delete' | 'copy') => {
    if (!menuItem) return;
    
    switch (action) {
      case 'edit':
        onItemEdit(menuItem);
        break;
      case 'delete':
        onItemDelete(menuItem);
        break;
      case 'copy':
        onItemCopy(menuItem);
        break;
    }
    handleMenuClose();
  };

  if (items.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: '100%',
        p: 4
      }}>
        <Extension sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No items found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Add your first secure item to get started
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ flex: 1, overflow: 'hidden' }}>
        <List sx={{ height: '100%', overflow: 'auto', p: 0 }}>
          {items.map((item, index) => {
            const IconComponent = getItemIcon(item.itemType);
            const isSelected = selectedItem?.id === item.id;
            
            return (
              <React.Fragment key={item.id}>
                <ListItem disablePadding>
                  <ListItemButton
                    selected={isSelected}
                    onClick={() => onItemSelect(item)}
                    sx={{
                      py: 2,
                      '&.Mui-selected': {
                        bgcolor: '#e3f2fd',
                        borderRight: '3px solid #1976d2'
                      }
                    }}
                  >
                    <ListItemIcon sx={{ color: getItemColor(item.itemType) }}>
                      <IconComponent />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                            {item.title}
                          </Typography>
                          {item.tags.length > 0 && (
                            <Chip 
                              label={item.tags[0]} 
                              size="small" 
                              variant="outlined"
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {item.itemType}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Modified {formatDistanceToNow(new Date(item.updatedAt))} ago
                          </Typography>
                        </Box>
                      }
                    />
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, item)}
                      sx={{ opacity: isSelected ? 1 : 0.5 }}
                    >
                      <MoreVert fontSize="small" />
                    </IconButton>
                  </ListItemButton>
                </ListItem>
                {index < items.length - 1 && <Divider />}
              </React.Fragment>
            );
          })}
        </List>
      </Paper>
      
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => onPageChange(page)}
            color="primary"
            size="small"
          />
        </Box>
      )}
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleMenuAction('copy')}>
          <ContentCopy fontSize="small" sx={{ mr: 1 }} />
          Copy
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('edit')}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('delete')} sx={{ color: 'error.main' }}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ItemList;