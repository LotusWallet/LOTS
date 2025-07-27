import Types "./types";
import Array "mo:base/Array";

module {
    // Predefined templates
    public let LOGIN_TEMPLATE : Types.StorageTemplate = {
        templateType = #Login;
        description = "Website and application login credentials";
        fields = [
            { name = "Website Name"; fieldType = #Text; required = true; placeholder = ?"e.g., Gmail" },
            { name = "Website URL"; fieldType = #URL; required = false; placeholder = ?"https://gmail.com" },
            { name = "Username"; fieldType = #Text; required = true; placeholder = ?"Username or email" },
            { name = "Password"; fieldType = #Password; required = true; placeholder = null },
            { name = "Notes"; fieldType = #TextArea; required = false; placeholder = ?"Additional information" }
        ];
    };

    public let CREDIT_CARD_TEMPLATE : Types.StorageTemplate = {
        templateType = #CreditCard;
        description = "Credit and debit card information";
        fields = [
            { name = "Card Name"; fieldType = #Text; required = true; placeholder = ?"e.g., Chase Sapphire" },
            { name = "Cardholder Name"; fieldType = #Text; required = true; placeholder = null },
            { name = "Card Number"; fieldType = #Number; required = true; placeholder = ?"16-digit card number" },
            { name = "Expiry Date"; fieldType = #Date; required = true; placeholder = ?"MM/YY" },
            { name = "CVV"; fieldType = #Number; required = true; placeholder = ?"3-digit security code" },
            { name = "Bank Name"; fieldType = #Text; required = false; placeholder = null },
            { name = "Notes"; fieldType = #TextArea; required = false; placeholder = null }
        ];
    };

    public let BANK_ACCOUNT_TEMPLATE : Types.StorageTemplate = {
        templateType = #BankAccount;
        description = "Bank account information";
        fields = [
            { name = "Account Name"; fieldType = #Text; required = true; placeholder = ?"e.g., Savings Account" },
            { name = "Bank Name"; fieldType = #Text; required = true; placeholder = null },
            { name = "Account Type"; fieldType = #Text; required = false; placeholder = ?"Savings/Checking" },
            { name = "Account Number"; fieldType = #Number; required = true; placeholder = null },
            { name = "Branch"; fieldType = #Text; required = false; placeholder = null },
            { name = "SWIFT Code"; fieldType = #Text; required = false; placeholder = null },
            { name = "Notes"; fieldType = #TextArea; required = false; placeholder = null }
        ];
    };

    public let IDENTITY_TEMPLATE : Types.StorageTemplate = {
        templateType = #Identity;
        description = "Identity document information";
        fields = [
            { name = "Document Type"; fieldType = #Text; required = true; placeholder = ?"ID Card/Passport/License" },
            { name = "Full Name"; fieldType = #Text; required = true; placeholder = null },
            { name = "Document Number"; fieldType = #Text; required = true; placeholder = null },
            { name = "Issue Date"; fieldType = #Date; required = false; placeholder = null },
            { name = "Expiry Date"; fieldType = #Date; required = false; placeholder = null },
            { name = "Issuing Authority"; fieldType = #Text; required = false; placeholder = null },
            { name = "Notes"; fieldType = #TextArea; required = false; placeholder = null }
        ];
    };

    public let CRYPTO_WALLET_TEMPLATE : Types.StorageTemplate = {
        templateType = #CryptoWallet;
        description = "Cryptocurrency wallet information";
        fields = [
            { name = "Wallet Name"; fieldType = #Text; required = true; placeholder = ?"e.g., MetaMask Main" },
            { name = "Wallet Type"; fieldType = #Text; required = true; placeholder = ?"Hot/Cold Wallet" },
            { name = "Seed Phrase"; fieldType = #TextArea; required = false; placeholder = ?"12 or 24 words" },
            { name = "Private Key"; fieldType = #Password; required = false; placeholder = null },
            { name = "Wallet Address"; fieldType = #Text; required = false; placeholder = null },
            { name = "Supported Coins"; fieldType = #Text; required = false; placeholder = ?"BTC, ETH, ICP" },
            { name = "Notes"; fieldType = #TextArea; required = false; placeholder = null }
        ];
    };

    public let SECURE_NOTE_TEMPLATE : Types.StorageTemplate = {
        templateType = #SecureNote;
        description = "Secure notes";
        fields = [
            { name = "Title"; fieldType = #Text; required = true; placeholder = null },
            { name = "Content"; fieldType = #TextArea; required = true; placeholder = ?"Secure information content" },
            { name = "Category"; fieldType = #Text; required = false; placeholder = ?"Personal/Work/Other" }
        ];
    };

    // Get all predefined templates
    public func getAllTemplates() : [Types.StorageTemplate] {
        [
            LOGIN_TEMPLATE,
            CREDIT_CARD_TEMPLATE,
            BANK_ACCOUNT_TEMPLATE,
            IDENTITY_TEMPLATE,
            CRYPTO_WALLET_TEMPLATE,
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
}