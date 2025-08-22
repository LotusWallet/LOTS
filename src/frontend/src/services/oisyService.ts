import { Principal } from '@dfinity/principal';
import { AccountIdentifier } from '@dfinity/ledger-icp';
import { hexStringToUint8Array } from '@dfinity/utils';

interface OISYWallet {
  connect(): Promise<boolean>;
  disconnect(): Promise<void>;
  isConnected(): Promise<boolean>;
  getPrincipal(): Promise<Principal | null>;
  getAccountId(): Promise<string | null>;
}

class OISYService {
  private wallet: OISYWallet | null = null;
  private isInitialized = false;

  async init(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Check if OISY wallet is available
      if (typeof window !== 'undefined' && (window as any).oisy) {
        this.wallet = (window as any).oisy;
        this.isInitialized = true;
      } else {
        // Fallback to wallet connect if OISY extension not available
        const { OISYWalletConnect } = await import('@oisy/wallet-connect');
        this.wallet = new OISYWalletConnect({
          appName: 'LotS - Decentralized Storage Protocol',
          appUrl: window.location.origin,
          appIcon: `${window.location.origin}/favicon.ico`
        });
        this.isInitialized = true;
      }
    } catch (error) {
      console.error('Failed to initialize OISY wallet:', error);
      throw new Error('OISY wallet not available');
    }
  }

  async connect(): Promise<boolean> {
    if (!this.wallet) {
      await this.init();
    }

    try {
      return await this.wallet!.connect();
    } catch (error) {
      console.error('Failed to connect to OISY wallet:', error);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    if (this.wallet) {
      await this.wallet.disconnect();
    }
  }

  async isConnected(): Promise<boolean> {
    if (!this.wallet) return false;
    return await this.wallet.isConnected();
  }

  async getPrincipal(): Promise<Principal | null> {
    if (!this.wallet) return null;
    return await this.wallet.getPrincipal();
  }

  async getAccountId(): Promise<string | null> {
    const principal = await this.getPrincipal();
    if (!principal) return null;

    try {
      const accountId = AccountIdentifier.fromPrincipal({
        principal,
        subAccount: undefined
      });
      return accountId.toHex();
    } catch (error) {
      console.error('Failed to generate account ID:', error);
      return null;
    }
  }

  async getPrincipalText(): Promise<string> {
    const principal = await this.getPrincipal();
    return principal ? principal.toText() : '';
  }

  async getFormattedAccountId(): Promise<string> {
    const accountId = await this.getAccountId();
    if (!accountId) return '';
    
    // Format account ID with dashes for better readability
    return accountId.replace(/(.{8})/g, '$1-').slice(0, -1);
  }
}

export const oisyService = new OISYService();