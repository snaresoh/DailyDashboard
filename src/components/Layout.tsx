/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LayoutDashboard, Calendar as CalendarIcon, TrendingUp, List } from 'lucide-react';
import { motion } from 'motion/react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Layout({ children, activeTab, setActiveTab }: LayoutProps) {
  const tabs = [
    { id: 'dashboard', label: 'DASHBOARD', icon: LayoutDashboard },
    { id: 'calendar', label: 'CALENDAR', icon: CalendarIcon },
    { id: 'trends', label: 'TRENDS', icon: TrendingUp },
    { id: 'logs', label: 'LOGS', icon: List },
  ];

  return (
    <div className="min-h-screen bg-surface text-on-surface pb-28">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass h-16">
        <div className="max-w-md mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/20">
              <img 
                src="https://picsum.photos/seed/athlete/100/100" 
                alt="Profile" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <h1 className="text-xl font-black tracking-tighter text-primary uppercase font-headline">
              PRECISION
            </h1>
          </div>
          <button className="text-primary p-2 rounded-lg hover:bg-surface-container transition-colors">
            <CalendarIcon size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto pt-20 px-4">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass pb-6 pt-3">
        <div className="max-w-md mx-auto flex justify-around items-center px-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center gap-1 transition-all relative ${
                  isActive ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-bold tracking-widest uppercase font-headline">
                  {tab.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
