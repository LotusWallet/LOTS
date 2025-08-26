import { AuthClient } from '@dfinity/auth-client';
import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { StorageItem, CanisterInfo, StorageTemplate, ItemType } from '../types';
import { cryptoService, EncryptedData } from './cryptoService';

// IDL interfaces (simplified)
const factoryIdl = ({ IDL }: any) => {
  return IDL.Service({
    'createStorageCanister': IDL.Func([], [IDL.Variant({
      'Ok': IDL.Record({
        'canisterId': IDL.Principal,
        'owner': IDL.Principal,
        'createdAt': IDL.Int,
        'storageUsed': IDL.Nat,
        'itemCount': IDL.Nat
      }),
      'Err': IDL.Text
    })], []),
    'getUserCanister': IDL.Func([], [IDL.Variant({
      'Ok': IDL.Record({
        'canisterId': IDL.Principal,
        'owner': IDL.Principal,
        'createdAt': IDL.Int,
        'storageUsed': IDL.Nat,
        'itemCount': IDL.Nat
      }),
      'Err': IDL.Text
    })], ['query']),
    'getAvailableTemplates': IDL.Func([], [IDL.Vec(IDL.Record({
      'templateType': IDL.Text,
      'description': IDL.Text,
      'fields': IDL.Vec(IDL.Record({
        'name': IDL.Text,
        'fieldType': IDL.Text,
        'required': IDL.Bool,
        'placeholder': IDL.Opt(IDL.Text)
      }))
    }))], ['query'])
  });
};

const storageIdl = ({ IDL }: any) => {
  return IDL.Service({
    'storeItem': IDL.Func([IDL.Text, IDL.Text, IDL.Text, IDL.Vec(IDL.Text)], [IDL.Variant({
      'Ok': IDL.Text,
      'Err': IDL.Text
    })], []),
    'listItems': IDL.Func([], [IDL.Variant({
      'Ok': IDL.Vec(IDL.Record({
        'id': IDL.Text,
        'itemType': IDL.Text,
        'title': IDL.Text,
        'createdAt': IDL.Int,
        'updatedAt': IDL.Int,
        'tags': IDL.Vec(IDL.Text)
      })),
      'Err': IDL.Text
    })], ['query']),
    'getItem': IDL.Func([IDL.Text], [IDL.Variant({
      'Ok': IDL.Tuple(IDL.Record({
        'id': IDL.Text,
        'itemType': IDL.Text,
        'title': IDL.Text,
        'createdAt': IDL.Int,
        'updatedAt': IDL.Int,
        'tags': IDL.Vec(IDL.Text)
      }), IDL.Text),
      'Err': IDL.Text
    })], []),
    'deleteItem': IDL.Func([IDL.Text], [IDL.Variant({
      'Ok': IDL.Null,
      'Err': IDL.Text
    })], [])
  });
};

class ICPService {
  private authClient: AuthClient | null = null;
  private agent: HttpAgent | null = null;
  private factoryActor: any = null;
  private storageActor: any = null;
  private isLocal = process.env.NODE_ENV === 'development';

  async init() {
    try {
      this.authClient = await AuthClient.create();
      await this.setupAgent();
    } catch (error) {
      console.error('Failed to initialize ICP service:', error);
    }
  }

  private async setupAgent() {
    if (this.authClient && await this.authClient.isAuthenticated()) {
      const identity = this.authClient.getIdentity();
      this.agent = new HttpAgent({
        host: this.isLocal ? 'http://localhost:8000' : 'https://ic0.app',
        identity
      });
      
      if (this.isLocal) {
        await this.agent.fetchRootKey();
      }
      
      this.factoryActor = Actor.createActor(factoryIdl, {
        agent: this.agent,
        canisterId: this.isLocal ? 'rrkah-fqaaa-aaaaa-aaaaq-cai' : 'factory-canister-id'
      });
    }
  }

