'use client';

// ============================================================================
// AthenaPeX PROMPT MANAGER - OPTIMIZED MODAL WRAPPER
// ATHENA Architecture | Reusable Snappy Modal | Premium Dark Theme
// ============================================================================

import React, { useRef, ReactNode } from 'react';

interface OptimizedModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
};

export const OptimizedModal: React.FC<OptimizedModalProps> = ({
    isOpen,
    onClose,
    children,
    maxWidth = 'md',
}) => {
    const overlayRef = useRef<HTMLDivElement>(null);
    const mouseDownTargetRef = useRef<EventTarget | null>(null);

    if (!isOpen) return null;

    // Click outside tracking - prevents close when dragging text selection
    const handleOverlayMouseDown = (e: React.MouseEvent) => {
        mouseDownTargetRef.current = e.target;
    };

    const handleOverlayMouseUp = (e: React.MouseEvent) => {
        // Only close if click started AND ended on the overlay (not the modal)
        if (
            mouseDownTargetRef.current === overlayRef.current &&
            e.target === overlayRef.current
        ) {
            onClose();
        }
        mouseDownTargetRef.current = null;
    };

    return (
        <div
            ref={overlayRef}
            onMouseDown={handleOverlayMouseDown}
            onMouseUp={handleOverlayMouseUp}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70"
            style={{
                animation: 'optimizedFadeIn 0.15s ease-out forwards',
            }}
        >
            <style jsx>{`
        @keyframes optimizedFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes optimizedModalIn {
          from { 
            opacity: 0; 
            transform: scale(0.96) translateY(8px); 
          }
          to { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
        }
      `}</style>
            <div
                className={`bg-[#1e2330] rounded-xl border border-white/10 shadow-2xl w-full ${maxWidthClasses[maxWidth]} flex flex-col max-h-[90vh]`}
                style={{
                    animation: 'optimizedModalIn 0.15s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                    willChange: 'transform, opacity',
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default OptimizedModal;
