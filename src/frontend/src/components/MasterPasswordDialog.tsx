import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  LinearProgress,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment } from '@mui/material';
import { cryptoService } from '../services/cryptoService';

interface MasterPasswordDialogProps {
  open: boolean;
  onClose: () => void;
  onUnlock: () => void;
  isFirstTime?: boolean;
}

const MasterPasswordDialog: React.FC<MasterPasswordDialogProps> = ({
  open,
  onClose,
  onUnlock,
  isFirstTime = false
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberPassword, setRememberPassword] = useState(false);

  const handleSubmit = async () => {
    if (!password) {
      setError('Please enter a password');
      return;
    }

    if (isFirstTime && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (isFirstTime && password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isFirstTime) {
        // Setup new master key
        const masterKeyData = await cryptoService.setupMasterKey(password);
        
        // Store salt and iterations in localStorage for future use
        localStorage.setItem('lots_master_salt', masterKeyData.salt);
        localStorage.setItem('lots_master_iterations', masterKeyData.iterations.toString());
        
        // Optionally store password hash for verification
        const passwordHash = cryptoService.hashPassword(password);
        localStorage.setItem('lots_password_hash', passwordHash.hash);
        localStorage.setItem('lots_password_salt', passwordHash.salt);
        
        onUnlock();
      } else {
        // Unlock existing vault
        const storedSalt = localStorage.getItem('lots_master_salt');
        const storedIterations = localStorage.getItem('lots_master_iterations');
        const storedHash = localStorage.getItem('lots_password_hash');
        const storedPasswordSalt = localStorage.getItem('lots_password_salt');
        
        if (!storedSalt || !storedIterations) {
          setError('Vault configuration not found');
          return;
        }

        // Verify password if hash is available
        if (storedHash && storedPasswordSalt) {
          const isValid = cryptoService.verifyPassword(password, storedHash, storedPasswordSalt);
          if (!isValid) {
            setError('Invalid password');
            return;
          }
        }

        const success = await cryptoService.unlockVault(
          password,
          storedSalt,
          parseInt(storedIterations)
        );
        
        if (success) {
          onUnlock();
        } else {
          setError('Failed to unlock vault');
        }
      }
    } catch (error) {
      setError(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={isFirstTime}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Lock color="primary" />
          <Typography variant="h6">
            {isFirstTime ? 'Set Master Password' : 'Unlock Vault'}
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {loading && <LinearProgress sx={{ mb: 2 }} />}
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {isFirstTime 
            ? 'Create a strong master password to protect your vault. This password will be used to encrypt all your data.'
            : 'Enter your master password to unlock your vault and access your encrypted data.'
          }
        </Typography>

        <TextField
          fullWidth
          label="Master Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        {isFirstTime && (
          <TextField
            fullWidth
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            margin="normal"
          />
        )}

        {!isFirstTime && (
          <FormControlLabel
            control={
              <Checkbox
                checked={rememberPassword}
                onChange={(e) => setRememberPassword(e.target.checked)}
              />
            }
            label="Remember for this session"
            sx={{ mt: 1 }}
          />
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {isFirstTime && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Important:</strong> Make sure to remember this password. 
              If you forget it, you will not be able to access your encrypted data.
            </Typography>
          </Alert>
        )}
      </DialogContent>
      
      <DialogActions>
        {!isFirstTime && (
          <Button onClick={onClose}>
            Cancel
          </Button>
        )}
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !password || (isFirstTime && !confirmPassword)}
        >
          {isFirstTime ? 'Create Vault' : 'Unlock'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MasterPasswordDialog;