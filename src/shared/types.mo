import Time "mo:base/Time";
import Principal "mo:base/Principal";

module {
    // Storage item type enumeration
    public type ItemType = {
        #Login;           // Login information
        #CreditCard;      // Credit card information
        #BankAccount;     // Bank account
        #Identity;        // Identity information
        #CryptoWallet;    // Crypto wallet
        #SecureNote;      // Secure note
        #DriverLicense;   // Driver license
        #OTP;            // Two-factor authentication
        #Custom: Text;    // Custom type
    };

    // Encrypted data structure
    public type EncryptedData = {
        data: Blob;           // Encrypted data
        nonce: Blob;          // Encryption nonce
        tag: Blob;            // Authentication tag
    };

    // Storage item
    public type StorageItem = {
        id: Text;                    // Unique identifier
        itemType: ItemType;          // Item type
        title: Text;                 // Title
        encryptedData: EncryptedData; // Encrypted data
        createdAt: Time.Time;        // Creation time
        updatedAt: Time.Time;        // Update time
        tags: [Text];                // Tags
        customFields: [CustomField]; // Custom fields
    };

    // Custom field
    public type CustomField = {
        name: Text;
        value: Text;
        fieldType: FieldType;
        encrypted: Bool;
    };

    // Storage template
    public type StorageTemplate = {
        templateType: ItemType;
        fields: [TemplateField];
        description: Text;
        category: Text;
        icon: ?Text;
    };

    // Template field
    public type TemplateField = {
        name: Text;
        fieldType: FieldType;
        required: Bool;
        placeholder: ?Text;
        description: ?Text;
        validation: ?Text;
        multiSelect: Bool;
        options: ?[Text];
    };

    // Field type
    public type FieldType = {
        #Text;           // Plain text
        #Password;       // Password
        #Email;          // Email
        #URL;            // Website URL
        #Number;         // Number
        #Date;           // Date
        #DateTime;       // Date and time
        #TextArea;       // Multi-line text
        #Phone;          // Phone number
        #Select;         // Single select dropdown
        #MultiSelect;    // Multi-select
        #Checkbox;       // Checkbox
        #File;           // File
        #Image;          // Image
        #OTPSecret;      // OTP secret key
        #Mnemonic;       // Mnemonic phrase
        #PrivateKey;     // Private key
        #Address;        // Address
        #Currency;       // Currency amount
        #Percentage;     // Percentage
        #Country;        // Country
        #Custom: Text;   // Custom type
    };

    // API response type
    public type Result<T, E> = {
        #Ok: T;
        #Err: E;
    };

    // Error type
    public type Error = {
        #NotFound;
        #Unauthorized;
        #InvalidInput: Text;
        #EncryptionError;
        #StorageFull;
        #InternalError: Text;
    };

    // Canister information
    public type CanisterInfo = {
        canisterId: Principal;
        owner: Principal;
        createdAt: Time.Time;
        storageUsed: Nat;
        itemCount: Nat;
    };
}