import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  Typography
} from '@mui/material';
import {
  Search,
  Clear,
  FilterList,
  Sort
} from '@mui/icons-material';
import { ItemType } from '../types';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  availableTags: string[];
  sortBy: 'title' | 'date' | 'type';
  onSortChange: (sort: 'title' | 'date' | 'type') => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedTags,
  onTagsChange,
  availableTags,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange
}) => {
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);
  const [sortAnchor, setSortAnchor] = useState<null | HTMLElement>(null);

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    onTagsChange(newTags);
  };

  const handleSortSelect = (sort: 'title' | 'date' | 'type') => {
    if (sortBy === sort) {
      onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onSortChange(sort);
      onSortOrderChange('asc');
    }
    setSortAnchor(null);
  };

  return (
    <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
      <TextField
        fullWidth
        placeholder="Search your vault..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={(e) => setFilterAnchor(e.currentTarget)}
                color={selectedTags.length > 0 ? 'primary' : 'default'}
              >
                <FilterList />
              </IconButton>
              <IconButton
                size="small"
                onClick={(e) => setSortAnchor(e.currentTarget)}
              >
                <Sort />
              </IconButton>
              {searchQuery && (
                <IconButton
                  size="small"
                  onClick={() => onSearchChange('')}
                >
                  <Clear />
                </IconButton>
              )}
            </InputAdornment>
          )
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2
          }
        }}
      />
      
      {selectedTags.length > 0 && (
        <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {selectedTags.map(tag => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              onDelete={() => handleTagToggle(tag)}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
      )}
      
      <Menu
        anchorEl={filterAnchor}
        open={Boolean(filterAnchor)}
        onClose={() => setFilterAnchor(null)}
      >
        <MenuItem disabled>
          <Typography variant="subtitle2">Filter by tags</Typography>
        </MenuItem>
        {availableTags.map(tag => (
          <MenuItem
            key={tag}
            onClick={() => handleTagToggle(tag)}
            selected={selectedTags.includes(tag)}
          >
            {tag}
          </MenuItem>
        ))}
      </Menu>
      
      <Menu
        anchorEl={sortAnchor}
        open={Boolean(sortAnchor)}
        onClose={() => setSortAnchor(null)}
      >
        <MenuItem onClick={() => handleSortSelect('title')}>
          Sort by Title {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
        </MenuItem>
        <MenuItem onClick={() => handleSortSelect('date')}>
          Sort by Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
        </MenuItem>
        <MenuItem onClick={() => handleSortSelect('type')}>
          Sort by Type {sortBy === 'type' && (sortOrder === 'asc' ? '↑' : '↓')}
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default SearchBar;