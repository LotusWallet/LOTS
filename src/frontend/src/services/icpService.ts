import { AuthClient } from '@dfinity/auth-client';
import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { StorageItem, CanisterInfo, StorageTemplate, ItemType } from '../types';

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
    this.authClient = await AuthClient.create();
    
    if (await this.authClient.isAuthenticated()) {
      await this.setupAgent();
    }
  }

  private async setupAgent() {
    if (!this.authClient) return;

    const identity = this.authClient.getIdentity();
    this.agent = new HttpAgent({
      identity,
      host: this.isLocal ? 'http://localhost:8000' : 'https://ic0.app'
    });
  
    if (this.isLocal) {
      await this.agent.fetchRootKey();
    }
  
    // Create factory actor
    const factoryCanisterId = this.isLocal 
      ? 'rrkah-fqaaa-aaaaa-aaaaq-cai' // Local canister ID
      : 'amo65-5iaaa-aaaac-a3ubq-cai'; // 正确的生产环境 canister ID
    
    this.factoryActor = Actor.createActor(factoryIdl, {
      agent: this.agent,
      canisterId: factoryCanisterId
    });
  }

  async login() {
    if (!this.authClient) return false;

    const identityProvider = this.isLocal
      ? `http://localhost:8000?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai`
      : 'https://identity.ic0.app';

    return new Promise<boolean>((resolve) => {
      this.authClient!.login({
        identityProvider,
        onSuccess: async () => {
          await this.setupAgent();
          resolve(true);
        },
        onError: () => resolve(false)
      });
    });
  }

  async logout() {
    if (this.authClient) {
      await this.authClient.logout();
      this.agent = null;
      this.factoryActor = null;
      this.storageActor = null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    return this.authClient ? await this.authClient.isAuthenticated() : false;
  }

  async getPrincipal(): Promise<string> {
    if (!this.authClient) return '';
    const identity = this.authClient.getIdentity();
    return identity.getPrincipal().toString();
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

  async storeItem(canisterId: string, itemType: ItemType, title: string, data: string, tags: string[]): Promise<string | null> {
    await this.setupStorageActor(canisterId);
    if (!this.storageActor) return null;

    try {
      const result = await this.storageActor.storeItem(itemType, title, data, tags);
      return 'Ok' in result ? result.Ok : null;
    } catch (error) {
      console.error('Error storing item:', error);
      return null;
    }
  }

  async getItems(canisterId: string): Promise<StorageItem[]> {
    await this.setupStorageActor(canisterId);
    if (!this.storageActor) return [];

    try {
      const result = await this.storageActor.listItems();
      if ('Ok' in result) {
        return result.Ok.map((item: any) => ({
          id: item.id,
          itemType: item.itemType as ItemType,
          title: item.title,
          fields: {},
          tags: item.tags,
          createdAt: Number(item.createdAt),
          updatedAt: Number(item.updatedAt)
        }));
      }
      return [];
    } catch (error) {
      console.error('Error getting items:', error);
      return [];
    }
  }

  async getItem(canisterId: string, itemId: string): Promise<{ item: StorageItem; data: string } | null> {
    await this.setupStorageActor(canisterId);
    if (!this.storageActor) return null;

    try {
      const result = await this.storageActor.getItem(itemId);
      if ('Ok' in result) {
        const [item, data] = result.Ok;
        return {
          item: {
            id: item.id,
            itemType: item.itemType as ItemType,
            title: item.title,
            fields: JSON.parse(data),
            tags: item.tags,
            createdAt: Number(item.createdAt),
            updatedAt: Number(item.updatedAt)
          },
          data
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting item:', error);
      return null;
    }
  }

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