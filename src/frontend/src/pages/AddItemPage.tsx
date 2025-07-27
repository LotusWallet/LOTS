import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { User, ItemType, StorageTemplate } from '../types';
import { icpService } from '../services/icpService';

interface AddItemPageProps {
  user: User;
}

const AddItemPage: React.FC<AddItemPageProps> = ({ user }) => {
  const navigate = useNavigate();
  const [itemType, setItemType] = useState<ItemType>('Login');
  const [title, setTitle] = useState('');
  const [fields, setFields] = useState<Record<string, string>>({});
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [templates, setTemplates] = useState<StorageTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    const template = templates.find(t => t.templateType === itemType);
    if (template) {
      const newFields: Record<string, string> = {};
      template.fields.forEach(field => {
        newFields[field.name] = '';
      });
      setFields(newFields);
    }
  }, [itemType, templates]);

  const loadTemplates = async () => {
    try {
      const availableTemplates = await icpService.getAvailableTemplates();
      setTemplates(availableTemplates);
    } catch (err) {
      setError('Failed to load templates');
    }
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    setFields(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags(prev => [...prev, newTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const canisterInfo = await icpService.getUserCanister();
      if (canisterInfo) {
        const data = JSON.stringify(fields);
        const result = await icpService.storeItem(
          canisterInfo.canisterId,
          itemType,
          title,
          data,
          tags
        );
        
        if (result) {
          navigate('/items');
        } else {
          setError('Failed to save item');
        }
      }
    } catch (err) {
      setError('Error saving item');
    } finally {
      setLoading(false);
    }
  };

  const currentTemplate = templates.find(t => t.templateType === itemType);

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Add New Item
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Item Type</InputLabel>
            <Select
              value={itemType}
              onChange={(e) => setItemType(e.target.value as ItemType)}
              label="Item Type"
            >
              {templates.map(template => (
                <MenuItem key={template.templateType} value={template.templateType}>
                  {template.templateType}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
          />
          
          {currentTemplate && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Fields
              </Typography>
              {currentTemplate.fields.map(field => (
                <TextField
                  key={field.name}
                  label={field.name}
                  value={fields[field.name] || ''}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                  type={field.fieldType === 'Password' ? 'password' : 'text'}
                  required={field.required}
                  placeholder={field.placeholder}
                  fullWidth
                  sx={{ mb: 2 }}
                />
              ))}
            </Box>
          )}
          
          <Box>
            <Typography variant="h6" gutterBottom>
              Tags
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              {tags.map(tag => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                  size="small"
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label="Add Tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                size="small"
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              />
              <Button onClick={handleAddTag} variant="outlined" size="small">
                Add
              </Button>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/items')}
              startIcon={<Cancel />}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={loading}
              startIcon={<Save />}
            >
              {loading ? 'Saving...' : 'Save Item'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddItemPage;