'use client';

// ============================================================================
// ATHENAPEX - DATA SYNC HOOK
// Syncs prompts data from backend API to Zustand store
// ============================================================================

import { useEffect, useState } from 'react';
import { usePromptManagerStore } from '@/stores/promptManager';
import type { TreeNode, Folder, Prompt } from '@/types/prompt-manager';

// Transform API data to TreeNode format with proper hierarchy
function buildTreeFromApi(data: any[]): TreeNode[] {
    // Separate folders and prompts
    const folders = data.filter(item => item.type === 'folder');
    const prompts = data.filter(item => item.type === 'prompt');

    // Build hierarchy - only include root folders (no parentId)
    const rootFolders = folders.filter(f => !f.parentId);

    // Map folders to TreeNode format
    const mapFolder = (folder: any): Folder => {
        // Find children of this folder
        const childFolders = folders.filter(f => f.parentId === folder.id);
        const childPrompts = prompts.filter(p => p.folderId === folder.id);

        // Also include nested children from the API response
        const apiChildren = folder.children || [];

        const children: TreeNode[] = [
            ...childFolders.map(mapFolder),
            ...apiChildren.filter((c: any) => c.type === 'folder').map(mapFolder),
            ...childPrompts.map(mapPrompt),
            ...apiChildren.filter((c: any) => c.type === 'prompt').map(mapPrompt),
            ...(folder.prompts || []).map(mapPrompt),
        ];

        // Remove duplicates by id
        const uniqueChildren = children.reduce((acc: TreeNode[], child) => {
            if (!acc.find(c => c.id === child.id)) {
                acc.push(child);
            }
            return acc;
        }, []);

        return {
            id: folder.id,
            name: folder.name,
            type: 'folder',
            emoji: folder.emoji || '📁',
            isSystem: folder.isSystem || false,
            children: uniqueChildren,
            createdAt: folder.createdAt || Date.now(),
            updatedAt: folder.updatedAt || Date.now(),
        };
    };

    const mapPrompt = (prompt: any): Prompt => ({
        id: prompt.id,
        name: prompt.name || prompt.title,
        type: 'prompt',
        content: prompt.content || '',
        emoji: prompt.emoji || '📄',
        category: prompt.category,
        tags: prompt.tags || [],
        date: prompt.date || new Date().toLocaleDateString('pt-BR'),
        folderId: prompt.folderId,
        createdAt: prompt.createdAt || Date.now(),
        updatedAt: prompt.updatedAt || Date.now(),
    });

    // Build tree
    const tree = rootFolders.map(mapFolder);

    // Add orphan prompts (no folder)
    const orphanPrompts = prompts.filter(p =>
        !p.folderId && !tree.some(f => f.id === p.folderId)
    );

    return [...tree, ...orphanPrompts.map(mapPrompt)];
}

export function useDataSync() {
    const setData = usePromptManagerStore(s => s.actions.setData);
    const updatePreferences = usePromptManagerStore(s => s.actions.updatePreferences);
    const [synced, setSynced] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const syncData = async () => {
            try {
                console.log('🔄 Syncing data from API...');

                // Fetch prompts
                const response = await fetch('/api/prompts');
                const result = await response.json();

                if (result.success && result.data) {
                    const tree = buildTreeFromApi(result.data);
                    console.log('✅ Data synced:', tree.length, 'root items');
                    setData(tree);
                }

                // Fetch user preferences from Neon DB
                const prefsRes = await fetch('/api/user/preferences');
                const prefsData = await prefsRes.json();
                if (prefsData.success && prefsData.data) {
                    console.log('✅ Preferences synced:', prefsData.data);
                    updatePreferences({ gridDensity: prefsData.data.gridDensity || 'standard' });
                }

                setSynced(true);
            } catch (err) {
                console.error('❌ Sync error:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
            }
        };

        // Only sync once on mount
        if (!synced) {
            syncData();
        }
    }, [setData, updatePreferences, synced]);

    return { synced, error };
}

export function DataSyncProvider({ children }: { children: React.ReactNode }) {
    const { synced, error } = useDataSync();

    // Optional: show loading while syncing
    // if (!synced && !error) {
    //   return <div>Loading...</div>;
    // }

    return <>{children}</>;
}
