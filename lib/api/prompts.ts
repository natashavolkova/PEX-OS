import prisma from '@/lib/prisma';
import type { Prompt, Folder, TreeNode } from '@/types/prompt-manager';

export const DataService = {
  fetchData: async (): Promise<TreeNode[]> => {
    // Fetch folders and prompts from DB
    const folders = await prisma.folder.findMany({
      include: {
        children: true, // This only includes direct children if modeled that way
        prompts: true,
      }
    });

    const prompts = await prisma.prompt.findMany();

    // Transform to TreeNode structure
    // Note: Prisma's recursive relations need careful handling. 
    // For now, we'll map a flat list or simple hierarchy.

    const mappedFolders = folders.map(f => ({
      id: f.id,
      name: f.name,
      type: 'folder' as const,
      emoji: f.emoji || undefined,
      isSystem: f.isSystem,
      children: [], // TODO: Reconstruct hierarchy if needed
      createdAt: f.createdAt.getTime(),
      updatedAt: f.updatedAt.getTime(),
    }));

    const mappedPrompts = prompts.map(p => ({
      id: p.id,
      name: p.title,
      type: 'prompt' as const,
      content: p.content,
      emoji: p.emoji || undefined,
      category: p.category || undefined,
      tags: p.tags,
      date: p.createdAt.toISOString(),
      createdAt: p.createdAt.getTime(),
      updatedAt: p.updatedAt.getTime(),
      folderId: p.folderId,
    }));

    // Basic hierarchy reconstruction (optional, for now returning flat-ish list)
    return [...mappedFolders, ...mappedPrompts];
  },

  createPrompt: async (prompt: Partial<Prompt>): Promise<Prompt> => {
    const newPrompt = await prisma.prompt.create({
      data: {
        title: prompt.name || 'Untitled Prompt',
        content: prompt.content || '',
        type: 'prompt',
        emoji: prompt.emoji,
        category: prompt.category,
        tags: prompt.tags || [],
        userId: 'user-1', // TODO: Get from Stack Auth
        folderId: undefined,
      }
    });

    return {
      id: newPrompt.id,
      name: newPrompt.title,
      type: 'prompt',
      content: newPrompt.content,
      emoji: newPrompt.emoji || undefined,
      category: newPrompt.category || undefined,
      tags: newPrompt.tags,
      date: newPrompt.createdAt.toISOString(),
      createdAt: newPrompt.createdAt.getTime(),
      updatedAt: newPrompt.updatedAt.getTime(),
    };
  },

  // Add other methods as needed by the API routes
};
