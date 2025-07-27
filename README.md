# LotS (Lot Storage Protocol)

A decentralized storage protocol built on the Internet Computer (ICP) blockchain, providing secure, private, and serverless data storage solutions.

## 🌟 Features

- 🔐 **End-to-End Encryption**: AES-256-GCM encryption ensures your data remains private
- 🏗️ **Modular Architecture**: Factory pattern for creating user-specific storage canisters
- 📋 **Predefined Templates**: Support for login credentials, credit cards, identity documents, crypto wallets, and more
- 🎯 **Custom Templates**: Flexible data structure definitions for any use case
- 🔑 **ICP Identity**: Secure authentication using Internet Identity
- 📱 **Web Interface**: User-friendly dashboard for managing encrypted data
- 🌐 **Serverless**: Fully decentralized with no central servers

## 🏛️ Architecture

### Factory Canister
- Creates user-specific Storage Canisters
- Manages storage templates
- Provides system statistics

### Storage Canister
- Personal encrypted data storage
- CRUD operations for stored items
- Built-in search and categorization

### Web Frontend
- React-based user interface
- Internet Identity integration
- Real-time data management

## 🚀 Quick Start

### Prerequisites

- [DFX SDK](https://internetcomputer.org/docs/current/developer-docs/setup/install/) installed
- Node.js 16+ for frontend development

### Deployment

1. **Clone and setup**
```bash
git clone <repository-url>
cd LOTS
```

2. **Deploy to IC Mainnet**
```bash
# Deploy backend canisters
dfx deploy --network ic lots_factory
dfx deploy --network ic lots_storage_template

# Build and deploy frontend
cd src/frontend
npm install
npm run build
cd ../..
dfx deploy --network ic lots_frontend
```

3. **Local Development**
```bash
# Start local replica
dfx start --background

# Deploy locally
dfx deploy

# Start frontend development server
cd src/frontend
npm run dev
```

### Usage Examples

1. **Create Storage Canister**
```bash
dfx canister --network ic call lots_factory createStorageCanister
```

2. **Get Available Templates**
```bash
dfx canister --network ic call lots_factory getAvailableTemplates
```

3. **Store Encrypted Data**
```bash
dfx canister --network ic call <storage_canister_id> storeItem '(
  "Login",
  "Gmail Account",
  "{\"username\":\"user@gmail.com\",\"password\":\"secret123\"}",
  vec { "email"; "work" }
)'
```

## 🔌 API Reference

### Factory Canister

| Method | Description | Parameters | Returns |
|--------|-------------|------------|----------|
| `createStorageCanister()` | Create user storage canister | None | `Result<CanisterInfo, Error>` |
| `getUserCanister()` | Get user's canister info | None | `Result<CanisterInfo, Error>` |
| `getAvailableTemplates()` | List all templates | None | `[StorageTemplate]` |
| `getTemplateByType(itemType)` | Get specific template | `ItemType` | `Result<StorageTemplate, Error>` |

### Storage Canister

| Method | Description | Parameters | Returns |
|--------|-------------|------------|----------|
| `storeItem(type, title, data, tags)` | Store new item | `ItemType, Text, Text, [Text]` | `Result<Text, Error>` |
| `getItem(itemId)` | Get and decrypt item | `Text` | `Result<(StorageItem, Text), Error>` |
| `updateItem(id, title?, data?, tags?)` | Update existing item | `Text, ?Text, ?Text, ?[Text]` | `Result<(), Error>` |
| `deleteItem(itemId)` | Delete item | `Text` | `Result<(), Error>` |
| `listItems()` | List all items | None | `Result<[StorageItem], Error>` |
| `searchItems(keyword)` | Search items | `Text` | `Result<[StorageItem], Error>` |

## 🛡️ Security Features

1. **Encryption**: AES-256-GCM authenticated encryption
2. **Key Management**: Auto-generated per-user encryption keys
3. **Access Control**: ICP Principal-based authentication
4. **Data Isolation**: Individual canisters per user
5. **Zero Knowledge**: Only users can decrypt their data

## 📋 Predefined Templates

- **Login Credentials**: Website usernames and passwords
- **Credit Cards**: Banking and payment card information
- **Bank Accounts**: Account details and routing information
- **Identity Documents**: ID cards, passports, licenses
- **Crypto Wallets**: Seed phrases, private keys, addresses
- **Secure Notes**: General encrypted text storage

## 🌐 Web Interface

The web interface provides:

- **Dashboard**: Overview of storage usage and statistics
- **Item Management**: Add, view, edit, and delete encrypted items
- **Template Selection**: Choose from predefined or create custom templates
- **Search & Filter**: Find items quickly by title, type, or tags
- **Security Settings**: Manage encryption and access preferences

## 🔧 Development

### Project Structure

src/
├── backend/
│   ├── factory/          # Factory canister
│   ├── storage/          # Storage canister template
│   └── shared/           # Shared types and utilities
└── frontend/
├── src/
│   ├── components/   # React components
│   ├── pages/        # Application pages
│   ├── services/     # ICP integration
│   └── types/        # TypeScript definitions
└── public/           # Static assets


### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📈 Roadmap

- [x] Core storage protocol
- [x] Encryption implementation
- [x] Predefined templates
- [x] Web interface
- [x] Internet Identity integration
- [ ] Mobile app integration
- [ ] Advanced search features
- [ ] Data export/import
- [ ] Multi-language support
- [ ] Advanced analytics

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Support

For questions, issues, or contributions:

- Create an issue on GitHub
- Join our community discussions
- Check the documentation

---

**LotS** - Secure, Private, Decentralized Storage for Everyone


