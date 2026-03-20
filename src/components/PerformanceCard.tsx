/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertCircle, CheckCircle2, RefreshCcw, TrendingUp, Star } from 'lucide-react';
import { DailyMetric } from '../types';

interface PerformanceCardProps {
  metric: DailyMetric;
}

export default function PerformanceCard({ metric }: PerformanceCardProps) {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'peak load':
      case 'strain increasing':
        return { color: 'text-secondary', borderColor: 'border-secondary', icon: AlertCircle };
      case 'maintenance':
      case 'productive':
        return { color: 'text-primary', borderColor: 'border-primary', icon: CheckCircle2 };
      case 'active recovery':
      case 'recovery':
        return { color: 'text-tertiary', borderColor: 'border-tertiary', icon: RefreshCcw };
      default:
        return { color: 'text-on-surface-variant', borderColor: 'border-outline-variant', icon: Star };
    }
  };

  const { color, borderColor, icon: Icon } = getStatusConfig(metric.status);

  return (
    <div className={`group relative bg-surface-container-low p-5 rounded-xl border-l-4 ${borderColor} transition-all hover:bg-surface-container overflow-hidden`}>
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <span className="text-[10px] font-headline font-bold text-on-surface-variant tracking-widest uppercase mb-1">
            {metric.date}
          </span>
          <span className="text-4xl font-headline font-black text-on-surface tracking-tighter leading-none">
            {metric.load.toFixed(1)}
          </span>
          <span className={`text-[10px] font-headline font-bold ${color} tracking-widest uppercase mt-1`}>
            {metric.status}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <Icon className={color} size={20} fill={color.includes('primary') || color.includes('secondary') || color.includes('tertiary') ? 'currentColor' : 'none'} fillOpacity={0.2} />
          <div className="mt-4 flex gap-4 text-right">
            <div>
              <span className="block text-[8px] font-headline font-bold text-on-surface-variant tracking-widest uppercase">TSB</span>
              <span className={`text-xs font-headline font-bold ${metric.tsb < 0 ? 'text-secondary' : 'text-primary'}`}>
                {metric.tsb > 0 ? `+${metric.tsb.toFixed(1)}` : metric.tsb.toFixed(1)}
              </span>
            </div>
            <div>
              <span className="block text-[8px] font-headline font-bold text-on-surface-variant tracking-widest uppercase">ACWR</span>
              <span className="text-xs font-headline font-bold text-on-surface">
                {metric.acwr.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
