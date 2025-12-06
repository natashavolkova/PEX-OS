// ============================================================================
// ATHENAPEX - YOUTUBE STORE
// ATHENA Architecture | YouTube References Domain
// ============================================================================

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { YouTubeReference, YouTubeInsight } from '@/types';

// --- UTILITY FUNCTIONS ---

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// --- STORE INTERFACE ---

interface YouTubeState {
    youtubeRefs: YouTubeReference[];

    actions: {
        addYoutubeRef: (ref: Omit<YouTubeReference, 'id' | 'addedAt' | 'updatedAt'>) => string;
        updateYoutubeRef: (id: string, updates: Partial<YouTubeReference>) => void;
        deleteYoutubeRef: (id: string) => void;
        addYoutubeInsight: (refId: string, insight: Omit<YouTubeInsight, 'id' | 'referenceId' | 'createdAt'>) => void;
    };
}

// --- ZUSTAND STORE ---

export const useYouTubeStore = create<YouTubeState>()(
    devtools(
        persist(
            (set) => ({
                youtubeRefs: [],

                actions: {
                    addYoutubeRef: (ref) => {
                        const id = generateId();
                        const newRef: YouTubeReference = {
                            ...ref,
                            id,
                            addedAt: Date.now(),
                            updatedAt: Date.now(),
                        };
                        set((state) => ({
                            youtubeRefs: [newRef, ...state.youtubeRefs],
                        }));
                        return id;
                    },

                    updateYoutubeRef: (id, updates) =>
                        set((state) => ({
                            youtubeRefs: state.youtubeRefs.map((r) =>
                                r.id === id ? { ...r, ...updates, updatedAt: Date.now() } : r
                            ),
                        })),

                    deleteYoutubeRef: (id) =>
                        set((state) => ({
                            youtubeRefs: state.youtubeRefs.filter((r) => r.id !== id),
                        })),

                    addYoutubeInsight: (refId, insight) => {
                        const newInsight: YouTubeInsight = {
                            ...insight,
                            id: generateId(),
                            referenceId: refId,
                            createdAt: Date.now(),
                        };
                        set((state) => ({
                            youtubeRefs: state.youtubeRefs.map((r) =>
                                r.id === refId
                                    ? { ...r, insights: [...r.insights, newInsight], updatedAt: Date.now() }
                                    : r
                            ),
                        }));
                    },
                },
            }),
            {
                name: 'pex-os-youtube',
                partialize: (state) => ({
                    youtubeRefs: state.youtubeRefs,
                }),
            }
        ),
        { name: 'YouTubeStore' }
    )
);

// Selector hooks
export const useYouTubeRefs = () => useYouTubeStore((s) => s.youtubeRefs);
export const useYouTubeActions = () => useYouTubeStore((s) => s.actions);
