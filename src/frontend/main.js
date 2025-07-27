// Main application controller
class LotSApp {
    constructor() {
        this.currentUser = null;
        this.userCanister = null;
        this.items = [];
        this.templates = [];
        this.currentFilter = 'all';
        this.currentSort = 'updated';
        
        this.init();
    }

    async init() {
        try {
            // Initialize ICP authentication
            await ICPAuth.init();
            
            // Check if user is already authenticated
            if (await ICPAuth.isAuthenticated()) {
                await this.handleAuthenticated();
            } else {
                this.showAuthScreen();
            }
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('Failed to initialize application');
        }
    }

    showLoadingScreen() {
        document.getElementById('loading-screen').classList.remove('hidden');
        document.getElementById('auth-screen').classList.add('hidden');
        document.getElementById('dashboard').classList.add('hidden');
    }

    showAuthScreen() {
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('auth-screen').classList.remove('hidden');
        document.getElementById('dashboard').classList.add('hidden');
        
        // Setup auth event listeners
        Auth.init();
    }

    async showDashboard() {
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('auth-screen').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
        
        // Initialize dashboard components
        Dashboard.init();
        ItemManager.init();
        TemplateSelector.init();
        
        // Load user data
        await this.loadUserData();
    }

    async handleAuthenticated() {
        try {
            this.showLoadingScreen();
            
            // Get user principal
            this.currentUser = await ICPAuth.getPrincipal();
            
            // Initialize API with user identity
            await API.init();
            
            // Get or create user canister
            await this.initializeUserCanister();
            
            // Load templates
            await this.loadTemplates();
            
            this.showDashboard();
        } catch (error) {
            console.error('Authentication error:', error);
            this.showError('Authentication failed');
            this.showAuthScreen();
        }
    }

    async initializeUserCanister() {
        try {
            // Try to get existing canister
            const result = await API.getUserCanister();
            
            if (result.success) {
                this.userCanister = result.data;
            } else {
                // Create new canister
                const createResult = await API.createStorageCanister();
                if (createResult.success) {
                    this.userCanister = createResult.data;
                } else {
                    throw new Error('Failed to create storage canister');
                }
            }
        } catch (error) {
            console.error('Failed to initialize user canister:', error);
            throw error;
        }
    }

    async loadTemplates() {
        try {
            const result = await API.getAvailableTemplates();
            if (result.success) {
                this.templates = result.data;
                TemplateSelector.setTemplates(this.templates);
            }
        } catch (error) {
            console.error('Failed to load templates:', error);
        }
    }

    async loadUserData() {
        try {
            // Load user items
            await this.loadItems();
            
            // Update UI
            this.updateUserInfo();
            this.updateStorageInfo();
        } catch (error) {
            console.error('Failed to load user data:', error);
            this.showError('Failed to load your data');
        }
    }

    async loadItems() {
        try {
            const result = await API.listItems();
            if (result.success) {
                this.items = result.data;
                this.renderItems();
            }
        } catch (error) {
            console.error('Failed to load items:', error);
            throw error;
        }
    }

    updateUserInfo() {
        const userPrincipalElement = document.getElementById('user-principal');
        if (userPrincipalElement && this.currentUser) {
            const shortPrincipal = this.currentUser.toString().substring(0, 8) + '...';
            userPrincipalElement.textContent = shortPrincipal;
        }
    }

    updateStorageInfo() {
        if (!this.userCanister) return;
        
        const storageUsed = this.userCanister.storageUsed || 0;
        const storageLimit = 500 * 1024 * 1024; // 500MB in bytes
        const usagePercent = (storageUsed / storageLimit) * 100;
        
        const progressBar = document.getElementById('storage-progress');
        const storageText = document.getElementById('storage-text');
        
        if (progressBar) {
            progressBar.style.width = `${Math.min(usagePercent, 100)}%`;
        }
        
        if (storageText) {
            const usedMB = (storageUsed / (1024 * 1024)).toFixed(1);
            storageText.textContent = `${usedMB} MB / 500 MB`;
        }
    }

