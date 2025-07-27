import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Alert
} from '@mui/material';
import { User, StorageItem, ItemType } from '../types';
import { icpService } from '../services/icpService';
import CategorySidebar from '../components/CategorySidebar';
import SearchBar from '../components/SearchBar';
import ItemList from '../components/ItemList';
import ItemDetail from '../components/ItemDetail';
import LoadingScreen from '../components/LoadingScreen';

interface ItemsPageProps {
  user: User;
}

const ItemsPage: React.FC<ItemsPageProps> = ({ user }) => {
  const [items, setItems] = useState<StorageItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<StorageItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<StorageItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ItemType | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'title' | 'date' | 'type'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const itemsPerPage = 20;

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    filterAndSortItems();
  }, [items, selectedCategory, searchQuery, selectedTags, sortBy, sortOrder]);

  const loadItems = async () => {
    try {
      const canisterInfo = await icpService.getUserCanister();
      if (canisterInfo) {
        const userItems = await icpService.getItems(canisterInfo.canisterId);
        setItems(userItems);
      }
    } catch (err) {
      setError('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortItems = () => {
    let filtered = [...items];

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.itemType === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        Object.values(item.fields).some(value =>
          value.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(item =>
        selectedTags.some(tag => item.tags.includes(tag))
      );
    }

    // Sort items
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'date':
          comparison = a.updatedAt - b.updatedAt;
          break;
        case 'type':
          comparison = a.itemType.localeCompare(b.itemType);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredItems(filtered);
    setCurrentPage(1);
  };

  const getCategoryCounts = () => {
    const counts: Record<ItemType | 'All', number> = {
      All: items.length,
      Login: 0,
      CreditCard: 0,
      BankAccount: 0,
      Identity: 0,
      CryptoWallet: 0,
      SecureNote: 0,
      Custom: 0
    };

    items.forEach(item => {
      counts[item.itemType]++;
    });

    return counts;
  };

  const getAvailableTags = () => {
    const tags = new Set<string>();
    items.forEach(item => {
      item.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  };

  const handleItemSave = async (item: StorageItem) => {
    // Implementation for saving item
    console.log('Save item:', item);
  };

  const handleItemDelete = async (item: StorageItem) => {
    // Implementation for deleting item
    console.log('Delete item:', item);
  };

  const handleItemCopy = (item: StorageItem) => {
    // Implementation for copying item data
    console.log('Copy item:', item);
  };

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CategorySidebar
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        categoryCounts={getCategoryCounts()}
        onAddItem={() => window.location.href = '/add-item'}
      />
      
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
          availableTags={getAvailableTags()}
          sortBy={sortBy}
          onSortChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
        />
        
        {error && (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ flex: 1, display: 'flex' }}>
          <Box sx={{ width: 400, borderRight: '1px solid #e0e0e0' }}>
            <ItemList
              items={paginatedItems}
              selectedItem={selectedItem}
              onItemSelect={setSelectedItem}
              onItemEdit={handleItemSave}
              onItemDelete={handleItemDelete}
              onItemCopy={handleItemCopy}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <ItemDetail
              item={selectedItem}
              onSave={handleItemSave}
              onDelete={handleItemDelete}
              onCopy={(text) => navigator.clipboard.writeText(text)}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ItemsPage;