  async login(): Promise<boolean> {
    try {
      if (!this.authClient) {
        await this.init();
      }
      
      return new Promise((resolve) => {
        this.authClient!.login({
          identityProvider: this.isLocal 
            ? 'http://localhost:8000/?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai'
            : 'https://identity.ic0.app',
          onSuccess: async () => {
            await this.setupAgent();
            resolve(true);
          },
          onError: (error) => {
            console.error('Login failed:', error);
            resolve(false);
          }
        });
      });
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }

  async logout(): Promise<void> {
    if (this.authClient) {
      await this.authClient.logout();
    }
    this.agent = null;
    this.factoryActor = null;
    this.storageActor = null;
  }

  async isAuthenticated(): Promise<boolean> {
    if (!this.authClient) {
      await this.init();
    }
    return this.authClient ? await this.authClient.isAuthenticated() : false;
  }

  async getPrincipal(): Promise<string> {
    if (this.authClient && await this.authClient.isAuthenticated()) {
      return this.authClient.getIdentity().getPrincipal().toString();
    }
    return '';
  }

  async getAccountId(): Promise<string> {
    if (this.authClient && await this.authClient.isAuthenticated()) {
      const principal = this.authClient.getIdentity().getPrincipal();
      // Convert principal to account ID format
      return principal.toString();
    }
    return '';
  }

  async createStorageCanister(): Promise<CanisterInfo | null> {
    if (!this.factoryActor) return null;

    try {
      const result = await this.factoryActor.createStorageCanister();
      if ('Ok' in result) {
        return {
          canisterId: result.Ok.canisterId.toString(),
          owner: result.Ok.owner.toString(),
          createdAt: Number(result.Ok.createdAt),
          storageUsed: Number(result.Ok.storageUsed),
          itemCount: Number(result.Ok.itemCount)
        };
      }
      return null;
    } catch (error) {
      console.error('Error creating storage canister:', error);
      return null;
    }
  }

  async getUserCanister(): Promise<CanisterInfo | null> {
    if (!this.factoryActor) return null;

    try {
      const result = await this.factoryActor.getUserCanister();
      if ('Ok' in result) {
        return {
          canisterId: result.Ok.canisterId.toString(),
          owner: result.Ok.owner.toString(),
          createdAt: Number(result.Ok.createdAt),
          storageUsed: Number(result.Ok.storageUsed),
          itemCount: Number(result.Ok.itemCount)
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting user canister:', error);
      return null;
    }
  }

  async getAvailableTemplates(): Promise<StorageTemplate[]> {
    if (!this.factoryActor) return [];

    try {
      const templates = await this.factoryActor.getAvailableTemplates();
      return templates.map((t: any) => ({
        templateType: t.templateType as ItemType,
        description: t.description,
        fields: t.fields.map((f: any) => ({
          name: f.name,
          fieldType: f.fieldType,
          required: f.required,
          placeholder: f.placeholder[0] || undefined
        }))
      }));
    } catch (error) {
      console.error('Error getting templates:', error);
      return [];
    }
  }

  private async setupStorageActor(canisterId: string) {
    if (!this.agent) return;

    this.storageActor = Actor.createActor(storageIdl, {
      agent: this.agent,
      canisterId
    });
  }

  /**
   * Store encrypted item
   */
  async storeItem(
    canisterId: string, 
    itemType: ItemType, 
    title: string, 
    data: any, 
    tags: string[]
  ): Promise<string | null> {
    if (!cryptoService.isVaultUnlocked()) {
      throw new Error('Vault is locked. Please unlock with master password.');
    }

    try {
      await this.setupStorageActor(canisterId);
      if (!this.storageActor) return null;

      // Encrypt the sensitive data
      const encryptedData = cryptoService.encryptObject(data);
      const encryptedDataString = JSON.stringify(encryptedData);

      const result = await this.storageActor.storeItem(
        itemType,
        title,
        encryptedDataString,
        tags
      );

      if ('Ok' in result) {
        return result.Ok;
      } else {
        console.error('Failed to store item:', result.Err);
        return null;
      }
    } catch (error) {
      console.error('Error storing item:', error);
      return null;
    }
  }

  /**
   * Get and decrypt item
   */
  async getItem(
    canisterId: string, 
    itemId: string
  ): Promise<{ item: StorageItem; data: any } | null> {
    await this.setupStorageActor(canisterId);
    if (!this.storageActor) return null;

    try {
      const result = await this.storageActor.getItem(itemId);
      if ('Ok' in result) {
        const [item, encryptedDataString] = result.Ok;
        
        // Decrypt the data
        const decryptedData = cryptoService.decryptObject(JSON.parse(encryptedDataString));
        
        return {
          item: {
            id: item.id,
            itemType: item.itemType as ItemType,
            title: item.title,
            fields: decryptedData as Record<string, string>,
            tags: item.tags,
            createdAt: Number(item.createdAt),
            updatedAt: Number(item.updatedAt)
          },
          data: decryptedData
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting item:', error);
      return null;
    }
  }

  async getItems(canisterId: string): Promise<StorageItem[]> {
    try {
      await this.setupStorageActor(canisterId);
      if (!this.storageActor) return [];

      const result = await this.storageActor.listItems();
      
      if ('Ok' in result) {
        return result.Ok.map((item: any) => ({
          id: item.id,
          itemType: item.itemType as ItemType,
          title: item.title,
          fields: {}, // Don't decrypt here for performance
          tags: item.tags,
          createdAt: Number(item.createdAt),
          updatedAt: Number(item.updatedAt)
        }));
      } else {
        console.error('Failed to get items:', result.Err);
        return [];
      }
    } catch (error) {
      console.error('Error getting items:', error);
      return [];
    }
  }

  // 移除第353-379行的重复getItem函数

  async deleteItem(canisterId: string, itemId: string): Promise<boolean> {
    await this.setupStorageActor(canisterId);
    if (!this.storageActor) return false;

    try {
      const result = await this.storageActor.deleteItem(itemId);
      return 'Ok' in result;
    } catch (error) {
      console.error('Error deleting item:', error);
      return false;
    }
  }
}

export const icpService = new ICPService();