    renderItems() {
        const itemsGrid = document.getElementById('items-grid');
        const emptyState = document.getElementById('empty-state');
        
        if (!itemsGrid || !emptyState) return;
        
        // Filter items
        let filteredItems = this.items;
        if (this.currentFilter !== 'all') {
            filteredItems = this.items.filter(item => 
                item.itemType.hasOwnProperty(this.currentFilter)
            );
        }
        
        // Sort items
        filteredItems.sort((a, b) => {
            switch (this.currentSort) {
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'created':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'type':
                    return this.getItemTypeString(a.itemType).localeCompare(
                        this.getItemTypeString(b.itemType)
                    );
                case 'updated':
                default:
                    return new Date(b.updatedAt) - new Date(a.updatedAt);
            }
        });
        
        if (filteredItems.length === 0) {
            itemsGrid.classList.add('hidden');
            emptyState.classList.remove('hidden');
        } else {
            itemsGrid.classList.remove('hidden');
            emptyState.classList.add('hidden');
            
            itemsGrid.innerHTML = filteredItems.map(item => this.createItemCard(item)).join('');
            
            // Add click listeners to item cards
            itemsGrid.querySelectorAll('.item-card').forEach(card => {
                card.addEventListener('click', () => {
                    const itemId = card.dataset.itemId;
                    ItemManager.viewItem(itemId);
                });
            });
        }
    }

    createItemCard(item) {
        const itemType = this.getItemTypeString(item.itemType);
        const iconClass = this.getItemIconClass(itemType);
        const formattedDate = new Date(item.updatedAt).toLocaleDateString();
        
        const tagsHtml = item.tags.slice(0, 3).map(tag => 
            `<span class="tag">${tag}</span>`
        ).join('');
        
        return `
            <div class="item-card" data-item-id="${item.id}">
                <div class="item-header">
                    <div class="item-icon ${iconClass}">
                        <i class="${this.getItemIcon(itemType)}"></i>
                    </div>
                    <div>
                        <div class="item-title">${item.title}</div>
                        <div class="item-type">${itemType}</div>
                    </div>
                </div>
                <div class="item-meta">
                    <div class="item-tags">${tagsHtml}</div>
                    <div class="item-date">${formattedDate}</div>
                </div>
            </div>
        `;
    }

    getItemTypeString(itemType) {
        if (typeof itemType === 'object') {
            const key = Object.keys(itemType)[0];
            return key === 'Custom' ? itemType.Custom : key;
        }
        return itemType;
    }

    getItemIconClass(itemType) {
        const typeMap = {
            'Login': 'login',
            'CreditCard': 'credit-card',
            'BankAccount': 'bank-account',
            'Identity': 'identity',
            'CryptoWallet': 'crypto-wallet',
            'SecureNote': 'secure-note'
        };
        return typeMap[itemType] || 'secure-note';
    }

    getItemIcon(itemType) {
        const iconMap = {
            'Login': 'fas fa-key',
            'CreditCard': 'fas fa-credit-card',
            'BankAccount': 'fas fa-university',
            'Identity': 'fas fa-id-card',
            'CryptoWallet': 'fas fa-wallet',
            'SecureNote': 'fas fa-sticky-note'
        };
        return iconMap[itemType] || 'fas fa-sticky-note';
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.renderItems();
        
        // Update content title
        const contentTitle = document.getElementById('content-title');
        if (contentTitle) {
            const titles = {
                'all': 'All Items',
                'Login': 'Login Credentials',
                'CreditCard': 'Credit Cards',
                'BankAccount': 'Bank Accounts',
                'Identity': 'Identity Documents',
                'CryptoWallet': 'Crypto Wallets',
                'SecureNote': 'Secure Notes'
            };
            contentTitle.textContent = titles[filter] || 'All Items';
        }
    }

    setSort(sort) {
        this.currentSort = sort;
        this.renderItems();
    }

    async addItem(itemData) {
        try {
            const result = await API.storeItem(
                itemData.type,
                itemData.title,
                JSON.stringify(itemData.data),
                itemData.tags
            );
            
            if (result.success) {
                await this.loadItems();
                this.updateStorageInfo();
                return { success: true };
            } else {
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.error('Failed to add item:', error);
            return { success: false, error: 'Failed to save item' };
        }
    }

    async updateItem(itemId, itemData) {
        try {
            const result = await API.updateItem(
                itemId,
                itemData.title,
                JSON.stringify(itemData.data),
                itemData.tags
            );
            
            if (result.success) {
                await this.loadItems();
                return { success: true };
            } else {
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.error('Failed to update item:', error);
            return { success: false, error: 'Failed to update item' };
        }
    }

    async deleteItem(itemId) {
        try {
            const result = await API.deleteItem(itemId);
            
            if (result.success) {
                await this.loadItems();
                this.updateStorageInfo();
                return { success: true };
            } else {
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.error('Failed to delete item:', error);
            return { success: false, error: 'Failed to delete item' };
        }
    }

    async logout() {
        try {
            await ICPAuth.logout();
            this.currentUser = null;
            this.userCanister = null;
            this.items = [];
            this.showAuthScreen();
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    showError(message) {
        // Simple error display - could be enhanced with a proper notification system
        alert(message