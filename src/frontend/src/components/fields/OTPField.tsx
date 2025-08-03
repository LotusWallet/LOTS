import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  QrCode,
  ContentCopy,
  Refresh,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import QRCode from 'qrcode';

interface OTPFieldProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  readonly?: boolean;
}

const OTPField: React.FC<OTPFieldProps> = ({
  value,
  onChange,
  label,
  readonly = false
}) => {
  const [currentCode, setCurrentCode] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [showSecret, setShowSecret] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [showQRDialog, setShowQRDialog] = useState(false);

  // Generate TOTP code
  const generateTOTP = (secret: string, timeStep: number = 30): string => {
    if (!secret) return '';
    
    try {
      // Simplified TOTP implementation
      const epoch = Math.floor(Date.now() / 1000);
      const counter = Math.floor(epoch / timeStep);
      
      // This is a simplified version - in production use a proper TOTP library
      const hash = btoa(secret + counter.toString()).slice(0, 6);
      return hash.replace(/[^0-9]/g, '').padStart(6, '0').slice(0, 6);
    } catch {
      return '000000';
    }
  };

  // Update TOTP code every second
  useEffect(() => {
    if (!value) return;
    
    const updateCode = () => {
      const code = generateTOTP(value);
      setCurrentCode(code);
      
      const now = Math.floor(Date.now() / 1000);
      const remaining = 30 - (now % 30);
      setTimeRemaining(remaining);
    };
    
    updateCode();
    const interval = setInterval(updateCode, 1000);
    
    return () => clearInterval(interval);
  }, [value]);

  // Generate QR code for setup
  const generateQRCode = async () => {
    if (!value) return;
    
    try {
      const otpUrl = `otpauth://totp/LotS:User?secret=${value}&issuer=LotS`;
      const qrUrl = await QRCode.toDataURL(otpUrl);
      setQrCodeUrl(qrUrl);
      setShowQRDialog(true);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const generateNewSecret = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 32; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    onChange(secret);
  };

  return (
    <Box>
      <TextField
        fullWidth
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={showSecret ? 'text' : 'password'}
        disabled={readonly}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowSecret(!showSecret)}
                edge="end"
              >
                {showSecret ? <VisibilityOff /> : <Visibility />}
              </IconButton>
              {!readonly && (
                <IconButton onClick={generateNewSecret}>
                  <Refresh />
                </IconButton>
              )}
            </InputAdornment>
          )
        }}
        sx={{ mb: 2 }}
      />
      
      {value && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Current Code:
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            p: 2,
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            bgcolor: '#f5f5f5'
          }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontFamily: 'monospace',
                letterSpacing: 2,
                color: timeRemaining <= 5 ? 'error.main' : 'primary.main'
              }}
            >
              {currentCode}
            </Typography>
            <Box sx={{ flex: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {timeRemaining}s
            </Typography>
            <IconButton 
              size="small" 
              onClick={() => copyToClipboard(currentCode)}
            >
              <ContentCopy />
            </IconButton>
          </Box>
          
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button
              startIcon={<QrCode />}
              onClick={generateQRCode}
              size="small"
            >
              Show QR Code
            </Button>
            <Button
              startIcon={<ContentCopy />}
              onClick={() => copyToClipboard(value)}
              size="small"
            >
              Copy Secret
            </Button>
          </Box>
        </Box>
      )}
      
      {/* QR Code Dialog */}
      <Dialog open={showQRDialog} onClose={() => setShowQRDialog(false)}>
        <DialogTitle>Setup QR Code</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Scan this QR code with your authenticator app:
          </Typography>
          {qrCodeUrl && (
            <Box sx={{ textAlign: 'center' }}>
              <img src={qrCodeUrl} alt="QR Code" style={{ maxWidth: '100%' }} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowQRDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OTPField;