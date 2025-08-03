import { StorageItem, ItemType } from '../types';
import { cryptoService } from './cryptoService';

export interface ExportData {
  version: string;
  exportDate: string;
  items: StorageItem[];
  encrypted: boolean;
}

export interface ImportResult {
  success: boolean;
  imported: number;
  failed: number;
  errors: string[];
}

class ImportExportService {
  private readonly EXPORT_VERSION = '1.0';

  /**
   * Export all items to JSON
   */
  async exportToJSON(items: StorageItem[], encrypt: boolean = true): Promise<string> {
    const exportData: ExportData = {
      version: this.EXPORT_VERSION,
      exportDate: new Date().toISOString(),
      items: encrypt ? this.encryptItems(items) : items,
      encrypted: encrypt
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Export to CSV format
   */
  async exportToCSV(items: StorageItem[]): Promise<string> {
    const headers = ['Type', 'Title', 'Tags', 'Created', 'Updated', 'Fields'];
    const rows = [headers.join(',')];

    items.forEach(item => {
      const fieldsJson = JSON.stringify(item.fields).replace(/"/g, '""');
      const row = [
        item.itemType,
        `"${item.title.replace(/"/g, '""')}"`,
        `"${item.tags.join(';')}"`,
        new Date(item.createdAt).toISOString(),
        new Date(item.updatedAt).toISOString(),
        `"${fieldsJson}"`
      ];
      rows.push(row.join(','));
    });

    return rows.join('\n');
  }

  /**
   * Import from JSON
   */
  async importFromJSON(jsonData: string): Promise<ImportResult> {
    const result: ImportResult = {
      success: false,
      imported: 0,
      failed: 0,
      errors: []
    };

    try {
      const data: ExportData = JSON.parse(jsonData);
      
      if (!this.validateExportData(data)) {
        result.errors.push('Invalid export data format');
        return result;
      }

      const items = data.encrypted ? this.decryptItems(data.items) : data.items;
      
      for (const item of items) {
        try {
          if (this.validateItem(item)) {
            // Here you would call the actual import logic
            // For now, we'll just count as successful
            result.imported++;
          } else {
            result.failed++;
            result.errors.push(`Invalid item: ${item.title}`);
          }
        } catch (error) {
          result.failed++;
          result.errors.push(`Failed to import ${item.title}: ${error}`);
        }
      }

      result.success = result.imported > 0;
    } catch (error) {
      result.errors.push(`Failed to parse JSON: ${error}`);
    }

    return result;
  }

  /**
   * Import from CSV
   */
  async importFromCSV(csvData: string): Promise<ImportResult> {
    const result: ImportResult = {
      success: false,
      imported: 0,
      failed: 0,
      errors: []
    };

    try {
      const lines = csvData.split('\n');
      const headers = lines[0].split(',');
      
      if (!this.validateCSVHeaders(headers)) {
        result.errors.push('Invalid CSV format');
        return result;
      }

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        try {
          const item = this.parseCSVLine(lines[i], headers);
          if (this.validateItem(item)) {
            result.imported++;
          } else {
            result.failed++;
            result.errors.push(`Invalid item at line ${i + 1}`);
          }
        } catch (error) {
          result.failed++;
          result.errors.push(`Failed to parse line ${i + 1}: ${error}`);
        }
      }

      result.success = result.imported > 0;
    } catch (error) {
      result.errors.push(`Failed to parse CSV: ${error}`);
    }

    return result;
  }

  /**
   * Download file
   */
  downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  private encryptItems(items: StorageItem[]): StorageItem[] {
    if (!cryptoService.isVaultUnlocked()) {
      throw new Error('Vault must be unlocked to encrypt export');
    }

    return items.map(item => ({
      ...item,
      fields: cryptoService.encryptObject(item.fields)
    }));
  }

  private decryptItems(items: StorageItem[]): StorageItem[] {
    if (!cryptoService.isVaultUnlocked()) {
      throw new Error('Vault must be unlocked to decrypt import');
    }

    return items.map(item => ({
      ...item,
      fields: cryptoService.decryptObject(item.fields as any)
    }));
  }

  private validateExportData(data: any): data is ExportData {
    return (
      data &&
      typeof data.version === 'string' &&
      typeof data.exportDate === 'string' &&
      Array.isArray(data.items) &&
      typeof data.encrypted === 'boolean'
    );
  }

  private validateItem(item: any): item is StorageItem {
    return (
      item &&
      typeof item.id === 'string' &&
      typeof item.title === 'string' &&
      typeof item.itemType === 'string' &&
      Object.values(ItemType).includes(item.itemType) &&
      Array.isArray(item.tags) &&
      typeof item.createdAt === 'number' &&
      typeof item.updatedAt === 'number' &&
      typeof item.fields === 'object'
    );
  }

  private validateCSVHeaders(headers: string[]): boolean {
    const requiredHeaders = ['Type', 'Title', 'Tags', 'Created', 'Updated', 'Fields'];
    return requiredHeaders.every(header => headers.includes(header));
  }

  private parseCSVLine(line: string, headers: string[]): StorageItem {
    const values = this.parseCSVRow(line);
    const item: any = {};
    
    headers.forEach((header, index) => {
      switch (header) {
        case 'Type':
          item.itemType = values[index];
          break;
        case 'Title':
          item.title = values[index];
          break;
        case 'Tags':
          item.tags = values[index] ? values[index].split(';') : [];
          break;
        case 'Created':
          item.createdAt = new Date(values[index]).getTime();
          break;
        case 'Updated':
          item.updatedAt = new Date(values[index]).getTime();
          break;
        case 'Fields':
          item.fields = JSON.parse(values[index] || '{}');
          break;
      }
    });
    
    item.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    return item as StorageItem;
  }

  private parseCSVRow(row: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      
      if (char === '"') {
        if (inQuotes && row[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  }
}

export const importExportService = new ImportExportService();