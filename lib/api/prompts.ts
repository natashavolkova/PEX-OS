import prisma from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/db/users';
import type { Prompt, Folder, TreeNode } from '@/types/prompt-manager';

export const DataService = {
  fetchData: async (): Promise<TreeNode[]> => {
    // Get current user
    const userId = await getCurrentUserId();

    // Fetch folders and prompts from DB for this user
    const folders = await prisma.folder.findMany({
      where: { userId },
      include: {
        children: {
          include: {
            prompts: true,
          }
        },
        prompts: true,
      },
      orderBy: { createdAt: 'asc' }
    });

    const prompts = await prisma.prompt.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    // Transform to TreeNode structure with hierarchy
    const mappedFolders = folders.map(f => ({
      id: f.id,
      name: f.name,
      type: 'folder' as const,
      emoji: f.emoji || undefined,
      isSystem: f.isSystem,
      parentId: f.parentId || undefined,
      children: f.children?.map(child => ({
        id: child.id,
        name: child.name,
        type: 'folder' as const,
        emoji: child.emoji || undefined,
        isSystem: child.isSystem,
        parentId: child.parentId || undefined,
        children: [],
        prompts: child.prompts?.map(p => ({
          id: p.id,
          name: p.title,
          type: 'prompt' as const,
          content: p.content,
          folderId: p.folderId,
        })) || [],
        createdAt: child.createdAt.getTime(),
        updatedAt: child.updatedAt.getTime(),
      })) || [],
      prompts: f.prompts?.map(p => ({
        id: p.id,
        name: p.title,
        type: 'prompt' as const,
        content: p.content,
        folderId: p.folderId,
      })) || [],
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

    // Return folders (with nested children) and prompts
    return [...mappedFolders, ...mappedPrompts];
  },

  createPrompt: async (prompt: Partial<Prompt>): Promise<Prompt> => {
    const userId = await getCurrentUserId();

    const newPrompt = await prisma.prompt.create({
      data: {
        title: prompt.name || 'Untitled Prompt',
        content: prompt.content || '',
        type: 'prompt',
        emoji: prompt.emoji,
        category: prompt.category,
        tags: prompt.tags || [],
        userId,
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

