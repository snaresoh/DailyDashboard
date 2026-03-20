/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Filter, SortAsc } from 'lucide-react';
import PerformanceCard from '../components/PerformanceCard';
import { DailyMetric } from '../types';

interface LogsScreenProps {
  data: DailyMetric[];
}

export default function LogsScreen({ data }: LogsScreenProps) {
  // Reverse to show latest first
  const sortedData = [...data].reverse();

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-[10px] font-headline font-bold tracking-[0.2em] text-primary/60 uppercase">System Logs</span>
            <h2 className="text-3xl font-headline font-extrabold tracking-tighter">PERFORMANCE</h2>
          </div>
          <div className="flex gap-2">
            <button className="p-2 bg-surface-container rounded-lg border border-outline-variant/10 text-on-surface-variant hover:text-on-surface transition-colors">
              <Filter size={16} />
            </button>
            <button className="p-2 bg-surface-container rounded-lg border border-outline-variant/10 text-on-surface-variant hover:text-on-surface transition-colors">
              <SortAsc size={16} />
            </button>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button className="flex-none px-4 py-2 bg-primary-container text-on-primary-container rounded-full text-xs font-bold font-headline tracking-wider">
            ALL DATES
          </button>
          <button className="flex-none px-4 py-2 bg-surface-container text-on-surface-variant rounded-full text-xs font-bold font-headline tracking-wider border border-outline-variant/10">
            HIGH INTENSITY
          </button>
          <button className="flex-none px-4 py-2 bg-surface-container text-on-surface-variant rounded-full text-xs font-bold font-headline tracking-wider border border-outline-variant/10">
            RECOVERY
          </button>
        </div>
      </section>

      <div className="space-y-3">
        {sortedData.map((metric) => (
          <div key={metric.date}>
            <PerformanceCard metric={metric} />
          </div>
        ))}
      </div>
    </div>
  );
}
