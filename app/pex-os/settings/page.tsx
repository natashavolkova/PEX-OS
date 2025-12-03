'use client';

// ============================================================================
// ATHENAPEX - SETTINGS PAGE
// Athena Architecture | System Settings Module
// ============================================================================

import React from 'react';

export default function SettingsPage() {
  return (
    <div className="h-full p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-cinzel font-bold text-athena-gold mb-6">
          Settings
        </h1>
        
        <div className="space-y-6">
          {/* General Settings */}
          <div className="bg-athena-navy/80 border border-athena-gold/20 rounded-xl p-6">
            <h2 className="text-lg font-cinzel font-semibold text-athena-platinum mb-4">
              General
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-athena-platinum">Theme</p>
                  <p className="text-xs text-athena-silver/60">Choose your preferred theme</p>
                </div>
                <select className="h-9 bg-athena-navy-deep border border-athena-gold/20 rounded-lg px-3 text-sm text-athena-platinum focus:border-athena-gold">
                  <option value="dark">Athena Dark</option>
                  <option value="light">Athena Light</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-athena-platinum">Language</p>
                  <p className="text-xs text-athena-silver/60">Select your language</p>
                </div>
                <select className="h-9 bg-athena-navy-deep border border-athena-gold/20 rounded-lg px-3 text-sm text-athena-platinum focus:border-athena-gold">
                  <option value="en">English</option>
                  <option value="pt">Português</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Notification Settings */}
          <div className="bg-athena-navy/80 border border-athena-gold/20 rounded-xl p-6">
            <h2 className="text-lg font-cinzel font-semibold text-athena-platinum mb-4">
              Notifications
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-athena-platinum">Push Notifications</p>
                  <p className="text-xs text-athena-silver/60">Receive push notifications</p>
                </div>
                <button className="w-12 h-6 bg-athena-gold rounded-full relative">
                  <span className="absolute right-1 top-1 w-4 h-4 bg-athena-navy-deep rounded-full transition-all" />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-athena-platinum">Email Notifications</p>
                  <p className="text-xs text-athena-silver/60">Receive email updates</p>
                </div>
                <button className="w-12 h-6 bg-athena-navy-light rounded-full relative">
                  <span className="absolute left-1 top-1 w-4 h-4 bg-athena-silver rounded-full transition-all" />
                </button>
              </div>
            </div>
          </div>
          
          {/* About */}
          <div className="bg-athena-navy/80 border border-athena-gold/20 rounded-xl p-6">
            <h2 className="text-lg font-cinzel font-semibold text-athena-platinum mb-4">
              About AthenaPeX
            </h2>
            <div className="space-y-2 text-sm text-athena-silver">
              <p><span className="text-athena-gold">Version:</span> 2.0.0</p>
              <p><span className="text-athena-gold">Architecture:</span> Athena Olympian</p>
              <p><span className="text-athena-gold">Build:</span> ENTJ Productivity System</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
