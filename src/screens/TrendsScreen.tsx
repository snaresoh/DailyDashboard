/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, ReferenceLine 
} from 'recharts';
import { TrendingUp, Activity, Zap, Heart, Moon } from 'lucide-react';
import { DailyMetric } from '../types';

interface TrendsScreenProps {
  data: DailyMetric[];
}

export default function TrendsScreen({ data }: TrendsScreenProps) {
  const latest = data[data.length - 1] || {
    ctl: 0, hrv: 0, tsb: 0, vo2Max: 0, acwr: 0, restHr: 0, sleepScore: 0
  };

  return (
    <div className="space-y-8 pb-10">
      <section>
        <p className="font-headline text-[10px] font-bold tracking-[0.2em] text-primary uppercase mb-1">METRIC ANALYSIS</p>
        <h2 className="font-headline text-4xl font-bold tracking-tight uppercase leading-none">TRENDS</h2>
      </section>

      {/* 1. Training Load (CTL vs ATL) */}
      <div className="bg-surface-container-low rounded-xl p-6 relative overflow-hidden">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="font-headline text-lg font-bold text-on-surface uppercase tracking-tight">Training Load</h3>
            <div className="flex gap-4 mt-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-1 bg-primary rounded-full"></span>
                <span className="font-body text-[10px] text-on-surface-variant uppercase tracking-widest">CTL (Fitness)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-1 bg-tertiary rounded-full"></span>
                <span className="font-body text-[10px] text-on-surface-variant uppercase tracking-widest">ATL (Fatigue)</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="font-headline text-3xl font-bold text-primary">{latest.ctl.toFixed(1)}</span>
            <p className="font-body text-[10px] text-on-surface-variant uppercase tracking-widest">CURRENT CTL</p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorCtl" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f9ffb5" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f9ffb5" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorAtl" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#679cff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#679cff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#484847" vertical={false} opacity={0.1} />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#adaaaa', fontSize: 10 }} 
                minTickGap={30}
              />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #484847', borderRadius: '8px' }}
                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="atl" stroke="#679cff" fillOpacity={1} fill="url(#colorAtl)" strokeWidth={2} />
              <Area type="monotone" dataKey="ctl" stroke="#f9ffb5" fillOpacity={1} fill="url(#colorCtl)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. HRV Trends */}
      <div className="bg-surface-container-low rounded-xl p-6 flex flex-col justify-between">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-headline text-sm font-bold text-on-surface uppercase tracking-tight">HRV & Baseline</h3>
          <TrendingUp className="text-tertiary" size={18} />
        </div>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#484847" vertical={false} opacity={0.1} />
              <XAxis dataKey="date" hide />
              <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #484847', borderRadius: '8px' }}
              />
              <Line type="monotone" dataKey="hrv" stroke="#679cff" strokeWidth={2} dot={false} />
              <ReferenceLine y={65} stroke="#679cff" strokeDasharray="3 3" opacity={0.3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="font-body text-[10px] text-on-surface-variant uppercase tracking-widest">7D AVERAGE</p>
            <p className="font-headline text-2xl font-bold text-on-surface">
              {latest.hrv.toFixed(0)}ms <span className="text-tertiary text-xs ml-1">Optimal</span>
            </p>
          </div>
          <div className="bg-surface-container-high px-2 py-1 rounded text-[10px] font-bold text-tertiary">
            RATIO: 1.12
          </div>
        </div>
      </div>

      {/* 3. Recovery Trend (TSB) */}
      <div className="bg-surface-container-low rounded-xl p-6 flex flex-col justify-between">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-headline text-sm font-bold text-on-surface uppercase tracking-tight">Recovery Balance (TSB)</h3>
          <Activity className="text-secondary" size={18} />
        </div>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorTsb" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff7162" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ff7162" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <ReferenceLine y={0} stroke="#ffffff" opacity={0.1} />
              <Area type="monotone" dataKey="tsb" stroke="#ff7162" fillOpacity={1} fill="url(#colorTsb)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="font-body text-[10px] text-on-surface-variant uppercase tracking-widest">TRAINING STRESS BALANCE</p>
            <p className="font-headline text-2xl font-bold text-secondary">
              {latest.tsb.toFixed(1)} <span className="text-on-surface-variant text-[10px] ml-1 uppercase">Overreaching</span>
            </p>
          </div>
          <div className="flex flex-col items-end">
            <div className="w-12 h-1 bg-surface-container-highest rounded-full overflow-hidden">
              <div className="w-1/3 h-full bg-secondary"></div>
            </div>
            <span className="text-[9px] text-on-surface-variant mt-1 uppercase">LOAD: HIGH</span>
          </div>
        </div>
      </div>

      {/* 4. Key Physiological Insights */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface-container rounded-lg p-4">
          <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">VO2 Max Trend</p>
          <p className="text-2xl font-headline font-bold text-on-surface">{latest.vo2Max.toFixed(1)}</p>
          <p className="text-[10px] text-primary flex items-center gap-1 mt-1 font-bold">
            <TrendingUp size={12} /> +0.8
          </p>
        </div>
        <div className="bg-surface-container rounded-lg p-4">
          <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Load Ratio</p>
          <p className="text-2xl font-headline font-bold text-on-surface">{latest.acwr.toFixed(2)}</p>
          <p className="text-[10px] text-secondary flex items-center gap-1 mt-1 font-bold">
            <Zap size={12} /> Caution
          </p>
        </div>
        <div className="bg-surface-container rounded-lg p-4">
          <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Rest HR</p>
          <p className="text-2xl font-headline font-bold text-on-surface">{latest.restHr.toFixed(0)}<span className="text-xs ml-1">BPM</span></p>
          <p className="text-[10px] text-tertiary flex items-center gap-1 mt-1 font-bold">
            <Heart size={12} fill="currentColor" fillOpacity={0.2} /> Stable
          </p>
        </div>
        <div className="bg-surface-container rounded-lg p-4">
          <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Sleep Score</p>
          <p className="text-2xl font-headline font-bold text-on-surface">{latest.sleepScore.toFixed(0)}<span className="text-xs ml-1">%</span></p>
          <p className="text-[10px] text-primary flex items-center gap-1 mt-1 font-bold">
            <Moon size={12} fill="currentColor" fillOpacity={0.2} /> Peak
          </p>
        </div>
      </div>
    </div>
  );
}
