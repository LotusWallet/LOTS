import Types "./types";
import Array "mo:base/Array";

module {
    // Crypto Wallet Template
    public let CRYPTO_WALLET_TEMPLATE : Types.StorageTemplate = {
        templateType = #CryptoWallet;
        description = "Digital wallet information management";
        category = "Finance";
        icon = ?"wallet";
        fields = [
            { name = "Wallet Name"; fieldType = #Text; required = true; placeholder = ?"e.g., ETH Main Wallet, Bitcoin Cold Wallet"; description = ?"User-defined wallet identifier"; validation = null; multiSelect = false; options = null },
            { name = "Wallet Type"; fieldType = #Select; required = true; placeholder = null; description = ?"Type of wallet"; validation = null; multiSelect = false; options = ?["Software Wallet (MetaMask)", "Hardware Wallet (Ledger)", "Paper Wallet", "Exchange Wallet", "Other"] },
            { name = "Blockchain Networks"; fieldType = #MultiSelect; required = false; placeholder = null; description = ?"Supported mainnets"; validation = null; multiSelect = true; options = ?["Ethereum", "Bitcoin", "BSC", "Polygon", "ICP", "Solana", "Cardano", "Other"] },
            { name = "Mnemonic Phrase"; fieldType = #Mnemonic; required = false; placeholder = ?"Enter 12 or 24 words, one per line"; description = ?"BIP39 standard mnemonic, record line by line"; validation = null; multiSelect = false; options = null },
            { name = "Private Key"; fieldType = #PrivateKey; required = false; placeholder = ?"hex format or string"; description = ?"Wallet private key, distinguish different networks"; validation = null; multiSelect = false; options = null },
            { name = "Wallet Address"; fieldType = #Address; required = false; placeholder = ?"Record separately by network"; description = ?"Public wallet address"; validation = null; multiSelect = false; options = null },
            { name = "Password/PIN"; fieldType = #Password; required = false; placeholder = null; description = ?"Wallet unlock password or hardware wallet PIN"; validation = null; multiSelect = false; options = null },
            { name = "Creation Date"; fieldType = #Date; required = false; placeholder = null; description = ?"Wallet generation time"; validation = null; multiSelect = false; options = null },
            { name = "Notes"; fieldType = #TextArea; required = false; placeholder = ?"Backup location, transaction summary, etc."; description = null; validation = null; multiSelect = false; options = null }
        ];
    };

    // Login Template
    public let LOGIN_TEMPLATE : Types.StorageTemplate = {
        templateType = #Login;
        description = "Website and application login information";
        category = "Accounts";
        icon = ?"login";
        fields = [
            { name = "Website Name"; fieldType = #Text; required = true; placeholder = ?"e.g., Gmail, GitHub"; description = ?"Name of website or application"; validation = null; multiSelect = false; options = null },
            { name = "Username"; fieldType = #Text; required = true; placeholder = ?"Username or email"; description = ?"Login account"; validation = null; multiSelect = false; options = null },
            { name = "Password"; fieldType = #Password; required = true; placeholder = null; description = ?"Login password"; validation = null; multiSelect = false; options = null },
            { name = "Website URL"; fieldType = #URL; required = false; placeholder = ?"https://example.com/login"; description = ?"Login page URL"; validation = null; multiSelect = false; options = null },
            { name = "OTP Secret"; fieldType = #OTPSecret; required = false; placeholder = null; description = ?"Google Authenticator or other 2FA secret"; validation = null; multiSelect = false; options = null },
            { name = "Payment Password"; fieldType = #Password; required = false; placeholder = null; description = ?"Account-associated payment verification password"; validation = null; multiSelect = false; options = null },
            { name = "Bound Phone Number"; fieldType = #Phone; required = false; placeholder = ?"+1 555-123-4567"; description = ?"Complete with country/region code"; validation = null; multiSelect = false; options = null },
            { name = "Bound Email"; fieldType = #Email; required = false; placeholder = null; description = ?"Account-associated email"; validation = null; multiSelect = false; options = null },
            { name = "Security Questions"; fieldType = #TextArea; required = false; placeholder = ?"Question: Mother's maiden name\nAnswer: Smith"; description = ?"Security questions and answers"; validation = null; multiSelect = false; options = null },
            { name = "Account Status"; fieldType = #Select; required = false; placeholder = null; description = ?"Current account status"; validation = null; multiSelect = false; options = ?["Active", "Frozen", "Pending Verification", "Deactivated"] },
            { name = "Last Login Time"; fieldType = #DateTime; required = false; placeholder = null; description = ?"Most recent login time"; validation = null; multiSelect = false; options = null },
            { name = "Notes"; fieldType = #TextArea; required = false; placeholder = ?"Account purpose, special instructions, etc."; description = null; validation = null; multiSelect = false; options = null }
        ];
    };

    // Bank Account Template
    public let BANK_ACCOUNT_TEMPLATE : Types.StorageTemplate = {
        templateType = #BankAccount;
        description = "Bank account information";
        category = "Finance";
        icon = ?"bank";
        fields = [
            { name = "Account Name"; fieldType = #Text; required = true; placeholder = ?"e.g., Salary Account, Savings Account"; description = ?"Bank account holder name"; validation = null; multiSelect = false; options = null },
            { name = "Account Number"; fieldType = #Number; required = true; placeholder = null; description = ?"Bank account number"; validation = null; multiSelect = false; options = null },
            { name = "Bank Name"; fieldType = #Text; required = true; placeholder = ?"Chase Bank, Bank of America"; description = ?"Name of the issuing bank"; validation = null; multiSelect = false; options = null },
            { name = "Branch Information"; fieldType = #Text; required = false; placeholder = ?"Downtown Branch"; description = ?"Branch name and address"; validation = null; multiSelect = false; options = null },
            { name = "Account Type"; fieldType = #Select; required = false; placeholder = null; description = ?"Nature of account"; validation = null; multiSelect = false; options = ?["Savings Account", "Checking Account", "Credit Card Account", "Time Deposit", "Other"] },
            { name = "Balance"; fieldType = #Currency; required = false; placeholder = ?"0.00"; description = ?"Current balance (manual update required)"; validation = null; multiSelect = false; options = null },
            { name = "SWIFT Code"; fieldType = #Text; required = false; placeholder = ?"CHASUS33"; description = ?"International wire transfer bank identifier"; validation = null; multiSelect = false; options = null },
            { name = "IBAN Code"; fieldType = #Text; required = false; placeholder = null; description = ?"International Bank Account Number for Europe/Middle East"; validation = null; multiSelect = false; options = null },
            { name = "Routing Number"; fieldType = #Text; required = false; placeholder = ?"9-digit routing number"; description = ?"Domestic bank routing number"; validation = null; multiSelect = false; options = null },
            { name = "Interest Rate"; fieldType = #Percentage; required = false; placeholder = ?"2.5%"; description = ?"Savings account annual interest rate"; validation = null; multiSelect = false; options = null },
            { name = "Fee Information"; fieldType = #TextArea; required = false; placeholder = ?"ATM fee: $2 per transaction"; description = ?"Various fee standards"; validation = null; multiSelect = false; options = null },
            { name = "Linked Cards"; fieldType = #Text; required = false; placeholder = ?"****1234"; description = ?"Last 4 digits of linked debit card"; validation = null; multiSelect = false; options = null },
            { name = "Notes"; fieldType = #TextArea; required = false; placeholder = ?"Opening date, account purpose, etc."; description = null; validation = null; multiSelect = false; options = null }
        ];
    };

    // Credit Card Template
    public let CREDIT_CARD_TEMPLATE : Types.StorageTemplate = {
        templateType = #CreditCard;
        description = "Credit card and debit card information";
        category = "Finance";
        icon = ?"credit-card";
        fields = [
            { name = "Cardholder Name"; fieldType = #Text; required = true; placeholder = null; description = ?"Name displayed on credit card"; validation = null; multiSelect = false; options = null },
            { name = "Card Number"; fieldType = #Number; required = true; placeholder = ?"16-digit card number"; description = ?"Credit card number"; validation = null; multiSelect = false; options = null },
            { name = "Expiry Date"; fieldType = #Text; required = true; placeholder = ?"12/25"; description = ?"Format: MM/YY"; validation = null; multiSelect = false; options = null },
            { name = "Security Code"; fieldType = #Number; required = true; placeholder = ?"CVV/CVC"; description = ?"3 or 4 digit security code on card back"; validation = null; multiSelect = false; options = null },
            { name = "Issuing Bank"; fieldType = #Text; required = true; placeholder = ?"Chase Bank, Citibank"; description = ?"Name of issuing bank"; validation = null; multiSelect = false; options = null },
            { name = "Billing Address"; fieldType = #Address; required = false; placeholder = null; description = ?"Statement mailing address"; validation = null; multiSelect = false; options = null },
            { name = "Credit Limit"; fieldType = #Currency; required = false; placeholder = ?"5000.00"; description = ?"Bank-authorized overdraft limit"; validation = null; multiSelect = false; options = null },
            { name = "Card Type"; fieldType = #Select; required = false; placeholder = null; description = ?"Credit card brand"; validation = null; multiSelect = false; options = ?["Visa", "MasterCard", "American Express", "Discover", "JCB", "Other"] },
            { name = "Last 4 Digits"; fieldType = #Text; required = false; placeholder = ?"1234"; description = ?"Last 4 digits for identification"; validation = null; multiSelect = false; options = null },
            { name = "Statement Date"; fieldType = #Number; required = false; placeholder = ?"5"; description = ?"Monthly statement date"; validation = null; multiSelect = false; options = null },
            { name = "Payment Due Date"; fieldType = #Text; required = false; placeholder = ?"20 days after statement date"; description = ?"Final payment deadline"; validation = null; multiSelect = false; options = null },
            { name = "Current Balance"; fieldType = #Currency; required = false; placeholder = ?"0.00"; description = ?"Latest statement unpaid amount"; validation = null; multiSelect = false; options = null },
            { name = "Rewards Points"; fieldType = #Text; required = false; placeholder = ?"12000 points, expires 2024-12-31"; description = ?"Points balance and expiry date"; validation = null; multiSelect = false; options = null },
            { name = "Additional Cards"; fieldType = #TextArea; required = false; placeholder = ?"Cardholder: John Smith\nLast 4 digits: 5678"; description = ?"Additional cardholder and card info"; validation = null; multiSelect = false; options = null },
            { name = "Customer Service"; fieldType = #Phone; required = false; placeholder = ?"1-800-xxx-xxxx"; description = ?"Bank credit card hotline"; validation = null; multiSelect = false; options = null }
        ];
    };

    // Identity Template
    public let IDENTITY_TEMPLATE : Types.StorageTemplate = {
        templateType = #Identity;
        description = "Identity document information";
        category = "Personal";
        icon = ?"id-card";
        fields = [
            { name = "Full Name"; fieldType = #Text; required = true; placeholder = null; description = ?"Complete personal name"; validation = null; multiSelect = false; options = null },
            { name = "Date of Birth"; fieldType = #Date; required = false; placeholder = null; description = ?"Birth date"; validation = null; multiSelect = false; options = null },
            { name = "Address"; fieldType = #Address; required = false; placeholder = null; description = ?"Residential address"; validation = null; multiSelect = false; options = null },
            { name = "Phone Number"; fieldType = #Phone; required = false; placeholder = null; description = ?"Contact phone"; validation = null; multiSelect = false; options = null },
            { name = "Email Address"; fieldType = #Email; required = false; placeholder = null; description = ?"Personal email"; validation = null; multiSelect = false; options = null },
            { name = "ID Number"; fieldType = #Text; required = false; placeholder = null; description = ?"National ID number"; validation = null; multiSelect = false; options = null },
            { name = "Gender"; fieldType = #Select; required = false; placeholder = null; description = null; validation = null; multiSelect = false; options = ?["Male", "Female", "Other"] },
            { name = "Nationality/Region"; fieldType = #Country; required = false; placeholder = null; description = ?"Country or region of citizenship"; validation = null; multiSelect = false; options = null },
            { name = "Occupation"; fieldType = #Text; required = false; placeholder = null; description = ?"Professional information"; validation = null; multiSelect = false; options = null },
            { name = "Document Types"; fieldType = #MultiSelect; required = false; placeholder = null; description = ?"Multiple selection allowed"; validation = null; multiSelect = true; options = ?["National ID", "Passport", "Military ID", "Driver License", "Other"] },
            { name = "Passport Number"; fieldType = #Text; required = false; placeholder = null; description = ?"Passport number and expiry date"; validation = null; multiSelect = false; options = null },
            { name = "Social Security/Insurance Number"; fieldType = #Text; required = false; placeholder = null; description = ?"Social security or insurance account number"; validation = null; multiSelect = false; options = null },
            { name = "Emergency Contact"; fieldType = #TextArea; required = false; placeholder = ?"Name: John Smith\nRelationship: Spouse\nPhone: +1-555-123-4567"; description = ?"Emergency contact information"; validation = null; multiSelect = false; options = null },
            { name = "Photo/Document Images"; fieldType = #Image; required = false; placeholder = null; description = ?"ID front/back, passport pages, etc."; validation = null; multiSelect = false; options = null }
        ];
    };

    // Driver License Template
    public let DRIVER_LICENSE_TEMPLATE : Types.StorageTemplate = {
        templateType = #DriverLicense;
        description = "Driver license information";
        category = "Personal";
        icon = ?"car";
        fields = [
            { name = "License Number"; fieldType = #Text; required = true; placeholder = ?"DL123456789"; description = ?"Unique driver license number"; validation = null; multiSelect = false; options = null },
            { name = "License Holder Name"; fieldType = #Text; required = true; placeholder = null; description = ?"Name consistent with license"; validation = null; multiSelect = false; options = null },
            { name = "License Class"; fieldType = #Select; required = true; placeholder = null; description = ?"Specific license type"; validation = null; multiSelect = false; options = ?["Class A - Commercial", "Class B - Large Truck", "Class C - Regular Vehicle", "Class D - Chauffeur", "Class M - Motorcycle", "Other"] },
            { name = "Issuing Authority"; fieldType = #Text; required = false; placeholder = ?"Department of Motor Vehicles"; description = ?"License issuing authority"; validation = null; multiSelect = false; options = null },
            { name = "First Issue Date"; fieldType = #Date; required = false; placeholder = null; description = ?"Date of first license issuance"; validation = null; multiSelect = false; options = null },
            { name = "Expiry Date"; fieldType = #Text; required = false; placeholder = ?"2020-05-10 to 2030-05-10"; description = ?"License validity period"; validation = null; multiSelect = false; options = null },
            { name = "Vehicle Categories"; fieldType = #MultiSelect; required = false; placeholder = null; description = ?"Authorized vehicle types"; validation = null; multiSelect = true; options = ?["Passenger Cars", "Motorcycles", "Commercial Vehicles", "Buses", "Trucks", "Other"] },
            { name = "Record Number"; fieldType = #Text; required = false; placeholder = null; description = ?"License record archive number"; validation = null; multiSelect = false; options = null },
            { name = "Address"; fieldType = #Address; required = false; placeholder = null; description = ?"Address registered on license"; validation = null; multiSelect = false; options = null },
            { name = "Photo"; fieldType = #Image; required = false; placeholder = null; description = ?"License holder photo"; validation = null; multiSelect = false; options = null }
        ];
    };

    // OTP Template
    public let OTP_TEMPLATE : Types.StorageTemplate = {
        templateType = #OTP;
        description = "Two-factor authentication codes";
        category = "Security";
        icon = ?"shield";
        fields = [
            { name = "Account Name"; fieldType = #Text; required = true; placeholder = ?"Gmail Account, GitHub Account"; description = ?"Associated account platform"; validation = null; multiSelect = false; options = null },
            { name = "Secret Key"; fieldType = #OTPSecret; required = true; placeholder = null; description = ?"TOTP protocol original secret (base32 format)"; validation = null; multiSelect = false; options = null },
            { name = "Algorithm"; fieldType = #Select; required = false; placeholder = null; description = ?"Encryption algorithm for code generation"; validation = null; multiSelect = false; options = ?["SHA-1", "SHA-256", "SHA-512"] },
            { name = "Code Length"; fieldType = #Select; required = false; placeholder = null; description = ?"Number of digits in verification code"; validation = null; multiSelect = false; options = ?["6 digits", "8 digits"] },
            { name = "Refresh Interval"; fieldType = #Select; required = false; placeholder = null; description = ?"Code validity period"; validation = null; multiSelect = false; options = ?["30 seconds", "60 seconds"] },
            { name = "Linked Login Item"; fieldType = #Text; required = false; placeholder = null; description = ?"Corresponding login entry ID"; validation = null; multiSelect = false; options = null },
            { name = "Notes"; fieldType = #TextArea; required = false; placeholder = ?"Secret key changed on 2023-09-01"; description = ?"Related information records"; validation = null; multiSelect = false; options = null }
        ];
    };

    // Secure Note Template
    public let SECURE_NOTE_TEMPLATE : Types.StorageTemplate = {
        templateType = #SecureNote;
        description = "Secure notes";
        category = "Other";
        icon = ?"note";
        fields = [
            { name = "Title"; fieldType = #Text; required = true; placeholder = null; description = ?"Note title"; validation = null; multiSelect = false; options = null },
            { name = "Content"; fieldType = #TextArea; required = true; placeholder = ?"Important information content"; description = ?"Any text information you want to record"; validation = null; multiSelect = false; options = null },
            { name = "Category Tags"; fieldType = #MultiSelect; required = false; placeholder = null; description = ?"For categorized management"; validation = null; multiSelect = true; options = ?["Medical Records", "Contract Summary", "WiFi Passwords", "Software Licenses", "Other"] },
            { name = "Attachments"; fieldType = #File; required = false; placeholder = null; description = ?"Related files (PDF, images, audio, etc.)"; validation = null; multiSelect = false; options = null },
            { name = "Creator/Shared With"; fieldType = #Text; required = false; placeholder = null; description = ?"Creator and shared user information"; validation = null; multiSelect = false; options = null },
            { name = "Modification History"; fieldType = #TextArea; required = false; placeholder = null; description = ?"Last modification time and modifier"; validation = null; multiSelect = false; options = null },
            { name = "Expiry Reminder"; fieldType = #DateTime; required = false; placeholder = null; description = ?"Important task reminder time"; validation = null; multiSelect = false; options = null }
        ];
    };

    // Get all predefined templates
    public func getAllTemplates() : [Types.StorageTemplate] {
        [
            CRYPTO_WALLET_TEMPLATE,
            LOGIN_TEMPLATE,
            BANK_ACCOUNT_TEMPLATE,
            CREDIT_CARD_TEMPLATE,
            IDENTITY_TEMPLATE,
            DRIVER_LICENSE_TEMPLATE,
            OTP_TEMPLATE,
            SECURE_NOTE_TEMPLATE
        ]
    };

    // Get template by type
    public func getTemplateByType(itemType: Types.ItemType) : ?Types.StorageTemplate {
        let templates = getAllTemplates();
        Array.find<Types.StorageTemplate>(templates, func(template) {
            template.templateType == itemType
        })
    };

    // Get templates by category
    public func getTemplatesByCategory(category: Text) : [Types.StorageTemplate] {
        let templates = getAllTemplates();
        Array.filter<Types.StorageTemplate>(templates, func(template) {
            template.category == category
        })
    };
}