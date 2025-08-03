import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Button,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Search,
  Clear,
  FilterList,
  Sort,
  ExpandMore,
  TuneOutlined
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
  selectedTypes?: ItemType[];
  onTypesChange?: (types: ItemType[]) => void;
  dateRange?: { start: Date | null; end: Date | null };
  onDateRangeChange?: (range: { start: Date | null; end: Date | null }) => void;
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
  onSortOrderChange,
  selectedTypes = [],
  onTypesChange,
  dateRange,
  onDateRangeChange
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);
  const [sortAnchor, setSortAnchor] = useState<null | HTMLElement>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchMode, setSearchMode] = useState<'simple' | 'advanced'>('simple');

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    onTagsChange(newTags);
  };

  const handleTypeToggle = (type: ItemType) => {
    if (!onTypesChange) return;
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    onTypesChange(newTypes);
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

  const clearAllFilters = () => {
    onSearchChange('');
    onTagsChange([]);
    if (onTypesChange) onTypesChange([]);
    if (onDateRangeChange) onDateRangeChange({ start: null, end: null });
  };

  const hasActiveFilters = searchQuery || selectedTags.length > 0 || selectedTypes.length > 0;

  return (
    <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
      {/* Main Search Bar */}
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
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
                {!isMobile && (
                  <>
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
                  </>
                )}
                <IconButton
                  size="small"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  color={showAdvanced ? 'primary' : 'default'}
                >
                  <TuneOutlined />
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
        
        {isMobile && (
          <>
            <IconButton
              onClick={(e) => setFilterAnchor(e.currentTarget)}
              color={selectedTags.length > 0 ? 'primary' : 'default'}
            >
              <FilterList />
            </IconButton>
            <IconButton
              onClick={(e) => setSortAnchor(e.currentTarget)}
            >
              <Sort />
            </IconButton>
          </>
        )}
      </Box>
      
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap', alignItems: 'center' }}>
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
          {selectedTypes.map(type => (
            <Chip
              key={type}
              label={type}
              size="small"
              onDelete={() => handleTypeToggle(type)}
              color="secondary"
              variant="outlined"
            />
          ))}
          {hasActiveFilters && (
            <Button
              size="small"
              onClick={clearAllFilters}
              sx={{ ml: 1 }}
            >
              Clear All
            </Button>
          )}
        </Box>
      )}
      
      {/* Advanced Search */}
      {showAdvanced && (
        <Accordion expanded sx={{ mt: 2, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
          <AccordionSummary sx={{ minHeight: 'auto', '& .MuiAccordionSummary-content': { margin: '8px 0' } }}>
            <Typography variant="subtitle2">Advanced Search Options</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Search Mode */}
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Search Mode</InputLabel>
                <Select
                  value={searchMode}
                  label="Search Mode"
                  onChange={(e) => setSearchMode(e.target.value as 'simple' | 'advanced')}
                >
                  <MenuItem value="simple">Simple</MenuItem>
                  <MenuItem value="advanced">Advanced (Regex)</MenuItem>
                </Select>
              </FormControl>
              
              {/* Type Filters */}
              {onTypesChange && (
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>Filter by Type:</Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {Object.values(ItemType).map(type => (
                      <Chip
                        key={type}
                        label={type}
                        size="small"
                        onClick={() => handleTypeToggle(type)}
                        color={selectedTypes.includes(type) ? 'primary' : 'default'}
                        variant={selectedTypes.includes(type) ? 'filled' : 'outlined'}
                      />
                    ))}
                  </Box>
                </Box>
              )}
              
              {/* Date Range */}
              {onDateRangeChange && (
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>Date Range:</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <TextField
                      type="date"
                      label="From"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      value={dateRange?.start ? dateRange.start.toISOString().split('T')[0] : ''}
                      onChange={(e) => onDateRangeChange({
                        ...dateRange,
                        start: e.target.value ? new Date(e.target.value) : null
                      })}
                    />
                    <TextField
                      type="date"
                      label="To"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      value={dateRange?.end ? dateRange.end.toISOString().split('T')[0] : ''}
                      onChange={(e) => onDateRangeChange({
                        ...dateRange,
                        end: e.target.value ? new Date(e.target.value) : null
                      })}
                    />
                  </Box>
                </Box>
              )}
            </Box>
          </AccordionDetails>
        </Accordion>
      )}
      
      {/* Filter Menu */}
      <Menu
        anchorEl={filterAnchor}
        open={Boolean(filterAnchor)}
        onClose={() => setFilterAnchor(null)}
      >
        <MenuItem disabled>
          <Typography variant="subtitle2">Filter by tags</Typography>
        </MenuItem>
        <Divider />
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
      
      {/* Sort Menu */}
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