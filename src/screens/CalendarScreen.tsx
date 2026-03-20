/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Activity, Heart, Zap } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { DailyMetric, Workout } from '../types';

interface CalendarScreenProps {
  daily: DailyMetric[];
  workouts: Workout[];
}

export default function CalendarScreen({ daily, workouts }: CalendarScreenProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const getMetricForDay = (date: Date) => {
    return daily.find(d => isSameDay(new Date(d.date), date));
  };

  const getWorkoutsForDay = (date: Date) => {
    return workouts.filter(w => isSameDay(new Date(w.date), date));
  };

  const selectedMetric = getMetricForDay(selectedDate);
  const selectedWorkouts = getWorkoutsForDay(selectedDate);

  return (
    <div className="space-y-6 pb-10">
      {/* Month Selector */}
      <div className="flex items-center justify-between py-4">
        <button onClick={prevMonth} className="text-on-surface-variant hover:text-primary transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h2 className="font-headline text-2xl font-bold tracking-tight uppercase">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button onClick={nextMonth} className="text-on-surface-variant hover:text-primary transition-colors">
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Calendar Grid */}
      <section className="bg-surface-container-low rounded-xl p-4">
        <div className="grid grid-cols-7 mb-2">
          {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
            <div key={day} className="text-center font-headline text-[10px] font-bold text-outline tracking-widest py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-4">
          {days.map((day, i) => {
            const metric = getMetricForDay(day);
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());

            let dotColor = 'bg-outline';
            if (metric) {
              if (metric.status.toLowerCase().includes('peak') || metric.status.toLowerCase().includes('strain')) {
                dotColor = 'bg-secondary';
              } else if (metric.status.toLowerCase().includes('maintenance') || metric.status.toLowerCase().includes('productive')) {
                dotColor = 'bg-primary';
              }
            }

            return (
              <button
                key={i}
                onClick={() => setSelectedDate(day)}
                className={`flex flex-col items-center relative py-1 ${!isSameMonth(day, monthStart) ? 'opacity-20' : ''}`}
              >
                {isSelected && (
                  <div className="absolute inset-0 -top-1 bg-surface-container rounded-lg -z-10 border border-primary/30" />
                )}
                <span className={`text-sm font-bold ${isSelected ? 'text-primary' : isToday ? 'text-on-surface underline' : 'text-on-surface'}`}>
                  {format(day, 'd')}
                </span>
                <div className={`w-1 h-1 rounded-full mt-1 ${dotColor}`} />
              </button>
            );
          })}
        </div>
      </section>

      {/* Selected Date Details */}
      {selectedMetric && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-headline font-bold text-sm tracking-wider text-outline uppercase">
              {format(selectedDate, 'MMMM d')} Detail
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-tighter uppercase ${
              selectedMetric.status.toLowerCase().includes('peak') ? 'bg-secondary-container text-on-secondary-container' : 'bg-primary-container text-on-primary-container'
            }`}>
              {selectedMetric.status}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="bg-surface-container rounded-xl p-6 flex items-end justify-between overflow-hidden relative border border-outline-variant/10">
              <div className="z-10">
                <p className="font-headline text-[10px] font-bold text-outline tracking-widest uppercase mb-1">Training Load</p>
                <h3 className="font-headline text-6xl font-black text-secondary tracking-tighter">
                  {selectedMetric.load.toFixed(0)}
                </h3>
              </div>
              <div className="text-right z-10">
                <p className="font-headline text-[10px] font-bold text-outline tracking-widest uppercase mb-1">ACWR</p>
                <p className="font-headline text-2xl font-bold text-secondary">{selectedMetric.acwr.toFixed(1)}</p>
              </div>
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-secondary/5 rounded-full blur-3xl"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-container-high rounded-xl p-5 border border-outline-variant/10">
                <p className="font-headline text-[10px] font-bold text-outline tracking-widest uppercase mb-4">CTL</p>
                <div className="flex items-baseline gap-1">
                  <span className="font-headline text-3xl font-bold text-on-surface">{selectedMetric.ctl.toFixed(0)}</span>
                  <span className="text-on-surface-variant text-xs font-bold uppercase">pts</span>
                </div>
              </div>
              <div className="bg-surface-container-high rounded-xl p-5 border border-outline-variant/10">
                <p className="font-headline text-[10px] font-bold text-outline tracking-widest uppercase mb-4">HRV</p>
                <div className="flex items-baseline gap-1">
                  <span className="font-headline text-3xl font-bold text-tertiary">{selectedMetric.hrv.toFixed(0)}</span>
                  <span className="text-on-surface-variant text-xs font-bold uppercase">ms</span>
                </div>
              </div>
            </div>

            {selectedWorkouts.map((workout, index) => (
              <div key={index} className="bg-surface-container-low rounded-xl p-4 flex items-center gap-4 border border-outline-variant/5">
                <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center text-secondary">
                  <Activity size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm tracking-tight">{workout.type}: {workout.intensity}</h4>
                  <p className="text-xs text-on-surface-variant">{workout.time} • {workout.duration} • {workout.calories} kcal</p>
                </div>
                <ChevronRight size={20} className="text-outline" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Legend */}
      <section className="flex justify-center gap-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-secondary"></div>
          <span className="font-headline text-[10px] font-bold text-outline tracking-widest uppercase">High</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          <span className="font-headline text-[10px] font-bold text-outline tracking-widest uppercase">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-outline"></div>
          <span className="font-headline text-[10px] font-bold text-outline tracking-widest uppercase">Rest</span>
        </div>
      </section>
    </div>
  );
}
