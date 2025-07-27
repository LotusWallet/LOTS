import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Card,
  CardContent
} from '@mui/material';
import { Security, Storage, Lock } from '@mui/icons-material';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          LotS
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom color="textSecondary">
          Decentralized Storage Protocol
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
          Secure, private, and decentralized storage for your sensitive information
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 4 }}>
          <Card sx={{ minWidth: 200 }}>
            <CardContent>
              <Security color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6">Secure</Typography>
              <Typography variant="body2" color="text.secondary">
                End-to-end encryption with AES-256-GCM
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ minWidth: 200 }}>
            <CardContent>
              <Storage color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6">Decentralized</Typography>
              <Typography variant="body2" color="text.secondary">
                Your data stored on ICP blockchain
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ minWidth: 200 }}>
            <CardContent>
              <Lock color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6">Private</Typography>
              <Typography variant="body2" color="text.secondary">
                Only you have access to your data
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Button
          variant="contained"
          size="large"
          onClick={onLogin}
          sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
        >
          Login with Internet Identity
        </Button>
        
        <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
          Secure authentication powered by ICP
        </Typography>
      </Paper>
    </Container>
  );
};

export default LoginPage;