import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Security,
  Storage,
  Lock,
  Speed,
  Visibility,
  AccountBalanceWallet,
  CheckCircle,
  CloudOff,
  Shield
} from '@mui/icons-material';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom color="primary" fontWeight="bold">
          LotS
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom color="textSecondary">
          Decentralized Password Manager
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
          Secure, private, and decentralized storage for your passwords, credentials, and sensitive information powered by Internet Computer blockchain
        </Typography>
        
        <Button
          variant="contained"
          size="large"
          onClick={onLogin}
          startIcon={<AccountBalanceWallet />}
          sx={{ px: 6, py: 2, fontSize: '1.2rem', borderRadius: 3 }}
        >
          Connect with OISY Wallet
        </Button>
        
        <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
          Secure authentication powered by Internet Computer Protocol
        </Typography>
      </Box>

      {/* Key Features */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
            <CardContent>
              <Security color="primary" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h5" gutterBottom>End-to-End Encryption</Typography>
              <Typography variant="body2" color="text.secondary">
                Your data is encrypted with AES-256 before leaving your device. Only you have the keys.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
            <CardContent>
              <CloudOff color="primary" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h5" gutterBottom>Truly Decentralized</Typography>
              <Typography variant="body2" color="text.secondary">
                No central servers. Your data lives on the Internet Computer blockchain, owned by you.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
            <CardContent>
              <Shield color="primary" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h5" gutterBottom>Zero Knowledge</Typography>
              <Typography variant="body2" color="text.secondary">
                We never see your data. Everything is encrypted locally with your master password.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Value Propositions */}
      <Paper elevation={2} sx={{ p: 4, mb: 6 }}>
        <Typography variant="h4" gutterBottom textAlign="center" color="primary">
          Why Choose LotS?
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <List>
              <ListItem>
                <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                <ListItemText 
                  primary="Personal Data Sovereignty" 
                  secondary="Your data belongs to you, stored in your personal canister"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                <ListItemText 
                  primary="No Subscription Fees" 
                  secondary="Pay only for the storage you use on the blockchain"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                <ListItemText 
                  primary="Cross-Platform Access" 
                  secondary="Access your data from any device with your OISY wallet"
                />
              </ListItem>
            </List>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <List>
              <ListItem>
                <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                <ListItemText 
                  primary="Quantum-Resistant Security" 
                  secondary="Built on Internet Computer's advanced cryptography"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                <ListItemText 
                  primary="Open Source & Auditable" 
                  secondary="Transparent code that you can verify and trust"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                <ListItemText 
                  primary="TOTP & 2FA Support" 
                  secondary="Generate time-based codes for enhanced security"
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Paper>

      {/* Security Features */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom color="primary">
          Enterprise-Grade Security Features
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mt: 2 }}>
          <Chip icon={<Lock />} label="AES-256 Encryption" variant="outlined" />
          <Chip icon={<Security />} label="PBKDF2 Key Derivation" variant="outlined" />
          <Chip icon={<Visibility />} label="Zero-Knowledge Architecture" variant="outlined" />
          <Chip icon={<Speed />} label="Secure Password Generation" variant="outlined" />
          <Chip icon={<Storage />} label="Blockchain Immutability" variant="outlined" />
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;