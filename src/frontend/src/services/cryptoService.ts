import CryptoJS from 'crypto-js';

export interface EncryptedData {
  encryptedData: string;
  salt: string;
  iv: string;
  iterations: number;
}

export interface MasterKeyData {
  derivedKey: string;
  salt: string;
  iterations: number;
}

class CryptoService {
  private static readonly DEFAULT_ITERATIONS = 100000; // PBKDF2 iterations
  private static readonly KEY_SIZE = 256 / 32; // AES-256 key size in words
  private static readonly IV_SIZE = 128 / 32; // AES IV size in words
  private static readonly SALT_SIZE = 128 / 32; // Salt size in words
  
  private masterKey: CryptoJS.lib.WordArray | null = null;
  private isUnlocked = false;

  /**
   * Generate a random salt
   */
  private generateSalt(): CryptoJS.lib.WordArray {
    return CryptoJS.lib.WordArray.random(CryptoService.SALT_SIZE * 4);
  }

  /**
   * Generate a random IV
   */
  private generateIV(): CryptoJS.lib.WordArray {
    return CryptoJS.lib.WordArray.random(CryptoService.IV_SIZE * 4);
  }

  /**
   * Derive key from password using PBKDF2
   */
  private deriveKey(
    password: string, 
    salt: CryptoJS.lib.WordArray, 
    iterations: number = CryptoService.DEFAULT_ITERATIONS
  ): CryptoJS.lib.WordArray {
    return CryptoJS.PBKDF2(password, salt, {
      keySize: CryptoService.KEY_SIZE,
      iterations: iterations,
      hasher: CryptoJS.algo.SHA256
    });
  }

  /**
   * Set up master key from password
   */
  async setupMasterKey(password: string, salt?: string): Promise<MasterKeyData> {
    const saltWordArray = salt ? 
      CryptoJS.enc.Hex.parse(salt) : 
      this.generateSalt();
    
    const iterations = CryptoService.DEFAULT_ITERATIONS;
    this.masterKey = this.deriveKey(password, saltWordArray, iterations);
    this.isUnlocked = true;

    return {
      derivedKey: this.masterKey.toString(CryptoJS.enc.Hex),
      salt: saltWordArray.toString(CryptoJS.enc.Hex),
      iterations
    };
  }

  /**
   * Unlock vault with master password
   */
  async unlockVault(password: string, storedSalt: string, iterations: number): Promise<boolean> {
    try {
      const salt = CryptoJS.enc.Hex.parse(storedSalt);
      const derivedKey = this.deriveKey(password, salt, iterations);
      
      // In a real implementation, you would verify this against a stored hash
      // For now, we'll assume the password is correct if derivation succeeds
      this.masterKey = derivedKey;
      this.isUnlocked = true;
      
      return true;
    } catch (error) {
      console.error('Failed to unlock vault:', error);
      return false;
    }
  }

  /**
   * Lock the vault
   */
  lockVault(): void {
    this.masterKey = null;
    this.isUnlocked = false;
  }

  /**
   * Check if vault is unlocked
   */
  isVaultUnlocked(): boolean {
    return this.isUnlocked && this.masterKey !== null;
  }

  /**
   * Encrypt data using AES-256-CBC
   */
  encrypt(plaintext: string): EncryptedData {
    if (!this.isVaultUnlocked() || !this.masterKey) {
      throw new Error('Vault is locked. Please unlock with master password.');
    }

    try {
      const iv = this.generateIV();
      const salt = this.generateSalt();
      
      // Use master key for encryption
      const encrypted = CryptoJS.AES.encrypt(plaintext, this.masterKey, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      return {
        encryptedData: encrypted.toString(),
        salt: salt.toString(CryptoJS.enc.Hex),
        iv: iv.toString(CryptoJS.enc.Hex),
        iterations: CryptoService.DEFAULT_ITERATIONS
      };
    } catch (error) {
      throw new Error(`Encryption failed: ${error}`);
    }
  }

  /**
   * Decrypt data using AES-256-CBC
   */
  decrypt(encryptedData: EncryptedData): string {
    if (!this.isVaultUnlocked() || !this.masterKey) {
      throw new Error('Vault is locked. Please unlock with master password.');
    }

    try {
      const iv = CryptoJS.enc.Hex.parse(encryptedData.iv);
      
      const decrypted = CryptoJS.AES.decrypt(encryptedData.encryptedData, this.masterKey, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
      
      if (!decryptedText) {
        throw new Error('Decryption resulted in empty string');
      }

      return decryptedText;
    } catch (error) {
      throw new Error(`Decryption failed: ${error}`);
    }
  }

  /**
   * Encrypt object data
   */
  encryptObject(obj: any): EncryptedData {
    const jsonString = JSON.stringify(obj);
    return this.encrypt(jsonString);
  }

  /**
   * Decrypt object data
   */
  decryptObject<T>(encryptedData: EncryptedData): T {
    const jsonString = this.decrypt(encryptedData);
    return JSON.parse(jsonString) as T;
  }

  /**
   * Generate a secure random password
   */
  generateSecurePassword(length: number = 16): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    const randomValues = CryptoJS.lib.WordArray.random(length);
    const bytes = [];
    
    for (let i = 0; i < length; i++) {
      const randomIndex = (randomValues.words[Math.floor(i / 4)] >>> (24 - (i % 4) * 8)) & 0xff;
      bytes.push(charset[randomIndex % charset.length]);
    }
    
    return bytes.join('');
  }

  /**
   * Hash password for verification (not for encryption)
   */
  hashPassword(password: string, salt?: string): { hash: string; salt: string } {
    const saltWordArray = salt ? 
      CryptoJS.enc.Hex.parse(salt) : 
      this.generateSalt();
    
    const hash = CryptoJS.PBKDF2(password, saltWordArray, {
      keySize: CryptoService.KEY_SIZE,
      iterations: CryptoService.DEFAULT_ITERATIONS,
      hasher: CryptoJS.algo.SHA256
    });

    return {
      hash: hash.toString(CryptoJS.enc.Hex),
      salt: saltWordArray.toString(CryptoJS.enc.Hex)
    };
  }

  /**
   * Verify password against hash
   */
  verifyPassword(password: string, hash: string, salt: string): boolean {
    const computed = this.hashPassword(password, salt);
    return computed.hash === hash;
  }
}

export const cryptoService = new CryptoService();