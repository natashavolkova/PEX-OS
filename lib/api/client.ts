import { TreeNode } from '@/types/prompt-manager';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async get<T>(endpoint: string): Promise<{ data: T; success: boolean }> {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API request error:', error);
            return { data: null as any, success: false };
        }
    }

    async post<T>(endpoint: string, body: unknown): Promise<{ data: T; success: boolean; message?: string }> {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API request error:', error);
            return { data: null as any, success: false, message: 'Request failed' };
        }
    }
}

const apiClient = new ApiClient(API_BASE_URL);

export const ClientDataService = {
    fetchData: async (): Promise<TreeNode[]> => {
        const response = await apiClient.get<{ data: TreeNode[] }>('/prompts');
        if (response.success && Array.isArray(response.data)) {
            return (response.data as any).data || [];
        }
        return [];
    }
};

export const BackupService = {
    async createBackup(): Promise<string> {
        // Use the export API
        const response = await fetch('/api/prompts/export');
        const result = await response.json();

        if (result.success && result.data) {
            const json = JSON.stringify(result.data, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            return URL.createObjectURL(blob);
        }

        // Fallback to old method
        const fallbackResponse = await apiClient.get<{ data: TreeNode[] }>('/prompts');
        const data = (fallbackResponse as any).data || [];

        const backup = {
            version: '1.0.0',
            timestamp: Date.now(),
            data,
        };

        const json = JSON.stringify(backup, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        return URL.createObjectURL(blob);
    },

    async restoreBackup(file: File): Promise<boolean> {
        try {
            const text = await file.text();
            const backup = JSON.parse(text);

            // Support both formats: { folders: [...] } or { data: [...] }
            let importData;

            if (backup.folders && Array.isArray(backup.folders)) {
                // New format from Backup_adaptado-EXEMPLO.json
                // This will create "Prompts AI" as parent folder
                importData = { folders: backup.folders };
            } else if (backup.data && Array.isArray(backup.data)) {
                // Old format
                importData = { folders: backup.data };
            } else {
                throw new Error('Invalid backup format');
            }

            // Call import API - creates "Prompts AI" as parent folder
            const response = await apiClient.post<{ foldersImported: number; promptsImported: number }>(
                '/prompts/import',
                {
                    data: importData,
                    parentFolderName: 'Prompts AI'
                }
            );

            if (response.success) {
                console.log(`✅ Imported: ${response.data?.foldersImported} folders, ${response.data?.promptsImported} prompts`);
                return true;
            } else {
                console.error('Import failed:', response.message);
                return false;
            }
        } catch (error) {
            console.error('Restore backup error:', error);
            return false;
        }
    },

    downloadBackup(url: string, filename: string = 'pex-os-backup.json'): void {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },
};

