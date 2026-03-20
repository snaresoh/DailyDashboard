/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import DashboardScreen from './screens/DashboardScreen';
import CalendarScreen from './screens/CalendarScreen';
import TrendsScreen from './screens/TrendsScreen';
import LogsScreen from './screens/LogsScreen';
import { fetchDailyMetrics, fetchWorkouts } from './services/dataService';
import { DailyMetric, Workout, AppState } from './types';
import { Loader2, AlertCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [state, setState] = useState<AppState>({
    daily: [],
    workouts: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [dailyData, workoutData] = await Promise.all([
          fetchDailyMetrics(),
          fetchWorkouts(),
        ]);
        
        setState({
          daily: dailyData,
          workouts: workoutData,
          loading: false,
          error: null,
        });
      } catch (err) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load performance data. Please check your connection.',
        }));
      }
    }

    loadData();
  }, []);

  const renderScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardScreen daily={state.daily} workouts={state.workouts} />;
      case 'calendar':
        return <CalendarScreen daily={state.daily} workouts={state.workouts} />;
      case 'trends':
        return <TrendsScreen data={state.daily} />;
      case 'logs':
        return <LogsScreen data={state.daily} />;
      default:
        return <DashboardScreen daily={state.daily} workouts={state.workouts} />;
    }
  };

  if (state.loading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-4">
        <Loader2 className="text-primary animate-spin" size={48} />
        <p className="font-headline text-xs font-bold tracking-widest text-primary uppercase">
          Initializing Telemetry...
        </p>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-4 p-6 text-center">
        <AlertCircle className="text-secondary" size={48} />
        <h2 className="font-headline text-xl font-bold text-on-surface uppercase tracking-tight">
          System Error
        </h2>
        <p className="text-on-surface-variant text-sm max-w-xs">
          {state.error}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-primary-container text-on-primary-container rounded-full text-xs font-bold font-headline tracking-wider"
        >
          RETRY CONNECTION
        </button>
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderScreen()}
    </Layout>
  );
}
