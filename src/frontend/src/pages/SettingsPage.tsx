import React, { useState } from 'react';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Security,
  Language,
  Backup,
  Lock,
  Delete,
  Info,
  CloudDownload,
  CloudUpload
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { cryptoService } from '../services/cryptoService';
import ImportExportDialog from '../components/ImportExportDialog';
import { User, StorageItem } from '../types';

interface SettingsPageProps {
  user: User;
  items: StorageItem[];
  onImport: (items: StorageItem[]) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({
  user,
  items,
  onImport
}) => {
  const { t, i18n } = useTranslation();
  const [autoLock, setAutoLock] = useState(true);
  const [showImportExport, setShowImportExport] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [language, setLanguage] = useState(i18n.language);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
    localStorage.setItem('lots_language', newLanguage);
  };

  const handleLockVault = () => {
    cryptoService.lockVault();
    // This would trigger the master password dialog
  };

  const handleDeleteAllData = () => {
    // Implementation for deleting all data
    localStorage.clear();
    setShowDeleteConfirm(false);
    // Redirect to login or reload
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      
      <List>
        {/* Security Section */}
        <ListItem>
          <ListItemIcon>
            <Security />
          </ListItemIcon>
          <ListItemText 
            primary="Security"
            secondary="Manage your vault security settings"
          />
        </ListItem>
        
        <ListItem>
          <ListItemText 
            primary="Auto-lock vault"
            secondary="Automatically lock vault after inactivity"
          />
          <ListItemSecondaryAction>
            <Switch
              checked={autoLock}
              onChange={(e) => setAutoLock(e.target.checked)}
            />
          </ListItemSecondaryAction>
        </ListItem>
        
        <ListItem button onClick={handleLockVault}>
          <ListItemIcon>
            <Lock />
          </ListItemIcon>
          <ListItemText 
            primary="Lock vault now"
            secondary="Immediately lock your vault"
          />
        </ListItem>
        
        <Divider sx={{ my: 2 }} />
        
        {/* Language Section */}
        <ListItem>
          <ListItemIcon>
            <Language />
          </ListItemIcon>
          <ListItemText 
            primary="Language"
            secondary="Choose your preferred language"
          />
          <ListItemSecondaryAction>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="zh">中文</MenuItem>
              </Select>
            </FormControl>
          </ListItemSecondaryAction>
        </ListItem>
        
        <Divider sx={{ my: 2 }} />
        
        {/* Backup Section */}
        <ListItem>
          <ListItemIcon>
            <Backup />
          </ListItemIcon>
          <ListItemText 
            primary="Backup & Restore"
            secondary="Import and export your vault data"
          />
        </ListItem>
        
        <ListItem button onClick={() => setShowImportExport(true)}>
          <ListItemIcon>
            <CloudDownload />
          </ListItemIcon>
          <ListItemText 
            primary="Import / Export"
            secondary="Backup or restore your data"
          />
        </ListItem>
        
        <Divider sx={{ my: 2 }} />
        
        {/* About Section */}
        <ListItem>
          <ListItemIcon>
            <Info />
          </ListItemIcon>
          <ListItemText 
            primary="About LotS"
            secondary="Version 1.0.0 - Secure password manager on ICP"
          />
        </ListItem>
        
        <Divider sx={{ my: 2 }} />
        
        {/* Danger Zone */}
        <ListItem>
          <ListItemText 
            primary="Danger Zone"
            secondary="Irreversible actions"
          />
        </ListItem>
        
        <ListItem>
          <Button
            color="error"
            startIcon={<Delete />}
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete All Data
          </Button>
        </ListItem>
      </List>
      
      {/* Import/Export Dialog */}
      <ImportExportDialog
        open={showImportExport}
        onClose={() => setShowImportExport(false)}
        items={items}
        onImport={onImport}
      />
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
        <DialogTitle>Delete All Data</DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            This action cannot be undone!
          </Alert>
          <Typography>
            Are you sure you want to delete all your vault data? 
            This will permanently remove all items, settings, and encryption keys.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteConfirm(false)}>
            Cancel
          </Button>
          <Button 
            color="error" 
            variant="contained"
            onClick={handleDeleteAllData}
          >
            Delete Everything
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SettingsPage;