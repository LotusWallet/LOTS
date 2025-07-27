import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { Add, Storage, Security, Info } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { icpService } from '../services/icpService';
import { User, CanisterInfo } from '../types';

interface DashboardPageProps {
  user: User;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ user }) => {
  const navigate = useNavigate();
  const [canisterInfo, setCanisterInfo] = useState<CanisterInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCanisterInfo();
  }, []);

  const loadCanisterInfo = async () => {
    try {
      const info = await icpService.getUserCanister();
      setCanisterInfo(info);
    } catch (err) {
      setError('Failed to load canister information');
    } finally {
      setLoading(false);
    }
  };

  const createCanister = async () => {
    setCreating(true);
    setError(null);
    
    try {
      const info = await icpService.createStorageCanister();
      if (info) {
        setCanisterInfo(info);
      } else {
        setError('Failed to create storage canister');
      }
    } catch (err) {
      setError('Error creating canister');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading your storage information...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome to your secure storage dashboard. Manage your encrypted data with complete privacy.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!canisterInfo ? (
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Storage sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Create Your Storage Canister
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              You don't have a storage canister yet. Create one to start storing your encrypted data securely.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={createCanister}
              disabled={creating}
              startIcon={creating ? <CircularProgress size={20} /> : <Add />}
            >
              {creating ? 'Creating...' : 'Create Storage Canister'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Storage color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Storage Usage</Typography>
                  </Box>
                  <Typography variant="h4" color="primary">
                    {(canisterInfo.storageUsed / 1024 / 1024).toFixed(2)} MB
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    of 500 MB available
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Security color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Stored Items</Typography>
                  </Box>
                  <Typography variant="h4" color="primary">
                    {canisterInfo.itemCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    encrypted items
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Info color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Canister ID</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                    {canisterInfo.canisterId}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Your unique storage identifier
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<Add />}
                onClick={() => navigate('/add-item')}
              >
                Add New Item
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                size="large"
                onClick={() => navigate('/items')}
              >
                View All Items
              </Button>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
};

export default DashboardPage;