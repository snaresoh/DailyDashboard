/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TrendingUp, Activity, Zap, Heart, Moon, ChevronRight, Sparkles } from 'lucide-react';
import { DailyMetric, Workout } from '../types';
import { GoogleGenAI } from "@google/genai";

interface DashboardScreenProps {
  daily: DailyMetric[];
  workouts: Workout[];
}

export default function DashboardScreen({ daily, workouts }: DashboardScreenProps) {
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  const latest = daily[daily.length - 1] || {
    load: 0, ctl: 0, atl: 0, tsb: 0, acwr: 0, hrv: 0, restHr: 0, sleepScore: 0, vo2Max: 0, status: 'N/A'
  };

  const recentWorkouts = [...workouts].reverse().slice(0, 3);

  useEffect(() => {
    async function getAiInsight() {
      if (daily.length === 0 || aiInsight) return;
      
      setLoadingInsight(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: `As an elite athletic performance coach, analyze these metrics for today:
            - Training Load: ${latest.load}
            - HRV: ${latest.hrv}ms
            - TSB: ${latest.tsb}
            - ACWR: ${latest.acwr}
            - Status: ${latest.status}
            
            Provide a one-sentence, high-impact recommendation for today's training.`,
          config: {
            systemInstruction: "You are a world-class sports scientist and performance coach. Be concise and authoritative.",
          }
        });
        setAiInsight(response.text || "Continue with your planned training block.");
      } catch (err) {
        console.error('AI Insight error:', err);
        setAiInsight("Maintain current training intensity and monitor recovery.");
      } finally {
        setLoadingInsight(false);
      }
    }

    getAiInsight();
  }, [daily, latest]);

  return (
    <div className="space-y-8 pb-10">
      {/* AI Insight Section */}
      <section className="bg-primary/10 border border-primary/20 rounded-2xl p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2">
          <Sparkles className="text-primary animate-pulse" size={16} />
        </div>
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="text-primary" size={16} />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold text-primary tracking-widest uppercase mb-1">AI Performance Insight</p>
            <p className="text-sm text-on-surface font-medium leading-relaxed">
              {loadingInsight ? "Analyzing telemetry..." : aiInsight}
            </p>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative h-48 rounded-2xl overflow-hidden bg-surface-container-low border border-outline-variant/10 flex flex-col justify-end p-6">
        <div className="absolute top-0 right-0 p-4">
          <div className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${
            latest.status.toLowerCase().includes('peak') ? 'bg-secondary/20 text-secondary' : 'bg-primary/20 text-primary'
          }`}>
            {latest.status}
          </div>
        </div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-tertiary/5 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <p className="font-headline text-[10px] font-bold text-on-surface-variant tracking-widest uppercase mb-1">Current Readiness</p>
          <div className="flex items-baseline gap-2">
            <h2 className="font-headline text-5xl font-black text-on-surface tracking-tighter">
              {latest.hrv.toFixed(0)}
            </h2>
            <span className="text-tertiary font-bold text-lg">ms</span>
          </div>
          <p className="text-xs text-on-surface-variant font-medium mt-1">HRV Baseline: 65ms (Optimal)</p>
        </div>
      </section>

      {/* Primary Metrics Grid */}
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/10">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-bold text-on-surface-variant tracking-widest uppercase">Training Load</span>
            <Activity size={14} className="text-secondary" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-headline font-bold text-on-surface">{latest.load.toFixed(0)}</span>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase">pts</span>
          </div>
          <div className="mt-2 flex items-center gap-1">
            <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-secondary" style={{ width: '75%' }} />
            </div>
          </div>
        </div>

        <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/10">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-bold text-on-surface-variant tracking-widest uppercase">Fitness (CTL)</span>
            <TrendingUp size={14} className="text-primary" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-headline font-bold text-on-surface">{latest.ctl.toFixed(0)}</span>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase">pts</span>
          </div>
          <div className="mt-2 text-[10px] text-primary font-bold flex items-center gap-1">
            <TrendingUp size={10} /> +2.4 vs last week
          </div>
        </div>
      </section>

      {/* Secondary Metrics Bento */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Rest HR', value: `${latest.restHr.toFixed(0)}`, unit: 'bpm', color: 'text-tertiary', icon: Heart },
          { label: 'Sleep', value: `${latest.sleepScore.toFixed(0)}`, unit: '%', color: 'text-primary', icon: Moon },
          { label: 'VO2 Max', value: `${latest.vo2Max.toFixed(1)}`, unit: '', color: 'text-primary', icon: Zap },
          { label: 'ACWR', value: `${latest.acwr.toFixed(2)}`, unit: '', color: 'text-secondary', icon: Activity },
        ].map((item, i) => (
          <div key={i} className="bg-surface-container rounded-xl p-4 border border-outline-variant/5">
            <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">{item.label}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-headline font-bold text-on-surface">{item.value}</span>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase">{item.unit}</span>
            </div>
            <item.icon size={12} className={`mt-2 ${item.color}`} fill="currentColor" fillOpacity={0.1} />
          </div>
        ))}
      </section>

      {/* Recent Workouts */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-headline text-sm font-bold text-on-surface uppercase tracking-tight">Recent Sessions</h3>
          <button className="text-[10px] font-bold text-primary tracking-widest uppercase">View All</button>
        </div>
        <div className="space-y-3">
          {recentWorkouts.map((workout, index) => (
            <div key={index} className="bg-surface-container-low rounded-xl p-4 flex items-center gap-4 border border-outline-variant/5 hover:bg-surface-container transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary">
                <Activity size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm tracking-tight">{workout.type}</h4>
                <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">
                  {workout.date} • {workout.duration}
                </p>
              </div>
              <ChevronRight size={16} className="text-outline" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
