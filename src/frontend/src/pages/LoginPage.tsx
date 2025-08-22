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
  ListItemText,
  Divider
} from '@mui/material';
import {
  AccountBalanceWallet,
  Security,
  Storage,
  Lock,
  CreditCard,
  Person,
  DriveEta,
  VpnKey,
  StickyNote2,
  Login,
  AccountBalance,
  Shield,
  Cloud,
  Speed,
  Visibility,
  Category,
  CheckCircle
} from '@mui/icons-material';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom 
          color="primary" 
          fontWeight="bold"
          sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' } }}
        >
          LotS
        </Typography>
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom 
          color="textSecondary"
          sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, mb: 3 }}
        >
          Your Personal Encrypted Data Storage on the Blockchain
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 4, 
            color: 'text.secondary', 
            maxWidth: 800, 
            mx: 'auto',
            fontSize: { xs: '1rem', md: '1.25rem' },
            lineHeight: 1.6
          }}
        >
          Securely store, manage, and access your sensitive data with military-grade encryption and blockchain technology. Each user gets their own isolated canister for maximum security.
        </Typography>
        
        <Button
          variant="contained"
          size="large"
          onClick={onLogin}
          startIcon={<AccountBalanceWallet />}
          sx={{ 
            px: 6, 
            py: 2, 
            fontSize: '1.2rem', 
            borderRadius: 3,
            boxShadow: 3,
            '&:hover': {
              boxShadow: 6
            }
          }}
        >
          Connect with OISY Wallet
        </Button>
        
        <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
          Secure authentication powered by Internet Computer Protocol
        </Typography>
      </Box>

      {/* Section 1: Comprehensive Data Templates */}
      <Paper elevation={3} sx={{ p: 4, mb: 6 }}>
        <Typography variant="h4" gutterBottom textAlign="center" color="primary" fontWeight="bold">
          Comprehensive Data Templates
        </Typography>
        <Typography variant="h6" textAlign="center" color="textSecondary" sx={{ mb: 4 }}>
          Organize your sensitive information with purpose-built templates
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 2, '&:hover': { boxShadow: 4 } }}>
              <CardContent>
                <AccountBalanceWallet color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6" gutterBottom fontWeight="bold">Crypto Wallet</Typography>
                <Typography variant="body2" color="text.secondary">
                  Store wallet addresses, private keys, and seed phrases
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 2, '&:hover': { boxShadow: 4 } }}>
              <CardContent>
                <Login color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6" gutterBottom fontWeight="bold">Login</Typography>
                <Typography variant="body2" color="text.secondary">
                  Website credentials, usernames, and passwords
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 2, '&:hover': { boxShadow: 4 } }}>
              <CardContent>
                <AccountBalance color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6" gutterBottom fontWeight="bold">Bank Account</Typography>
                <Typography variant="body2" color="text.secondary">
                  Account numbers, routing info, and IBAN details
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 2, '&:hover': { boxShadow: 4 } }}>
              <CardContent>
                <CreditCard color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6" gutterBottom fontWeight="bold">Credit Card</Typography>
                <Typography variant="body2" color="text.secondary">
                  Card numbers, expiry dates, and billing information
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 2, '&:hover': { boxShadow: 4 } }}>
              <CardContent>
                <Person color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6" gutterBottom fontWeight="bold">Identity</Typography>
                <Typography variant="body2" color="text.secondary">
                  Personal documents, SSN, and passport information
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 2, '&:hover': { boxShadow: 4 } }}>
              <CardContent>
                <DriveEta color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6" gutterBottom fontWeight="bold">Driver License</Typography>
                <Typography variant="body2" color="text.secondary">
                  License numbers, expiry dates, and restrictions
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 2, '&:hover': { boxShadow: 4 } }}>
              <CardContent>
                <VpnKey color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6" gutterBottom fontWeight="bold">OTP</Typography>
                <Typography variant="body2" color="text.secondary">
                  Two-factor authentication codes and secret keys
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 2, '&:hover': { boxShadow: 4 } }}>
              <CardContent>
                <StickyNote2 color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6" gutterBottom fontWeight="bold">Secure Note</Typography>
                <Typography variant="body2" color="text.secondary">
                  Encrypted notes and sensitive text information
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Section 2: Why Choose LotS? */}
      <Paper elevation={3} sx={{ p: 4, mb: 6, bgcolor: 'grey.50' }}>
        <Typography variant="h4" gutterBottom textAlign="center" color="primary" fontWeight="bold">
          Why Choose LotS?
        </Typography>
        
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <List>
              <ListItem>
                <ListItemIcon><Shield color="primary" sx={{ fontSize: 30 }} /></ListItemIcon>
                <ListItemText 
                  primary={<Typography variant="h6" fontWeight="bold">Military-Grade Security</Typography>}
                  secondary="End-to-end encryption with blockchain-secured access control"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><Storage color="primary" sx={{ fontSize: 30 }} /></ListItemIcon>
                <ListItemText 
                  primary={<Typography variant="h6" fontWeight="bold">Personal Canisters</Typography>}
                  secondary="Each user gets their own isolated storage canister"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><Category color="primary" sx={{ fontSize: 30 }} /></ListItemIcon>
                <ListItemText 
                  primary={<Typography variant="h6" fontWeight="bold">Smart Templates</Typography>}
                  secondary="Pre-built templates for crypto wallets, logins, cards, identity, and more"
                />
              </ListItem>
            </List>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <List>
              <ListItem>
                <ListItemIcon><VpnKey color="primary" sx={{ fontSize: 30 }} /></ListItemIcon>
                <ListItemText 
                  primary={<Typography variant="h6" fontWeight="bold">OTP Generation</Typography>}
                  secondary="Built-in one-time password generation for enhanced security"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><Speed color="primary" sx={{ fontSize: 30 }} /></ListItemIcon>
                <ListItemText 
                  primary={<Typography variant="h6" fontWeight="bold">Instant Access</Typography>}
                  secondary="Access your data anywhere with your OISY wallet"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><Visibility color="primary" sx={{ fontSize: 30 }} /></ListItemIcon>
                <ListItemText 
                  primary={<Typography variant="h6" fontWeight="bold">Complete Privacy</Typography>}
                  secondary="Your data is encrypted and only you have the keys"
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Paper>

      {/* Section 3: Key Benefits */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom color="primary" fontWeight="bold">
          Key Benefits
        </Typography>
        
        <Grid container spacing={2} sx={{ mt: 2, justifyContent: 'center' }}>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <CheckCircle color="success" sx={{ mr: 1 }} />
              <Typography variant="h6">Blockchain-secured storage</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <CheckCircle color="success" sx={{ mr: 1 }} />
              <Typography variant="h6">End-to-end encryption</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <CheckCircle color="success" sx={{ mr: 1 }} />
              <Typography variant="h6">Personal data isolation</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <CheckCircle color="success" sx={{ mr: 1 }} />
              <Typography variant="h6">Access from anywhere</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <CheckCircle color="success" sx={{ mr: 1 }} />
              <Typography variant="h6">Smart categorization</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <CheckCircle color="success" sx={{ mr: 1 }} />
              <Typography variant="h6">Built-in OTP generation</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default LoginPage;