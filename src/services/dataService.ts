/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Papa from 'papaparse';
import { DailyMetric, Workout } from '../types';

const WORKER_URL = 'https://polished-pond-d9e9.chenrinan.workers.dev/';

export async function fetchDailyMetrics(): Promise<DailyMetric[]> {
  try {
    const response = await fetch(`${WORKER_URL}?sheet=daily`);
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data.map((row: any) => ({
            date: row.Date || row.date,
            load: row.Load || row.load || 0,
            ctl: row.CTL || row.ctl || 0,
            atl: row.ATL || row.atl || 0,
            tsb: row.TSB || row.tsb || 0,
            acwr: row.ACWR || row.acwr || 0,
            hrv: row.HRV || row.hrv || 0,
            restHr: row.RestHR || row.restHr || 0,
            sleepScore: row.SleepScore || row.sleepScore || 0,
            vo2Max: row.VO2Max || row.vo2Max || 0,
            status: row.Status || row.status || 'Maintenance',
          }));
          resolve(data);
        },
        error: (error: any) => reject(error),
      });
    });
  } catch (error) {
    console.error('Error fetching daily metrics:', error);
    return [];
  }
}

export async function fetchWorkouts(): Promise<Workout[]> {
  try {
    const response = await fetch(`${WORKER_URL}?sheet=workouts`);
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data.map((row: any) => ({
            date: row.Date || row.date,
            time: row.Time || row.time || '',
            duration: row.Duration || row.duration || '',
            calories: row.Calories || row.calories || 0,
            type: row.Type || row.type || '',
            intensity: row.Intensity || row.intensity || '',
          }));
          resolve(data);
        },
        error: (error: any) => reject(error),
      });
    });
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return [];
  }
}
