import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  Alert,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import {
  CloudDownload,
  CloudUpload,
  Description,
  TableChart
} from '@mui/icons-material';
import { StorageItem } from '../types';
import { importExportService, ImportResult } from '../services/importExportService';

interface ImportExportDialogProps {
  open: boolean;
  onClose: () => void;
  items: StorageItem[];
  onImport: (items: StorageItem[]) => void;
}

const ImportExportDialog: React.FC<ImportExportDialogProps> = ({
  open,
  onClose,
  items,
  onImport
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [encryptExport, setEncryptExport] = useState(true);
  const [loading, setLoading] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState('');

  const handleExportJSON = async () => {
    setLoading(true);
    setError('');
    
    try {
      const jsonData = await importExportService.exportToJSON(items, encryptExport);
      const filename = `lots-export-${new Date().toISOString().split('T')[0]}.json`;
      importExportService.downloadFile(jsonData, filename, 'application/json');
    } catch (error) {
      setError(`Export failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    setLoading(true);
    setError('');
    
    try {
      const csvData = await importExportService.exportToCSV(items);
      const filename = `lots-export-${new Date().toISOString().split('T')[0]}.csv`;
      importExportService.downloadFile(csvData, filename, 'text/csv');
    } catch (error) {
      setError(`Export failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');
    setImportResult(null);

    try {
      const content = await file.text();
      let result: ImportResult;

      if (file.name.endsWith('.json')) {
        result = await importExportService.importFromJSON(content);
      } else if (file.name.endsWith('.csv')) {
        result = await importExportService.importFromCSV(content);
      } else {
        throw new Error('Unsupported file format');
      }

      setImportResult(result);
    } catch (error) {
      setError(`Import failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Import / Export Data
      </DialogTitle>
      
      <DialogContent>
        <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value)}>
          <Tab icon={<CloudDownload />} label="Export" />
          <Tab icon={<CloudUpload />} label="Import" />
        </Tabs>
        
        {loading && <LinearProgress sx={{ mt: 2 }} />}
        
        {/* Export Tab */}
        {activeTab === 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Export Your Data
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Export all your vault items to a file for backup or migration.
            </Typography>
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={encryptExport}
                  onChange={(e) => setEncryptExport(e.target.checked)}
                />
              }
              label="Encrypt exported data (recommended)"
              sx={{ mb: 3 }}
            />
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<Description />}
                onClick={handleExportJSON}
                disabled={loading}
              >
                Export as JSON
              </Button>
              <Button
                variant="outlined"
                startIcon={<TableChart />}
                onClick={handleExportCSV}
                disabled={loading}
              >
                Export as CSV
              </Button>
            </Box>
            
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>JSON format:</strong> Complete backup with all data and metadata.<br />
                <strong>CSV format:</strong> Simplified format for spreadsheet applications (not encrypted).
              </Typography>
            </Alert>
          </Box>
        )}
        
        {/* Import Tab */}
        {activeTab === 1 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Import Data
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Import items from a previously exported file.
            </Typography>
            
            <input
              type="file"
              accept=".json,.csv"
              onChange={handleFileImport}
              style={{ display: 'none' }}
              id="import-file-input"
            />
            <label htmlFor="import-file-input">
              <Button
                variant="contained"
                component="span"
                startIcon={<CloudUpload />}
                disabled={loading}
              >
                Choose File
              </Button>
            </label>
            
            {importResult && (
              <Box sx={{ mt: 3 }}>
                <Alert 
                  severity={importResult.success ? 'success' : 'error'}
                  sx={{ mb: 2 }}
                >
                  Import {importResult.success ? 'completed' : 'failed'}:
                  {importResult.imported} items imported, {importResult.failed} failed
                </Alert>
                
                {importResult.errors.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Errors:
                    </Typography>
                    <List dense>
                      {importResult.errors.map((error, index) => (
                        <ListItem key={index}>
                          <ListItemText 
                            primary={error}
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </Box>
            )}
            
            <Alert severity="warning" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Warning:</strong> Importing will add new items to your vault. 
                Duplicate items may be created if the same data is imported multiple times.
              </Typography>
            </Alert>
          </Box>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImportExportDialog;