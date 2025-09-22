LotS Secure Data Management Platform
Overview
LotS is a secure data management platform that allows users to store and manage encrypted personal data entries using Internet Identity wallet authentication and personal container isolation.

Authentication System
Internet Identity wallet authentication for user login
Principal and account ID retrieval
Session management and logout functionality
Display "Deploy Personal Container" button on first login, manually triggering container deployment
Personal Container Deployment
True per-user container deployment: when user clicks "Deploy Personal Container", backend must reliably create new container
Backend stores user's container ID, ensuring all future data operations for that user are routed to their personal container
Container deployment state persistence: after successful deployment, UI always reflects true container state (success, error, or pending) by querying backend
Display clear loading state during deployment, with appropriate success or error messages upon completion
After successful deployment, UI must update to reflect container existence and no longer prompt user to redeploy
Ensure each user gets unique personal container
Frontend enables data entry functionality only after successful container deployment
Data Storage
Each user gets independent personal container for encrypted data storage
Store encrypted data entries within personal containers, supporting predefined templates:
Crypto Wallet
Login Credentials
Bank Account
Credit Card
Identity Document
Driver's License
OTP
Secure Note
Support custom fields with field types: text, password, OTP, URL, email, date
Templates automatically assign field types
Save entry metadata (timestamps, category, etc.)
Data entry structure includes: title, category, created time, updated time, fields array (field name, type, value)
Backend Operations
User authentication and account identifier generation
Reliably deploy personal containers for users on demand, ensuring each deployment request successfully creates unique container
Store user container ID mappings
Route all data operations to user's personal container
Complete data entry CRUD operations:
Create data entry: receive title, category, fields array, automatically set created and updated timestamps
Retrieve data entries: get list of all data entries for user
Update data entry: modify any fields of existing entry, update timestamp
Delete data entry: remove specified entry from user's personal container
Manage custom fields and template field initialization for entries
Generate TOTP codes for OTP fields
Support entry sorting and filtering
Accurately query container deployment status, ensuring status reflects true deployment situation
Timestamp data must be returned in format that frontend can correctly parse, ensuring created time and updated time can be properly converted to JavaScript Date objects
Support storage and retrieval of new field types (URL, email, date)
Frontend Functionality
Pre-login landing page showcasing product highlights with enhanced content:
"Comprehensive Data Templates" section: introduce all 8 templates (Crypto Wallet, Login Credentials, Bank Account, Credit Card, Identity Document, Driver's License, OTP, Secure Note) with icons and detailed descriptions
"Why Choose LotS?" section: list 6 compelling reasons to choose LotS
"Core Advantages" section: highlight 6 main advantages of the platform
Landing page content is visually rich, well-structured, and engaging
Internet Identity wallet login integration
User menu displaying principal and account ID
"Deploy Personal Container" button that reliably triggers container creation when clicked, with clear loading animation during deployment
Clear success and error message display for container deployment operations
After successful deployment, UI immediately updates to reflect container existence state, removing deployment prompts
Enable data entry functionality only after successful container deployment
Password generator accessible via navigation button at top of dashboard (not always visible), opens as modal popup when clicked:
Configurable password length settings
Toggle options for including numbers and special characters
Generate button creates new password
Copy button copies generated password to clipboard
Regenerate functionality to create new password with same settings
Modal can be closed without affecting other functionality
Password generator modal integration accessible from all password input fields throughout the application:
Opens modal when user clicks generate button near password field
Same configuration options as navigation-triggered modal
Inserts generated password directly into triggering password field
Easy access from all password input contexts in product
Dashboard displaying entry list with sorting and filtering support
Entry details popup with field-specific handling and edit/delete options
Password field support for show/hide/copy functionality
OTP fields display dynamic TOTP codes with countdown
Entry creation and editing interface with category grid and template fields
"New Entry" button logic: click opens entry creation interface
Support template selection, add/remove custom fields
Entry editing modal must allow users to add new custom fields when editing existing entries, providing same field addition functionality available during entry creation
Automatic field type assignment and form validation
Save and cancel operations
Complete data entry CRUD operations frontend implementation:
useCreateDataEntry: call backend to create entry, handle loading and error states
useGetDataEntries: fetch entry list from backend, update UI in real-time
useUpdateDataEntry: call backend to update entry, immediately reflect changes
useDeleteDataEntry: call backend to delete entry, remove from list
Real-time UI updates after all CRUD operations, gracefully handle loading, error, success states
Google Authenticator compatible OTP implementation
Sensitive data copy functionality
Responsive design
Clean UI and form validation
Loading states, error handling, and confirmation dialogs
Timestamp display fix: ensure "Created Time" and "Updated Time" in entry details popup and other relevant components display properly formatted dates instead of "Invalid Date" by correctly handling backend timestamp data and converting to JavaScript Date objects
All UI components use hardcoded English text for interface elements, labels, messages, prompts, button labels, placeholders, tooltips, and category names
Frontend components supporting new field types:
URL fields: display as clickable links in view mode, use text input in edit mode
Email fields: display as mailto: links in view mode, use email input in edit mode
Date fields: display as readable date format in view mode, use date picker in edit mode
Data Operation Flow
All data CRUD operations interact with personal containers through backend API
Frontend React hooks fully integrated with backend Motoko methods
Ensure data isolation and security
Complete frontend-backend integration
Clear user feedback for loading, success, failure, confirmation states
Real-time UI state synchronization after CRUD operations
Security Features
Internet Identity wallet authentication
Per-user personal container isolation
All sensitive data encrypted storage
Secure handling of password and OTP fields
Template-based data organization
Standard TOTP implementation for OTP fields
Language
App content language: English
All interface elements display in English by default
Complete English translation for all UI text, including button labels, placeholders, tooltips, and category names