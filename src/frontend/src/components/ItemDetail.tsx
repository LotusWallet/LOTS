import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Paper,
  Divider,
  Chip,
  InputAdornment,
  Alert
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  Visibility,
  VisibilityOff,
  ContentCopy,
  Delete
} from '@mui/icons-material';
import { StorageItem } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface ItemDetailProps {
  item: StorageItem | null;
  onSave: (item: StorageItem) => void;
  onDelete: (item: StorageItem) => void;
  onCopy: (text: string) => void;
}

const ItemDetail: React.FC<ItemDetailProps> = ({
  item,
  onSave,
  onDelete,
  onCopy
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState<StorageItem | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  if (!item) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: '100%',
        p: 4
      }}>
        <Typography variant="h6" color="text.secondary">
          Select an item to view details
        </Typography>
      </Box>
    );
  }

  const handleEdit = () => {
    setEditedItem({ ...item });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedItem) {
      onSave(editedItem);
      setIsEditing(false);
      setEditedItem(null);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedItem(null);
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    if (editedItem) {
      setEditedItem({
        ...editedItem,
        fields: {
          ...editedItem.fields,
          [fieldName]: value
        }
      });
    }
  };

  const togglePasswordVisibility = (fieldName: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  const isPasswordField = (fieldName: string) => {
    return fieldName.toLowerCase().includes('password') || 
           fieldName.toLowerCase().includes('pin') ||
           fieldName.toLowerCase().includes('secret');
  };

  const currentItem = editedItem || item;

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ flex: 1, overflow: 'auto' }}>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'flex-start', mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" gutterBottom>
                {currentItem.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip label={currentItem.itemType} size="small" color="primary" />
                {currentItem.tags.map(tag => (
                  <Chip key={tag} label={tag} size="small" variant="outlined" />
                ))}
              </Box>
              <Typography variant="caption" color="text.secondary">
                Created {formatDistanceToNow(new Date(currentItem.createdAt))} ago • 
                Modified {formatDistanceToNow(new Date(currentItem.updatedAt))} ago
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              {isEditing ? (
                <>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Save />}
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <IconButton onClick={handleEdit}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => onDelete(item)} color="error">
                    <Delete />
                  </IconButton>
                </>
              )}
            </Box>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {Object.entries(currentItem.fields).map(([fieldName, fieldValue]) => {
              const isPassword = isPasswordField(fieldName);
              const showPassword = showPasswords[fieldName] || !isPassword;
              
              return (
                <TextField
                  key={fieldName}
                  label={fieldName}
                  value={fieldValue}
                  onChange={(e) => handleFieldChange(fieldName, e.target.value)}
                  disabled={!isEditing}
                  type={isPassword && !showPassword ? 'password' : 'text'}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {isPassword && (
                          <IconButton
                            onClick={() => togglePasswordVisibility(fieldName)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        )}
                        <IconButton
                          onClick={() => onCopy(fieldValue)}
                          edge="end"
                        >
                          <ContentCopy />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              );
            })}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ItemDetail;