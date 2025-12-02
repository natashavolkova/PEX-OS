'use client';

// ============================================================================
// HIERARCHY VIEW - SEARCH BAR COMPONENT
// Search input with stats display for hierarchy tree filtering
// ============================================================================

import React from 'react';
import { Search, Folder, FileText } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalFolders: number;
  totalPrompts: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  totalFolders,
  totalPrompts,
}) => {
  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar na hierarquia..."
          className="w-full h-10 bg-[#0f111a] border border-white/10 rounded-lg pl-10 pr-4 text-sm text-gray-300 focus:outline-none focus:border-[#2979ff] transition-all placeholder-gray-600"
        />
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-1.5">
          <Folder size={12} />
          <span>{totalFolders} pastas</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-gray-600" />
        <div className="flex items-center gap-1.5">
          <FileText size={12} />
          <span>{totalPrompts} prompts</span>
        </div>
        {searchQuery && (
          <>
            <div className="w-1 h-1 rounded-full bg-gray-600" />
            <span className="text-[#2979ff]">Filtrando por "{searchQuery}"</span>
          </>
        )}
      </div>
    </div>
  );
};
