export interface StorageItem {
  id: string;
  itemType: ItemType;
  title: string;
  fields: Record<string, string>;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export type ItemType = 
  | 'Login'
  | 'CreditCard'
  | 'BankAccount'
  | 'Identity'
  | 'CryptoWallet'
  | 'SecureNote'
  | 'Custom';

export interface TemplateField {
  name: string;
  fieldType: FieldType;
  required: boolean;
  placeholder?: string;
}

export type FieldType = 
  | 'Text'
  | 'Password'
  | 'Email'
  | 'URL'
  | 'Number'
  | 'Date'
  | 'TextArea';

export interface StorageTemplate {
  templateType: ItemType;
  fields: TemplateField[];
  description: string;
}

export interface CanisterInfo {
  canisterId: string;
  owner: string;
  createdAt: number;
  storageUsed: number;
  itemCount: number;
}

export interface User {
  principal: string;
  isAuthenticated: boolean;
}