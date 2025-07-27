import Time "mo:base/Time";
import Principal "mo:base/Principal";

module {
    // Storage item types
    public type ItemType = {
        #Login;           // Login credentials
        #CreditCard;      // Credit card information
        #BankAccount;     // Bank account details
        #Identity;        // Identity documents
        #CryptoWallet;    // Cryptocurrency wallet
        #SecureNote;      // Secure notes
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
        updatedAt: Time.Time;        // Last update time
        tags: [Text];                // Tags
    };

    // Storage template
    public type StorageTemplate = {
        templateType: ItemType;
        fields: [TemplateField];
        description: Text;
    };

    // Template field
    public type TemplateField = {
        name: Text;
        fieldType: FieldType;
        required: Bool;
        placeholder: ?Text;
    };

    // Field types
    public type FieldType = {
        #Text;
        #Password;
        #Email;
        #URL;
        #Number;
        #Date;
        #TextArea;
    };

    // API response types
    public type Result<T, E> = {
        #Ok: T;
        #Err: E;
    };

    // Error types
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

    // Web API types for frontend
    public type ItemData = {
        id: Text;
        itemType: Text;
        title: Text;
        fields: [(Text, Text)]; // Field name and value pairs
        tags: [Text];
        createdAt: Int;
        updatedAt: Int;
    };
}

    // Web API types
    public type ItemSummary = {
        id: Text;
        title: Text;
        itemType: ItemType;
        createdAt: Time.Time;
        updatedAt: Time.Time;
        tags: [Text];
    };

    public type ItemDetail = {
        item: StorageItem;
        decryptedData: Text;
    };
}