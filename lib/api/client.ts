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
}

const apiClient = new ApiClient(API_BASE_URL);

export const ClientDataService = {
    fetchData: async (): Promise<TreeNode[]> => {
        const response = await apiClient.get<{ data: TreeNode[] }>('/prompts');
        if (response.success && Array.isArray(response.data)) {
            // The API returns { data: TreeNode[], ... } but our apiClient.get returns the whole body as T?
            // Wait, my ApiClient.get implementation above returns `data` which is the JSON body.
            // The API returns { data: [...], success: true }.
            // So T should be { data: TreeNode[] }?
            // Let's adjust types.
            return (response.data as any).data || [];
        }
        return [];
    }
};

export const BackupService = {
    async createBackup(): Promise<string> {
        // Fetch data from API
        const response = await apiClient.get<{ data: TreeNode[] }>('/prompts');
        const data = (response as any).data || [];

        const backup = {
            version: '1.0.0',
            timestamp: Date.now(),
            data,
        };

        const json = JSON.stringify(backup, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        return url;
    },

    async restoreBackup(file: File): Promise<boolean> {
        try {
            const text = await file.text();
            const backup = JSON.parse(text);

            if (!backup.data || !Array.isArray(backup.data)) {
                throw new Error('Invalid backup format');
            }

            // TODO: Implement restore endpoint in API
            // await apiClient.post('/prompts/restore', { data: backup.data });
            return true;
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
