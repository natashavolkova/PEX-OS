'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function KeyboardShortcutHandler() {
    const router = useRouter();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Ignore if user is typing in an input or textarea
            if (
                event.target instanceof HTMLInputElement ||
                event.target instanceof HTMLTextAreaElement ||
                (event.target as HTMLElement).isContentEditable
            ) {
                return;
            }

            switch (event.key) {
                case '1':
                    router.push('/prompts');
                    break;
                case '2':
                    router.push('/projects');
                    break;
                case '3':
                    router.push('/tasks');
                    break;
                case '4':
                    router.push('/battle-plan');
                    break;
                case '5':
                    router.push('/analytics');
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [router]);

    return null;
}
